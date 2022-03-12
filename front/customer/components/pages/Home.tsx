import { NavBar } from '../base/NavBar'
import { CurrentOrder } from '../base/CurrentOrder'
import { HomeDashboard } from '../base/HomeDashboard'
import { Status } from '../interfaces'

export function Home(props: any) {
  const hasEvents = props.currentOrderEvents.length > 0

  const isComplete =
    props.currentOrderEvents.filter((x: any) => {
      return x.event === Status.ORDER_COMPLETE
    }).length > 0

  const isCancelled =
    props.currentOrderEvents.filter((x: any) => {
      return x.event === Status.ORDER_CANCELLATION_COMPLETE
    }).length > 0

  const storeIdIsPresent = props.currentOrderDetails.storeId.length > 0

  const showCard = hasEvents && !isComplete && storeIdIsPresent
  const orderInProcess = hasEvents && !isComplete && !isCancelled

  return (
    <div className="relative">
      <NavBar page="Home" />
      <div className="px-10 py-4">
        {showCard && (
          <CurrentOrder
            storeId={props.currentOrderDetails.storeId}
            status={props.order.status}
            currentOrderDetails={props.currentOrderDetails}
            currentOrderEvents={props.currentOrderEvents}
            cancelling={props.cancelling}
          />
        )}
        {props.error.length > 0 && (
          <p className="pt-4 text-red-600">{props.error}</p>
        )}
        <HomeDashboard />

        <div className="flex">
          <button
            onClick={() => props.setPage('settings')}
            className="mr-2 flex-1 rounded bg-gray-600 px-4 py-10 text-white"
          >
            Settings
          </button>
          <button
            disabled={props.cancelled}
            onClick={() => {
              if (orderInProcess) {
                props.cancelOrder()
              } else {
                props.setPage('choose-store')
              }
            }}
            className={` flex-1 rounded bg-gray-800 px-4 py-10 text-white ${
              props.cancelling && 'bg-gray-500'
            }`}
          >
            {props.cancelling
              ? 'Cancelling...'
              : orderInProcess
              ? 'Cancel Order'
              : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  )
}
