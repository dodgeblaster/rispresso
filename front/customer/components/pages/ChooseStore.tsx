import { NavBar } from '../base/NavBar'
import { StoreCard } from '../base/StoreCard'
import { useRiseGet } from '../../hooks/useRiseGet'
import { PageState } from '../interfaces'

export function ChooseStore(props: any) {
  const [stores, loading] = useRiseGet({
    action: 'listStores',
    input: {},
  })

  return (
    <div className="relative">
      <NavBar page="Choose Store" back={() => props.setPage(PageState.HOME)} />
      <div className="px-10 py-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {stores.map((x: any) => {
              return (
                <StoreCard
                  name={x.name}
                  location={x.location}
                  onClick={() => {
                    props.setStore(x.sk.split('_')[1])
                    props.setPage(PageState.MAKE_ORDER)
                  }}
                />
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}
