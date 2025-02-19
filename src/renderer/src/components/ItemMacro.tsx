import { FaClipboard, FaTrash } from 'react-icons/fa6'

type itemProps = {
  title: string
  id: number
}

function ItemMacro(data: itemProps): JSX.Element {
  return (
    <li className="flex px-4 text-2xl border-b-1  p-2 border-gray-500 gap-3">
      <h3
        className="text-3xl font-bold tracking-wide cursor-pointer flex-1"
        id={data.id.toString()}
      >
        {data.title}
      </h3>
      <section className="flex gap-5">
        <button>
          <FaClipboard width={16} />
        </button>
        <div className="h-8 w-0.5 bg-gray-500"></div>
        <button>
          <FaTrash width={16} />
        </button>
      </section>
    </li>
  )
}

export default ItemMacro
