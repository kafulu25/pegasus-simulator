// src/hooks/useFullScreen.ts
import { useEffect, useRef, useCallback } from 'react';

export const useFullScreen = (autoEnter: boolean = true) => {
  const isFullScreen = useRef(false);

  const enterFullScreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
        isFullScreen.current = true;
      } catch (err) {
        console.warn('Full-screen request denied:', err);
      }
    }
  }, []);

  const exitFullScreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      isFullScreen.current = false;
    }
  }, []);

  // Re‑enter if the user exits (e.g., via browser UI)
  const handleFullScreenChange = useCallback(() => {
    if (!document.fullscreenElement && isFullScreen.current) {
      // If we still want full‑screen, re‑enter after a short delay
      setTimeout(enterFullScreen, 100);
    }
    isFullScreen.current = !!document.fullscreenElement;
  }, [enterFullScreen]);

  // Block keyboard shortcuts that exit full‑screen
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Block Escape and F11 (they exit full‑screen)
    if (e.key === 'Escape' || e.key === 'F11') {
      e.preventDefault();
      // Re‑enter if we're not already in full‑screen
      if (!document.fullscreenElement) {
        enterFullScreen();
      }
    }
  }, [enterFullScreen]);

  // Block right‑click context menu
  const handleContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault();
  }, []);

  // Block certain touch gestures that might exit (optional)
  const handleTouchMove = useCallback((e: TouchEvent) => {
    // If we want to prevent pull‑to‑refresh, etc.
    // Not necessary but can help.
  }, []);

  useEffect(() => {
    if (autoEnter) {
      // Enter full‑screen after a small delay to ensure DOM is ready
      const timer = setTimeout(enterFullScreen, 500);
      return () => clearTimeout(timer);
    }
  }, [autoEnter, enterFullScreen]);

  useEffect(() => {
    // Listen for full‑screen changes
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('MSFullscreenChange', handleFullScreenChange);

    // Block keyboard shortcuts
    document.addEventListener('keydown', handleKeyDown);

    // Block context menu
    document.addEventListener('contextmenu', handleContextMenu);

    // Optional: block touch gestures
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleFullScreenChange, handleKeyDown, handleContextMenu, handleTouchMove]);

  return { enterFullScreen, exitFullScreen, isFullScreen: !!document.fullscreenElement };
};
