const OPTIONS = [
  { value: 'updated', label: 'Last updated' },
  { value: 'stars', label: 'Stars' },
  { value: 'name', label: 'Name' },
];

function SortControls({ value, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-600">
      Sort by
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-900 outline-none focus:border-gray-500"
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default SortControls;
