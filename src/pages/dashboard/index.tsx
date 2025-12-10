import { useState } from 'react';
import { Moon, Sun, TrendingUp } from 'lucide-react';
import { RevenueChart } from '@/components/RevenueChart';
import { RevenueCalendar } from '@/components/RevenueCalendar';

const generateDailyData = (year: number, month: number) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dailyRevenue: { [key: number]: number } = {};
  
  for (let day = 1; day <= daysInMonth; day++) {
    // 生成随机收益，有些天可能没有收益
    const hasRevenue = Math.random() > 0.2;
    dailyRevenue[day] = hasRevenue ? Math.floor(Math.random() * 5000) + 500 : 0;
  }
  
  return dailyRevenue;
};

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  
  const dailyData = generateDailyData(selectedYear, selectedMonth);
  
  const totalRevenue = Object.values(dailyData).reduce((sum, val) => sum + val, 0);
  const avgDailyRevenue = Math.floor(totalRevenue / Object.keys(dailyData).length);
  
  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  return (
    <div className="container mx-auto max-w-7xl">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">本月总收益</p>
            <p className="text-slate-900 dark:text-white text-3xl">
              ¥{totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">日均收益</p>
            <p className="text-slate-900 dark:text-white text-3xl">
              ¥{avgDailyRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">收益天数</p>
            <p className="text-slate-900 dark:text-white text-3xl">
              {Object.values(dailyData).filter(v => v > 0).length} 天
            </p>
          </div>
        </div>

        {/* 收益曲线图 */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-lg mb-8 border border-slate-200 dark:border-slate-700">
          <h2 className="text-slate-900 dark:text-white mb-6">收益趋势</h2>
          <RevenueChart 
            dailyData={dailyData} 
            year={selectedYear}
            month={selectedMonth}
            darkMode={darkMode} 
          />
        </div>

        {/* 收益日历 */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-slate-900 dark:text-white mb-6">收益日历</h2>
          <RevenueCalendar
            year={selectedYear}
            month={selectedMonth}
            dailyData={dailyData}
            onMonthChange={handleMonthChange}
            darkMode={darkMode}
          />
        </div>
      </div>
  );
}