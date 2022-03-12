import { useState, useEffect } from 'react'
import { useRiseSocket } from '../hooks/useRiseSocket'
import { useRiseGet } from '../hooks/useRiseGet'
import { useRisePost } from '../hooks/useRisePost'
import login from '../utils/loginWrapper'

// pages
import { Settings } from './pages/Settings'
import { ChooseStore } from './pages/ChooseStore'
import { MakeOrder } from './pages/MakeOrder'
import { OrderPaying } from './pages/OrderPaying'
import { OrderSending } from './pages/OrderSending'
import { Home } from './pages/Home'

import {
  Status,
  PageState,
  CurrentOrderDetails,
  OrderEvent,
} from './interfaces'

function Main() {
  // prefetch
  useRiseGet({
    action: 'listStores',
    input: {},
  })

  // For this component
  const [messages, connecting] = useRiseSocket({
    connection: 'customer',
    input: {},
  })

  const [profile, loadingProfile] = useRiseGet({
    action: 'getProfile',
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

  const [page, setPage] = useState('home')
  const [order, setOrder] = useState({
    items: [],
    status: Status.NONE,
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

  const [store, setStore] = useState('')
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
        }
      })
    }
  }, [currentOrder])

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
        setPage('home')
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
    } else {
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
      setPage('home')
    }
  }, [messages])

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

    placeOrder({
      products: JSON.stringify(order.items),
      amount: total,
      storeId: store,
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
          setPage('home')
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

  if (loading) {
    return <p>Loading...</p>
  }
  if (order.status === Status.PAYING) {
    return <OrderPaying />
  }

  if (order.status === Status.SENDING) {
    return <OrderSending />
  }

  if (page === PageState.SETTINGS) {
    return <Settings setPage={setPage} profile={profile} />
  }

  if (page === PageState.CHOOSE_STORE) {
    return <ChooseStore setPage={setPage} setStore={setStore} />
  }

  if (page === PageState.MAKE_ORDER) {
    return (
      <MakeOrder
        store={store}
        setPage={setPage}
        order={order}
        setOrder={setOrder}
        placeOrder={executePlaceOrder}
      />
    )
  }

  return (
    <Home
      setPage={setPage}
      order={order}
      cancelOrder={cancelOrder}
      cancelling={cancelling}
      currentOrderDetails={currentOrderDetails}
      currentOrderEvents={currentOrderEvents}
      error={Status.ORDER_ERROR ? order.errorMessage : ''}
    />
  )
}

export default login(Main)
