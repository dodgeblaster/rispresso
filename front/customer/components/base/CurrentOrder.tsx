import { DateTime } from 'luxon'
import { Status } from '../interfaces'

const formatTime = (time: number) => {
  return DateTime.fromMillis(time).toLocaleString(DateTime.TIME_SIMPLE)
}
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

export function CurrentOrder(props: any) {
  let stepOneActive = getStepInfo(props.currentOrderEvents, Status.ORDER_PLACED)

  let stepTwoActive = getStepInfo(
    props.currentOrderEvents,
    Status.ORDER_STARTED
  )

  let stepThreeActive = getStepInfo(
    props.currentOrderEvents,
    Status.ORDER_READY
  )

  if (stepThreeActive.time < stepTwoActive.time) {
    stepThreeActive.on = false
    stepThreeActive.time = ''
  }

  let isCancelling = getStepInfo(
    props.currentOrderEvents,
    Status.ORDER_CANCELLATION_STARTED
  )

  let isCancelled = getStepInfo(
    props.currentOrderEvents,
    Status.ORDER_CANCELLATION_COMPLETE
  )

  return (
    <>
      <div className="relative rounded-lg bg-gradient-to-r from-green-700 to-green-500 px-4 py-4 text-white shadow">
        <p className="font-bold">Current Order</p>
        <p>Store: {props.currentOrderDetails.storeId}</p>
        <p>CustomerName: {props.currentOrderDetails.customerName}</p>
        <p>Total: ${(props.currentOrderDetails.amount / 100).toFixed(2)}</p>

        {/* <p>Ready in 1m 20s</p> */}
        <hr className="my-4 border-white opacity-50" />
        {!isCancelling.on && !isCancelled.on && (
          <>
            <p
              className={`flex items-center justify-between ${
                stepOneActive.on ? 'opacity-100' : 'opacity-60'
              }`}
            >
              <span>1. Order has been placed</span>
              <span>{stepOneActive.on && formatTime(stepOneActive.time)}</span>
            </p>
            <p
              className={`flex items-center justify-between ${
                stepTwoActive.on ? 'opacity-100' : 'opacity-60'
              }`}
            >
              <span>2. Order has been started</span>
              <span>{stepTwoActive.on && formatTime(stepTwoActive.time)}</span>
            </p>
            <p
              className={`flex items-center justify-between ${
                stepThreeActive.on ? 'opacity-100' : 'opacity-60'
              }`}
            >
              <span>3. Order is ready</span>
              <span>
                {stepThreeActive.on && formatTime(stepThreeActive.time)}
              </span>
            </p>
          </>
        )}
        {props.cancelling && <p>Cancelling Order...</p>}
        {isCancelled.on && <p>Order has been cancelled</p>}
      </div>
    </>
  )
}
