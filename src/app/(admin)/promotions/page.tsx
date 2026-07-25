'use client';

import { useMemo, useRef, useState } from 'react';

import { Box, Center, Spinner, Stack, Text, VStack } from '@chakra-ui/react';

import { AdminPagination } from '@/components/admin/AdminPagination';
import { PromotionsFilters } from '@/components/promotions/PromotionsFilters';
import { PromotionsTable } from '@/components/promotions/PromotionsTable';
import { usePromotionsAdmin } from '@/hooks/query/usePromotionsAdmin';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import {
  Promotion,
  PromotionActiveFilter,
  PromotionType,
} from '@/types/promotion';

const PROMOTIONS_PAGE_SIZE = 20;

const matchesPromotion = (promotion: Promotion, search: string) => {
  const normalizedSearch = search.toLowerCase();

  return [
    promotion.id,
    promotion.title,
    promotion.description,
    promotion.slug,
    promotion.type,
    promotion.productText,
    ...promotion.promoCodes.map((promoCode) => promoCode.code),
  ].some((value) =>
    String(value ?? '')
      .toLowerCase()
      .includes(normalizedSearch),
  );
};

const getActiveParam = (filter: PromotionActiveFilter) => {
  if (filter === 'active') {
    return true;
  }

  if (filter === 'inactive') {
    return false;
  }

  return undefined;
};

export default function PromotionsPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [activeFilter, setActiveFilter] =
    useState<PromotionActiveFilter>('all');
  const [typeFilter, setTypeFilter] = useState<PromotionType | ''>('');

  const debouncedSearch = useDebouncedValue(searchInput.trim(), 400);
  const queryParams = useMemo(
    () => ({
      active: getActiveParam(activeFilter),
      type: typeFilter || undefined,
    }),
    [activeFilter, typeFilter],
  );

  const { data = [], isPending, isFetching } = usePromotionsAdmin(queryParams);

  const filteredPromotions = useMemo(() => {
    if (!debouncedSearch) {
      return data;
    }

    return data.filter((promotion) =>
      matchesPromotion(promotion, debouncedSearch),
    );
  }, [data, debouncedSearch]);

  const total = filteredPromotions.length;
  const totalPages = Math.max(1, Math.ceil(total / PROMOTIONS_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const skip = (safePage - 1) * PROMOTIONS_PAGE_SIZE;
  const promotions = filteredPromotions.slice(
    skip,
    skip + PROMOTIONS_PAGE_SIZE,
  );
  const hasPromotions = promotions.length > 0;

  const changeSearch = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  const changeActiveFilter = (value: PromotionActiveFilter) => {
    setActiveFilter(value);
    setPage(1);
  };

  const changeTypeFilter = (value: PromotionType | '') => {
    setTypeFilter(value);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchInput('');
    setPage(1);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  return (
    <Stack gap={5}>
      <PromotionsFilters
        search={searchInput}
        activeFilter={activeFilter}
        typeFilter={typeFilter}
        inputRef={inputRef}
        onSearchChange={changeSearch}
        onActiveFilterChange={changeActiveFilter}
        onTypeFilterChange={changeTypeFilter}
        onClearSearch={clearSearch}
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
            <Text>Завантаження акцій...</Text>
          </VStack>
        </Center>
      ) : !hasPromotions ? (
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
            Акцій не знайдено
          </Text>

          <Text mt={2} color="gray.500">
            Змініть пошук, статус або тип акції.
          </Text>
        </Box>
      ) : (
        <>
          <PromotionsTable data={promotions} />

          <AdminPagination
            page={safePage}
            pageSize={PROMOTIONS_PAGE_SIZE}
            total={total}
            onPageChange={setPage}
          />
        </>
      )}
    </Stack>
  );
}
