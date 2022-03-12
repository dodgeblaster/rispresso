const MinusIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
    </svg>
  )
}

const PlusIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  )
}
const ItemPic = (props: any) => {
  return (
    <div
      className="h-20 w-20 rounded-tl rounded-bl"
      style={{
        background: `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)),
           url(${props.img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }}
    ></div>
  )
}

export function ItemCard(props: any) {
  return (
    <div
      className="relative mb-2 flex w-full  items-center rounded shadow-md"
      onClick={props.onClick}
    >
      {props.amount > 0 && (
        <div className="absolute -top-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-xs shadow-lg">
          <p>{props.amount}</p>
        </div>
      )}
      <ItemPic img={props.img} />
      <div className="mr-auto px-2 py-4">
        <p className="font-bold ">{props.name}</p>
        <p className=" opacity-60">${(props.price / 100).toFixed(2)}</p>
      </div>
      <button
        onClick={props.minus}
        className="mr-2 flex h-14 w-14 items-center justify-center rounded border border-gray-200 bg-gray-200"
      >
        <MinusIcon />
      </button>
      <button
        onClick={props.plus}
        className="mr-2 flex h-14 w-14 items-center justify-center rounded border border-gray-200 bg-gray-200"
      >
        <PlusIcon />
      </button>
    </div>
  )
}
