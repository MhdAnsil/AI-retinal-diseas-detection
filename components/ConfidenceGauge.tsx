import React from 'react';

interface ConfidenceGaugeProps {
  value: number;
}

const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({ value }) => {
  const size = 100;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
            className="text-brand-border"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
        />
        <circle
            className="text-brand-yellow"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
        <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".3em"
            className="text-xl font-bold fill-current text-brand-text-heading"
        >
            {value.toFixed(1)}%
        </text>
        </svg>
        <p className="text-sm font-semibold text-brand-text-light mt-2">Confidence</p>
    </div>
  );
};

export default ConfidenceGauge;
