import { NavBar } from '../base/NavBar'
import { StoreCard } from '../base/StoreCard'
import { useRiseGet } from '../../hooks/useRiseGet'

export function StoreList(props: any) {
  const [stores, loading] = useRiseGet({
    action: 'listStores',
    input: {},
  })

  if (loading) {
    return (
      <div>
        <NavBar page="Store List" />
        <div className="absolute top-16 left-0 right-0 bottom-0 flex bg-gray-200 px-4">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <NavBar page="Store List" />
      <div className="container mx-auto max-w-5xl pt-10">
        {stores.map((s: any) => {
          return (
            <StoreCard
              onClick={() => props.storeOnClick(s.sk.split('_')[1])}
              name={s.name}
              location={s.location}
            />
          )
        })}
      </div>
    </div>
  )
}
