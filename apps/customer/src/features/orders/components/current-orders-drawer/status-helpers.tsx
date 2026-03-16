import { Clock, ClipboardList, ChefHat, Bike, BadgeCheck, X } from "@repo/ui/icons";

export const statusConfigs: Record<string, { label: string; icon: any; color: string; bg: string; border: string; iconBg: string }> = {
  PENDING: { label: "Pending", icon: Clock, color: "text-amber-700", bg: "bg-amber-50/95", border: "border-amber-100/50", iconBg: "bg-amber-200/50" },
  PLACED: { label: "Placed", icon: ClipboardList, color: "text-amber-700", bg: "bg-amber-50/95", border: "border-amber-100/50", iconBg: "bg-amber-200/50" },
  PREPARING: { label: "Preparing", icon: ChefHat, color: "text-amber-700", bg: "bg-amber-50/95", border: "border-amber-100/50", iconBg: "bg-amber-200/50" },
  READY: { label: "Ready", icon: ChefHat, color: "text-amber-700", bg: "bg-amber-50/95", border: "border-amber-100/50", iconBg: "bg-amber-200/50" },
  PICKED_UP: { label: "Picked Up", icon: Bike, color: "text-amber-700", bg: "bg-amber-50/95", border: "border-amber-100/50", iconBg: "bg-amber-200/50" },
  ARRIVED: { label: "Arrived", icon: Bike, color: "text-amber-700", bg: "bg-amber-50/95", border: "border-amber-100/50", iconBg: "bg-amber-200/50" },
  DELIVERED: { label: "Completed", icon: BadgeCheck, color: "text-lime-700", bg: "bg-lime-50/95", border: "border-lime-100/50", iconBg: "bg-lime-200/50" },
  CANCELLED: { label: "Cancelled", icon: X, color: "text-red-700", bg: "bg-red-50/95", border: "border-red-100/50", iconBg: "bg-red-200/50" },
};

export function getStatusIcon(status: string) {
  switch (status) {
    case "PENDING": return <Clock className="w-3.5 h-3.5" />;
    case "PLACED": return <ClipboardList className="w-3.5 h-3.5" />;
    case "PREPARING": return <ChefHat className="w-3.5 h-3.5" />;
    case "DRIVER_ASSIGNED": case "READY": case "PICKED_UP": case "ARRIVED": return <Bike className="w-3.5 h-3.5" />;
    case "DELIVERED": return <BadgeCheck className="w-3.5 h-3.5" />;
    default: return <Clock className="w-3.5 h-3.5" />;
  }
}

export function statusLabel(status: string): string {
  switch (status) {
    case "PENDING": return "Chờ xác nhận";
    case "PLACED": return "Đã đặt";
    case "PREPARING": return "Đang chuẩn bị";
    case "DRIVER_ASSIGNED": case "READY": return "Có tài xế";
    case "PICKED_UP": return "Đang giao";
    case "ARRIVED": return "Đã đến";
    case "DELIVERED": return "Thành công";
    case "CANCELLED": return "Đã hủy";
    default: return status;
  }
}
