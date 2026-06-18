// Lightweight skeleton shown while a search is in flight.
function Loading() {
  return (
    <div className="grid gap-3" aria-busy="true" aria-label="Loading">
      <div className="h-32 animate-pulse rounded-lg bg-gray-200" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-200" />
      ))}
    </div>
  );
}

export default Loading;
