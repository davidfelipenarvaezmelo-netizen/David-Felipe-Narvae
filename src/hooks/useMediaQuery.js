import { useState, useEffect } from 'react';

/**
 * Hook para detectar si se cumple una media query.
 * Se usa para montar layouts totalmente distintos (móvil / escritorio)
 * en lugar de solo ocultar cosas con CSS.
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handleChange = (event) => setMatches(event.matches);

    setMatches(mql.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}
