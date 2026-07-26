const SkeletonCard = () => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white animate-pulse">
      <div className="h-40 bg-gray-200 sm:h-56" />

      <div className="flex flex-col gap-3 p-3 sm:p-4">
        <div className="h-4 w-3/4 rounded bg-gray-200 sm:h-5" />
        <div className="h-3 w-full rounded bg-gray-200 sm:h-4" />
        <div className="h-3 w-5/6 rounded bg-gray-200 sm:h-4" />

        <div className="mt-1 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-3 w-3 rounded-full bg-gray-200 sm:h-3.5 sm:w-3.5" />
          ))}
        </div>

        <div className="mt-1 flex items-center justify-between">
          <div className="h-5 w-20 rounded bg-gray-200 sm:h-6 sm:w-24" />
          <div className="h-3 w-10 rounded bg-gray-200 sm:h-4 sm:w-12" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
