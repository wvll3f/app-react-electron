import { useState } from "react"

type EditMacroProps = {
  onSubmit: () => void
  onCancel: () => void
  sts: boolean
  resTitle: string
  resMessage: string
}

function EditMacro({ onSubmit, onCancel, sts, resTitle, resMessage }: EditMacroProps): JSX.Element {
  const [title, setTitle] = useState(resTitle)
  const [message, setMessage] = useState(resMessage)
  const [messagem, setMessagem] = useState('')

  const onEdit = (title, message): void => {
    const query = {
      title: title,
      message: message
    }
    window.electron.ipcRenderer.send('add-macro', query)

    window.electron.ipcRenderer.once('add-macro-response', (_event, response) => {
      if (response.success) {
        setMessagem(`Macro adicionada com sucesso! ID: ${response.id}`)
      } else {
        setMessagem(`Erro: ${response.error}`)
      }
    })
  }

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
        value={message}
      ></textarea>
      <div className="flex gap-2">
        <button
          className="font-bold w-full py-2 rounded-md bg-green-300 text-gray-800 hover:bg-green-400"
          onClick={(event) => {
            event.preventDefault()
            onSubmit()
            onEdit(title, message)
          }}
        >
          Enviar
        </button>
        <button
          className="font-bold w-full py-2 rounded-md bg-red-300 text-gray-800 hover:bg-red-400"
          onClick={(event) => {
            event.preventDefault()
            onCancel()
          }}
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default EditMacro
