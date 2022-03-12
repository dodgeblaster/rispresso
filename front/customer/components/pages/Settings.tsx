import { useState, useEffect } from 'react'
import { NavBar } from '../base/NavBar'
import { Input } from '../base/Input'
import { SavingIcon } from '../base/SavingIcon'
import { useRiseGet } from '../../hooks/useRiseGet'
import { useRisePost } from '../../hooks/useRisePost'

import { PageState } from '../interfaces'

export function Settings(props: any) {
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
    <div className="relative">
      <NavBar page="Settings" back={() => props.setPage(PageState.HOME)} />
      <div className="px-10 py-4">
        <Input name="Name" value={name} setValue={setNameValue} />
        <Input name="CreditCard" value={cc} setValue={setCcValue} />
        {saving && (
          <p className="px-2 py-2  ">
            <SavingIcon />
            <span className="ml-2 inline-block">Saving...</span>
          </p>
        )}
      </div>
    </div>
  )
}
