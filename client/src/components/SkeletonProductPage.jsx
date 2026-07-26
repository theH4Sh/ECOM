const SkeletonProductPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10 animate-pulse">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <div className="flex-1 h-[280px] sm:h-[400px] lg:h-[450px] rounded-2xl bg-gray-200" />

        <div className="flex-1 space-y-4">
          <div className="h-8 w-3/4 rounded-lg bg-gray-200 sm:h-10" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-2/3 rounded bg-gray-200" />
          </div>
          <div className="h-9 w-28 rounded-full bg-gray-200" />
          <div className="h-10 w-32 rounded-lg bg-gray-200" />
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="h-12 flex-1 rounded-lg bg-gray-200" />
            <div className="h-12 flex-1 rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProductPage;
