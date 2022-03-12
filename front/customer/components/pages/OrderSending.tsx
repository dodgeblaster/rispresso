import { SavingIcon } from '../base/SavingIcon'
export function OrderSending() {
  return (
    <div className="absolute top-0 bottom-0 right-0 left-0 flex flex-col items-center justify-center bg-gradient-to-r from-green-700 to-green-500">
      <p>
        <SavingIcon />
      </p>
      <p className="text-white">Sending order to store</p>
    </div>
  )
}
