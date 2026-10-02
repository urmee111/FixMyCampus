// Returns `value` only after it has stopped changing for `delay` ms.
// Used for the search box and the duplicate check (plan: debounced 400 ms) so we don't call
// the API on every keystroke.
//
//   const debouncedTitle = useDebounce(title, 400);
//   useEffect(() => { /* call the API with debouncedTitle */ }, [debouncedTitle]);

import { useEffect, useState } from 'react';

export default function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // restart the wait if value changes again
  }, [value, delay]);

  return debounced;
}
