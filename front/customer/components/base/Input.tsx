export function Input(props: any) {
  return (
    <div className="mb-4 flex flex-col">
      <label>{props.name}</label>
      <input
        onChange={(e: any) => props.setValue(e.target.value)}
        value={props.value}
        className="py4 rounded bg-gray-200 px-4 py-4"
      ></input>
    </div>
  )
}
