export interface DriverProfile {
  name: string;
  phone: string;
  email: string;
  vehicleType: string;
  licensePlate: string;
  rating: number;
  totalTrips: number;
  yearsActive: number;
  profilePhoto: string;
  joinDate: string;
}

export const mockDriverProfile: DriverProfile = {
  name: "Chưa đăng nhập",
  phone: "No data",
  email: "No data",
  vehicleType: "No data",
  licensePlate: "No data",
  rating: 0,
  totalTrips: 0,
  yearsActive: 0,
  profilePhoto: "https://i.pravatar.cc/150?img=11",
  joinDate: "No data"
};
