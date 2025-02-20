import { useState } from "react"

type CreateMacroProps = {
  onSubmit: (title: string, messgae: string) => void
  onCancel: (sts: boolean) => void
  sts: boolean
}

function CreateMacro({ onSubmit, onCancel, sts }: CreateMacroProps): JSX.Element {
  const [title, setTitle] = useState('')
  const [messgae, setMessage] = useState('')

  return (
    <form action="" className="flex flex-col gap-2 w-full p-3">
      <label>Titulo:</label>
      <input
        required={true}
        className="w-full border-1 border-gray-300 p-2 outline-none rounded-md"
        type="text"
        placeholder="Insira o titulo da sua macro"
        name="title"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <label>Macro:</label>
      <textarea
        required={true}
        className="bg-gray-800 w-full resize-none border-1 border-gray-300 p-2 h-48 outline-none rounded-md"
        placeholder="Insira sua macro"
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

export default CreateMacro
