import { z } from "@repo/lib/zod";

export const personalSchema = z.object({
  fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  dob: z.string().min(1, "Ngày sinh là bắt buộc"),
  gender: z.enum(["male", "female", "other"], { required_error: "Vui lòng chọn giới tính" }),
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  city: z.string().min(2, "Vui lòng chọn tỉnh/thành phố"),
});

export const kycSchema = z.object({
  idType: z.enum(["CCCD", "CMND", "PASSPORT"], { required_error: "Vui lòng chọn loại giấy tờ" }),
  idNumber: z.string().min(6, "Số giấy tờ không hợp lệ"),
  idFrontImageUrl: z.string().min(1, "Vui lòng tải ảnh mặt trước"),
  idBackImageUrl: z.string().min(1, "Vui lòng tải ảnh mặt sau"),
  selfieImageUrl: z.string().min(1, "Vui lòng tải ảnh selfie"),
});

export const licenseSchema = z.object({
  driverLicenseNumber: z.string().min(6, "Số GPLX không hợp lệ"),
  driverLicenseClass: z.enum(["A1", "A2"], { required_error: "Vui lòng chọn hạng" }),
  driverLicenseIssueDate: z.string().min(1, "Vui lòng chọn ngày cấp"),
  driverLicenseImageUrl: z.string().min(1, "Vui lòng tải ảnh bằng lái"),
});

export const vehicleSchema = z.object({
  vehicleType: z.enum(["MANUAL", "SCOOTER", "ELECTRIC"], { required_error: "Vui lòng chọn loại xe" }),
  brand: z.string().min(1, "Vui lòng nhập hãng"),
  model: z.string().min(1, "Vui lòng nhập model"),
  plateNumber: z.string().min(6, "Biển số không hợp lệ"),
  year: z.string().min(4, "Vui lòng chọn năm sản xuất"),
  registrationImageUrl: z.string().min(1, "Vui lòng tải giấy đăng ký"),
  insuranceImageUrl: z.string().min(1, "Vui lòng tải bảo hiểm"),
  vehiclePhotoUrl: z.string().min(1, "Vui lòng tải ảnh xe & biển số"),
});

export const criminalSchema = z.object({
  criminalRecordNumber: z.string().min(6, "Số LLTP không hợp lệ"),
  criminalRecordIssueDate: z.string().min(1, "Vui lòng chọn ngày cấp"),
  criminalRecordImageUrl: z.string().min(1, "Vui lòng tải ảnh/scan LLTP"),
});

export const bankTaxSchema = z.object({
  bankName: z.string().min(2, "Vui lòng chọn ngân hàng"),
  bankAccountName: z.string().min(2, "Vui lòng nhập chủ tài khoản"),
  bankAccountNumber: z.string().regex(/^[0-9]{6,20}$/g, "Số tài khoản không hợp lệ"),
  taxCode: z.string().min(8, "MST không hợp lệ"),
});

export const termsSchema = z.object({
  hasAcceptedTerms: z.literal(true, { errorMap: () => ({ message: "Vui lòng đồng ý điều khoản" }) }),
  hasConfirmedAccuracy: z.literal(true, { errorMap: () => ({ message: "Vui lòng xác nhận tính chính xác" }) }),
});

export type PersonalData = z.infer<typeof personalSchema>;
export type KycData = z.infer<typeof kycSchema>;
export type LicenseData = z.infer<typeof licenseSchema>;
export type VehicleData = z.infer<typeof vehicleSchema>;
export type CriminalData = z.infer<typeof criminalSchema>;
export type BankTaxData = z.infer<typeof bankTaxSchema>;
