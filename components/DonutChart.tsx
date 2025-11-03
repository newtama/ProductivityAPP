import React from 'react';

interface DonutChartProps {
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
}

const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  if (totalValue === 0) return null;

  let accumulatedPercentage = 0;

  const segments = data.map(item => {
    const percentage = (item.value / totalValue) * 100;
    const segment = {
      ...item,
      percentage,
      offset: accumulatedPercentage,
    };
    accumulatedPercentage += percentage;
    return segment;
  });

  return (
    <div className="w-full h-full flex items-center justify-center gap-8">
      <div className="relative w-36 h-36 flex-shrink-0">
        <svg className="w-full h-full" viewBox="0 0 36 36" transform="rotate(-90)">
          {segments.map((segment, index) => (
            <circle
              key={index}
              className={`${segment.color} transition-all duration-500`}
              cx="18"
              cy="18"
              r="15.9155"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={`${segment.percentage} ${100 - segment.percentage}`}
              strokeDashoffset={-segment.offset}
            />
          ))}
        </svg>
      </div>
      <div className="flex flex-col space-y-2">
        {segments.map((item, index) => (
          <div key={index} className="flex items-center">
            <span className={`w-3 h-3 rounded-full me-3 ${item.color.replace('text-', 'bg-')}`}></span>
            <span className="text-sm font-semibold text-brand-text-primary dark:text-dark-text-primary">
              {item.label}
            </span>
            <span className="ms-auto text-sm font-medium text-brand-text-secondary dark:text-dark-text-secondary">
              {item.percentage.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
