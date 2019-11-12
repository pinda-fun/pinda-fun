import { useLayoutEffect, useState } from 'react';

/**
 * Hook that listens to window resize event, from:
 * https://stackoverflow.com/questions/19014250/rerender-view-on-browser-resize-with-react
 */
const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};

export default useWindowSize;
