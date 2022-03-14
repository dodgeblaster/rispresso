import { useState, useEffect } from 'react'
import { NoOrder } from './cards/NoOrder'
import { ChooseStore } from './cards/ChooseStore'
import { MakeOrder } from './cards/MakeOrder'
import { Paying } from './cards/Paying'
import { Sending } from './cards/Sending'
import { CurrentOrder } from './cards/CurrentOrder'
import { Logo } from './cards/icons/Icons'
import { useRiseSocket } from '../hooks/useRiseSocket'
import { useRiseGet } from '../hooks/useRiseGet'
import { useRisePost } from '../hooks/useRisePost'
import login from '../utils/loginWrapper'

import { Status, CurrentOrderDetails, OrderEvent } from './interfaces'

const bgImage = `/coffeebg.jpeg`

const Layout = (props: any) => {
  const positions = [
    [0, 100, 200, 300, 400, 500],
    [-100, 0, 100, 200, 300, 400],
    [-200, -100, 0, 100, 200, 300],
    [-300, -200, -100, 0, 100, 200],
    [-400, -300, -200, -100, 0, 100],
    [-500, -400, -300, -200, -100, 0],
  ]

  const Comp1 = props.Position1
  const Comp2 = props.Position2
  const Comp3 = props.Position3
  const Comp4 = props.Position4
  const Comp5 = props.Position5
  const Comp6 = props.Position6

  return (
    <div
      className="flex h-screen w-screen flex-col"
      style={{
        background: `linear-gradient(rgba(34, 35, 37, 0), rgba(34, 35, 37, 0.4) 20%), url("${bgImage}")`,
        backgroundSize: 'cover',
      }}
    >
      <div className="mt-36  flex flex-col items-center justify-center px-8">
        <h1
          className="mb-4 flex flex-col items-center justify-center text-4xl"
          style={{
            color: '#EBDBCC',
          }}
        >
          <Logo />
          Rispresso
        </h1>
      </div>
      <div className="w-full">
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            transition: '0.2s',
            transform: `translateX(${positions[props.position][0]}%)`,
          }}
        >
          <Comp1 setPosition={props.setPosition} />
        </div>
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            transition: '0.2s',
            transform: `translateX(${positions[props.position][1]}%)`,
          }}
        >
          <Comp2 setPosition={props.setPosition} />
        </div>
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            transition: '0.2s',
            transform: `translateX(${positions[props.position][2]}%)`,
          }}
        >
          <Comp3 setPosition={props.setPosition} />
        </div>
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            transition: '0.2s',
            transform: `translateX(${positions[props.position][3]}%)`,
          }}
        >
          <Comp4 setPosition={props.setPosition} />
        </div>
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            transition: '0.2s',
            transform: `translateX(${positions[props.position][4]}%)`,
          }}
        >
          <Comp5 setPosition={props.setPosition} />
        </div>
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            transition: '0.2s',
            transform: `translateX(${positions[props.position][5]}%)`,
          }}
        >
          <Comp6 setPosition={props.setPosition} />
        </div>
      </div>
      {props.children}
    </div>
  )
}

const Main = () => {
  const [profile, loadingProfile] = useRiseGet({
    action: 'getProfile',
    input: {},
  })

  const [messages, connecting] = useRiseSocket({
    connection: 'customer',
    input: {},
  })

  const [currentOrder, currentOrderLoading] = useRiseGet({
    action: 'getCustomersCurrentOrder',
    input: {},
  })

  const [getCurrentOrderDetails] = useRisePost({
    action: 'getCustomersCurrentOrderDetails',
  })

  const [placeOrder, orderLoading] = useRisePost({
    action: 'startOrderPayment',
  })

  const [apiCancelOrder] = useRisePost({
    action: 'cancelOrder',
  })

  useRiseGet({
    action: 'listStores',
    input: {},
  })

  const [getProducts] = useRisePost({
    action: 'listProducts',
  })

  const [position, setPosition] = useState(0)
  const [chosenStore, setChosenStore] = useState('')
  const [products, setProducts] = useState<any[]>([])
  const [order, setOrder] = useState({
    items: [],
    status: 'NONE',
    errorMessage: '',
  })
  const [currentOrderDetails, setCurrentOrderDetails] =
    useState<CurrentOrderDetails>({
      amount: 0,
      customerName: '',
      products: '',
      storeId: '',
      orderId: '',
      time: 0,
    })

  const [currentOrderEvents, setCurrentOrderEvents] = useState<OrderEvent[]>([])
  const [cancelling, setCancelling] = useState(false)
  const loading = connecting || currentOrderLoading || loadingProfile

  useEffect(() => {
    if (currentOrder && !currentOrder.hasOwnProperty('item')) {
      getCurrentOrderDetails({
        orderId: currentOrder.orderId,
      }).then((x: any) => {
        const details = x.filter((x: any) => x.sk.includes('details'))[0]
        if (!details) {
          return
        }
        const products = JSON.parse(details.products)

        setCurrentOrderDetails({
          amount: details.amount,
          customerName: details.customerName,
          products: products,
          storeId: details.storeId,
          orderId: details.orderId,
          time: details.time,
        })

        const events = x.filter((x: any) => x.sk.includes('event'))

        setCurrentOrderEvents(events)

        if (
          events.filter(
            (x: any) => x.event === Status.ORDER_CANCELLATION_COMPLETE
          ).length > 0
        ) {
          setCancelling(false)
          setCurrentOrderDetails({
            amount: 0,
            customerName: '',
            products: '',
            storeId: '',
            orderId: '',
            time: 0,
          })
          setPosition(0)
        } else {
          setPosition(5)
        }
      })
    }
  }, [currentOrder])

  const getStepInfo = (list: any, event: Status) => {
    return list
      .sort((a: any, b: any) => a.time - b.time)
      .reduce(
        (acc: any, x: any) => {
          if (x.event === event) {
            return {
              on: true,
              time: x.time,
            }
          }
          return acc
        },
        {
          on: false,
          time: '',
        }
      )
  }

  /**
   * webSocket events
   */
  useEffect(() => {
    let index
    if (messages.length === 0) {
      return
    }
    if (messages.length === 1) {
      index = 0
    } else {
      index = messages.length - 1
    }

    const event: any = messages[index]

    if (event.event === Status.ORDER_PLACED) {
      getCurrentOrderDetails({
        orderId: event.orderId,
      }).then((x: any) => {
        const details = x.filter((x: any) => x.sk.includes('details'))[0]
        const products = JSON.parse(details.products)

        setCurrentOrderDetails({
          amount: details.amount,
          customerName: details.customerName,
          products: products,
          storeId: details.storeId,
          time: details.time,
          orderId: details.orderId,
        })

        const events = x.filter((x: any) => x.sk.includes('event'))
        setCurrentOrderEvents(events)
        setOrder((o: any) => {
          return {
            ...o,
            status: event.event,
          }
        })
        setPosition(5)
      })
    } else if (event.event === Status.ORDER_CANCELLATION_COMPLETE) {
      setCurrentOrderEvents((o: OrderEvent[]) => {
        return [
          ...o,
          {
            event: event.event,
            time: event.time,
            orderId: event.orderId,
          },
        ]
      })
      setCancelling(false)
    } else if (event.event === Status.ORDER_COMPLETE) {
      setCurrentOrderEvents((o: OrderEvent[]) => {
        return [
          ...o,
          {
            event: event.event,
            time: event.time,
            orderId: event.orderId,
          },
        ]
      })

      setOrder((o: any) => {
        return {
          ...o,
          status: event.event,
        }
      })
      setPosition(0)
    } else {
      let isCancelled = getStepInfo(
        currentOrderEvents,
        Status.ORDER_CANCELLATION_COMPLETE
      )

      if (isCancelled.on) {
        return
      }

      setCurrentOrderEvents((o: OrderEvent[]) => {
        return [
          ...o,
          {
            event: event.event,
            time: event.time,
            orderId: event.orderId,
          },
        ]
      })

      setOrder((o: any) => {
        return {
          ...o,
          status: event.event,
        }
      })

      setPosition(5)
    }
  }, [messages])

  const executeChooseStore = async (x: string) => {
    setChosenStore(x)
    const res = await getProducts({
      storeId: x,
    })

    setProducts(res)
  }

  const executePlaceOrder = async () => {
    const wait = () => new Promise((r) => setTimeout(r, 1000))

    setPosition(3)
    const total: number = order.items.reduce((acc: any, x: any) => {
      return acc + x.price
    }, 0)
    await wait()

    setPosition(4)

    placeOrder({
      products: JSON.stringify(order.items),
      amount: total,
      storeId: chosenStore,
      customerName: profile.name,
    })
      .then((x: any) => {
        if (x.error) {
          setOrder((o: any) => {
            return {
              ...o,
              status: Status.ORDER_ERROR,
              errorMessage:
                'There was a problem with your order, please try again',
            }
          })
          setPosition(0)
          return
        }
      })
      .catch((e: any) => {
        setOrder((o: any) => {
          return {
            ...o,
            status: Status.ORDER_ERROR,
            errorMessage:
              'There was a problem with your order, please try again',
          }
        })
      })
  }

  const cancelOrder = async () => {
    if (currentOrderDetails.storeId.length === 0) {
      return
    }

    setCancelling(true)

    await apiCancelOrder({
      storeId: currentOrderDetails.storeId,
      orderId: currentOrderDetails.orderId,
    })
  }

  if (loadingProfile) {
    return 'loading'
  }

  return (
    <Layout
      position={position}
      setPosition={setPosition}
      Position1={(props: any) => <NoOrder profile={profile} {...props} />}
      Position2={(props: any) => (
        <ChooseStore
          setChosenStore={executeChooseStore}
          chosenStore={chosenStore}
          {...props}
        />
      )}
      Position3={(props: any) => (
        <MakeOrder
          store={chosenStore}
          products={products}
          order={order}
          setOrder={setOrder}
          placeOrder={executePlaceOrder}
          {...props}
        />
      )}
      Position4={Paying}
      Position5={Sending}
      Position6={(props: any) => (
        <CurrentOrder
          order={order}
          cancelOrder={cancelOrder}
          cancelling={cancelling}
          currentOrderDetails={currentOrderDetails}
          currentOrderEvents={currentOrderEvents}
          storeId={currentOrderDetails.storeId}
          status={order.status}
          {...props}
        />
      )}
    ></Layout>
  )
}

export default login(Main)
