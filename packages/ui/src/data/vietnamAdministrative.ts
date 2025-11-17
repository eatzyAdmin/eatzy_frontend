export type Province = { code: string; name: string; type?: string };
export type District = { code: string; name: string; type?: string };
export type Ward = { code: string; name: string; type?: string };

export const vietnamAdministrative: {
  provinces: Province[];
  districts: Record<string, District[]>;
  wards: Record<string, Ward[]>;
} = {
  provinces: [
    { code: "01", name: "Thành phố Hà Nội", type: "Thành phố Trung ương" },
    { code: "79", name: "Thành phố Hồ Chí Minh", type: "Thành phố Trung ương" },
    { code: "48", name: "Thành phố Đà Nẵng", type: "Thành phố Trung ương" },
    { code: "31", name: "Thành phố Hải Phòng", type: "Thành phố Trung ương" },
    { code: "92", name: "Thành phố Cần Thơ", type: "Thành phố Trung ương" },
    { code: "89", name: "Tỉnh An Giang", type: "Tỉnh" },
    { code: "77", name: "Tỉnh Bà Rịa - Vũng Tàu", type: "Tỉnh" },
    { code: "24", name: "Tỉnh Bắc Giang", type: "Tỉnh" },
    { code: "06", name: "Tỉnh Bắc Kạn", type: "Tỉnh" },
    { code: "27", name: "Tỉnh Bắc Ninh", type: "Tỉnh" },
    { code: "02", name: "Tỉnh Hà Giang", type: "Tỉnh" },
    { code: "04", name: "Tỉnh Cao Bằng", type: "Tỉnh" },
    // Rút gọn: có thể bổ sung thêm các tỉnh nếu cần
  ],
  districts: {
    "01": [
      { code: "001", name: "Quận Ba Đình", type: "Quận" },
      { code: "002", name: "Quận Hoàn Kiếm", type: "Quận" },
      { code: "003", name: "Quận Tây Hồ", type: "Quận" },
    ],
    "79": [
      { code: "760", name: "Quận 1", type: "Quận" },
      { code: "767", name: "Thành phố Thủ Đức", type: "Thành phố" },
      { code: "776", name: "Quận 7", type: "Quận" },
    ],
    "48": [
      { code: "492", name: "Quận Hải Châu", type: "Quận" },
      { code: "493", name: "Quận Sơn Trà", type: "Quận" },
    ],
    "24": [
      { code: "213", name: "Thành phố Bắc Giang", type: "Thành phố" },
      { code: "218", name: "Huyện Lục Nam", type: "Huyện" },
    ],
    "06": [
      { code: "058", name: "Thành phố Bắc Kạn", type: "Thành phố" },
      { code: "066", name: "Huyện Na Rì", type: "Huyện" },
    ],
    "04": [
      { code: "040", name: "Thành phố Cao Bằng", type: "Thành phố" },
      { code: "046", name: "Huyện Trà Lĩnh", type: "Huyện" },
    ],
  },
  wards: {
    "001": [
      { code: "00001", name: "Phường Phúc Xá", type: "Phường" },
      { code: "00004", name: "Phường Trúc Bạch", type: "Phường" },
    ],
    "760": [
      { code: "26734", name: "Phường Tân Định", type: "Phường" },
      { code: "26740", name: "Phường Bến Nghé", type: "Phường" },
    ],
    "776": [
      { code: "27265", name: "Phường Tân Kiểng", type: "Phường" },
      { code: "27271", name: "Phường Bình Thuận", type: "Phường" },
    ],
    "492": [
      { code: "20196", name: "Phường Hải Châu II", type: "Phường" },
      { code: "20203", name: "Phường Hòa Cường Bắc", type: "Phường" },
    ],
    "213": [
      { code: "07123", name: "Phường Ngô Quyền", type: "Phường" },
      { code: "07144", name: "Phường Xương Giang", type: "Phường" },
    ],
    "040": [
      { code: "01270", name: "Phường Sông Hiến", type: "Phường" },
      { code: "01276", name: "Phường Hợp Giang", type: "Phường" },
    ],
    "058": [
      { code: "01816", name: "Phường Đức Xuân", type: "Phường" },
      { code: "01819", name: "Phường Sông Cầu", type: "Phường" },
    ],
  },
};

export const getProvinces = () => vietnamAdministrative.provinces;
export const getDistrictsByProvince = (provinceCode: string) => vietnamAdministrative.districts[provinceCode] || [];
export const getWardsByDistrict = (districtCode: string) => vietnamAdministrative.wards[districtCode] || [];
export const getProvinceByCode = (code: string) => vietnamAdministrative.provinces.find((p) => p.code === code);