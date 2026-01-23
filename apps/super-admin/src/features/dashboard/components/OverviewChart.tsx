import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ChartDataPoint {
  label: string;
  value: number;
}

interface OverviewChartProps {
  data: ChartDataPoint[];
}

export function OverviewChart({ data }: OverviewChartProps) {
  const totalRevenue = data.reduce((sum, item) => sum + (item.value || 0), 0);
  const targetRevenue = totalRevenue * 1.2;

  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xl font-bold text-[#1A1A1A] mb-1">Doanh thu hệ thống</h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs font-medium text-gray-500">Doanh thu</span>
              <span className="text-sm font-bold text-gray-900">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', notation: 'compact' }).format(totalRevenue)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-400" />
              <span className="text-xs font-medium text-gray-500">Mục tiêu</span>
              <span className="text-sm font-bold text-gray-900">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', notation: 'compact' }).format(targetRevenue)}
              </span>
            </div>
          </div>
        </div>

        <select className="bg-gray-50 border-none text-xs font-bold text-gray-500 rounded-lg py-2 px-3 hover:bg-gray-100 cursor-pointer outline-none transition-colors">
          <option>30 ngày qua</option>
          <option>7 ngày qua</option>
          <option>Năm nay</option>
        </select>
      </div>

      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenueOverview" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }}
              dy={15}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
            />
            <Tooltip
              cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '3 3' }}
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenueOverview)"
            />
            <Area
              type="monotone"
              dataKey={(data) => data.value * 1.2}
              stroke="#FB923C"
              strokeWidth={3}
              fill="none"
              strokeDasharray="5 5"
              fillOpacity={0}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
