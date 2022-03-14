import {
  ForwardArrowIcon,
  BackArrowIcon,
  CartIcon,
  CheckIcon,
  UnCheckIcon,
} from './icons/Icons'
import { useRiseGet } from '../../hooks/useRiseGet'
const bgImage = `/coffeebg.jpeg`

const Item = (itemProps: any) => {
  return (
    <div
      onClick={() => {
        itemProps.setChosenStore(itemProps.store.id)
      }}
      className="relative mb-2 flex w-full  items-center rounded shadow-md"
    >
      <div
        className="h-20 w-20 rounded-tl rounded-bl"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.3))
           `,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }}
      ></div>
      <div className="mr-auto px-2 py-4">
        <p className="font-bold ">{itemProps.store.name}</p>
        <p className=" opacity-60">{itemProps.store.location}</p>
      </div>
      <div className="mr-4">
        {itemProps.check ? <CheckIcon /> : <UnCheckIcon />}
      </div>
    </div>
  )
}

export const ChooseStore = (props: any) => {
  const [stores, loading] = useRiseGet({
    action: 'listStores',
    input: {},
  })

  if (loading) {
    return <p>loading</p>
  }

  return (
    <div className="mx-4 my-4 flex max-w-2xl flex-col items-center justify-center overflow-hidden rounded-lg bg-white bg-gradient-to-br  from-yellow-800 to-yellow-600 text-white shadow-lg md:mx-auto">
      <div className=" w-full px-8 pt-8 opacity-70">
        <p className="flex font-bold">
          <CartIcon />
          <span className="ml-1">Choose Store</span>
        </p>
      </div>
      <div className="mb-4 h-96 w-full rounded-lg px-8 py-4">
        {stores.map((s: any) => {
          return (
            <Item
              key={s.id}
              store={s}
              check={props.chosenStore === s.id}
              setChosenStore={props.setChosenStore}
            />
          )
        })}
      </div>
      <div className="flex w-full">
        <button
          onClick={() => props.setPosition(0)}
          className="flex w-full justify-center border-r border-yellow-900 bg-yellow-800 px-8 py-4 text-white"
        >
          <BackArrowIcon />
          <span className="ml-2 ">Back</span>
        </button>
        <button
          disabled={props.chosenStore.length === 0}
          onClick={() => props.setPosition(2)}
          className={`flex w-full justify-center bg-yellow-800 px-8 py-4 text-white ${
            props.chosenStore.length === 0 && 'opacity-50'
          }`}
        >
          <span className="mr-2 ">Make Order</span>
          <ForwardArrowIcon />
        </button>
      </div>
    </div>
  )
}
