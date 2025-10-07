"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface AnimatedLinesProps {
  lines: string[];
  className?: string;
  delay?: number;
  duration?: number;
  as?: keyof React.JSX.IntrinsicElements;
  lineStagger?: number;
}

const AnimatedLines: React.FC<AnimatedLinesProps> = ({
  lines,
  className = '',
  delay = 0,
  duration = 0.6,
  as: Component = 'div',
  lineStagger = 0.15,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px 0px -100px 0px"
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: lineStagger,
        delayChildren: delay,
      },
    },
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
      {...(Component !== 'div' && { as: Component })}
    >
      {lines.map((line, index) => (
        <motion.div
          key={index}
          variants={lineVariants}
          className="overflow-hidden"
        >
          <div>{line}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AnimatedLines;