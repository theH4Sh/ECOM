const SkeletonOrderCard = () => {
  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 animate-pulse">
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-20 rounded-full bg-gray-200" />
          <div className="h-4 w-24 rounded bg-gray-200" />
        </div>
        <div className="h-3 w-40 rounded bg-gray-200" />
      </div>

      <div className="space-y-4 px-4 pb-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-14 w-14 shrink-0 rounded-xl bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-20 rounded bg-gray-200" />
            </div>
            <div className="h-4 w-16 rounded bg-gray-200" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-b-2xl bg-gray-50 px-4 py-4">
        <div className="h-4 w-12 rounded bg-gray-200" />
        <div className="h-6 w-24 rounded bg-gray-200" />
      </div>
    </div>
  );
};

export default SkeletonOrderCard;
