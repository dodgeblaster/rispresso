export function StoreCard(props: any) {
  return (
    <button
      className="mb-2 flex w-full overflow-hidden rounded shadow"
      onClick={props.onClick}
      style={{
        background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),
        
           url(https://images.unsplash.com/photo-1632479145590-bfb41ecfedc7?ixlib=rb-1.2.1&dpr=2&auto=format&fit=crop&w=480&h=80&q=60)`,
        backgroundSize: 'cover',
      }}
    >
      <div className="px-2 py-4">
        <p className="font-bold text-white">{props.name}</p>
        <p className="text-white opacity-60">Other text</p>
      </div>
    </button>
  )
}
