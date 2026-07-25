'use client';

import { useMemo, useRef, useState } from 'react';

import { Box, Center, Spinner, Stack, Text, VStack } from '@chakra-ui/react';

import { AdminPagination } from '@/components/admin/AdminPagination';
import {
  SellerActivityFilter,
  SellersFilters,
} from '@/components/sellers/SellersFilters';
import { SellersTable } from '@/components/sellers/SellersTable';
import {
  useCreateSeller,
  useDeleteSeller,
  useUpdateSeller,
} from '@/hooks/mutations/seller/useSellerMutations';
import { useGetSellers } from '@/hooks/query/useGetSellers';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { Seller, SellerPayload, UpdateSellerPayload } from '@/types/seller';

const SELLERS_PAGE_SIZE = 20;

const matchesSeller = (seller: Seller, search: string) => {
  const normalizedSearch = search.toLowerCase();

  return [
    seller.id,
    seller.name,
    seller.phone,
    seller.email,
  ].some((value) =>
    String(value ?? '')
      .toLowerCase()
      .includes(normalizedSearch),
  );
};

const matchesActivityFilter = (
  seller: Seller,
  activityFilter: SellerActivityFilter,
) => {
  if (activityFilter === 'active') {
    return seller.isActive;
  }

  if (activityFilter === 'inactive') {
    return !seller.isActive;
  }

  return true;
};

export default function SellersPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [activityFilter, setActivityFilter] =
    useState<SellerActivityFilter>('active');

  const debouncedSearch = useDebouncedValue(searchInput.trim(), 400);
  const { data = [], isPending, isFetching } = useGetSellers();

  const createSeller = useCreateSeller();
  const updateSeller = useUpdateSeller();
  const deleteSeller = useDeleteSeller();

  const filteredSellers = useMemo(() => {
    return data.filter(
      (seller) =>
        matchesActivityFilter(seller, activityFilter) &&
        (!debouncedSearch || matchesSeller(seller, debouncedSearch)),
    );
  }, [activityFilter, data, debouncedSearch]);

  const total = filteredSellers.length;
  const totalPages = Math.max(1, Math.ceil(total / SELLERS_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const skip = (safePage - 1) * SELLERS_PAGE_SIZE;
  const sellers = filteredSellers.slice(skip, skip + SELLERS_PAGE_SIZE);
  const hasSellers = sellers.length > 0;

  const changeSearch = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  const changeActivityFilter = (value: SellerActivityFilter) => {
    setActivityFilter(value);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchInput('');
    setPage(1);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const createSellerItem = async (
    payload: SellerPayload | UpdateSellerPayload,
  ) => {
    await createSeller.mutateAsync(payload as SellerPayload);
  };

  const updateSellerItem = async (
    id: number,
    payload: SellerPayload | UpdateSellerPayload,
  ) => {
    await updateSeller.mutateAsync({
      id,
      payload: payload as UpdateSellerPayload,
    });
  };

  const deleteSellerItem = (id: number) => {
    const shouldDelete = window.confirm(
      'Видалити продавця? Якщо до нього привʼязані замовлення, видалення може бути заблоковане.',
    );

    if (shouldDelete) {
      deleteSeller.mutate(id);
    }
  };

  return (
    <Stack gap={5}>
      <SellersFilters
        search={searchInput}
        activityFilter={activityFilter}
        inputRef={inputRef}
        isCreating={createSeller.isPending}
        onSearchChange={changeSearch}
        onActivityFilterChange={changeActivityFilter}
        onClearSearch={clearSearch}
        onCreate={createSellerItem}
      />

      {isFetching && !isPending && (
        <Center py={1}>
          <Spinner size="sm" color="della.primary" />
        </Center>
      )}

      {isPending ? (
        <Center py={16}>
          <VStack color="della.accent">
            <Spinner />
            <Text>Завантаження продавців...</Text>
          </VStack>
        </Center>
      ) : !hasSellers ? (
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
            Продавців не знайдено
          </Text>

          <Text mt={2} color="gray.500">
            Змініть пошук, фільтр активності або додайте першого продавця.
          </Text>
        </Box>
      ) : (
        <>
          <SellersTable
            data={sellers}
            deletingSellerId={deleteSeller.variables}
            updatingSellerId={updateSeller.variables?.id}
            onDelete={deleteSellerItem}
            onUpdate={updateSellerItem}
          />

          <AdminPagination
            page={safePage}
            pageSize={SELLERS_PAGE_SIZE}
            total={total}
            onPageChange={setPage}
          />
        </>
      )}
    </Stack>
  );
}
