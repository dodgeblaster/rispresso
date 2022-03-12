import useSWR from 'swr'

const fetcher = async (props: string) => {
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
  }).then((x) => x.json())
}

export const useRiseGet = (props: any) => {
  const { data, error } = useSWR(JSON.stringify(props), fetcher)
  const loading = !error && !data
  return [data, loading, error]
}
