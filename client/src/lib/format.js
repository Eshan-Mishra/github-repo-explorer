// Small display helpers shared across components.

export function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatCount(value) {
  return new Intl.NumberFormat().format(value ?? 0);
}
