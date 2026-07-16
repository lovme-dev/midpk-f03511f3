// Comprehensive security and interaction prevention
export const initializeInteractionPrevention = () => {
  // Prevent context menu globally
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // Prevent developer tools shortcuts: F12, Ctrl+Shift+I, Ctrl+U, Ctrl+Shift+C, Ctrl+Shift+J
  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && e.key === 'I') ||
      (e.ctrlKey && e.shiftKey && e.key === 'i') ||
      (e.ctrlKey && e.key === 'u') ||
      (e.ctrlKey && e.key === 'U') ||
      (e.ctrlKey && e.shiftKey && e.key === 'C') ||
      (e.ctrlKey && e.shiftKey && e.key === 'c') ||
      (e.ctrlKey && e.shiftKey && e.key === 'J') ||
      (e.ctrlKey && e.shiftKey && e.key === 'j') ||
      (e.ctrlKey && e.key === 's') ||
      (e.ctrlKey && e.key === 'S')
    ) {
      e.preventDefault();
      return false;
    }
  });

  // Prevent image drag and save
  document.addEventListener('dragstart', (e) => {
    if (e.target instanceof HTMLImageElement) {
      e.preventDefault();
      return false;
    }
  });

  // Prevent text selection on the entire document (optional - may affect UX)
  document.addEventListener('selectstart', (e) => {
    const target = e.target as HTMLElement;
    // Allow selection in input fields and textareas
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return true;
    }
    e.preventDefault();
    return false;
  });

  // Prevent copy
  document.addEventListener('copy', (e) => {
    const target = e.target as HTMLElement;
    // Allow copy in input fields and textareas
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return true;
    }
    e.preventDefault();
    return false;
  });

  // Prevent cut
  document.addEventListener('cut', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return true;
    }
    e.preventDefault();
    return false;
  });

  // Disable right-click on images specifically
  document.addEventListener('mousedown', (e) => {
    if (e.button === 2 && e.target instanceof HTMLImageElement) {
      e.preventDefault();
      return false;
    }
  });

  // Prevent zoom gestures on touch devices
  document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
  });

  document.addEventListener('gesturechange', (e) => {
    e.preventDefault();
  });

  document.addEventListener('gestureend', (e) => {
    e.preventDefault();
  });

  // Detect DevTools opening (basic detection)
  const devToolsDetector = () => {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    
    if (widthThreshold || heightThreshold) {
      // DevTools might be open - you can add custom behavior here
      // For now, just log (will be removed in production)
    }
  };

  // Run detector periodically
  setInterval(devToolsDetector, 1000);

  // Disable console methods in production to prevent information leakage
  if (import.meta.env.PROD) {
    const noop = () => {};
    console.log = noop;
    console.debug = noop;
    console.info = noop;
    console.warn = noop;
  }

  // Add CSS to prevent selection and pointer events on images
  const style = document.createElement('style');
  style.textContent = `
    img {
      -webkit-user-drag: none;
      -khtml-user-drag: none;
      -moz-user-drag: none;
      -o-user-drag: none;
      user-drag: none;
      pointer-events: auto;
    }
    
    body {
      -webkit-touch-callout: none;
    }
    
    ::selection {
      background: transparent;
    }
    
    ::-moz-selection {
      background: transparent;
    }
  `;
  document.head.appendChild(style);
};