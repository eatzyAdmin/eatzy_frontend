'use client';

import React, { useState, useEffect } from 'react';
import { User, Download, FileText, Phone, Mail, Lock, LockOpen, Bike, ClipboardList } from 'lucide-react';
import { SearchFilterBar, DataTable, ExportDataModal, ColumnDef, ExportNotification, useSwipeConfirmation, useNotification } from '@repo/ui';
import type { Driver } from '@repo/types';
import { mockDrivers } from '../../../../data/mockDrivers';

// Format currency helper
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value).replace(/\u00a0/g, ' ');
};

export default function DriversPage() {
  const { confirm } = useSwipeConfirmation();
  const { showNotification } = useNotification();

  // Loading states
  const [isLoadingSearch, setIsLoadingSearch] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // State for filter, sort, search
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [sortField, setSortField] = useState<string>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchFields, setSearchFields] = useState({
    id: '',
    fullName: '',
    phone: '',
    email: '',
    licensePlate: ''
  });

  // State for export
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportData, setExportData] = useState<Driver[]>([]);
  const [exportNotification, setExportNotification] = useState({
    visible: false,
    type: 'success' as 'success' | 'error',
    message: '',
    format: ''
  });

  // State to track if component is mounted (client-side only)
  const [isMounted, setIsMounted] = useState(false);

  // useEffect to simulate loading states
  useEffect(() => {
    setIsMounted(true);

    // Simulate loading for search filtering
    setTimeout(() => {
      setIsLoadingSearch(false);
    }, 2000);

    // Simulate loading for data
    setTimeout(() => {
      setDrivers(mockDrivers);
      setIsLoading(false);
    }, 1500);
  }, []);

  // useEffect filter + sort
  useEffect(() => {
    let result = [...drivers];

    // Filter
    result = result.filter(driver => {
      const idMatch = searchFields.id === '' || String(driver.id).includes(searchFields.id);
      const nameMatch = searchFields.fullName === '' || driver.fullName.toLowerCase().includes(searchFields.fullName.toLowerCase());
      const phoneMatch = searchFields.phone === '' || driver.phone.toLowerCase().includes(searchFields.phone.toLowerCase());
      const emailMatch = searchFields.email === '' || driver.email.toLowerCase().includes(searchFields.email.toLowerCase());
      const plateMatch = searchFields.licensePlate === '' || driver.licensePlate.toLowerCase().includes(searchFields.licensePlate.toLowerCase());
      return idMatch && nameMatch && phoneMatch && emailMatch && plateMatch;
    });

    // Sort
    result.sort((a, b) => {
      const valueA = a[sortField as keyof Driver];
      const valueB = b[sortField as keyof Driver];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }

      const numA = Number(valueA);
      const numB = Number(valueB);

      if (sortDirection === 'asc') return numA > numB ? 1 : -1;
      else return numA < numB ? 1 : -1;
    });

    setFilteredDrivers(result);
  }, [drivers, searchFields, sortField, sortDirection]);

  // Table columns
  const driverColumns: ColumnDef<Driver>[] = [
    {
      key: 'id',
      label: 'Mã TX',
      sortable: true,
      formatter: (value, item) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Bike size={16} />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{value}</div>
          </div>
        </div>
      )
    },
    {
      key: 'fullName',
      label: 'Họ và tên',
      sortable: true,
      formatter: (value) => <div className="text-sm font-medium text-gray-900">{value}</div>
    },
    {
      key: 'phone',
      label: 'Số điện thoại',
      sortable: true,
      className: 'hidden sm:table-cell',
      formatter: (value) => <div className="text-sm text-gray-600">{value}</div>
    },
    {
      key: 'vehicleType',
      label: 'Loại xe',
      sortable: true,
      className: 'hidden lg:table-cell',
      formatter: (value) => <div className="text-sm text-gray-600">{value}</div>
    },
    {
      key: 'licensePlate',
      label: 'Biển số',
      sortable: true,
      className: 'hidden xl:table-cell',
      formatter: (value) => <div className="text-sm font-mono text-gray-700">{value}</div>
    },
    {
      key: 'rating',
      label: 'Đánh giá',
      sortable: true,
      className: 'text-center',
      formatter: (value) => (
        <div className="flex items-center justify-center">
          <span className="text-sm font-semibold text-yellow-600">★ {value}</span>
        </div>
      )
    },
    {
      key: 'totalTrips',
      label: 'Số chuyến',
      sortable: true,
      className: 'text-center',
      formatter: (value) => <div className="text-sm font-semibold text-gray-700">{value}</div>
    },
    {
      key: 'totalEarnings',
      label: 'Thu nhập',
      sortable: true,
      className: 'text-right',
      formatter: (value) => <div className="text-sm font-semibold text-primary">{formatCurrency(value as number)}</div>
    },
    {
      key: 'status',
      label: 'Trạng thái',
      sortable: true,
      type: 'status'
    }
  ];

  // Handle toggle status
  const handleToggleStatus = async (driver: Driver) => {
    const isDisabled = driver.status === 'disabled';
    const actionText = isDisabled ? 'kích hoạt' : 'vô hiệu hóa';
    const newStatus = isDisabled ? 'active' : 'disabled';

    confirm({
      title: `Xác nhận ${actionText} tài khoản`,
      description: `Bạn có chắc chắn muốn ${actionText} tài khoản của tài xế "${driver.fullName}"?`,
      confirmText: `Vuốt để ${actionText}`,
      type: isDisabled ? "success" : "danger",
      onConfirm: async () => {
        // Simulate loading 1.5s
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Update status
        setDrivers(prev => prev.map(d =>
          d.id === driver.id ? { ...d, status: newStatus } : d
        ));

        // Show notification
        showNotification({
          message: `Đã ${actionText} tài khoản tài xế "${driver.fullName}" thành công.`,
          type: 'success',
          autoHideDuration: 3000
        });
      }
    });
  };

  // Render action for each row
  const renderActions = (driver: Driver) => (
    <div className="flex justify-end space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          alert('Xem chi tiết tài xế: ' + driver.fullName);
        }}
        className="text-[#1A1A1A] hover:text-black p-1 rounded-full hover:bg-gray-100"
        title="Xem chi tiết"
      >
        <FileText size={16} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleToggleStatus(driver);
        }}
        className={`p-1 rounded-full transition-colors ${driver.status === 'disabled'
          ? 'text-green-600 hover:text-green-800 hover:bg-green-50'
          : 'text-red-600 hover:text-red-800 hover:bg-red-50'
          }`}
        title={driver.status === 'disabled' ? 'Kích hoạt tài khoản' : 'Vô hiệu hóa tài khoản'}
      >
        {driver.status === 'disabled' ? (
          <LockOpen size={16} />
        ) : (
          <Lock size={16} />
        )}
      </button>
    </div>
  );

  // SearchFilterBar config
  const searchFieldsConfig = [
    { key: 'id', label: 'Mã TX', icon: FileText, placeholder: 'Tìm theo mã TX...' },
    { key: 'fullName', label: 'Họ tên', icon: User, placeholder: 'Tìm theo họ tên...' },
    { key: 'phone', label: 'Số điện thoại', icon: Phone, placeholder: 'Tìm theo SĐT...' },
    { key: 'email', label: 'Email', icon: Mail, placeholder: 'Tìm theo email...' },
    { key: 'licensePlate', label: 'Biển số', icon: Bike, placeholder: 'Tìm theo biển số...' }
  ];

  // Handle search change
  const handleSearchChange = (field: string, value: string) => {
    setSearchFields(prev => ({ ...prev, [field]: value }));
  };

  const clearSearchFields = () => {
    setSearchFields({ id: '', fullName: '', phone: '', email: '', licensePlate: '' });
  };

  // Handle sort
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Export
  const handleExportData = (data: Driver[], format: string) => {
    // Simulate export process
    const isSuccess = Math.random() > 0.2;

    if (isSuccess) {
      setExportNotification({
        visible: true,
        type: 'success',
        message: `Xuất ${data.length} bản ghi thành công!`,
        format
      });
    } else {
      setExportNotification({
        visible: true,
        type: 'error',
        message: 'Có lỗi khi xuất dữ liệu. Vui lòng thử lại!',
        format
      });
    }

    // Auto hide notification after 5 seconds
    setTimeout(() => {
      setExportNotification(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return null;
  }

  return (
    <div className="container mx-auto p-8 px-12 pr-16 text-gray-900 max-w-full overflow-x-hidden" suppressHydrationWarning>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Quản lý tài xế</h2>
            <p className="text-gray-500 text-sm">Tra cứu và xem thông tin chi tiết các tài xế</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => alert('Chức năng xem đơn đăng ký đang phát triển')}
              className="group flex items-center space-x-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
            >
              <ClipboardList size={16} className="text-gray-500 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium text-sm">Xem đơn đăng ký</span>
            </button>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="group flex items-center space-x-2 px-4 py-2.5 bg-primary text-white rounded-xl shadow-md hover:shadow-lg hover:brightness-105 transition-all duration-300"
            >
              <Download size={16} className="text-white group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium text-sm">Xuất dữ liệu</span>
            </button>
          </div>
        </div>

        {isLoadingSearch ? (
          <div className="animate-pulse">
            <div className="h-20 bg-gray-50 rounded-2xl border border-gray-100"></div>
          </div>
        ) : (
          <SearchFilterBar
            searchFields={searchFields}
            handleSearchChange={handleSearchChange}
            clearSearchFields={clearSearchFields}
            searchFieldsConfig={searchFieldsConfig}
            title="Tìm kiếm tài xế"
            subtitle="Nhập thông tin để tìm kiếm tài xế"
          />
        )}
      </div>

      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-96 bg-white rounded-2xl border border-gray-100 shadow-sm"></div>
        </div>
      ) : (
        <DataTable
          data={filteredDrivers}
          columns={driverColumns}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          onRowClick={(driver) => {
            alert('Xem chi tiết: ' + driver.fullName);
          }}
          keyField="id"
          className="mb-6"
          headerClassName="bg-primary text-white"
          renderActions={renderActions}
          statusFilters={{
            status: ['active', 'disabled']
          }}
          changeTableData={(data) => setExportData(data as Driver[])}
        />
      )}

      {/* Export notification */}
      {exportNotification.visible && (
        <ExportNotification
          isVisible={exportNotification.visible}
          format={exportNotification.format}
          onClose={() => setExportNotification(prev => ({ ...prev, visible: false }))}
          message={exportNotification.message}
          type={exportNotification.type}
          autoHideDuration={5000}
        />
      )}

      {/* Export Data Modal */}
      {isExportModalOpen && (
        <ExportDataModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          data={exportData}
          onExport={(payload) => handleExportData(payload.data as Driver[], payload.format)}
          title="Xuất dữ liệu tài xế"
          initialSelectedColumns={[
            'id',
            'fullName',
            'idNumber',
            'dateOfBirth',
            'email',
            'phone',
            'address',
            'vehicleType',
            'licensePlate',
            'registrationDate',
            'status',
            'rating',
            'totalTrips',
            'totalEarnings'
          ]}
          columnLabels={{
            id: 'Mã tài xế',
            fullName: 'Họ và tên',
            idNumber: 'Số CCCD',
            dateOfBirth: 'Ngày sinh',
            email: 'Email',
            phone: 'Số điện thoại',
            address: 'Địa chỉ',
            vehicleType: 'Loại xe',
            licensePlate: 'Biển số xe',
            registrationDate: 'Ngày đăng ký',
            status: 'Trạng thái',
            rating: 'Đánh giá',
            totalTrips: 'Tổng số chuyến',
            totalEarnings: 'Tổng thu nhập'
          }}
          formatData={(value, column) => {
            if (column === 'totalEarnings') return formatCurrency(value as number);
            if (column === 'status') {
              if (value === 'active') return 'Hoạt động';
              if (value === 'disabled') return 'Vô hiệu hóa';
            }
            return value;
          }}
          defaultFormat="excel"
          customColumnCategories={{
            personal: ['id', 'fullName', 'idNumber', 'dateOfBirth'],
            contact: ['email', 'phone', 'address'],
            vehicle: ['vehicleType', 'licensePlate'],
            other: ['registrationDate', 'status', 'rating', 'totalTrips', 'totalEarnings']
          }}
          enableGrouping={true}
        />
      )}
    </div>
  );
}
