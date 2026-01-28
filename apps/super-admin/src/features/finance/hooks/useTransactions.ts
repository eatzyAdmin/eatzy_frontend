import { useInfiniteQuery } from '@tanstack/react-query';
import { walletApi } from '@repo/api';
import { WalletTransactionsBackendRes, ResultPaginationDTO, WalletTransactionResponse } from '@repo/types';

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

      // Explicitly cast to ResultPaginationDTO for safety
      const data = res.data as unknown as ResultPaginationDTO<WalletTransactionResponse[]>;

      return {
        result: data.result || [],
        meta: data.meta,
      };
    },
    getNextPageParam: (lastPage) => {
      const { meta } = lastPage;
      if (!meta) return undefined;
      return meta.page + 1 < meta.pages ? meta.page + 1 : undefined;
    },
    initialPageParam: 0,
  });
};
