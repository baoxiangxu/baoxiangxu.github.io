import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'backdropVisibility';

/**
 * How much of the animated sphere shows through behind the article.
 *   1 = the homepage background at full strength, nothing dimmed
 *   0 = background completely hidden behind a solid surface
 * The article paints a wash of (1 - visibility) over the fixed canvas.
 */
export const DEFAULT_VISIBILITY = 0.1;

const clamp = (n) => Math.min(1, Math.max(0, n));

export const BackdropVisibilityContext = createContext({
  visibility: DEFAULT_VISIBILITY,
  setVisibility: () => {},
  reset: () => {},
});

const readStored = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return DEFAULT_VISIBILITY;
    const n = Number(raw);
    return Number.isFinite(n) ? clamp(n) : DEFAULT_VISIBILITY;
  } catch (err) {
    // Private mode, blocked storage, or the prerender's jsdom — fall back.
    return DEFAULT_VISIBILITY;
  }
};

export const BackdropVisibilityProvider = ({ children }) => {
  const [visibility, setVisibilityState] = useState(readStored);

  const setVisibility = useCallback((value) => setVisibilityState(clamp(value)), []);
  const reset = useCallback(() => setVisibilityState(DEFAULT_VISIBILITY), []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(visibility));
    } catch (err) {
      /* not fatal — the setting just won't persist */
    }
  }, [visibility]);

  return (
    <BackdropVisibilityContext.Provider value={{ visibility, setVisibility, reset }}>
      {children}
    </BackdropVisibilityContext.Provider>
  );
};

export const useBackdropVisibility = () => useContext(BackdropVisibilityContext);
