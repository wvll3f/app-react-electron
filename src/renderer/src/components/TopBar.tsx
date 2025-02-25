import { useState } from "react"

function TopBar(): JSX.Element {
  const [full, setFull] = useState(false)
  const [onTop, setOnTop] = useState(false)

  const ipcCloseWindow = (): void => window.electron.ipcRenderer.send('close-window')
  const ipcMinimizeWindow = (): void => window.electron.ipcRenderer.send('minimize-window')
  const ipcMaximizeWindow = (): void => {
    setOnTop((prev) => !prev)
    window.electron.ipcRenderer.send('maximize-window', onTop)
  }
  const ipcOnTopWindow = (): void => {
    setFull((prev) => !prev)
    window.electron.ipcRenderer.send('on-top-window', full)
  }

  return (
    <header className="bg-gray-900 w-full h-10 p-5 flex items-center justify-center">
      <button onClick={ipcOnTopWindow} className="w-4 h-4 rounded-full bg-gray-500"></button>
      <span className=" text-center text-gray-200 opacity-50 flex-1">Macrobox</span>
      <nav className="flex gap-2 items-center">
        <button
          onClick={ipcMinimizeWindow}
          id="minimize-btn"
          className="w-3.5 h-3.5 bg-yellow-500"
        ></button>
        <button
          onClick={ipcMaximizeWindow}
          className="w-3.5 h-3.5 rounded-xs bg-green-500"
        ></button>
        <button
          className="w-3.5 h-3.5 flex items-center justify-center rounded-full text-red-500 text-lg font-bold"
          onClick={ipcCloseWindow}
        >
          ✕
        </button>
      </nav>
    </header>
  )
}

export default TopBar
