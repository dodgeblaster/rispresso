enum Status {
  'NONE' = 'NONE',
  'PAYING' = 'PAYING',
  'SENDING' = 'SENDING',
  'ORDER_PLACED' = 'ORDER_PLACED',
  'ORDER_STARTED' = 'ORDER_STARTED',
  'ORDER_READY' = 'ORDER_READY',
  'ORDER_COMPLETE' = 'ORDER_COMPLETE',
  'ORDER_ERROR' = 'ORDER_ERROR',
}

export function CurrentOrder(props: any) {
  const stepOneActive = [
    Status.ORDER_PLACED,
    Status.ORDER_STARTED,
    Status.ORDER_READY,
  ].includes(props.status)

  const stepTwoActive = [Status.ORDER_STARTED, Status.ORDER_READY].includes(
    props.status
  )

  const stepThreeActive = [Status.ORDER_READY].includes(props.status)
  return (
    <>
      <div className="relative rounded-lg bg-gradient-to-r from-green-700 to-green-500 px-4 py-4 text-white shadow">
        <p className="font-bold">Current Order</p>
        <p>Store: {props.storeId}</p>
        {/* <p>Ready in 1m 20s</p> */}
        <hr className="my-4 border-white opacity-50" />
        <p className={stepOneActive ? 'opacity-100' : 'opacity-60'}>
          1. Order has been placed
        </p>
        <p className={stepTwoActive ? 'opacity-100' : 'opacity-60'}>
          2. Order has been started
        </p>
        <p className={stepThreeActive ? 'opacity-100' : 'opacity-60'}>
          3. Order is ready
        </p>
      </div>
    </>
  )
}
