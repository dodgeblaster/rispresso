export function CurrentOrder(props: any) {
  return (
    <>
      <div className="relative rounded-lg bg-gradient-to-r from-green-700 to-green-500 px-4 py-4 text-white shadow">
        <p className="font-bold">Current Order</p>
        <p>Store: 1234</p>
        <p>Ready in 1m 20s</p>
        <hr className="my-4 border-white opacity-50" />
        <p className="">1. Order has been placed</p>
        <p className={props.orderStarted ? 'opacity-100' : 'opacity-60'}>
          2. Order has been started
        </p>
        <p className={props.orderReady ? 'opacity-100' : 'opacity-60'}>
          3. Order is ready
        </p>
      </div>
    </>
  )
}
