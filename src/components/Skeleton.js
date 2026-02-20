/**
 * Loading skeleton variants: card (h-64), listItem (h-28), grid(count).
 * @param {Object} props
 * @param {'card'|'listItem'|'grid'} [props.variant='card'] - Skeleton variant
 * @param {number} [props.count=1] - Number of items (for grid)
 * @returns {string} HTML string
 */
export function render(props) {
  const { variant = 'card', count = 1 } = props || {};
  const n = Math.max(1, Math.min(count, 12));

  const card = () => '<div class="skeleton h-64 rounded-2xl"></div>';
  const listItem = () => '<div class="skeleton h-28 rounded-2xl"></div>';

  if (variant === 'listItem') {
    return Array.from({ length: n }, listItem).join('');
  }
  if (variant === 'grid') {
    return Array.from({ length: n }, card).join('');
  }
  return card();
}
