import { useState, useEffect } from 'react'
import login from '../utils/loginWrapper'
import { Board } from '../components/pages/Board'
import { StoreList } from '../components/pages/StoreList'

function Home() {
  const [store, setStore] = useState('')
  const [page, setPage] = useState('LIST')

  if (page === 'LIST') {
    return (
      <StoreList
        storeOnClick={(id: string) => {
          setStore(id)
          setPage('BOARD')
        }}
      />
    )
  }

  return <Board storeId={store} back={() => setPage('LIST')} />
}

export default login(Home)
