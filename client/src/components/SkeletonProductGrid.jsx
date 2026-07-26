import SkeletonCard from "./SkeletonCard";

const GRID_CLASS =
  "grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export default function SkeletonProductGrid({
  count = 8,
  className = GRID_CLASS,
}) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export { GRID_CLASS };
