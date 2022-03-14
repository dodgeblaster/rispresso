import { useState, useEffect } from 'react'
import { ForwardArrowIcon, SavingIcon } from './icons/Icons'
import { useRiseSocket } from '../../hooks/useRiseSocket'
import { useRiseGet } from '../../hooks/useRiseGet'
import { useRisePost } from '../../hooks/useRisePost'

function Input(props: any) {
  return (
    <div className="mb-4 flex w-full flex-col">
      <label className="text-white">{props.name}</label>
      <input
        key={props.name}
        onChange={(e: any) => props.setValue(e.target.value)}
        value={props.value}
        className="py4 rounded bg-gray-200 px-4 py-4"
      ></input>
    </div>
  )
}

export function NoOrder(props: any) {
  const [ccInfo, loadingCcInfo] = useRiseGet({
    action: 'getCreditCardInfo',
    input: {},
  })

  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [cc, setCc] = useState('')
  const [started, setStarted] = useState(false)

  const [apiSetProfile] = useRisePost({
    action: 'setProfile',
    invalidate: [
      {
        action: 'getProfile',
        input: {},
      },
    ],
  })

  const [apiSetCreditCardInfo] = useRisePost({
    action: 'setCreditCardInfo',
  })

  useEffect(() => {
    if (props.profile && props.profile.name) {
      setName(props.profile.name)
    }

    if (ccInfo && ccInfo.creditCardInfo) {
      setCc(ccInfo.creditCardInfo)
    }
  }, [ccInfo])

  useEffect(() => {
    if (!started) {
      return
    }
    // @ts-ignore
    clearTimeout(window.settingsSave)
    // @ts-ignore
    window.settingsSave = setTimeout(async () => {
      setSaving(true)
      await apiSetProfile({
        name: name,
      })
      await apiSetCreditCardInfo({
        creditCardInfo: cc,
      })
      setSaving(false)
    }, 500)
  }, [name, cc, started])

  if (loadingCcInfo) {
    return <p>Loading...</p>
  }

  const setNameValue = (s: string) => {
    setStarted(true)
    setName(s)
  }

  const setCcValue = (s: string) => {
    setStarted(true)
    setCc(s)
  }

  return (
    <div className="mx-10 my-10 flex max-w-2xl flex-col items-center justify-center overflow-hidden md:mx-auto">
      {saving && (
        <div className="flex flex-col items-center px-2 py-2">
          <SavingIcon />
          <p className="ml-2 inline-block text-white">Saving</p>
        </div>
      )}

      <Input name="Name for Order" value={name} setValue={setNameValue} />
      <Input name="CreditCard" value={cc} setValue={setCcValue} />

      <button
        onClick={() => props.setPosition(1)}
        className="flex w-full rounded-lg bg-gradient-to-br from-yellow-800 to-yellow-600 px-4 py-4 text-white"
      >
        <span className="mr-2">Order Now</span> <ForwardArrowIcon />
      </button>
    </div>
  )
}
