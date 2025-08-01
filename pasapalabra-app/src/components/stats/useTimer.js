// src/hooks/useTimer.js
import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(initialTime, isActive, onExpire) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const intervalRef = useRef(null);

  // Arranca o detiene según isActive
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            onExpire?.();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, onExpire]);

  // Reset manual
  const reset = useCallback((newTime = initialTime) => {
    clearInterval(intervalRef.current);
    setTimeLeft(newTime);
  }, [initialTime]);

  return { timeLeft, reset };
}
