import { FaClipboard, FaTrash } from 'react-icons/fa6'

type itemProps = {
  title: string
  id: number
}

function ItemMacro({ title, id }: itemProps): JSX.Element {
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
    <li className="flex px-4 text-xl border-b-1  p-2 border-gray-500 gap-3">
      <h3 className="text-2xl font-bold tracking-wide cursor-pointer flex-1" id={id.toString()}>
        {title}
      </h3>
      <section className="flex gap-5">
        <button id={id.toString()}>
          <FaClipboard width={16} />
        </button>
        <div className="h-8 w-0.5 bg-gray-500"></div>
        <button id={id.toString()}>
          <FaTrash width={16} />
        </button>
      </section>
    </li>
  )
}

export default ItemMacro
