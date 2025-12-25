'use client';

import React, { useState, useEffect } from 'react';
import { Store, Download, FileText, Phone, Mail, Lock, LockOpen, ClipboardList } from 'lucide-react';
import { SearchFilterBar, DataTable, ExportDataModal, ColumnDef, ExportNotification, useSwipeConfirmation, useNotification } from '@repo/ui';
import type { Restaurant, RestaurantStatus } from '@repo/types';
import { mockRestaurants } from '../../../../data/mockRestaurants';

// Format currency helper
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value).replace(/\u00a0/g, ' ');
};

export default function RestaurantsPage() {
  const { confirm } = useSwipeConfirmation();
  const { showNotification } = useNotification();

  // Loading states
  const [isLoadingSearch, setIsLoadingSearch] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // State for filter, sort, search
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [sortField, setSortField] = useState<string>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchFields, setSearchFields] = useState({
    id: '',
    name: '',
    ownerName: '',
    ownerPhone: ''
  });

  // State for export
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportData, setExportData] = useState<Restaurant[]>([]);
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
      setRestaurants(mockRestaurants);
      setIsLoading(false);
    }, 1500);
  }, []);

  // useEffect filter + sort
  useEffect(() => {
    let result = [...restaurants];

    // Filter
    result = result.filter(restaurant => {
      const idMatch = searchFields.id === '' || restaurant.id.toLowerCase().includes(searchFields.id.toLowerCase());
      const nameMatch = searchFields.name === '' || restaurant.name.toLowerCase().includes(searchFields.name.toLowerCase());
      const ownerNameMatch = searchFields.ownerName === '' || (restaurant.ownerName && restaurant.ownerName.toLowerCase().includes(searchFields.ownerName.toLowerCase()));
      const ownerPhoneMatch = searchFields.ownerPhone === '' || (restaurant.ownerPhone && restaurant.ownerPhone.toLowerCase().includes(searchFields.ownerPhone.toLowerCase()));
      return idMatch && nameMatch && ownerNameMatch && ownerPhoneMatch;
    });

    // Sort
    result.sort((a, b) => {
      const valueA = a[sortField as keyof Restaurant];
      const valueB = b[sortField as keyof Restaurant];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }

      const numA = Number(valueA);
      const numB = Number(valueB);

      if (sortDirection === 'asc') return numA > numB ? 1 : -1;
      else return numA < numB ? 1 : -1;
    });

    setFilteredRestaurants(result);
  }, [restaurants, searchFields, sortField, sortDirection]);

  // Table columns
  const restaurantColumns: ColumnDef<Restaurant>[] = [
    {
      key: 'id',
      label: 'Mã QA',
      sortable: true,
      formatter: (value, item) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Store size={16} />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{value}</div>
          </div>
        </div>
      )
    },
    {
      key: 'name',
      label: 'Tên quán',
      sortable: true,
      formatter: (value) => <div className="text-sm font-medium text-gray-900">{value}</div>
    },
    {
      key: 'ownerName',
      label: 'Chủ quán',
      sortable: true,
      className: 'hidden sm:table-cell',
      formatter: (value) => <div className="text-sm text-gray-600">{value || 'N/A'}</div>
    },
    {
      key: 'ownerPhone',
      label: 'SĐT chủ',
      sortable: true,
      className: 'hidden lg:table-cell',
      formatter: (value) => <div className="text-sm text-gray-600">{value || 'N/A'}</div>
    },
    {
      key: 'address',
      label: 'Địa chỉ',
      sortable: true,
      className: 'hidden xl:table-cell',
      formatter: (value) => <div className="text-sm text-gray-600">{value || 'N/A'}</div>
    },
    {
      key: 'rating',
      label: 'Đánh giá',
      sortable: true,
      className: 'text-center',
      formatter: (value) => (
        <div className="flex items-center justify-center">
          <span className="text-sm font-semibold text-yellow-600">★ {value || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'totalOrders',
      label: 'Tổng đơn',
      sortable: true,
      className: 'text-center',
      formatter: (value) => <div className="text-sm font-semibold text-gray-700">{value || 0}</div>
    },
    {
      key: 'totalRevenue',
      label: 'Doanh thu',
      sortable: true,
      className: 'text-right',
      formatter: (value) => <div className="text-sm font-semibold text-primary">{value ? formatCurrency(value as number) : 'N/A'}</div>
    },
    {
      key: 'status',
      label: 'Trạng thái',
      sortable: true,
      type: 'status'
    }
  ];

  // Handle toggle status
  const handleToggleStatus = async (restaurant: Restaurant) => {
    const isLocked = restaurant.status === 'LOCKED';
    // Logic: If currently LOCKED -> Unlock to CLOSED. If OPEN/CLOSED -> Lock to LOCKED.
    const newStatus: RestaurantStatus = isLocked ? 'CLOSED' : 'LOCKED';
    const actionText = isLocked ? "mở khóa" : "khóa";
    const confirmType = isLocked ? "info" : "danger"; // Info for unlock (safer), Danger for lock (restrictive)

    confirm({
      title: `Xác nhận ${actionText} quán ăn`,
      description: `Bạn có chắc chắn muốn ${actionText} quán "${restaurant.name}"?`,
      confirmText: `Vuốt để ${actionText}`,
      type: confirmType,
      onConfirm: async () => {
        // Simulate loading 1.5s
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Update status
        setRestaurants(prev => prev.map(r =>
          r.id === restaurant.id ? { ...r, status: newStatus } : r
        ));

        // Show notification
        showNotification({
          message: `Đã ${actionText} quán "${restaurant.name}" thành công.`,
          type: 'success',
          autoHideDuration: 3000
        });
      }
    });
  };

  // Render action for each row
  const renderActions = (restaurant: Restaurant) => {
    const isLocked = restaurant.status === 'LOCKED';

    return (
      <div className="flex justify-end space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            alert('Xem chi tiết quán: ' + restaurant.name);
          }}
          className="text-[#1A1A1A] hover:text-black p-1 rounded-full hover:bg-gray-100"
          title="Xem chi tiết"
        >
          <FileText size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleStatus(restaurant);
          }}
          className={`p-1 rounded-full transition-colors ${isLocked
            ? 'text-gray-500 hover:bg-gray-100' // Locked state (click to unlock)
            : 'text-red-500 hover:bg-red-50' // Unlocked state (click to lock)
            }`}
          title={isLocked ? 'Mở khóa quán' : 'Khóa quán'}
        >
          {isLocked ? (
            <LockOpen size={16} />
          ) : (
            <Lock size={16} />
          )}
        </button>
      </div>
    );
  };

  // SearchFilterBar config
  const searchFieldsConfig = [
    { key: 'id', label: 'Mã QA', icon: FileText, placeholder: 'Tìm theo mã QA...' },
    { key: 'name', label: 'Tên quán', icon: Store, placeholder: 'Tìm theo tên quán...' },
    { key: 'ownerName', label: 'Chủ quán', icon: Mail, placeholder: 'Tìm theo chủ quán...' },
    { key: 'ownerPhone', label: 'SĐT chủ', icon: Phone, placeholder: 'Tìm theo SĐT...' }
  ];

  // Handle search change
  const handleSearchChange = (field: string, value: string) => {
    setSearchFields(prev => ({ ...prev, [field]: value }));
  };

  const clearSearchFields = () => {
    setSearchFields({ id: '', name: '', ownerName: '', ownerPhone: '' });
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
  const handleExportData = (data: Restaurant[], format: string) => {
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
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Quản lý quán ăn</h2>
            <p className="text-gray-500 text-sm">Tra cứu và xem thông tin chi tiết các quán ăn</p>
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
            title="Tìm kiếm quán ăn"
            subtitle="Nhập thông tin để tìm kiếm quán ăn"
          />
        )}
      </div>

      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-96 bg-white rounded-2xl border border-gray-100 shadow-sm"></div>
        </div>
      ) : (
        <DataTable
          data={filteredRestaurants}
          columns={restaurantColumns}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          onRowClick={(restaurant) => {
            alert('Xem chi tiết: ' + restaurant.name);
          }}
          keyField="id"
          className="mb-6"
          headerClassName="bg-primary text-white"
          renderActions={renderActions}
          statusFilters={{
            status: ['OPEN', 'CLOSED', 'LOCKED']
          }}
          changeTableData={(data) => setExportData(data as Restaurant[])}
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
          onExport={(payload) => handleExportData(payload.data as Restaurant[], payload.format)}
          title="Xuất dữ liệu quán ăn"
          initialSelectedColumns={[
            'id',
            'name',
            'ownerName',
            'ownerPhone',
            'ownerEmail',
            'address',
            'registrationDate',
            'status',
            'rating',
            'totalOrders',
            'totalRevenue'
          ]}
          columnLabels={{
            id: 'Mã quán ăn',
            name: 'Tên quán',
            ownerName: 'Tên chủ quán',
            ownerPhone: 'SĐT chủ quán',
            ownerEmail: 'Email chủ quán',
            address: 'Địa chỉ',
            registrationDate: 'Ngày đăng ký',
            status: 'Trạng thái',
            rating: 'Đánh giá',
            totalOrders: 'Tổng đơn hàng',
            totalRevenue: 'Tổng doanh thu'
          }}
          formatData={(value, column) => {
            if (column === 'totalRevenue') return value ? formatCurrency(value as number) : 'N/A';
            if (column === 'status') {
              if (value === 'OPEN') return 'Đang mở cửa';
              if (value === 'LOCKED') return 'Bị khóa';
              if (value === 'CLOSED') return 'Đã đóng cửa';
            }
            return value || 'N/A';
          }}
          defaultFormat="excel"
          customColumnCategories={{
            basic: ['id', 'name', 'address'],
            owner: ['ownerName', 'ownerPhone', 'ownerEmail'],
            business: ['registrationDate', 'status', 'rating', 'totalOrders', 'totalRevenue']
          }}
          enableGrouping={true}
        />
      )}
    </div>
  );
}
