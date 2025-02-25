import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import {
  createTable,
  deleteMacro,
  insertMacro,
  selectMacroById,
  selectMacros,
  updateMacro
} from './db/dbController'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    maxWidth: 720,
    minHeight: 440,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: true,
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  ipcMain.on('delete-macro', (_event, id) => {
    console.log(id)
    console.log('tentativa de delete')
    deleteMacro(id)
  })
  ipcMain.on('close-window', () => mainWindow.close())
  ipcMain.on('minimize-window', () => mainWindow.minimize())
  ipcMain.on('maximize-window', (_event, res) => mainWindow.setFullScreen(res))
  ipcMain.on('on-top-window', (_event, res) => mainWindow.setAlwaysOnTop(res))
  ipcMain.handle('get-macros', async () => selectMacros())
  ipcMain.handle('get-macro-id', async (_event, id) => await selectMacroById(id))
  ipcMain.on('add-macro', (event, macro) => {
    insertMacro(macro)
      .then((res) => {
        event.reply('add-macro-response', { success: true, id: res })
      })
      .catch((error) => {
        event.reply('add-macro-response', { success: false, error: error.message })
      })
  })
  ipcMain.on('edit-macro', (event, data) => {
    const { title, message, id } = data
    updateMacro({ title, message, id })
      .then((res) => {
        event.reply('update-macro-response', res)
      })
      .catch((error) => {
        event.reply('update-macro-response', { success: false, error: error.message })
      })
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  createWindow()
  createTable()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
