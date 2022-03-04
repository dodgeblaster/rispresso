import { Auth } from 'aws-amplify'
import useSWR from 'swr'

const getToken = async () => {
  return (await Auth.currentSession()).getAccessToken().getJwtToken()
}

const fetcher = async (props: string) => {
  const jwt = await getToken()
  const URL = process.env.NEXT_PUBLIC_RISE_ENDPOINT || ''

  const riseInput = JSON.parse(props)
  const action = riseInput.action
  const input = riseInput.input

  return fetch(URL, {
    method: 'POST',
    body: JSON.stringify({
      action: action,
      input,
    }),
    headers: {
      Authorization: 'Bearer ' + jwt,
    },
  }).then((x) => x.json())
}

export const useRiseGet = (props: any) => {
  const { data, error } = useSWR(JSON.stringify(props), fetcher)
  const loading = !error && !data
  return [data, loading, error]
}
