interface StatWidgetProps {
  title: string;
  value: number | string;
  icon: string;
  trend?: { value: number; isPositive: boolean };
}

export function StatWidget({ title, value, icon, trend }: StatWidgetProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="text-5xl">{icon}</div>
      </div>
    </div>
  );
}
