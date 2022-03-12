import { useState, useEffect } from 'react'
import { Buffer } from 'buffer'
import { Auth } from 'aws-amplify'

const getToken = async () => {
  return (await Auth.currentSession()).getAccessToken().getJwtToken()
}

const initMessages: any[] = []
export const useRiseSocket = (props: any) => {
  const [messages, setMessages] = useState(initMessages)
  const [connecting, setConnecting] = useState(true)

  const URL = process.env.NEXT_PUBLIC_RISE_SOCKET_ENDPOINT || ''
  let interval: any

  const execute = async () => {
    /**
     * Setup Websocket Connection
     */
    const url = URL
    const jwt = await getToken()
    const headers = Buffer.from(
      JSON.stringify({
        jwt: jwt,
      })
    ).toString('base64')
    const urlWithHeaders = `${url}?header=${headers}`
    const socket = new WebSocket(urlWithHeaders)

    /**
     * Once ready, send event to get connectionId
     */
    let subId = null
    socket.addEventListener('open', (e) => {
      console.log('WebSocket is connected')
      const payload = {
        action: 'sendMessage',
        data: {
          channel: 'RISE_CONNECTION_INFO',
          payload: {},
        },
      }
      socket.send(JSON.stringify(payload))
    })

    /**
     * Add Error Listener
     */
    socket.addEventListener('error', (e) =>
      console.error('WebSocket is in error', e)
    )

    /**
     * Add Connection Info Listener
     */
    const isConnectionInfo = (str: string) => {
      const e = JSON.parse(str)
      if (Object.keys(e).length !== 1) return false
      if (!e.connectionId) return false
      return e.connectionId
    }
    const isKeepAliveMessage = (str: string) => {
      const e = JSON.parse(str)
      if (Object.keys(e).length !== 1) return false
      if (!e.KEEPALIVE) return false
      return e.KEEPALIVE
    }
    socket.addEventListener('message', (e) => {
      if (isConnectionInfo(e.data)) {
        subId = isConnectionInfo(e.data)
        const payload = {
          action: 'sendMessage',
          data: {
            channel: 'RISE_CONNECT',
            payload: {
              connection: props.connection,
              jwt: jwt,
              id: subId,
              input: props.input,
            },
          },
        }
        socket.send(JSON.stringify(payload))
        setConnecting(false)
        return
      }
      if (isKeepAliveMessage(e.data)) {
        console.log('keepalive received')
        return
      }
      // @ts-ignore
      setMessages((m) => [...m, JSON.parse(e.data)])
    })

    const MINUTE = 60000
    const FIVE_MINUTES = 5 * MINUTE
    interval = setInterval(() => {
      console.log('sending keepalive')
      const payload = {
        action: 'sendMessage',
        data: {
          channel: 'RISE_KEEPALIVE',
          payload: {},
        },
      }
      socket.send(JSON.stringify(payload))
    }, FIVE_MINUTES)
  }

  useEffect(() => {
    execute()
  }, [])

  const unsubscribe = () => {
    clearInterval(interval)
  }

  return [messages, connecting, unsubscribe]
}
