import { useState } from 'react'
import { NavBar } from './base/NavBar'
import { useRiseGet } from '../hooks/useRiseGet'
import { useRisePost } from '../hooks/useRisePost'
import login from '../utils/loginWrapper'
import { Popup } from '../components/base/Popup'
import { List } from '../components/base/List'

function StoreListPage(props: { setStore: any }) {
  const [createStorePopupActive, setCreateStorePopupActive] = useState(false)

  const [stores, loading] = useRiseGet({
    action: 'listStores',
  })
  const [apiCreateStore] = useRisePost({
    action: 'createStore',
    invalidate: [
      {
        action: 'listStores',
      },
    ],
  })

  const [apiRemoveStore] = useRisePost({
    action: 'removeStore',
    invalidate: [
      {
        action: 'listStores',
      },
    ],
  })

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <NavBar page="Manager Stores" />

        <div className="container mx-auto max-w-5xl px-10 py-4">Loading...</div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <NavBar page="Manager Stores" />

      <div className="container mx-auto max-w-5xl px-10 py-4">
        <p className="mt-8 mb-2 text-xl font-bold">Stores</p>
        <List
          items={stores}
          itemRemove={async (id: string) => {
            await apiRemoveStore({
              id,
            })
          }}
          itemClick={(id: string) => {
            props.setStore(id)
          }}
          add={() => {
            setCreateStorePopupActive(true)
          }}
        />

        {createStorePopupActive && (
          <Popup
            title="Create Store"
            definition={{
              name: {
                label: 'Store Name',
              },
              location: {
                label: 'Location',
              },
              orderCapacity: {
                label: 'Order Capacity',
              },
            }}
            submit={async (form: any) => {
              await apiCreateStore({
                name: form.name,
                location: form.location,
                orderCapacity: parseInt(form.orderCapacity),
              })
              setCreateStorePopupActive(false)
            }}
            cancel={() => {
              setCreateStorePopupActive(false)
            }}
          />
        )}
      </div>
    </div>
  )
}

function StoreDetails(props: { setPage: any; storeId: string }) {
  const [createProductPopupActive, setCreateProductPopupActive] =
    useState(false)
  const [createBaristaPopupActive, setCreateBaristaPopupActive] =
    useState(false)
  const [store, loading] = useRiseGet({
    action: 'getStore',
    input: {
      id: props.storeId,
    },
  })

  const [products, productsLoading] = useRiseGet({
    action: 'listProducts',
    input: {
      storeId: props.storeId,
    },
  })

  const [baristas, baristasLoading] = useRiseGet({
    action: 'listBaristas',
    input: {
      storeId: props.storeId,
    },
  })
  const [apiCreateProduct] = useRisePost({
    action: 'createProduct',
    invalidate: [
      {
        action: 'listProducts',
        input: {
          storeId: props.storeId,
        },
      },
    ],
  })
  const [apiRemoveProduct] = useRisePost({
    action: 'removeProduct',
    invalidate: [
      {
        action: 'listProducts',
        input: {
          storeId: props.storeId,
        },
      },
    ],
  })
  const [apiCreateBarista] = useRisePost({
    action: 'createBarista',
    invalidate: [
      {
        action: 'listBaristas',
        input: {
          storeId: props.storeId,
        },
      },
    ],
  })
  const [apiRemoveBarista] = useRisePost({
    action: 'removeBarista',
    invalidate: [
      {
        action: 'listBarista',
        input: {
          storeId: props.storeId,
        },
      },
    ],
  })

  //removeProduct
  if (loading || productsLoading || baristasLoading) {
    return (
      <div className="relative min-h-screen">
        <NavBar page="Store Details" />

        <div className="container mx-auto max-w-5xl px-10 py-4">Loading...</div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <NavBar
        page={`Store: ${store.name}`}
        back={() => props.setPage('STORE_LIST')}
      />
      <div className="container mx-auto max-w-5xl px-10 py-4">
        <p className="mt-8 mb-2 text-xl font-bold">Products</p>
        <List
          items={products}
          itemRemove={async (id: string) => {
            await apiRemoveProduct({
              storeId: props.storeId,
              id,
            })
          }}
          itemClick={() => {}}
          add={() => {
            setCreateProductPopupActive(true)
          }}
        />
        {createProductPopupActive && (
          <Popup
            title="Create Product"
            definition={{
              name: {
                label: 'Product Name',
              },
              amount: {
                label: 'Price',
              },
              img: {
                label: 'Image Url',
              },
            }}
            submit={async (form: any) => {
              await apiCreateProduct({
                storeId: props.storeId,
                name: form.name,
                amount: parseInt(form.amount),
                img: form.img,
              })
              setCreateProductPopupActive(false)
            }}
            cancel={() => {
              setCreateProductPopupActive(false)
            }}
          />
        )}
        <p className="mt-8 mb-2 text-xl font-bold">Baristas</p>
        <List
          items={baristas}
          itemRemove={async (id: string) => {
            await apiRemoveBarista({
              storeId: props.storeId,
              id,
              email: baristas.find((x: { id: string }) => x.id === id).email,
            })
          }}
          itemClick={() => {}}
          add={() => {
            setCreateBaristaPopupActive(true)
          }}
        />
        {createBaristaPopupActive && (
          <Popup
            title="Add Barista"
            definition={{
              name: {
                label: 'Name',
              },
              email: {
                label: 'Email',
              },
            }}
            submit={async (form: any) => {
              await apiCreateBarista({
                storeId: props.storeId,
                name: form.name,
                email: form.email,
              })
              setCreateBaristaPopupActive(false)
            }}
            cancel={() => {
              setCreateBaristaPopupActive(false)
            }}
          />
        )}
      </div>
    </div>
  )
}

function HomePage(props: any) {
  const [page, setPage] = useState('STORE_LIST')
  const [selected, setSelected] = useState('')

  const setStore = (id: string) => {
    setSelected(id)
    setPage('STORE_DETAILS')
  }
  if (page === 'STORE_DETAILS') {
    return <StoreDetails setPage={setPage} storeId={selected} />
  }
  return <StoreListPage setStore={setStore} />
}

export default login(HomePage)
