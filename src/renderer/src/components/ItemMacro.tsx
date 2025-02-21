import { useState } from 'react'
import { FaClipboard, FaTrash } from 'react-icons/fa6'
import EditMacro from './EditMacro'

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
  const [editMacro, setEditMacro] = useState<MacroRes>(null)

  const getMacroById = (id): void => {
    window.electron.ipcRenderer.invoke('get-macro-id', id).then(setEditMacro).catch(console.error)
    console.log(editMacro.message)
  }
  // const [text, setText] = useState("Texto para copiar")
  // const [copied, setCopied] = useState(false)

  // const copyToClipboard = async () => {
  //   try {
  //     await navigator.clipboard.writeText(text)
  //     setCopied(true);
  //     setTimeout(() => setCopied(false), 1000)
  //   } catch (err) {
  //     console.error("Falha ao copiar!", err)
  //   }
  // }

  return (
    <>
      {selected ? (
        <EditMacro
          sts={false}
          onCancel={() => setSelected(false)}
          onSubmit={() => setSelected(false)}
          resTitle={'editMacro.title'}
          resMessage={'editMacro.message'}
        />
      ) : (
        <li className="flex px-4 text-xl border-b-1 p-2 border-gray-500 gap-3 items-center">
          <h3
            onClick={() => {
              getMacroById(id)
              setSelected(true)
            }}
            className="text-2xl font-bold tracking-wide cursor-pointer flex-1" id={id.toString()}
          >
            {title}
          </h3>
          <section className="flex gap-5">
            <button id={id.toString()}>
              <FaClipboard width={16} />
            </button>
            <div className="h-8 w-0.5 bg-gray-500"></div>
            <button onClick={onDelete} id={id.toString()}>
              <FaTrash width={16} />
            </button>
          </section>
        </li>
      )}
    </>
  )
}

export default ItemMacro
