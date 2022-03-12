const BackIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function NavBar(props: any) {
  return (
    <div className=" flex h-16 items-center shadow ">
      <div className="mr-4 ml-2">
        {props.back && (
          <button onClick={props.back}>
            <BackIcon />
          </button>
        )}
      </div>
      <div>
        <h1 className="-mb-1 text-lg font-bold text-gray-800">Rispresso</h1>
        <h2 className="text-sm font-bold text-gray-400">{props.page}</h2>
      </div>
      {props.cancelActive && (
        <button className="ml-auto mr-2 rounded px-2 py-2 text-xs text-red-700">
          Cancel Order
        </button>
      )}
    </div>
  )
}
