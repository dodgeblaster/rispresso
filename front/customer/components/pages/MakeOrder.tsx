import { NavBar } from '../base/NavBar'
import { ItemCard } from '../base/ItemCard'
import { useRiseGet } from '../../hooks/useRiseGet'
import { PageState } from '../interfaces'

export function MakeOrder(props: any) {
  const [products, loading] = useRiseGet({
    action: 'listProducts',
    input: {
      storeId: props.store,
    },
  })

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

  if (loading) {
    return <p>Loading...</p>
  }

  const formatNameToId = (x: string) => {
    return x.split(' ').join('-').toLowerCase()
  }

  return (
    <div className="relative">
      <div className="bg fixed bottom-4 right-4 left-4 flex items-center rounded bg-gradient-to-r from-green-700 to-green-500 px-4 py-2 text-white shadow">
        <p>Total: ${(total / 100).toFixed(2)}</p>
        <button
          onClick={props.placeOrder}
          className="ml-auto border border-green-600 px-4 py-2 shadow-lg"
        >
          Complete Order
        </button>
      </div>
      <NavBar
        page="Make Order"
        back={() => props.setPage(PageState.CHOOSE_STORE)}
      />
      <div className="px-10 py-4">
        {products.map((p: any) => {
          return (
            <ItemCard
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
    </div>
  )
}
