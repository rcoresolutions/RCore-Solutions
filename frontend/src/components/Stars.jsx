import { Star } from 'lucide-react';

export function Stars({ value = 0, size = 16 }) {
  return (
    <span className="stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} className={n <= Math.round(value) ? 'on' : ''} />
      ))}
    </span>
  );
}

export function StarInput({ value, onChange }) {
  return (
    <span className="stars input" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button type="button" key={n} onClick={() => onChange(n)} aria-label={`${n} star${n > 1 ? 's' : ''}`} aria-checked={n === value} role="radio">
          <Star size={26} className={n <= value ? 'on' : ''} />
        </button>
      ))}
    </span>
  );
}
