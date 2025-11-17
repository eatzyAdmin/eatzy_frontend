"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CustomSelect from "./CustomSelect";
import InputField from "./InputField";
import { getProvinces as getVNProvinces, getDistrictsByProvince as getVNDistrictsByProvince, getWardsByDistrict as getVNWardsByDistrict } from "../data/vietnamAdministrative";

type District = { code: string; name: string };
type Ward = { code: string; name: string };
type Province = { code: string; name: string };

type Props = {
  prefix: string;
  values: {
    province?: string;
    district?: string;
    ward?: string;
    streetName?: string;
    houseNumber?: string;
  };
  onChange: (field: string, value: string) => void;
  onBlur?: (field: string) => void;
  disabled?: boolean;
  required?: boolean;
  errors?: Record<string, string | undefined>;
  className?: string;
  provinces?: Province[];
  getDistrictsByProvince?: (provinceCode: string) => District[];
  getWardsByDistrict?: (districtCode: string) => Ward[];
};

export default function AddressFields({
  prefix,
  values,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  errors = {},
  className,
  provinces,
  getDistrictsByProvince,
  getWardsByDistrict,
}: Props) {
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<string>("");
  const [availableDistricts, setAvailableDistricts] = useState<District[]>([]);
  const [availableWards, setAvailableWards] = useState<Ward[]>([]);

  useEffect(() => {
    if (values.province) {
      const sourceProvinces = provinces ?? getVNProvinces();
      const province = sourceProvinces.find((p) => p.name === values.province);
      if (province) {
        setSelectedProvinceCode(province.code);
        const districts = (getDistrictsByProvince ?? getVNDistrictsByProvince)(province.code);
        setAvailableDistricts(districts);
        if (values.district) {
          const exists = districts.find((d) => d.name === values.district);
          if (!exists) {
            onChange(`${prefix}.district`, "");
            onChange(`${prefix}.ward`, "");
          }
        }
      }
    } else {
      setSelectedProvinceCode("");
      setAvailableDistricts([]);
      setAvailableWards([]);
    }
  }, [values.province, provinces, getDistrictsByProvince]);

  useEffect(() => {
    if (values.district && availableDistricts.length > 0) {
      const district = availableDistricts.find((d) => d.name === values.district);
      if (district) {
        setSelectedDistrictCode(district.code);
        const wards = (getWardsByDistrict ?? getVNWardsByDistrict)(district.code);
        setAvailableWards(wards);
        if (values.ward) {
          const exists = wards.find((w) => w.name === values.ward);
          if (!exists) onChange(`${prefix}.ward`, "");
        }
      }
    } else {
      setSelectedDistrictCode("");
      setAvailableWards([]);
    }
  }, [values.district, availableDistricts, getWardsByDistrict]);

  const handleProvinceChange = (provinceName: string) => {
    onChange(`${prefix}.province`, provinceName);
    onChange(`${prefix}.district`, "");
    onChange(`${prefix}.ward`, "");
  };

  const handleDistrictChange = (districtName: string) => {
    onChange(`${prefix}.district`, districtName);
    onChange(`${prefix}.ward`, "");
  };

  return (
    <motion.div layout transition={{ duration: 0.3, type: "spring" }} className={`grid grid-cols-1 sm:grid-cols-2 gap-2 ${className ?? ""}`}>
      <CustomSelect
        label="Tỉnh/Thành phố"
        options={(provinces ?? getVNProvinces()).map((p) => p.name)}
        value={values.province || ""}
        onChange={handleProvinceChange}
        onBlur={() => onBlur && onBlur(`${prefix}.province`)}
        disabled={disabled}
        error={errors[`${prefix}.province`]}
        required={required}
        placeholder="Chọn tỉnh/thành phố..."
      />
      <CustomSelect
        label="Quận/Huyện"
        options={availableDistricts.map((d) => d.name)}
        value={values.district || ""}
        onChange={handleDistrictChange}
        onBlur={() => onBlur && onBlur(`${prefix}.district`)}
        disabled={disabled || !values.province}
        error={errors[`${prefix}.district`]}
        required={required}
        placeholder="Chọn quận/huyện..."
      />
      <CustomSelect
        label="Phường/Xã"
        options={availableWards.map((w) => w.name)}
        value={values.ward || ""}
        onChange={(val) => onChange(`${prefix}.ward`, val)}
        onBlur={() => onBlur && onBlur(`${prefix}.ward`)}
        disabled={disabled || !values.district}
        error={errors[`${prefix}.ward`]}
        required={required}
        placeholder="Chọn phường/xã..."
      />
      <InputField
        label="Tên đường"
        value={values.streetName || ""}
        onChange={(e) => onChange(`${prefix}.streetName`, e.currentTarget.value)}
        onBlur={() => onBlur && onBlur(`${prefix}.streetName`)}
        disabled={disabled}
        required={required}
        placeholder="Nhập tên đường..."
        error={errors[`${prefix}.streetName`]}
      />
      <InputField
        label="Số nhà"
        value={values.houseNumber || ""}
        onChange={(e) => onChange(`${prefix}.houseNumber`, e.currentTarget.value)}
        onBlur={() => onBlur && onBlur(`${prefix}.houseNumber`)}
        disabled={disabled}
        required={required}
        placeholder="Nhập số nhà..."
        error={errors[`${prefix}.houseNumber`]}
      />
    </motion.div>
  );
}