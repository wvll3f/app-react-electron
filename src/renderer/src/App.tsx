import { useEffect, useState } from 'react'
import CreateMacro from './components/CreateMacro'
import ItemMacro from './components/ItemMacro'
import TopBar from './components/TopBar'
import { Bounce, toast, ToastContainer } from 'react-toastify'
//import EditMacro from './components/EditMacro'

type Macro = {
  id: number
  title: string
  message: string
}

function App(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [itemsMacro, setItemsMacro] = useState<string | null>(null)
  const [statusMacro, setStatusMacro] = useState<boolean>(false)
  const [macro, setMacro] = useState<Macro[] | null>(null)
  const [mesagem, setMensagem] = useState('')

  const getMacros = (): void => {
    window.electron.ipcRenderer.invoke('get-macros').then(setMacro).catch(console.error)
  }
  const newMacro = (): void => {
    setStatusMacro((prev) => !prev)
    setItemsMacro('ss')
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
      }
    })
    toast('Macro criado com sucesso!')
    setStatusMacro((prev) => !prev)
    getMacros()
  }
  const onCancel = (): void => {
    setStatusMacro((prev) => !prev)
  }
  const onDelete = (id): void => {
    window.electron.ipcRenderer.send('delete-macro', id)
    getMacros()
    toast(`Macro ${id} deletado com sucesso`)
  }

  useEffect(() => {
    getMacros()
  }, [])

  return (
    <div id="main-container" className="h-[100dvh] bg-gray-800 text-gray-300">
      <TopBar />
      <div className="flex items-center w-full gap-3 border-b-1 border-gray-500 p-3 justify-center">
        <button
          className="font-bold w-full py-2 rounded-md bg-green-300 text-gray-800 hover:bg-green-400"
          onClick={newMacro}
        >
          Criar novo macro
        </button>
      </div>
      <div id="container-macros" className="">
        {!statusMacro ? (
          macro?.length ? (
            macro.map((m) => (
              <div key={m.id}>
                <ItemMacro onDelete={() => onDelete(m.id)} title={m.title} id={m.id} />
              </div>
            ))
          ) : (
            <p>Nenhum macro encontrado</p>
          )
        ) : (
          <CreateMacro sts={statusMacro} onSubmit={onSubmit} onCancel={onCancel} />
        )}
        <ToastContainer
          position="bottom-right"
          autoClose={1000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
      </div>
    </div>
  )
}

export default App
