import { useState, useEffect } from 'react'
import { NavBar } from '../base/NavBar'
import { useRiseSocket } from '../../hooks/useRiseSocket'
import { useRiseGet } from '../../hooks/useRiseGet'
import { useRisePost } from '../../hooks/useRisePost'
import { Card } from '../base/BaristaCard'

enum Status {
  'NONE' = 'NONE',
  'PAYING' = 'PAYING',
  'SENDING' = 'SENDING',
  'ORDER_PLACED' = 'ORDER_PLACED',
  'ORDER_STARTED' = 'ORDER_STARTED',
  'ORDER_READY' = 'ORDER_READY',
  'ORDER_COMPLETE' = 'ORDER_COMPLETE',
  'ORDER_ERROR' = 'ORDER_ERROR',
  'ORDER_CANCELLATION_COMPLETE' = 'ORDER_CANCELLATION_COMPLETE',
}

interface UpdateEvent {
  orderId: string
  time: number
  event: Status
}

interface OrderDetailsEvent {
  orderId: string
  time: number
  products: string
  customerId: string
  customerName: string
  storeId: string
}

const initOrderState: any = {}
const initReadyState: any = {}
const initOrderStateState: any = {}
export function Board(props: any) {
  const [orders, setOrder] = useState(initOrderState)
  const [orderState, setOrderState] = useState(initOrderStateState)
  const [orderCancelState, setOrderCancelState] = useState(initOrderStateState)
  const [orderReadyState, setOrderReadyState] = useState(initReadyState)
  const [messages, connecting] = useRiseSocket({
    connection: 'barista',
    input: {
      storeId: props.storeId,
    },
  })

  const [apiOrders, apiOrdersLoading] = useRiseGet({
    action: 'listBaristaOrders',
    input: {
      storeId: props.storeId,
    },
  })

  const [executeApiStartOrder] = useRisePost({
    action: 'orderStarted',
  })

  const [executeApiReadyOrder] = useRisePost({
    action: 'orderReady',
  })

  const [executeApiCompleteOrder] = useRisePost({
    action: 'orderComplete',
  })

  /**
   * On Load
   */
  useEffect(() => {
    if (apiOrders) {
      const res = apiOrders
        .filter((x: any) => !x.event && !x.state)
        .map((x: any) => {
          const products = JSON.parse(x.products)

          return {
            orderId: x.orderId,
            name: x.customerName,
            customerId: x.customerId,
            storeId: x.storeId,
            products: products,

            orderedTime: x.time,
          }
        })
        .reduce((acc: any, x: any) => {
          acc[x.orderId] = x
          return acc
        }, {})

      setOrder(res)

      const orderState = apiOrders
        .filter((x: any) => x.event)
        .sort((a: any, b: any) => a.time - b.time)
        .reduce((acc: any, x: any) => {
          let orderId = x.orderId
          let status = Status.ORDER_PLACED
          if (x.event === 'ORDER_STARTED') {
            status = Status.ORDER_STARTED
          }
          if (x.event === 'ORDER_READY') {
            status = Status.ORDER_READY
          }
          if (x.event === 'ORDER_COMPLETE') {
            status = Status.ORDER_COMPLETE
          }

          acc[orderId] = status
          return acc
        }, {})

      setOrderState(orderState)

      const orderCancelState = apiOrders
        .filter((x: any) => x.event)
        .sort((a: any, b: any) => a.time - b.time)
        .reduce((acc: any, x: any) => {
          let orderId = x.orderId
          if (acc[orderId]) {
            return acc
          }
          let status = false
          if (x.event === 'ORDER_CANCELLATION_COMPLETE') {
            status = true
          }

          acc[orderId] = status
          return acc
        }, {})

      setOrderCancelState(orderCancelState)
    }
  }, [apiOrders])

  /**
   * On Websocket Message
   */
  useEffect(() => {
    type WebSocketEvent = OrderDetailsEvent | UpdateEvent
    // @ts-ignore
    let eventMessages: WebSocketEvent[] = messages

    if (eventMessages.length === 0) {
      return
    }

    const index = eventMessages.length === 1 ? 0 : eventMessages.length - 1
    const event = eventMessages[index]

    function isCancellationEvent(
      e: OrderDetailsEvent | UpdateEvent
    ): e is UpdateEvent {
      return (e as UpdateEvent).event === 'ORDER_CANCELLATION_COMPLETE'
    }

    function isOrderDetailsEvent(
      e: OrderDetailsEvent | UpdateEvent
    ): e is OrderDetailsEvent {
      return (e as OrderDetailsEvent).products !== undefined
    }

    if (isCancellationEvent(event)) {
      setOrderCancelState((x: any) => {
        return {
          ...x,
          [event.orderId]: true,
        }
      })
      return
    }

    if (isOrderDetailsEvent(event)) {
      const products = JSON.parse(event.products)
      setOrder((x: any) => {
        return {
          ...x,
          [event.orderId]: {
            orderId: event.orderId,
            name: event.customerName,
            products: products,
            customerId: event.customerId,
            storeId: event.storeId,
            orderedTime: event.time,
          },
        }
      })

      setOrderState((x: any) => {
        return {
          ...x,
          [event.orderId]: Status.ORDER_PLACED,
        }
      })
    }
  }, [messages])

  /**
   * Api Calls
   */
  const executeStartOrder = async (x: any) => {
    await executeApiStartOrder({
      storeId: props.storeId,
      orderId: x.orderId,
      customerId: x.customerId,
    })
  }

  const executeReadyOrder = async (x: any) => {
    await executeApiReadyOrder({
      storeId: props.storeId,
      orderId: x.orderId,
      customerId: x.customerId,
    })
  }

  const executeCompleteOrder = async (x: any) => {
    await executeApiCompleteOrder({
      storeId: props.storeId,
      orderId: x.orderId,
      customerId: x.customerId,
    })
  }

  /**
   * Organizing Lists
   */
  const orderedList = Object.keys(orderState)
    .filter((k: string) => {
      return orderState[k] === Status.ORDER_PLACED
    })
    .map((k: string) => {
      return {
        ...orders[k],
        orderId: k,
      }
    })

  const startedList = Object.keys(orderState)
    .filter((k: string) => {
      return orderState[k] === Status.ORDER_STARTED
    })
    .map((k: string) => {
      return {
        ...orders[k],
        orderId: k,
      }
    })

  const pickupList = Object.keys(orderState)
    .filter((k: string) => {
      return orderState[k] === Status.ORDER_READY
    })
    .map((k: string) => {
      return {
        ...orders[k],
        orderId: k,
      }
    })

  if (apiOrdersLoading || connecting) {
    return 'Loading...'
  }
  return (
    <div>
      <NavBar page="Barista" back={props.back} />
      <div className="absolute top-16 left-0 right-0 bottom-0 flex bg-gray-200 px-4">
        <div className="flex-1 px-1 py-4">
          <p className="py-2 font-bold">Ordered</p>
          <hr />
          {orderedList.map((o: any) => (
            <Card
              key={o.orderId}
              id={o.orderId}
              name={o.name}
              products={o.products}
              orderedTime={o.orderedTime}
              readyTime={false}
              cancelled={orderCancelState[o.orderId]}
              back={() => {
                setOrderState(() => {})
              }}
              forward={() => {
                setOrderState((x: any) => {
                  executeStartOrder(o)
                  return {
                    ...x,
                    [o.orderId]: Status.ORDER_STARTED,
                  }
                })
              }}
            />
          ))}
        </div>
        <div className="flex-1 px-1 py-4">
          <p className="py-2 font-bold">Started</p>
          <hr />
          {startedList.map((o: any) => (
            <Card
              key={o.orderId}
              id={o.orderId}
              name={o.name}
              products={o.products}
              orderedTime={o.orderedTime}
              cancelled={orderCancelState[o.orderId]}
              readyTime={false}
              back={() => {
                setOrderState((x: any) => {
                  return {
                    ...x,
                    [o.orderId]: Status.ORDER_PLACED,
                  }
                })
              }}
              forward={() => {
                executeReadyOrder(o)
                setOrderReadyState((x: any) => {
                  return {
                    ...x,
                    [o.orderId]: Date.now(),
                  }
                })
                setOrderState((x: any) => {
                  return {
                    ...x,
                    [o.orderId]: Status.ORDER_READY,
                  }
                })
              }}
            />
          ))}
        </div>
        <div className="flex-1 px-1 py-4">
          <p className="py-2 font-bold">Read For Pickup</p>
          <hr />
          {pickupList.map((o: any) => (
            <Card
              key={o.orderId}
              id={o.orderId}
              name={o.name}
              products={o.products}
              orderedTime={o.orderedTime}
              readyTime={orderReadyState[o.orderId] || false}
              cancelled={orderCancelState[o.orderId]}
              back={() => {
                executeStartOrder(o)
                setOrderState((x: any) => {
                  return {
                    ...x,
                    [o.orderId]: Status.ORDER_STARTED,
                  }
                })
              }}
              forwardType="success"
              forward={() => {
                executeCompleteOrder(o)
                setOrderState((x: any) => {
                  return {
                    ...x,
                    [o.orderId]: Status.ORDER_COMPLETE,
                  }
                })
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
