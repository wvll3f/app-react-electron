import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { db, createTable, getAllMacro, getMacroById, deleteMacroById } from './db/db'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    maxWidth: 720,
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

  ipcMain.on('delete-macro', (event, id) => {
    console.log(id)
    console.log('tentativa de delete')
    deleteMacroById(id)
  })
  ipcMain.on('close-window', () => mainWindow.close())
  ipcMain.on('minimize-window', () => mainWindow.minimize())
  ipcMain.on('maximize-window', (_event, res) => mainWindow.setFullScreen(res))
  ipcMain.on('on-top-window', (_event, res) => mainWindow.setAlwaysOnTop(res))
  ipcMain.handle('get-macros', async () => getAllMacro())
  ipcMain.handle('get-macro-id', async (_event, id) => await getMacroById(id))
  ipcMain.on('add-macro', (event, macro) => {
    const { title, message } = macro

    db.run('INSERT INTO macro (title, message) VALUES (?, ?)', [title, message], function (err) {
      if (err) {
        console.error('Erro ao inserir macro:', err.message)
        event.reply('add-macro-response', { success: false, error: err.message })
      } else {
        console.log('Macro inserido com ID:', this.lastID)
        event.reply('add-macro-response', { success: true, id: this.lastID })
      }
    })
  })
  ipcMain.on('edit-macro', (event, data) => {
    const { title, message, id } = data

    db.run(
      'UPDATE macro SET (title, message) = (?, ?) WHERE id = ?',
      [title, message, id],
      function (err) {
        if (err) {
          console.error('Erro ao editar macro:', err.message)
          event.reply('edit-macro-response', { success: false, error: err.message })
        } else {
          console.log('Macro editar com ID:', this.lastID)
          event.reply('edit-macro-response', { success: true, id: this.lastID })
        }
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
