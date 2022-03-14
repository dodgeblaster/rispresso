import {
  ForwardArrowIcon,
  BackArrowIcon,
  CartIcon,
  CheckIcon,
  UnCheckIcon,
} from './icons/Icons'
import { useRiseGet } from '../../hooks/useRiseGet'
import Image from 'next/image'

const bgImage = `/coffeebg.jpeg`

const Item = (props: any) => {
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
    return <Image alt="Mountains" src={props.img} width={80} height={80} />
  }
  return (
    <div className="relative mb-2 flex w-full  items-center rounded shadow-md">
      <ItemPic img={props.img} />
      <div className="mr-auto px-2 py-4">
        <p className="font-bold ">{props.name}</p>
        <p className=" opacity-60">${(props.price / 100).toFixed(2)}</p>
      </div>
      <button
        onClick={props.minus}
        className=" flex h-14 w-14 items-center justify-center rounded border border-yellow-800 text-yellow-800 "
      >
        <MinusIcon />
      </button>

      <span className="px-4 ">{props.amount > 0 ? props.amount : 0}</span>

      <button
        onClick={props.plus}
        className="mr-2 flex h-14 w-14 items-center justify-center rounded border border-yellow-800 text-yellow-800 "
      >
        <PlusIcon />
      </button>
    </div>
  )
}

export const MakeOrder = (props: any) => {
  // const [products, loading] = useRiseGet({
  //   action: 'listProducts',
  //   input: {
  //     storeId: props.store,
  //   },
  // })

  const total: number = props.order.items.reduce((acc: any, x: any) => {
    return acc + x.price
  }, 0)

  const makeAdd = (name: string, price: number) => () => {
    props.setOrder((order: any) => {
      return {
        ...order,
        items: [
          ...order.items,
          {
            id: Math.random() * 1000,
            price: price,
            type: name,
          },
        ],
      }
    })
  }

  const makeMinus = (name: string) => () => {
    props.setOrder((order: any) => {
      return {
        ...order,
        items: order.items.reduce(
          (acc: any, x: any) => {
            if (x.type === name && !acc.removed) {
              return {
                items: acc.items,
                removed: true,
              }
            }
            return {
              items: [...acc.items, x],
              removed: acc.removed,
            }
          },
          {
            items: [],
            removed: false,
          }
        ).items,
      }
    })
  }

  // if (loading) {
  //   return <p>Loading...</p>
  // }

  const formatNameToId = (x: string) => {
    return x.split(' ').join('-').toLowerCase()
  }

  return (
    <div className=" mx-4 my-4 flex max-w-2xl flex-col items-center justify-center overflow-hidden rounded-lg bg-white bg-gradient-to-br  from-yellow-800 to-yellow-600 text-white shadow-lg md:mx-auto">
      <div className="  w-full px-8 pt-8 opacity-70">
        <p className="flex font-bold">
          <CartIcon />
          <span className="ml-1">Make Order</span>
        </p>
      </div>
      <div className="mb-4 h-96 w-full rounded-lg px-8 py-4">
        <p>Total: ${(total / 100).toFixed(2)}</p>

        <hr className="my-4 border-black opacity-20" />
        {props.products.map((p: any) => {
          return (
            <Item
              name={p.name}
              price={p.amount}
              img={p.img}
              plus={makeAdd(formatNameToId(p.name), p.amount)}
              minus={makeMinus(formatNameToId(p.name))}
              amount={
                props.order.items.filter(
                  (x: any) => x.type === formatNameToId(p.name)
                ).length
              }
            />
          )
        })}
      </div>
      <div className="flex w-full">
        <button
          onClick={() => props.setPosition(1)}
          className="flex w-full justify-center border-r border-yellow-900 bg-yellow-800 px-8 py-4 text-white"
        >
          <BackArrowIcon />
          <span className="ml-2 ">Back</span>
        </button>
        <button
          onClick={props.placeOrder}
          className="flex w-full justify-center bg-yellow-800 px-8 py-4 text-white"
        >
          <span className="mr-2 ">Confirm Order</span>
          <ForwardArrowIcon />
        </button>
      </div>
    </div>
  )
}
