export interface IAddress {
  id?: number;
  label: string;
  addressLine: string;
  latitude?: number;
  longitude?: number;
  customer?: {
    id: number;
  };
}
