import { useState, useEffect } from 'react'

const BackIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 opacity-100"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
        clipRule="evenodd"
      />
    </svg>
  )
}

const ForwardIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 opacity-100"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
        clipRule="evenodd"
      />
    </svg>
  )
}

const SuccessIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 opacity-100"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  )
}

interface CardProps {
  id: string
  name: string
  forward: any
  back: any
  cancelled: boolean
  forwardType?: string
  orderedTime: number
  products: any
  readyTime: number | false
}

export function Card(props: CardProps) {
  const [ms, setMs] = useState(0)
  const ONE_MINUTE = 60000

  useEffect(() => {
    const newMs = Date.now() - props.orderedTime
    setMs(newMs)

    const interval = setInterval(() => {
      const newMs = Date.now() - props.orderedTime
      setMs(newMs)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  let totalMs = props.readyTime ? props.readyTime - props.orderedTime : ms
  const percent = Math.floor((totalMs / (1 * ONE_MINUTE)) * 100)
  const seconds = Math.floor((totalMs * 0.001) % 60)
  const minutes = Math.floor(totalMs / 60000)

  let color = 'bg-green-400'
  if (percent > 50) {
    color = 'bg-yellow-500'
  }
  if (percent > 70) {
    color = 'bg-red-600'
  }

  const formatNameFromId = (x: string) =>
    x
      .split('-')
      .map((x: string) => {
        return x.charAt(0).toUpperCase() + x.slice(1)
      })
      .join(' ')
  const displayProducts = props.products.reduce((acc: any, x: any) => {
    const id = formatNameFromId(x.type)
    if (!acc[id]) {
      acc[id] = 0
    }

    acc[id] = acc[id] + 1
    return acc
  }, {})

  return (
    <div className=" mb-2 flex h-32 overflow-hidden  rounded bg-white shadow-md">
      <div
        className="flex w-20 items-center justify-center bg-gray-100"
        onClick={props.back}
      >
        <BackIcon />
      </div>

      <div className="relative flex flex-1 flex-col px-4 py-4">
        {props.cancelled && (
          <div className="absolute right-4 bottom-10 rounded bg-orange-300 px-4 py-2 font-bold">
            CANCELLED
          </div>
        )}
        <div className="flex ">
          <div className="flex-1">
            <p className="font-bold">Order #{props.id.slice(0, 3)}</p>
            <p>Name: {props.name}</p>
          </div>
          <div className="flex-1">
            {Object.keys(displayProducts).map((k: string) => {
              return (
                <p>
                  {k}: {displayProducts[k]}
                </p>
              )
            })}
          </div>
        </div>
        <div className="mt-2">
          <p>
            Timer: {minutes}:{String(seconds).padStart(2, '0')}
          </p>
          <div className="relative h-2 w-full overflow-hidden rounded bg-gray-200">
            <div
              className={`absolute top-0 left-0 bottom-0 rounded ${color}`}
              style={{
                width: `${percent}%`,
                transition: '0.2s',
              }}
            ></div>
          </div>
        </div>
      </div>

      {props.forwardType === 'success' && (
        <div
          className="flex w-20 items-center justify-center bg-green-400"
          onClick={props.forward}
        >
          <SuccessIcon />
        </div>
      )}
      {props.forwardType !== 'success' && (
        <div
          className="flex w-20 items-center justify-center bg-gray-100"
          onClick={props.forward}
        >
          <ForwardIcon />
        </div>
      )}
    </div>
  )
}
