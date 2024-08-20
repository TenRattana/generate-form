import { useWindowDimensions } from 'react-native';
import { useState, useEffect } from 'react';

export function useResponsive() {
  const { width } = useWindowDimensions();
  const [responsive, setResponsive] = useState('small');

  useEffect(() => {
    if (width > 1000) {
      setResponsive('large');
    } else if (width > 550) {
      setResponsive('medium');
    } else {
      setResponsive('small');
    }
  }, [width]);

  return responsive;
}
