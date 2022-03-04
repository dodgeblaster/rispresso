import { useState, useEffect } from 'react'
import { NavBar } from './base/NavBar'
import { CurrentOrder } from './base/CurrentOrder'
import { HomeDashboard } from './base/HomeDashboard'
import { Input } from './base/Input'
import { StoreCard } from './base/StoreCard'
import { ItemCard } from './base/ItemCard'
import { SavingIcon } from './base/SavingIcon'
import { useRiseSocket } from '../hooks/useRiseSocket'
import { useRiseGet } from '../hooks/useRiseGet'
import { useRisePost } from '../hooks/useRisePost'

function HomePage(props: any) {
  return (
    <div className="relative">
      <NavBar page="Home" cancelActive={props.orderInProcess} />
      <div className="px-10 py-4">
        {props.orderInProcess && <CurrentOrder />}
        <HomeDashboard />

        <div className="flex">
          <button
            disabled={props.orderInProcess}
            onClick={() => props.setPage('choose-store')}
            className={`mr-2 flex-1 rounded bg-gray-800 px-4 py-10 text-white ${
              props.orderInProcess && 'opacity-50'
            }`}
          >
            {props.orderInProcess ? 'Order has been placed' : 'Place Order'}
          </button>
          <button
            onClick={() => props.setPage('settings')}
            className="flex-1 rounded bg-gray-600 px-4 py-10 text-white"
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  )
}

function Settings(props: any) {
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [cc, setCc] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!started) {
      return
    }
    clearTimeout(window.settingsSave)
    window.settingsSave = setTimeout(() => {
      setSaving(true)
      setTimeout(() => {
        setSaving(false)
      }, 1000)
    }, 1000)
  }, [name, cc, started])

  const setNameValue = (s: string) => {
    setStarted(true)
    setName(s)
  }

  const setCcValue = (s: string) => {
    setStarted(true)
    setCc(s)
  }

  return (
    <div className="relative">
      <NavBar page="Settings" back={() => props.setPage('home')} />
      <div className="px-10 py-4">
        <Input name="Name" value={name} setValue={setNameValue} />
        <Input name="CreditCard" value={cc} setValue={setCcValue} />
        {saving && (
          <p className="px-2 py-2  ">
            <SavingIcon />
            <span className="ml-2 inline-block">Saving...</span>
          </p>
        )}
      </div>
    </div>
  )
}

function ChooseStore(props: any) {
  return (
    <div className="relative">
      <NavBar page="Choose Store" back={() => props.setPage('home')} />
      <div className="px-10 py-4">
        <StoreCard
          name="Store 1"
          onClick={() => {
            props.setPage('make-order')
          }}
        />
        <StoreCard
          name="Store 1"
          onClick={() => {
            props.setPage('make-order')
          }}
        />
      </div>
    </div>
  )
}

function MakeOrder(props: any) {
  const lightOrders = props.order.items.filter(
    (x: any) => x.type === 'light-coffee'
  )
  const mediumOrders = props.order.items.filter(
    (x: any) => x.type === 'medium-coffee'
  )
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
      <NavBar page="Make Order" back={() => props.setPage('choose-store')} />
      <div className="px-10 py-4">
        <ItemCard
          name="Light Coffee"
          price="$2.00"
          plus={makeAdd('light-coffee', 200)}
          minus={makeMinus('light-coffee')}
          amount={lightOrders.length}
        />
        <ItemCard
          name="Medium Coffee"
          price="$2.00"
          plus={makeAdd('medium-coffee', 200)}
          minus={makeMinus('medium-coffee')}
          amount={mediumOrders.length}
        />
      </div>
    </div>
  )
}

function OrderPaying(props: any) {
  useEffect(() => {
    setTimeout(() => {
      props.setOrder((o: any) => {
        return {
          ...o,
          status: Status.SENDING,
        }
      })
    }, 2000)
  }, [])
  return (
    <div className="absolute top-0 bottom-0 right-0 left-0 flex flex-col items-center justify-center bg-gradient-to-r from-green-700 to-green-500">
      <p>
        <SavingIcon />
      </p>
      <p className="text-white">Paying</p>
    </div>
  )
}
function OrderSending(props: any) {
  useEffect(() => {
    setTimeout(() => {
      props.setOrder((o: any) => {
        return {
          ...o,
          status: Status.ORDER_PLACED,
        }
      })
    }, 2000)
  }, [])
  return (
    <div className="absolute top-0 bottom-0 right-0 left-0 flex flex-col items-center justify-center bg-gradient-to-r from-green-700 to-green-500">
      <p>
        <SavingIcon />
      </p>
      <p className="text-white">Sending order to store</p>
    </div>
  )
}

enum Status {
  'NONE' = 'NONE',
  'PAYING' = 'PAYING',
  'SENDING' = 'SENDING',
  'ORDER_PLACED' = 'ORDER_PLACED',
  'ORDER_STARTED' = 'ORDER_STARTED',
  'ORDER_COMPLETE' = 'ORDER_COMPLETE',
}
export function Home() {
  const [placeOrder, orderLoading] = useRisePost({
    action: 'placeOrder',
  })
  const [page, setPage] = useState('home')
  const [order, setOrder] = useState({
    items: [],
    status: Status.NONE,
  })

  const orderInProcess = [Status.ORDER_PLACED, Status.ORDER_STARTED].includes(
    order.status
  )

  const executePlaceOrder = async () => {
    const wait = () => new Promise((r) => setTimeout(r, 1000))
    setOrder((o: any) => {
      return {
        ...o,
        status: Status.PAYING,
      }
    })
    const total: number = order.items.reduce((acc: any, x: any) => {
      return acc + x.price
    }, 0)
    await wait()

    setOrder((o: any) => {
      return {
        ...o,
        status: Status.SENDING,
      }
    })
    await placeOrder({
      items: order.items,
      amount: total,
    })
    setPage('home')
  }

  if (order.status === Status.PAYING) {
    return <OrderPaying setPage={setPage} setOrder={setOrder} />
  }

  if (order.status === Status.SENDING) {
    return <OrderSending setPage={setPage} setOrder={setOrder} />
  }

  if (page === 'settings') {
    return <Settings setPage={setPage} />
  }

  if (page === 'choose-store') {
    return <ChooseStore setPage={setPage} />
  }

  if (page === 'make-order') {
    return (
      <MakeOrder
        setPage={setPage}
        order={order}
        placeOrder={executePlaceOrder}
      />
    )
  }

  return (
    <HomePage setPage={setPage} order={order} orderInProcess={orderInProcess} />
  )
}
