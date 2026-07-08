'use client';

import { useEffect, useState } from 'react';

export const useDebouncedValue = <TValue>(
  value: TValue,
  delay = 400,
): TValue => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
};
