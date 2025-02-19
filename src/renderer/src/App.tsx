import { useEffect, useState } from 'react'
import CreateMacro from './components/CreateMacro'
import ItemMacro from './components/ItemMacro'
import TopBar from './components/TopBar'
import { Bounce, toast, ToastContainer } from 'react-toastify'

type Macro = {
  id: number
  nome: string
  descricao: string
}

function App(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [itemsMacro, setItemsMacro] = useState<string | null>(null)
  const [statusMacro, setStatusMacro] = useState<boolean>(false)
  const [macro, setMacro] = useState<Macro[] | null>(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ipcHandle = (): Promise<void> =>
      window.electron.ipcRenderer.invoke('get-macros').then(setMacro).catch(console.error)
    console.log(macro)
  }, [])

  const newMacro = (): void => {
    setStatusMacro((prev) => !prev)
    setItemsMacro('ss')
  }
  const onSubmit = (): void => {
    toast('Macro criado com sucesso!')
    setStatusMacro((prev) => !prev)
  }
  const onCancel = (): void => {
    setStatusMacro((prev) => !prev)
  }

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
          <ItemMacro title="Boas Vindas" id={5} />
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
