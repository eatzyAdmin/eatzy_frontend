export interface IAddress {
  id?: number;
  label: string;
  addressLine?: string; // For sending to backend entity
  address_line?: string; // For receiving from backend DTO

  latitude?: number;
  longitude?: number;
  customer?: {
    id: number;
  };
}
