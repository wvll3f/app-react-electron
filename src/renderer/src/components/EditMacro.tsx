import { useState } from "react"

type EditMacroProps = {
  onSubmit: (title: string, messgae: string) => void
  onCancel: (sts: boolean) => void
  sts: boolean
}

function EditMacro({ onSubmit, onCancel, sts }: EditMacroProps): JSX.Element {
  const [title, setTitle] = useState('')
  const [messgae, setMessage] = useState('')

  return (
    <form action="" className="flex flex-col gap-2 w-full p-3">
      <label className="font-bold">Titulo:</label>
      <input
        required={true}
        className="w-full border-none p-2 outline-none rounded-md"
        type="text"
        name="title"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <label className="font-bold">Macro:</label>
      <textarea
        required={true}
        className="bg-gray-800 w-full resize-none border-none p-2 h-48 outline-none rounded-md"
        name="message"
        onChange={(e) => setMessage(e.target.value)}
        value={messgae}
      ></textarea>
      <div className="flex gap-2">
        <button
          className="font-bold w-full py-2 rounded-md bg-green-300 text-gray-800 hover:bg-green-400"
          onClick={(event) => {
            event.preventDefault()
            onSubmit(title, messgae)
          }}
        >
          Enviar
        </button>
        <button
          className="font-bold w-full py-2 rounded-md bg-red-300 text-gray-800 hover:bg-red-400"
          onClick={(event) => {
            event.preventDefault()
            onCancel(sts)
          }}
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default EditMacro
