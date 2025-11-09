import React from 'react';

interface BarChartProps {
  data: Array<{
    label: string;
    value: number;
  }>;
  maxValue?: number;
}

const BarChart: React.FC<BarChartProps> = ({ data, maxValue: propMaxValue }) => {
  const maxValue = propMaxValue || Math.max(...data.map(item => item.value), 100);

  return (
    <div className="w-full h-full flex items-end justify-around gap-2 px-2">
      {data.map((item, index) => {
        const barHeight = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
        return (
          <div key={index} className="flex-1 flex flex-col items-center h-full">
            <div className="w-full flex-grow flex items-end">
                <div 
                    className="w-full bg-brand-primary/20 dark:bg-dark-elev1 rounded-t-lg transition-all duration-500"
                    style={{ height: `${barHeight}%` }}
                >
                    <div 
                        className="bg-brand-primary dark:bg-dark-text-primary h-full w-full rounded-t-lg"
                        style={{ transformOrigin: 'bottom', transform: `scaleY(1)` }} // Simplified animation
                    />
                </div>
            </div>
            <span className="text-xs font-semibold text-brand-text-secondary dark:text-dark-text-secondary mt-2">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default BarChart;