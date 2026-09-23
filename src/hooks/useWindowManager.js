import { useState, useCallback } from 'react';
import { useSound } from './useSound';
import { useLocalStorage } from './useLocalStorage'; // <-- ADDED

export function useWindowManager() {
  const [windows, setWindows] = useLocalStorage('vishal_os_windows', []);
  const [activeWindowId, setActiveWindowId] = useLocalStorage('vishal_os_active_window', null);
  const [highestZIndex, setHighestZIndex] = useLocalStorage('vishal_os_zindex', 70);
  const { playSound } = useSound();

  const openWindow = useCallback((app) => {
    setWindows((prev) => {
      const exists = prev.find((w) => w.id === app.id);
      if (exists) {
        playSound('window-open');
        setActiveWindowId(app.id);
        setHighestZIndex((z) => z + 1);
        return prev.map((w) =>
          w.id === app.id
            ? { ...w, isMinimized: false, zIndex: highestZIndex + 1 }
            : w
        );
      }

      playSound('window-open');
      setHighestZIndex((z) => z + 1);
      setActiveWindowId(app.id);

      // Cascading default position to prevent overlapping
      const offset = (prev.length * 20) % 200;

      return [
        ...prev,
        {
          ...app,
          isMinimized: false,
          isMaximized: false,
          zIndex: highestZIndex + 1,
          position: { x: 50 + offset, y: 50 + offset },
          size: { width: 800, height: 600 }
        }
      ];
    });
  }, [highestZIndex, playSound]);

  const closeWindow = useCallback((id) => {
    playSound('window-close');
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setActiveWindowId((prevActive) => (prevActive === id ? null : prevActive));
  }, [playSound]);

  const focusWindow = useCallback((id) => {
    setHighestZIndex((z) => z + 1);
    setActiveWindowId(id);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: highestZIndex + 1 } : w))
    );
  }, [highestZIndex]);

  const minimizeWindow = useCallback((id) => {
    playSound('window-minimize');
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    setActiveWindowId((prevActive) => (prevActive === id ? null : prevActive));
  }, [playSound]);

  const toggleMaximize = useCallback((id) => {
    playSound('window-maximize');
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      )
    );
    focusWindow(id);
  }, [focusWindow, playSound]);

  const updateWindowPosition = useCallback((id, position) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, position } : w))
    );
  }, []);

  return {
    windows,
    activeWindowId,
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    toggleMaximize,
    updateWindowPosition
  };
}