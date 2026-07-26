const SkeletonReview = () => {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 animate-pulse">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="h-4 w-24 rounded bg-gray-200" />
        <div className="h-4 w-20 rounded bg-gray-200" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-gray-200 sm:h-4" />
        <div className="h-3 w-4/5 rounded bg-gray-200 sm:h-4" />
      </div>
    </div>
  );
};

export default SkeletonReview;
