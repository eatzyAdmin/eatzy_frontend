"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User as UserIcon } from "lucide-react";
import AddressFields from "../forms/AddressFields";
import SwipeConfirmationModal from "./SwipeConfirmationModal";
import InputField from "../forms/InputField";
import CalendarDatePicker from "../forms/CalendarDatePicker";
import { Button } from "../primitives/Button";

type Address = {
  province: string;
  district: string;
  ward: string;
  streetName: string;
  houseNumber: string;
};

type ProfileData = {
  fullName: string;
  dateOfBirth: string;
  idNumber: string;
  email: string;
  phone: string;
  accountCreated?: string;
  accountType?: string;
  permanentAddress: Address;
  contactAddress: Address;
};

type Geo = {
  provinces: { code: string; name: string }[];
  getDistrictsByProvince: (provinceCode: string) => { code: string; name: string }[];
  getWardsByDistrict: (districtCode: string) => { code: string; name: string }[];
};

export default function ProfileModal({
  isOpen = false,
  onClose,
  data,
  onSave,
  geo,
}: {
  isOpen?: boolean;
  onClose: () => void;
  data: ProfileData;
  onSave: (next: { phone: string; contactAddress: Address }) => Promise<void> | void;
  geo: Geo;
}) {
  const [editMode, setEditMode] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [editData, setEditData] = useState<{ phone: string; contactAddress: Address }>({
    phone: data.phone,
    contactAddress: { ...data.contactAddress },
  });

  useEffect(() => {
    if (isOpen) {
      setEditData({ phone: data.phone, contactAddress: { ...data.contactAddress } });
      setEditMode(false);
      setValidationErrors({});
    }
  }, [isOpen, data.phone, data.contactAddress]);

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "phone":
        if (!value) return "Số điện thoại không được để trống";
        if (!/^0\d{9}$/.test(value)) return "Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0";
        return "";
      case "contactAddress.streetName":
        if (!value) return "Tên đường không được để trống";
        if (value.length < 3) return "Tên đường phải có ít nhất 3 ký tự";
        return "";
      case "contactAddress.houseNumber":
        if (!value) return "Số nhà không được để trống";
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (field: string, value: string) => {
    const err = validateField(field, value);
    setValidationErrors((prev) => ({ ...prev, [field]: err }));
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      if (parent === "contactAddress") {
        setEditData((prev) => ({
          ...prev,
          contactAddress: { ...prev.contactAddress, [child as keyof Address]: value },
        }));
      }
    } else {
      setEditData((prev) => ({ ...prev, phone: value }));
    }
  };

  const isFormValid = () => {
    const phoneError = validateField("phone", editData.phone);
    const streetError = validateField("contactAddress.streetName", editData.contactAddress.streetName);
    const houseError = validateField("contactAddress.houseNumber", editData.contactAddress.houseNumber);
    return !phoneError && !streetError && !houseError;
  };

  const handleSave = async () => {
    const errors: Record<string, string> = {};
    const phoneError = validateField("phone", editData.phone);
    const streetError = validateField("contactAddress.streetName", editData.contactAddress.streetName);
    const houseError = validateField("contactAddress.houseNumber", editData.contactAddress.houseNumber);
    if (phoneError) errors.phone = phoneError;
    if (streetError) errors["contactAddress.streetName"] = streetError;
    if (houseError) errors["contactAddress.houseNumber"] = houseError;
    setValidationErrors(errors);
    if (Object.keys(errors).length === 0) setConfirmModalOpen(true);
  };

  const handleConfirmSave = async () => {
    setIsProcessing(true);
    await Promise.resolve(onSave(editData));
    setIsProcessing(false);
    setConfirmModalOpen(false);
    setEditMode(false);
    setValidationErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 backdrop-blur-md bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden">
        <div className="bg-white/70 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 md:p-8 border-b border-white/30 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <motion.div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/50 border border-white/40 flex items-center justify-center shadow-lg" whileHover={{ scale: 1.03 }}>
                <UserIcon size={28} className="text-blue-600" />
              </motion.div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Thông tin cá nhân</h2>
                <p className="text-gray-600 font-medium">{data.fullName}</p>
                <p className="text-gray-500 text-sm">{data.email}</p>
              </div>
            </div>
            <Button onClick={onClose} variant="outline">Đóng</Button>
          </div>

          <div className="p-8 bg-white/50 max-h-[60vh] overflow-y-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">{editMode ? "Chỉnh sửa thông tin" : "Chi tiết thông tin"}</h3>
              {!editMode ? (
                <Button onClick={() => setEditMode(true)} variant="secondary">Chỉnh sửa</Button>
              ) : (
                <div className="flex gap-3">
                  <Button onClick={() => setEditMode(false)} variant="outline">Hủy</Button>
                  <Button onClick={handleSave} disabled={!isFormValid()} variant={isFormValid() ? "primary" : "ghost"}>Lưu thay đổi</Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white/60 border border-white/40 rounded-2xl p-6">
                  {!editMode ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Họ tên</label>
                        <div className="p-3 bg-white/80 border border-white/50 rounded-xl">{data.fullName}</div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Ngày sinh</label>
                        <div className="p-3 bg-white/80 border border-white/50 rounded-xl">{data.dateOfBirth}</div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Số CCCD</label>
                        <div className="p-3 bg-white/80 border border-white/50 rounded-xl">{data.idNumber}</div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Email</label>
                        <div className="p-3 bg-white/80 border border-white/50 rounded-xl">{data.email}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <CalendarDatePicker
                        label="Ngày sinh"
                        value={data.dateOfBirth}
                        onChange={() => {}}
                        disabled
                      />
                      <InputField
                        label="Số điện thoại"
                        value={editData.phone}
                        onChange={(e) => handleInputChange("phone", e.currentTarget.value)}
                        placeholder="Nhập số điện thoại..."
                        error={validationErrors.phone}
                        required
                      />
                    </div>
                  )}
                </div>

                {!editMode && (
                  <div className="bg-white/60 border border-white/40 rounded-2xl p-6">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Ngày tạo tài khoản</label>
                      <div className="p-3 bg-white/80 border border-white/50 rounded-xl">{data.accountCreated}</div>
                    </div>
                    <div className="mt-4">
                      <label className="text-sm font-semibold text-gray-700">Loại tài khoản</label>
                      <div className="p-3 bg-white/80 border border-white/50 rounded-xl">{data.accountType}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {!editMode && (
                  <div className="bg-white/60 border border-white/40 rounded-2xl p-6">
                    {Object.entries({
                      "Tỉnh/Thành phố": data.permanentAddress.province,
                      "Quận/Huyện": data.permanentAddress.district,
                      "Phường/Xã": data.permanentAddress.ward,
                      "Tên đường": data.permanentAddress.streetName,
                      "Số nhà": data.permanentAddress.houseNumber,
                    }).map(([label, value]) => (
                      <div key={label} className="space-y-1 mb-3">
                        <label className="text-sm font-semibold text-gray-700">{label}</label>
                        <div className="p-3 bg-white/80 border border-white/50 rounded-xl">{value as string}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-white/60 border border-white/40 rounded-2xl p-6">
                  {!editMode ? (
                    <div className="space-y-1">
                      {Object.entries({
                        "Tỉnh/Thành phố": data.contactAddress.province,
                        "Quận/Huyện": data.contactAddress.district,
                        "Phường/Xã": data.contactAddress.ward,
                        "Tên đường": data.contactAddress.streetName,
                        "Số nhà": data.contactAddress.houseNumber,
                      }).map(([label, value]) => (
                        <div key={label} className="space-y-1 mb-3">
                          <label className="text-sm font-semibold text-gray-700">{label}</label>
                          <div className="p-3 bg-white/80 border border-white/50 rounded-xl">{value as string}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <AddressFields
                        prefix="contactAddress"
                        values={editData.contactAddress}
                        onChange={handleInputChange}
                        required
                        errors={validationErrors}
                        provinces={geo.provinces}
                        getDistrictsByProvince={geo.getDistrictsByProvince}
                        getWardsByDistrict={geo.getWardsByDistrict}
                      />
                      {validationErrors["contactAddress.streetName"] && (
                        <div className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                          {validationErrors["contactAddress.streetName"]}
                        </div>
                      )}
                      {validationErrors["contactAddress.houseNumber"] && (
                        <div className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                          {validationErrors["contactAddress.houseNumber"]}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SwipeConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmSave}
        title="Xác nhận thay đổi"
        description="Bạn có chắc chắn muốn cập nhật thông tin cá nhân?"
        confirmText="Quẹt để xác nhận"
        type="update"
        isProcessing={isProcessing}
        confirmDetails={{
          "Số điện thoại": editData.phone,
          "Tỉnh/Thành phố": editData.contactAddress.province,
          "Quận/Huyện": editData.contactAddress.district,
          "Phường/Xã": editData.contactAddress.ward,
          "Tên đường": editData.contactAddress.streetName,
          "Số nhà": editData.contactAddress.houseNumber,
        }}
      />
    </div>
  );
}