'use client';

import React, { useState, useEffect } from 'react';
import { User, Download, FileText, Phone, Mail, Lock, LockOpen } from 'lucide-react';
import { SearchFilterBar, DataTable, ExportDataModal, ColumnDef, ExportNotification, useSwipeConfirmation, useNotification } from '@repo/ui';
import type { Customer } from '@repo/types';
import { mockCustomers } from '../../../../data/mockCustomers';

// Format currency helper
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value).replace(/\u00a0/g, ' '); // Replace non-breaking space to prevent hydration mismatch
};

export default function CustomersPage() {
  const { confirm } = useSwipeConfirmation();
  const { showNotification } = useNotification();

  // Loading states
  const [isLoadingSearch, setIsLoadingSearch] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // State for filter, sort, search
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [sortField, setSortField] = useState<string>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchFields, setSearchFields] = useState({
    id: '',
    idNumber: '',
    fullName: '',
    phone: '',
    email: ''
  });

  // State for export
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportData, setExportData] = useState<Customer[]>([]);
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
      setCustomers(mockCustomers);
      setIsLoading(false);
    }, 1500);
  }, []);

  // useEffect filter + sort
  useEffect(() => {
    let result = [...customers];

    // Filter
    result = result.filter(customer => {
      const idMatch = searchFields.id === '' || String(customer.id).includes(searchFields.id);
      const idNumberMatch = searchFields.idNumber === '' || customer.idNumber.toLowerCase().includes(searchFields.idNumber.toLowerCase());
      const nameMatch = searchFields.fullName === '' || customer.fullName.toLowerCase().includes(searchFields.fullName.toLowerCase());
      const phoneMatch = searchFields.phone === '' || customer.phone.toLowerCase().includes(searchFields.phone.toLowerCase());
      const emailMatch = searchFields.email === '' || customer.email.toLowerCase().includes(searchFields.email.toLowerCase());
      return idMatch && idNumberMatch && nameMatch && phoneMatch && emailMatch;
    });

    // Sort
    result.sort((a, b) => {
      const valueA = a[sortField as keyof Customer];
      const valueB = b[sortField as keyof Customer];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }

      const numA = Number(valueA);
      const numB = Number(valueB);

      if (sortDirection === 'asc') return numA > numB ? 1 : -1;
      else return numA < numB ? 1 : -1;
    });

    setFilteredCustomers(result);
  }, [customers, searchFields, sortField, sortDirection]);

  // Table columns
  const customerColumns: ColumnDef<Customer>[] = [
    {
      key: 'id',
      label: 'Mã KH',
      sortable: true,
      formatter: (value, item) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User size={16} />
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
    // Removed idNumber column from table view as requested, but kept in data model
    {
      key: 'phone',
      label: 'Số điện thoại',
      sortable: true,
      className: 'hidden sm:table-cell',
      formatter: (value) => <div className="text-sm text-gray-600">{value}</div>
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      className: 'hidden lg:table-cell',
      formatter: (value) => <div className="text-sm text-gray-600">{value}</div>
    },
    {
      key: 'totalOrders',
      label: 'Tổng đơn',
      sortable: true,
      className: 'text-center',
      formatter: (value) => <div className="text-sm font-semibold text-gray-700">{value}</div>
    },
    {
      key: 'totalSpent',
      label: 'Tổng chi tiêu',
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
  const handleToggleStatus = async (customer: Customer) => {
    const isDisabled = customer.status === 'disabled';
    const actionText = isDisabled ? 'kích hoạt' : 'vô hiệu hóa';
    const newStatus = isDisabled ? 'active' : 'disabled';

    confirm({
      title: `Xác nhận ${actionText} tài khoản`,
      description: `Bạn có chắc chắn muốn ${actionText} tài khoản của khách hàng "${customer.fullName}"?`,
      confirmText: `Vuốt để ${actionText}`,
      type: isDisabled ? "success" : "danger",
      onConfirm: async () => {
        // Simulate loading 1.5s
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Update status
        setCustomers(prev => prev.map(c =>
          c.id === customer.id ? { ...c, status: newStatus } : c
        ));

        // Show notification
        showNotification({
          message: `Đã ${actionText} tài khoản khách hàng "${customer.fullName}" thành công.`,
          type: 'success',
          autoHideDuration: 3000
        });
      }
    });
  };

  // Render action for each row
  const renderActions = (customer: Customer) => (
    <div className="flex justify-end space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          alert('Xem chi tiết khách hàng: ' + customer.fullName);
        }}
        className="text-[#1A1A1A] hover:text-black p-1 rounded-full hover:bg-gray-100"
        title="Xem chi tiết"
      >
        <FileText size={16} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleToggleStatus(customer);
        }}
        className={`p-1 rounded-full transition-colors ${customer.status === 'disabled'
          ? 'text-green-600 hover:text-green-800 hover:bg-green-50'
          : 'text-red-600 hover:text-red-800 hover:bg-red-50'
          }`}
        title={customer.status === 'disabled' ? 'Kích hoạt tài khoản' : 'Vô hiệu hóa tài khoản'}
      >
        {customer.status === 'disabled' ? (
          <LockOpen size={16} />
        ) : (
          <Lock size={16} />
        )}
      </button>
    </div>
  );

  // SearchFilterBar config
  const searchFieldsConfig = [
    { key: 'id', label: 'Mã KH', icon: FileText, placeholder: 'Tìm theo mã KH...' },
    // { key: 'idNumber', label: 'Số CCCD', icon: FileText, placeholder: 'Tìm theo CCCD...' },
    { key: 'fullName', label: 'Họ tên', icon: User, placeholder: 'Tìm theo họ tên...' },
    { key: 'phone', label: 'Số điện thoại', icon: Phone, placeholder: 'Tìm theo SĐT...' },
    { key: 'email', label: 'Email', icon: Mail, placeholder: 'Tìm theo email...' }
  ];

  // Handle search change
  const handleSearchChange = (field: string, value: string) => {
    setSearchFields(prev => ({ ...prev, [field]: value }));
  };

  const clearSearchFields = () => {
    setSearchFields({ id: '', idNumber: '', fullName: '', phone: '', email: '' });
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
  const handleExportData = (data: Customer[], format: string) => {
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
    <div className="container mx-auto p-8 px-12 pr-16 text-gray-900" suppressHydrationWarning>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Quản lý khách hàng</h2>
            <p className="text-gray-500 text-sm">Tra cứu và xem thông tin chi tiết các khách hàng</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
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
            title="Tìm kiếm khách hàng"
            subtitle="Nhập thông tin để tìm kiếm khách hàng"
          />
        )}
      </div>

      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-96 bg-white rounded-2xl border border-gray-100 shadow-sm"></div>
        </div>
      ) : (
        <DataTable
          data={filteredCustomers}
          columns={customerColumns}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          onRowClick={(customer) => {
            alert('Xem chi tiết: ' + customer.fullName);
          }}
          keyField="id"
          className="mb-6"
          headerClassName="bg-primary text-white"
          renderActions={renderActions}
          statusFilters={{
            status: ['active', 'disabled']
          }}
          changeTableData={(data) => setExportData(data as Customer[])}
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
          onExport={(payload) => handleExportData(payload.data as Customer[], payload.format)}
          title="Xuất dữ liệu khách hàng"
          initialSelectedColumns={[
            'id',
            'fullName',
            'idNumber',
            'dateOfBirth',
            'email',
            'phone',
            'address',
            'registrationDate',
            'status',
            'totalOrders',
            'totalSpent'
          ]}
          columnLabels={{
            id: 'Mã khách hàng',
            fullName: 'Họ và tên',
            idNumber: 'Số CCCD',
            dateOfBirth: 'Ngày sinh',
            email: 'Email',
            phone: 'Số điện thoại',
            address: 'Địa chỉ',
            registrationDate: 'Ngày đăng ký',
            status: 'Trạng thái',
            totalOrders: 'Tổng đơn hàng',
            totalSpent: 'Tổng chi tiêu'
          }}
          formatData={(value, column) => {
            if (column === 'totalSpent') return formatCurrency(value as number);
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
            other: ['registrationDate', 'status', 'totalOrders', 'totalSpent']
          }}
          enableGrouping={true}
        />
      )}
    </div>
  );
}
