import { useState } from 'react';
import { ChevronLeft, ChevronRight, BarChart3, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface DayData {
  date: number;
  profit: number;
}

// 生成模拟数据
const generateMockData = (year: number, month: number): DayData[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const data: DayData[] = [];
  
  for (let i = 1; i <= daysInMonth; i++) {
    // 生成随机收益数据，有正有负
    const profit = Math.random() > 0.1 
      ? parseFloat((Math.random() * 150 - 10).toFixed(2))
      : 0;
    data.push({ date: i, profit });
  }
  
  return data;
};

export function DailyProfitCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10)); // 2025-11
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const [monthData] = useState<DayData[]>(generateMockData(year, month));
  
  // 获取月份第一天是星期几（0-6，0是周日）
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // 准备图表数据（累计收益）
  const chartData = monthData.map((day, index) => {
    const cumulativeProfit = monthData
      .slice(0, index + 1)
      .reduce((sum, d) => sum + d.profit, 0);
    return {
      date: day.date,
      profit: parseFloat(day.profit.toFixed(2)),
      cumulative: parseFloat(cumulativeProfit.toFixed(2))
    };
  });
  
  // 计算总收益
  const totalProfit = monthData.reduce((sum, d) => sum + d.profit, 0);
  
  // 切换月份
  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };
  
  // 获取某一天的收益数据
  const getDayProfit = (day: number): number => {
    const dayData = monthData.find(d => d.date === day);
    return dayData?.profit || 0;
  };
  
  // 格式化收益显示
  const formatProfit = (profit: number): string => {
    if (profit === 0) return '0.00';
    return profit > 0 ? `+${profit.toFixed(2)}` : profit.toFixed(2);
  };
  
  // 获取收益的颜色类
  const getProfitColor = (profit: number): string => {
    if (profit > 0) return 'text-[#4ade80]';
    if (profit < 0) return 'text-[#ef4444]';
    return 'text-gray-500';
  };
  
  // 获取单元格背景色
  const getCellBackground = (profit: number): string => {
    if (profit > 0) return 'bg-[#1e3a32]';
    if (profit < 0) return 'bg-[#3a1e28]';
    return 'bg-[#252836]';
  };
  
  // 渲染日历格子
  const renderCalendarDays = () => {
    const cells = [];
    
    // 添加空白单元格（月初之前的）
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<div key={`empty-${i}`} className="aspect-square" />);
    }
    
    // 添加日期单元格
    for (let day = 1; day <= daysInMonth; day++) {
      const profit = getDayProfit(day);
      cells.push(
        <div
          key={day}
          className={`aspect-square rounded-xl ${getCellBackground(profit)} flex flex-col items-center justify-center p-2 transition-all`}
        >
          <div className="text-white text-lg mb-1">{day}</div>
          <div className={`text-xs ${getProfitColor(profit)}`}>
            {formatProfit(profit)}
          </div>
        </div>
      );
    }
    
    return cells;
  };
  
  // 自定义Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#252836] border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-400 text-sm mb-1">日期: {payload[0].payload.date}号</p>
          <p className={`text-sm ${payload[0].value >= 0 ? 'text-[#4ade80]' : 'text-[#ef4444]'}`}>
            单日: {payload[0].value >= 0 ? '+' : ''}{payload[0].value}
          </p>
          <p className={`text-sm ${payload[0].payload.cumulative >= 0 ? 'text-[#4ade80]' : 'text-[#ef4444]'}`}>
            累计: {payload[0].payload.cumulative >= 0 ? '+' : ''}{payload[0].payload.cumulative}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#1a1d29] text-white p-4">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl">单日盈亏</h1>
        <div className="flex gap-3">
          <button className="w-10 h-10 rounded-lg bg-[#252836] flex items-center justify-center hover:bg-[#2d3142] transition-colors">
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-10 h-10 rounded-lg bg-[#252836] flex items-center justify-center hover:bg-[#2d3142] transition-colors">
            <Calendar className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
      
      {/* 月份选择器 */}
      <div className="flex items-center justify-center mb-6 gap-4">
        <button
          onClick={() => changeMonth(-1)}
          className="w-8 h-8 rounded-lg hover:bg-[#252836] flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div className="text-lg text-gray-300">
          {year}-{String(month + 1).padStart(2, '0')}
        </div>
        <button
          onClick={() => changeMonth(1)}
          className="w-8 h-8 rounded-lg hover:bg-[#252836] flex items-center justify-center transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      
      {/* 收益曲线图 */}
      <div className="bg-[#252836] rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-gray-400 text-sm mb-1">本月累计收益</div>
            <div className={`text-2xl ${totalProfit >= 0 ? 'text-[#4ade80]' : 'text-[#ef4444]'}`}>
              {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)}
            </div>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickLine={{ stroke: '#374151' }}
            />
            <YAxis 
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickLine={{ stroke: '#374151' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="#4ade80"
              strokeWidth={2}
              fill="url(#colorProfit)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {weekDays.map((day, index) => (
          <div key={index} className="text-center text-gray-500 text-sm py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* 日历格子 */}
      <div className="grid grid-cols-7 gap-2">
        {renderCalendarDays()}
      </div>
    </div>
  );
}