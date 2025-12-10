import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface RevenueChartProps {
  dailyData: { [key: number]: number };
  year: number;
  month: number;
  darkMode: boolean;
}

export function RevenueChart({ dailyData, year, month, darkMode }: RevenueChartProps) {
  // 将每日数据转换为图表数据格式
  const chartData = Object.entries(dailyData).map(([day, revenue]) => ({
    day: parseInt(day),
    revenue: revenue,
    date: `${month + 1}月${day}日`
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3">
          <p className="text-slate-600 dark:text-slate-400 text-sm">{payload[0].payload.date}</p>
          <p className="text-slate-900 dark:text-white">
            ¥{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[300px] md:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={darkMode ? '#334155' : '#e2e8f0'}
            vertical={false}
          />
          <XAxis
            dataKey="day"
            stroke={darkMode ? '#94a3b8' : '#64748b'}
            tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }}
            axisLine={{ stroke: darkMode ? '#334155' : '#e2e8f0' }}
            label={{ value: '日期', position: 'insideBottom', offset: -5, fill: darkMode ? '#94a3b8' : '#64748b' }}
          />
          <YAxis
            stroke={darkMode ? '#94a3b8' : '#64748b'}
            tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }}
            axisLine={{ stroke: darkMode ? '#334155' : '#e2e8f0' }}
            tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="url(#colorRevenue)"
            activeDot={{
              r: 6,
              fill: '#3b82f6',
              stroke: '#fff',
              strokeWidth: 2
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
