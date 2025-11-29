export type DriverProfileStatus = 'DRAFT' | 'SUBMITTED' | 'NEED_MORE_INFO' | 'APPROVED' | 'REJECTED';

export type DocumentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type IdType = 'CCCD' | 'CMND' | 'PASSPORT';

export type VehicleType = 'MANUAL' | 'SCOOTER' | 'ELECTRIC';

export type OnboardingStepId =
  | 'welcome'
  | 'otp'
  | 'personal'
  | 'kyc'
  | 'license'
  | 'vehicle'
  | 'criminal'
  | 'bank_tax'
  | 'terms_submit'
  | 'pending_review';

export type DriverOnboardingData = {
  phoneNumber?: string;
  otpCode?: string;
  isPhoneVerified?: boolean;
  fullName?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  email?: string;
  address?: string;
  city?: string;
  idType?: IdType;
  idNumber?: string;
  idIssueDate?: string;
  idIssuePlace?: string;
  idFrontImageUrl?: string;
  idBackImageUrl?: string;
  selfieImageUrl?: string;
  idVerificationStatus?: DocumentStatus;
  driverLicenseNumber?: string;
  driverLicenseClass?: 'A1' | 'A2';
  driverLicenseIssueDate?: string;
  driverLicenseImageUrl?: string;
  vehicleType?: VehicleType;
  brand?: string;
  model?: string;
  plateNumber?: string;
  year?: string;
  engineCapacity?: string;
  powerWatt?: string;
  registrationImageUrl?: string;
  insuranceImageUrl?: string;
  vehiclePhotoUrl?: string;
  criminalRecordNumber?: string;
  criminalRecordIssueDate?: string;
  criminalRecordImageUrl?: string;
  additionalDocuments?: string[];
  bankName?: string;
  bankBranch?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  taxCode?: string;
  hasAcceptedTerms?: boolean;
  hasConfirmedAccuracy?: boolean;
  applicationStatus?: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  submittedAt?: string;
  driverProfileStatus?: DriverProfileStatus;
};

export const ONBOARDING_STEPS: { id: OnboardingStepId; label: string }[] = [
  { id: 'welcome', label: 'Chào mừng' },
  { id: 'otp', label: 'Xác thực Email' },
  { id: 'personal', label: 'Thông tin cá nhân' },
  { id: 'kyc', label: 'Giấy tờ & Selfie' },
  { id: 'license', label: 'Bằng lái' },
  { id: 'vehicle', label: 'Thông tin xe' },
  { id: 'criminal', label: 'Lý lịch tư pháp' },
  { id: 'bank_tax', label: 'Ngân hàng & MST' },
  { id: 'terms_submit', label: 'Điều khoản & gửi' },
];
