import Home from '../components/Home'
import { useRouter } from 'next/router'

const App = () => {
  const router = useRouter()
  const { id } = router.query
  return <Home storeId={id} />
}

export default App
