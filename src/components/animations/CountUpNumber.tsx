import { motion, useSpring, useTransform } from 'motion/react';
import { useEffect } from 'react';

interface CountUpNumberProps {
  value: number;
  duration?: number;
  className?: string;
}

export function CountUpNumber({ value, duration = 2, className = '' }: CountUpNumberProps) {
  const spring = useSpring(0, { 
    duration: duration * 1000,
    bounce: 0 
  });
  
  const display = useTransform(spring, (current) =>
    Math.round(current)
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span className={className}>
      {display}
    </motion.span>
  );
}
