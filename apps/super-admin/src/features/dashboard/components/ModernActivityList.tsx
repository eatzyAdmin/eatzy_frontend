import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { ShoppingBag, Store, Truck, Users, AlertCircle } from "lucide-react";

interface Activity {
  id: string;
  type: 'order' | 'restaurant' | 'driver' | 'user' | 'system';
  description: string;
  timestamp: string;
  status?: string;
}

interface ModernActivityListProps {
  activities: Activity[];
}

export function ModernActivityList({ activities }: ModernActivityListProps) {
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'order': return ShoppingBag;
      case 'restaurant': return Store;
      case 'driver': return Truck;
      case 'user': return Users;
      default: return AlertCircle;
    }
  };

  const getIconColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'order': return 'text-blue-600 bg-blue-50';
      case 'restaurant': return 'text-orange-600 bg-orange-50';
      case 'driver': return 'text-purple-600 bg-purple-50';
      case 'user': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-[#1A1A1A]">Hoạt động gần đây</h3>
        <button className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Xem tất cả</button>
      </div>

      <div className="flex flex-col gap-6">
        {activities.map((activity) => {
          const Icon = getIcon(activity.type);
          const colorClass = getIconColor(activity.type);
          
          return (
            <div key={activity.id} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${colorClass}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 font-medium capitalize">
                    {activity.type} {activity.status ? `• ${activity.status}` : ''}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-400 font-medium">
                  {formatDistanceToNow(new Date(activity.timestamp), { locale: vi, addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
