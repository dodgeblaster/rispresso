export function List(listProps: any) {
  const Item = (props: any) => {
    return (
      <div className="flex cursor-pointer items-center px-4 py-4 hover:bg-gray-50">
        <p
          className="flex-1"
          onClick={() => {
            listProps.itemClick(props.id)
          }}
        >
          {props.name}
        </p>

        <button className="" onClick={() => listProps.itemRemove(props.id)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    )
  }

  const AddItem = () => {
    return (
      <div
        onClick={listProps.add}
        className="flex cursor-pointer items-center px-4 py-4 hover:bg-gray-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2 h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
            clipRule="evenodd"
          />
        </svg>
        Add
      </div>
    )
  }
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded border border-gray-200 shadow-md">
      {listProps.items.map((x: any) => {
        return <Item key={x.id} id={x.id} name={x.name} />
      })}

      <AddItem />
    </div>
  )
}
