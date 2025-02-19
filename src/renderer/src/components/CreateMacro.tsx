type CreateMacroProps = {
  onSubmit: (sts: boolean) => void
  onCancel: (sts: boolean) => void
  sts: boolean
}

function CreateMacro({ onSubmit, onCancel, sts }: CreateMacroProps): JSX.Element {
  return (
    <form action="" className="flex flex-col gap-2 w-full p-3">
      <label>Titulo:</label>
      <input
        required={true}
        className="w-full border-1 border-gray-300 p-2 outline-none rounded-md"
        type="text"
        placeholder="Insira o titulo da sua macro"
      />
      <label>Macro:</label>
      <textarea
        required={true}
        className="bg-gray-800 w-full resize-none border-1 border-gray-300 p-2 h-48 outline-none rounded-md"
        placeholder="Insira sua macro"
        name=""
        id=""
      ></textarea>
      <div className="flex gap-2">
        <button
          className="font-bold w-full py-2 rounded-md bg-green-300 text-gray-800 hover:bg-green-400"
          onClick={(event) => {
            event.preventDefault()
            onSubmit(sts)
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
