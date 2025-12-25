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
  name: "Nguyễn Văn A",
  phone: "0901234567",
  email: "nguyenvana@driver.eatzy.com",
  vehicleType: "Honda Wave Alpha",
  licensePlate: "59A-12345",
  rating: 4.8,
  totalTrips: 1234,
  yearsActive: 2,
  profilePhoto: "https://i.pravatar.cc/150?img=11",
  joinDate: "2023-05-15"
};
