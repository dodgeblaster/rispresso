import { useState, useEffect } from 'react'
import { Input } from '../base/Input'

function PrimaryButton(props: any) {
  return (
    <button
      className="mr-2 rounded bg-green-700 px-4 py-2 text-white"
      onClick={props.onClick}
    >
      {props.text}
    </button>
  )
}

function SecondaryButton(props: any) {
  return (
    <button className="rounded bg-gray-200 px-4 py-2" onClick={props.onClick}>
      {props.text}
    </button>
  )
}

const initFormState: any = {}
export function Popup(props: any) {
  const [formValues, setFormValues] = useState(initFormState)
  useEffect(() => {
    const init = Object.keys(props.definition).reduce((acc: any, x: any) => {
      acc[x] = ''
      return acc
    }, {})
    setFormValues(init)
  }, [])
  return (
    <div className="absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="rounded-md bg-white shadow-lg"
        style={{
          width: 400,
          //minHeight: 400,
        }}
      >
        <div className="py4 flex items-center border-b border-gray-200 px-4 py-4 font-bold">
          {props.title}
        </div>
        <div className="py-4 px-4">
          {Object.keys(props.definition).map((k: string) => {
            return (
              <Input
                name={props.definition[k].label}
                value={formValues[k]}
                setValue={(text: any) => {
                  setFormValues((f: any) => {
                    return {
                      ...f,
                      [k]: text,
                    }
                  })
                }}
              />
            )
          })}

          <PrimaryButton
            text="Create Store"
            onClick={() => {
              props.submit(formValues)
            }}
          />
          <SecondaryButton
            text="Cancel"
            onClick={() => {
              props.cancel()
            }}
          />
        </div>
      </div>
    </div>
  )
}
