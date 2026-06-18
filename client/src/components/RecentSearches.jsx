function RecentSearches({ items, onSelect, onClear }) {
  if (items.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
      <span className="text-gray-500">Recent:</span>
      {items.map((name) => (
        <button
          key={name}
          type="button"
          onClick={() => onSelect(name)}
          className="rounded-full border border-gray-300 bg-white px-3 py-1 text-gray-700 hover:bg-gray-100"
        >
          {name}
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="text-gray-400 hover:text-gray-700"
      >
        Clear
      </button>
    </div>
  );
}

export default RecentSearches;
