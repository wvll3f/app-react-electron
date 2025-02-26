/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import { FaClipboard, FaTrash } from 'react-icons/fa6'
import EditMacro from './EditMacro'
import { toast, ToastContainer } from 'react-toastify'

type itemProps = {
  title: string
  id: number
  onDelete: () => void
}
type MacroRes = {
  id: number
  title: string
  message: string
}

function ItemMacro({ title, id, onDelete }: itemProps): JSX.Element {
  const [selected, setSelected] = useState(false)
  const [editMacro, setEditMacro] = useState<MacroRes>({} as MacroRes)
  const [text, setText] = useState('')
  const [, setCopied] = useState(false) // Remove `copied`

  async function getMacroById(id): Promise<void> {
    window.electron.ipcRenderer
      .invoke('get-macro-id', id)
      .then((res) => {
        setEditMacro(res)
        setSelected(true)
      })
      .catch((error) => toast(error))
  }
  async function getCopyMacro(id: number): Promise<void> {
    const callback = async (): Promise<void> => {
      window.electron.ipcRenderer
        .invoke('get-macro-id', id)
        .then((res: MacroRes) => {
          setText(res.message)
        })
        .catch((error) => toast(error))
    }
    callback()
  }
  async function copyToClipboard(id: number): Promise<void> {
    try {
      await getCopyMacro(id)
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast('Copiado com sucesso!', { theme: 'dark', type: 'success' })
      setTimeout(() => setCopied(false), 1000)
    } catch (err) {
      console.error('Falha ao copiar!', err)
    }
  }

  return (
    <div className="">
      {selected ? (
        <div className="">
          <EditMacro
            onCancel={() => setSelected(false)}
            onSubmit={() => {
              setSelected(false)
            }}
            resId={editMacro.id}
            resTitle={editMacro.title}
            resMessage={editMacro.message}
          />
        </div>
      ) : (
        <li className="flex px-4 text-xl border-b-1 select-none p-2 border-gray-500 gap-3 items-center hover:bg-gray-900">
          <h3
            onClick={() => {
              getMacroById(id)
            }}
            className="text-xl font-bold tracking-wide cursor-pointer flex-1"
            id={id.toString()}
          >
            {title}
          </h3>
          <section className="flex gap-5">
            <button id={id.toString()}>
              <FaClipboard onClick={async () => copyToClipboard(id)} width={16} />
            </button>
            <div className="h-8 w-0.5 bg-gray-500"></div>
            <button onClick={onDelete} id={id.toString()}>
              <FaTrash width={16} />
            </button>
          </section>
        </li>
      )}
      <ToastContainer theme="dark" />
    </div>
  )
}

export default ItemMacro
