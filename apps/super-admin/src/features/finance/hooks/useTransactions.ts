import { useInfiniteQuery } from '@tanstack/react-query';
import { walletApi } from '@repo/api';
import { ResultPaginationDTO, WalletTransactionResponse } from '@repo/types';

interface UseTransactionsProps {
  searchTerm?: string;
  filter?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  pageSize?: number;
}

export const useTransactions = ({
  searchTerm,
  filter,
  sortField,
  sortDirection,
  pageSize = 10,
}: UseTransactionsProps = {}) => {
  return useInfiniteQuery({
    queryKey: ['transactions', searchTerm, filter, sortField, sortDirection],
    queryFn: async ({ pageParam = 0 }) => {
      const params: any = {
        page: pageParam,
        size: pageSize,
      };

      let filterQuery = '';
      if (searchTerm) {
        filterQuery += `(description ~ '%${searchTerm}%' or transactionType ~ '%${searchTerm}%' or wallet.user.name ~ '%${searchTerm}%')`;
      }

      if (filter) {
        filterQuery += filterQuery ? ` and (${filter})` : filter;
      }

      if (filterQuery) {
        params.filter = filterQuery;
      }

      if (sortField) {
        params.sort = `${sortField},${sortDirection || 'desc'}`;
      } else {
        params.sort = 'createdAt,desc';
      }

      const res = await walletApi.getAllTransactions(params);

      return (res.data ?? {
        result: [],
        meta: {
          page: 0,
          pageSize: pageSize,
          pages: 0,
          total: 0,
        },
      }) as ResultPaginationDTO<WalletTransactionResponse[]>;
    },
    getNextPageParam: (lastPage) => {
      const { meta } = lastPage;
      if (!meta) return undefined;
      return meta.page < meta.pages ? meta.page : undefined;
    },
    initialPageParam: 0,
  });
};
