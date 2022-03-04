import { useRiseSocket } from '../hooks/useRiseSocket'
import { useRiseGet } from '../hooks/useRiseGet'
import { useRisePost } from '../hooks/useRisePost'
import login from '../utils/loginWrapper'

const Home = (props: any) => {
  const [messages, connecting] = useRiseSocket({
    connection: 'barista',
    input: {
      storeId: '1234',
    },
  })

  const [data, loading, error] = useRiseGet({
    action: 'echo',
    input: {},
  })

  const [executeSend, sending] = useRisePost({
    action: 'send',
    input: {
      storeId: '1234',
    },
  })

  if (loading || connecting) return <p>Loading</p>

  if (error) return <p>{error}</p>
  return (
    <div>
      <button onClick={executeSend}>{sending ? 'Sending' : 'Send'}</button>
      <p>Result</p>
      <p>{JSON.stringify(data)}</p>
      {messages.map((x: any) => (
        <p>{JSON.stringify(x)}</p>
      ))}
    </div>
  )

  // if (connecting) {
  //   return <p>Connecting...</p>
  // }

  // return (
  //   <div className="flex min-h-screen flex-col items-center justify-center py-2">
  //     <Head>
  //       <title>Create Next App</title>
  //       <link rel="icon" href="/favicon.ico" />
  //     </Head>

  //     <div>
  //       {
  //         // @ts-ignore
  //         messages.map((x: any) => (
  //           <p key={Math.random().toString()}>{JSON.stringify(x)}</p>
  //         ))
  //       }
  //     </div>
  //   </div>
  // )
}

export default login(Home)
