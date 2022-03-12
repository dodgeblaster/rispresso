import { useRiseGet } from '../hooks/useRiseGet'

function Home(props: any) {
  const [products, loading, error] = useRiseGet({
    action: 'listProducts',
    input: {
      storeId: props.storeId,
    },
  })

  if (loading) {
    return (
      <div
        className="flex h-screen w-screen items-center justify-center"
        style={{ background: 'rgba(1, 136, 97, 0.05' }}
      >
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="flex h-screen w-screen items-center justify-center"
        style={{ background: 'rgba(1, 136, 97, 0.05' }}
      >
        <p>Error: {error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div
        className="flex h-screen w-screen items-center justify-center"
        style={{ background: 'rgba(1, 136, 97, 0.05' }}
      >
        <p>There does not appear to be a menu for that store</p>
      </div>
    )
  }

  const Card = (props: any) => {
    return (
      <div
        className="max-w-96 relative mx-6 h-96 w-64 flex-1  rounded-lg"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 124, 89, 0), rgb(0, 124, 89) 60%), url("http://tv.starbucksclone.garysjennings-dev.com/static/selected-background.svg")`,
        }}
      >
        <div
          style={{
            backgroundImage: `url(${props.img})`,
            backgroundSize: 'cover',
            backgroundPositionX: 'center',
            backgroundPositionY: 'center',
          }}
          className="absolute -top-24 left-8 h-48 w-48 rounded-full"
        />
        <p className="font-xl mt-24 font-bold text-white">{props.name}</p>
      </div>
    )
  }

  return (
    <div
      className="flex h-screen w-screen items-center justify-center"
      style={{ background: 'rgba(1, 136, 97, 0.05' }}
    >
      <div className="flex flex-col bg-white">
        <div className="flex justify-center">
          {products.map((x: any) => (
            <Card name={x.name} img={x.img}></Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
