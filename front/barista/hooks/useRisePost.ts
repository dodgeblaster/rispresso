import { useState, useEffect } from 'react'
import { Auth } from 'aws-amplify'
import { useSWRConfig } from 'swr'

const getToken = async () => {
  return (await Auth.currentSession()).getIdToken().getJwtToken()
}

export const useRisePost = (props: any) => {
  const [loading, setLoading] = useState(false)
  const { mutate } = useSWRConfig()

  const URL = process.env.NEXT_PUBLIC_RISE_ENDPOINT || ''
  const makeApiCall: any = async (input: any) => {
    setLoading(true)
    const jwt = await getToken()

    return fetch(URL, {
      method: 'POST',
      body: JSON.stringify({
        action: props.action,
        input: input,
      }),
      headers: {
        Authorization: 'Bearer ' + jwt,
      },
    }).then((x) => {
      setLoading(false)
      for (const m of props.invalidate || []) {
        mutate(JSON.stringify(m))
      }
      return x.json()
    })
  }

  return [makeApiCall, loading]
}
