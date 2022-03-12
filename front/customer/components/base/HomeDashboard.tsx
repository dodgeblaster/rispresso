export function HomeDashboard(props: any) {
  return (
    <div className="mt-6 py-4">
      <div className="flex">
        <div className="mr-2 flex flex-1 flex-col items-center rounded bg-gray-100 py-8">
          <p className="text-6xl">12</p>
          <p>Orders</p>
        </div>
        <div className="flex flex-1 flex-col items-center rounded bg-gray-100 py-8">
          <p className="text-6xl">208</p>
          <p>Points</p>
        </div>
      </div>
      {/* Points Level */}
      <div className="py-10">
        <div className="relative h-3 overflow-hidden rounded bg-gray-300">
          <div
            className="absolute top-0 left-0 h-3 bg-gradient-to-r from-green-700 to-green-500"
            style={{
              width: '40%',
            }}
          ></div>
        </div>
        <div className="flex">
          <p className="mr-auto">Coffee Level 12</p>
          <p>Next Level: 302</p>
        </div>
      </div>
    </div>
  )
}
