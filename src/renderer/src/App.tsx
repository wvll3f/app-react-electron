import { useEffect, useState } from 'react'
import CreateMacro from './components/CreateMacro'
import ItemMacro from './components/ItemMacro'
import TopBar from './components/TopBar'
import { toast, ToastContainer } from 'react-toastify'
//import EditMacro from './components/EditMacro'

type Macro = {
  id: number
  title: string
  message: string
}

function App(): JSX.Element {
  // const [itemsMacro, setItemsMacro] = useState<string | null>(null)
  const [statusMacro, setStatusMacro] = useState<boolean>(false)
  const [macro, setMacro] = useState<Macro[] | null>(null)
  const [mesagem, setMensagem] = useState('')

  const getMacros = (): void => {
    window.electron.ipcRenderer
      .invoke('get-macros')
      .then((res) => {
        console.log(res)
        setMacro(res)
      })
      .catch(console.error)
  }
  const newMacro = (): void => {
    setStatusMacro((prev) => !prev)
  }
  const onSubmit = (title, message): void => {
    const query = {
      title: title,
      message: message
    }
    window.electron.ipcRenderer.send('add-macro', query)

    window.electron.ipcRenderer.once('add-macro-response', (_event, response) => {
      if (response.success) {
        setMensagem(`Macro adicionada com sucesso! ID: ${response.id}`)
      } else {
        setMensagem(`Erro: ${response.error}`)
        toast(mesagem)
      }
    })
    setStatusMacro((prev) => !prev)
    getMacros()
  }
  const onCancel = (): void => {
    setStatusMacro((prev) => !prev)
  }
  const onDelete = (id): void => {
    const fun = async (): Promise<void> => {
      window.electron.ipcRenderer.send('delete-macro', id)
    }
    fun()
    getMacros()
    toast('Macro deletada com sucesso!', { theme: 'dark', type: 'success' })
  }

  useEffect(() => {
    getMacros()
  }, [macro])

  return (
    <div
      id="main-container"
      className="h-[100dvh] bg-gray-800 text-gray-300 overflow-hidden flex flex-col"
    >
      <TopBar />
      <div className="flex items-center w-full gap-3 border-b-1 border-gray-500 p-3 justify-center">
        <button
          className="font-bold w-full py-2 rounded-md bg-green-300 text-gray-800 hover:bg-green-400"
          onClick={newMacro}
        >
          Criar novo macro
        </button>
      </div>
      <div
        id="container-macros"
        className="flex flex-col bg-gray-800 overflow-y-scroll scrollbar-custom flex-1 py-2"
      >
        {!statusMacro ? (
          macro?.length ? (
            macro.map((m) => (
              <div key={m.id}>
                <ItemMacro
                  onDelete={() => {
                    onDelete(m.id)
                    getMacros()
                  }}
                  title={m.title}
                  id={m.id}
                />
              </div>
            ))
          ) : (
            <p className="p-3">Nenhum macro encontrado</p>
          )
        ) : (
          <CreateMacro sts={statusMacro} onSubmit={onSubmit} onCancel={onCancel} />
        )}
        <ToastContainer position="top-right" autoClose={1000} hideProgressBar={true} />
      </div>
    </div>
  )
}

export default App
