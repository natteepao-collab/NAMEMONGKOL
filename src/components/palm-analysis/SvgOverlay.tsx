'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PalmAnalysisResult } from '@/types/palm-analysis';

interface SvgOverlayProps {
  lines: PalmAnalysisResult['lines'];
  width: number;
  height: number;
}

function toSmoothPath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 1; index < points.length - 1; index++) {
    const current = points[index];
    const next = points[index + 1];
    const controlX = (current.x + next.x) / 2;
    const controlY = (current.y + next.y) / 2;
    path += ` Q ${current.x} ${current.y}, ${controlX} ${controlY}`;
  }

  const lastPoint = points[points.length - 1];
  path += ` T ${lastPoint.x} ${lastPoint.y}`;

  return path;
}

export default function SvgOverlay({ lines, width, height }: SvgOverlayProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !width || !height) return null;

  // Colors for different lines
  const lineColors = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      {lines.map((line, index) => {
        if (!line.points || line.points.length < 2) return null;

        // Convert percentage points to actual pixel coordinates
        const pixelPoints = line.points.map((point) => ({
          x: (point.x / 100) * width,
          y: (point.y / 100) * height,
        }));
        const pathData = toSmoothPath(pixelPoints);

        const color = lineColors[index % lineColors.length];
        const confidence = line.confidence ?? 1;

        return (
          <g key={line.id || index}>
            {/* Glow effect */}
            <motion.path
              d={pathData}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="blur-sm"
              opacity={Math.max(0.2, confidence * 0.35)}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: 'easeInOut', delay: index * 0.5 }}
            />
            {/* Main line */}
            <motion.path
              d={pathData}
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={Math.max(0.55, confidence)}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: 'easeInOut', delay: index * 0.5 }}
            />
            
            {/* Label at the start of the line */}
            {pixelPoints[0] && (
              <motion.text
                x={pixelPoints[0].x}
                y={pixelPoints[0].y - 10}
                fill={color}
                fontSize="12"
                fontWeight="bold"
                className="drop-shadow-md"
                opacity={Math.max(0.65, confidence)}
                initial={{ opacity: 0 }}
                animate={{ opacity: Math.max(0.65, confidence) }}
                transition={{ delay: 2 + index * 0.5 }}
              >
                {line.name}
              </motion.text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
