import type { DriverProfile, SubmitDriverKycRevision, UpdateDriverProfileDto } from "../../types/src";

/** Preserve explicit admin edits without replaying stale counters/status from a full DTO. */
export function makeDriverProfilePatch(baseline: DriverProfile, edited: Partial<DriverProfile>): UpdateDriverProfileDto {
  const patch: UpdateDriverProfileDto = { id: baseline.id };
  for (const field of Object.keys(edited) as (keyof DriverProfile)[]) {
    if (['id', 'user', 'kycEligible', 'kycRevisionState'].includes(field)) continue;
    if (edited[field] !== undefined && !Object.is(edited[field], baseline[field]))
      Object.assign(patch, { [field]: edited[field] });
  }
  return patch;
}

// Explicit wire allowlist: excludes approval flags, user and operational fields.
export const driverKycFields = [
  'vehicleDetails', 'national_id_front', 'national_id_back', 'national_id_number', 'profile_photo',
  'driver_license_image', 'driver_license_number', 'driver_license_class', 'driver_license_expiry',
  'bank_name', 'bank_branch', 'bank_account_holder', 'bank_account_number', 'tax_code', 'bank_account_image',
  'vehicle_type', 'vehicle_brand', 'vehicle_model', 'vehicle_license_plate', 'vehicle_year',
  'vehicle_registration_image', 'vehicle_insurance_image', 'vehicle_insurance_expiry', 'vehicle_photo',
  'criminal_record_image', 'criminal_record_number', 'criminal_record_issue_date',
] as const satisfies readonly (keyof DriverProfile)[];

export function makeDriverKycSubmission(profile: DriverProfile, documents: SubmitDriverKycRevision['documents']): SubmitDriverKycRevision {
  if (!profile.kycRevisionState) throw new Error('Reload the profile before editing documents.');
  const unsupported = Object.keys(documents).some(key => !driverKycFields.some(field => field === key));
  if (unsupported) throw new Error('Unsupported document field.');
  return {
    baseRevisionNumber: profile.kycRevisionState.activeRevisionNumber,
    expectedVersion: profile.kycRevisionState.pendingRevision?.lockVersion ?? null,
    documents,
  };
}

export function driverProfileError(error: unknown): { conflict: boolean; message: string } {
  const response = typeof error === 'object' && error !== null && 'response' in error ? error.response : undefined;
  const data = typeof response === 'object' && response !== null && 'data' in response ? response.data : undefined;
  const message = typeof data === 'object' && data !== null && 'message' in data ? data.message : undefined;
  return {
    conflict: typeof response === 'object' && response !== null && 'status' in response && response.status === 409,
    message: typeof message === 'string' ? message : error instanceof Error ? error.message : 'Unable to update the profile.',
  };
}
