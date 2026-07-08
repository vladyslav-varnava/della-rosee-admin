'use client';

import { useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Box, Center, Spinner, Stack, Text, VStack } from '@chakra-ui/react';

import {
  getDefaultOrdersFilters,
  OrdersFilters,
} from '@/components/orders/OrdersFilters';
import { OrdersPagination } from '@/components/orders/OrdersPagination';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { useUpdateOrderStatus } from '@/hooks/mutations/useOrderMutations';
import { useGetOrdersAdmin } from '@/hooks/query/useGetOrdersAdmin';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { ORDER_STATUS } from '@/types/order';

const ORDERS_PAGE_SIZE = 20;

const toStartOfDayIso = (date: string) => {
  return date ? new Date(`${date}T00:00:00`).toISOString() : undefined;
};

const toEndOfDayIso = (date: string) => {
  return date ? new Date(`${date}T23:59:59`).toISOString() : undefined;
};

export default function OrdersPage() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(getDefaultOrdersFilters);

  const debouncedSearch = useDebouncedValue(filters.search.trim(), 400);
  const skip = (page - 1) * ORDERS_PAGE_SIZE;

  const queryParams = useMemo(
    () => ({
      take: ORDERS_PAGE_SIZE,
      skip,
      search: debouncedSearch || undefined,
      from: toStartOfDayIso(filters.from),
      to: toEndOfDayIso(filters.to),
    }),
    [skip, debouncedSearch, filters.from, filters.to],
  );

  const { data, isPending, isFetching } = useGetOrdersAdmin(queryParams);

  const updateOrderStatus = useUpdateOrderStatus();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters.from, filters.to]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [page]);

  const total = data?.paging.total ?? 0;
  const orders = data?.items ?? [];
  const hasOrders = orders.length > 0;

  return (
    <Stack gap={5}>
      <OrdersFilters value={filters} onChange={setFilters} />

      {isFetching && !isPending && (
        <Center py={1}>
          <Spinner size="sm" color="della.primary" />
        </Center>
      )}

      {isPending ? (
        <Center py={16}>
          <VStack color="della.accent">
            <Spinner />
            <Text>Завантаження замовлень...</Text>
          </VStack>
        </Center>
      ) : !hasOrders ? (
        <Box
          bg="white"
          border="1px solid"
          borderColor="blackAlpha.100"
          borderRadius="2xl"
          p={10}
          textAlign="center"
          boxShadow="sm"
        >
          <Text fontSize="xl" fontWeight="800" color="della.text">
            Замовлень не знайдено
          </Text>

          <Text mt={2} color="gray.500">
            Змініть пошук або діапазон дат.
          </Text>
        </Box>
      ) : (
        <>
          <OrdersTable
            data={orders}
            updatingOrderId={updateOrderStatus.variables?.id}
            onOpenDetails={(id) => router.push(`/orders/${id}`)}
            onStartProcessing={(id) =>
              updateOrderStatus.mutate({
                id,
                status: ORDER_STATUS.PROCESSING,
              })
            }
          />

          <OrdersPagination
            page={page}
            pageSize={ORDERS_PAGE_SIZE}
            total={total}
            onPageChange={setPage}
          />
        </>
      )}
    </Stack>
  );
}
