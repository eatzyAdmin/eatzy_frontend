import type { DriverOrderOffer, PaymentMethod } from "@repo/types";

const OFFERS: DriverOrderOffer[] = [
  {
    id: "offer-1",
    netEarning: 29247,
    orderValue: 45000,
    paymentMethod: "EATZYPAY" as PaymentMethod,
    distanceKm: 0.6,
    pickup: { name: "Trà Sữa Cộng Đồng", address: "34 Hậu Giang, Quận 6" },
    dropoff: { address: "2A/29 Đường 13A - KP.19, Bình Hưng Hòa, TP.HCM" },
    expireSeconds: 30,
  },
  {
    id: "offer-2",
    netEarning: 21500,
    orderValue: 60000,
    paymentMethod: "CASH" as PaymentMethod,
    distanceKm: 1.2,
    pickup: { name: "Bún Bò Huế Ngon", address: "12 Lý Thường Kiệt, Quận 5" },
    dropoff: { address: "85 Nguyễn Văn Cừ, Quận 5, TP.HCM" },
    expireSeconds: 30,
  },
  {
    id: "offer-3",
    netEarning: 32500,
    orderValue: 80000,
    paymentMethod: "VNPAY" as PaymentMethod,
    distanceKm: 2.4,
    pickup: { name: "Cơm Tấm 36", address: "36 Trần Hưng Đạo, Quận 1" },
    dropoff: { address: "220 Pasteur, Quận 3, TP.HCM" },
    expireSeconds: 30,
  },
];

export function getMockOffer(index: number): DriverOrderOffer {
  return OFFERS[index % OFFERS.length];
}

