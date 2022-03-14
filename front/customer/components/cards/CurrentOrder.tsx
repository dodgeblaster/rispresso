import { CartIcon, CheckIcon, UnCheckIcon, StopIcon } from './icons/Icons'
import { DateTime } from 'luxon'
import {
  Status,
  PageState,
  CurrentOrderDetails,
  OrderEvent,
} from '../interfaces'

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

export const CurrentOrder = (props: any) => {
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
    <div className=" mx-4 my-4 flex max-w-2xl flex-col items-center justify-center overflow-hidden rounded-lg bg-white bg-gradient-to-br  from-yellow-800 to-yellow-600 text-white shadow-lg md:mx-auto">
      <div className="  w-full px-8 pt-8 opacity-70">
        <p className="flex font-bold">
          <CartIcon />
          <span className="ml-1">Current Order</span>
        </p>
      </div>
      <div className="mb-4 h-96 w-full rounded-lg px-8 py-4">
        <p>Store Id: {props.currentOrderDetails.storeId}</p>
        <p>Customer Name: {props.currentOrderDetails.customerName}</p>
        <p>Total: ${(props.currentOrderDetails.amount / 100).toFixed(2)}</p>
        <hr className="my-4 border-black opacity-20" />

        {!isCancelling.on && !isCancelled.on && (
          <>
            <div
              className={`mb-2 flex justify-between ${
                stepOneActive.on ? 'opacity-100' : 'opacity-60'
              }`}
            >
              <p className="flex items-center">
                {stepOneActive.on ? <CheckIcon /> : <UnCheckIcon />}
                <p className="ml-2">1. Order has been placed</p>
              </p>
              <p>{stepOneActive.on && formatTime(stepOneActive.time)}</p>
            </div>

            <div
              className={`mb-2 flex justify-between ${
                stepTwoActive.on ? 'opacity-100' : 'opacity-60'
              }`}
            >
              <p className="flex items-center">
                {stepTwoActive.on ? <CheckIcon /> : <UnCheckIcon />}
                <p className="ml-2">2. Order has been started</p>
              </p>
              <p>{stepTwoActive.on && formatTime(stepTwoActive.time)}</p>
            </div>

            <div
              className={`mb-2 flex justify-between ${
                stepThreeActive.on ? 'opacity-100' : 'opacity-60'
              }`}
            >
              <p className="flex items-center">
                {stepThreeActive.on ? <CheckIcon /> : <UnCheckIcon />}
                <p className="ml-2">3. Order is ready</p>
              </p>
              <p>{stepThreeActive.on && formatTime(stepThreeActive.time)}</p>
            </div>
          </>
        )}

        {props.cancelling && <p>Cancelling Order...</p>}
        {isCancelled.on && <p>Order has been cancelled</p>}
      </div>
      {isCancelled.on ? (
        <button
          onClick={() => props.setPosition(0)}
          className="flex w-full justify-center bg-yellow-800 px-8 py-4 text-white"
        >
          <span className="ml-2 ">Back</span>
        </button>
      ) : (
        <button
          onClick={props.cancelOrder}
          className="flex w-full justify-center bg-yellow-800 px-8 py-4 text-white"
        >
          <StopIcon />
          <span className="ml-2 ">Cancel Order</span>
        </button>
      )}
    </div>
  )
}
