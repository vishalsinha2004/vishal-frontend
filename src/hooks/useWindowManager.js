import { useCallback } from 'react';
import { useSound } from './useSound';
import { useLocalStorage } from './useLocalStorage';

export function useWindowManager() {
  const [windows, setWindows] = useLocalStorage('vishal_os_windows', []);
  const [activeWindowId, setActiveWindowId] = useLocalStorage('vishal_os_active_window', null);
  const [highestZIndex, setHighestZIndex] = useLocalStorage('vishal_os_zindex', 70);
  const { playSound } = useSound();

  const openWindow = useCallback((app) => {
    setHighestZIndex((currentZ) => {
      const newZ = currentZ + 1;
      setWindows((prev) => {
        const exists = prev.find((w) => w.id === app.id);
        if (exists) {
          playSound('window-open');
          setActiveWindowId(app.id);
          // Ensure it restores and comes to front if minimized
          return prev.map((w) => w.id === app.id ? { ...w, isMinimized: false, zIndex: newZ } : w);
        }

        playSound('window-open');
        setActiveWindowId(app.id);
        // Safe cascading position logic
        const openCount = prev.length;
        const offset = (openCount * 25) % 200;
        return [
          ...prev,
          {
            ...app,
            isMinimized: false,
            isMaximized: false,
            zIndex: newZ,
            position: { x: 50 + offset, y: 50 + offset },
            size: { width: 800, height: 600 }
          }
        ];
      });
      return newZ;
    });
  }, [playSound, setHighestZIndex, setWindows, setActiveWindowId]);

  const closeWindow = useCallback((id) => {
    playSound('window-close');
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setActiveWindowId((prevActive) => (prevActive === id ? null : prevActive));
  }, [playSound, setWindows, setActiveWindowId]);

  const focusWindow = useCallback((id) => {
    setHighestZIndex((currentZ) => {
      const newZ = currentZ + 1;
      setActiveWindowId(id);
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, zIndex: newZ, isMinimized: false } : w))
      );
      return newZ;
    });
  }, [setHighestZIndex, setActiveWindowId, setWindows]);

  const minimizeWindow = useCallback((id) => {
    playSound('window-minimize');
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    setActiveWindowId((prevActive) => (prevActive === id ? null : prevActive));
  }, [playSound, setWindows, setActiveWindowId]);

  const toggleMaximize = useCallback((id) => {
    playSound('window-maximize');
    setHighestZIndex((currentZ) => {
      const newZ = currentZ + 1;
      setActiveWindowId(id);
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id ? { ...w, isMaximized: !w.isMaximized, zIndex: newZ, isMinimized: false } : w
        )
      );
      return newZ;
    });
  }, [playSound, setHighestZIndex, setActiveWindowId, setWindows]);

  const updateWindowPosition = useCallback((id, position) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, position } : w))
    );
  }, [setWindows]);

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