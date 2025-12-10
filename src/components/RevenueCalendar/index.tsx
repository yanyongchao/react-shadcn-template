import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RevenueCalendarProps {
  year: number;
  month: number;
  dailyData: { [key: number]: number };
  onMonthChange: (direction: 'prev' | 'next') => void;
  darkMode: boolean;
}

export function RevenueCalendar({
  year,
  month,
  dailyData,
  onMonthChange,
  darkMode
}: RevenueCalendarProps) {
  // 获取当前月份的天数
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // 获取当前月第一天是星期几 (0-6, 0是星期日)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  // 获取上个月的天数
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  
  // 计算需要显示的上个月的天数
  const prevMonthDays = firstDayOfMonth;
  
  // 计算需要显示的下个月的天数
  const totalCells = Math.ceil((prevMonthDays + daysInMonth) / 7) * 7;
  const nextMonthDays = totalCells - prevMonthDays - daysInMonth;
  
  const monthName = new Date(year, month).toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long' 
  });
  
  // 获取所有收益值用于计算颜色强度
  const revenueValues = Object.values(dailyData).filter(v => v > 0);
  const maxRevenue = Math.max(...revenueValues, 1);
  const minRevenue = Math.min(...revenueValues.filter(v => v > 0), 0);
  
  const getRevenueColor = (revenue: number) => {
    if (revenue === 0) return '';
    
    // 计算收益的强度 (0-1)
    const intensity = (revenue - minRevenue) / (maxRevenue - minRevenue);
    
    if (darkMode) {
      // 暗黑模式：从深蓝到亮蓝
      if (intensity > 0.75) return 'bg-blue-500';
      if (intensity > 0.5) return 'bg-blue-600';
      if (intensity > 0.25) return 'bg-blue-700';
      return 'bg-blue-800';
    } else {
      // 浅色模式：从浅蓝到深蓝
      if (intensity > 0.75) return 'bg-blue-600';
      if (intensity > 0.5) return 'bg-blue-500';
      if (intensity > 0.25) return 'bg-blue-400';
      return 'bg-blue-300';
    }
  };
  
  const renderDay = (day: number, isCurrentMonth: boolean, isPrevMonth: boolean) => {
    const revenue = isCurrentMonth ? (dailyData[day] || 0) : 0;
    const hasRevenue = revenue > 0;
    const colorClass = hasRevenue ? getRevenueColor(revenue) : '';
    
    const today = new Date();
    const isToday = isCurrentMonth && 
                    day === today.getDate() && 
                    month === today.getMonth() && 
                    year === today.getFullYear();
    
    return (
      <div
        key={`${isPrevMonth ? 'prev' : 'next'}-${day}`}
        className={`
          aspect-square rounded-lg flex flex-col items-center justify-center p-1 md:p-2 relative
          transition-all duration-200 group cursor-pointer
          ${!isCurrentMonth 
            ? 'text-slate-400 dark:text-slate-600' 
            : 'text-slate-900 dark:text-white'
          }
          ${hasRevenue 
            ? `${colorClass} text-white hover:scale-105 shadow-md hover:shadow-lg` 
            : 'bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700'
          }
          ${isToday ? 'ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-slate-800' : ''}
        `}
      >
        <span className="text-xs md:text-sm z-10">{day}</span>
        {hasRevenue && (
          <span className="text-[10px] md:text-xs opacity-90 z-10">
            ¥{revenue >= 1000 ? `${(revenue / 1000).toFixed(1)}k` : revenue}
          </span>
        )}
        
        {/* Tooltip */}
        {hasRevenue && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-700 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
            <div className="text-center">
              <div className="mb-1">{year}年{month + 1}月{day}日</div>
              <div>收益: ¥{revenue.toLocaleString()}</div>
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-700"></div>
          </div>
        )}
      </div>
    );
  };
  
  const days = [];
  
  // 添加上个月的天数
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    days.push(renderDay(daysInPrevMonth - i, false, true));
  }
  
  // 添加当前月的天数
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(renderDay(day, true, false));
  }
  
  // 添加下个月的天数
  for (let day = 1; day <= nextMonthDays; day++) {
    days.push(renderDay(day, false, false));
  }
  
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div>
      {/* 月份选择器 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => onMonthChange('prev')}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          aria-label="上个月"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
        
        <h3 className="text-slate-900 dark:text-white">{monthName}</h3>
        
        <button
          onClick={() => onMonthChange('next')}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          aria-label="下个月"
        >
          <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
      </div>
      
      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-slate-600 dark:text-slate-400 text-xs md:text-sm py-2"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* 日历网格 */}
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {days}
      </div>
    </div>
  );
}