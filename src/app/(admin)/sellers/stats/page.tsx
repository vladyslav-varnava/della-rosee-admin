'use client';

import { useMemo, useState } from 'react';

import { Box, Center, Spinner, Stack, Text, VStack } from '@chakra-ui/react';

import {
  getDefaultSellerStatsFilters,
  SellerStatsFilters,
} from '@/components/sellers/SellerStatsFilters';
import { SellerStatsSummary } from '@/components/sellers/SellerStatsSummary';
import { SellerStatsTable } from '@/components/sellers/SellerStatsTable';
import { useGetSellerStats } from '@/hooks/query/useGetSellers';

const toStartOfDayIso = (date: string) => {
  return date ? new Date(`${date}T00:00:00`).toISOString() : undefined;
};

const toEndOfDayIso = (date: string) => {
  return date ? new Date(`${date}T23:59:59`).toISOString() : undefined;
};

export default function SellerStatsPage() {
  const [filters, setFilters] = useState(getDefaultSellerStatsFilters);

  const queryParams = useMemo(
    () => ({
      from: toStartOfDayIso(filters.from),
      to: toEndOfDayIso(filters.to),
    }),
    [filters.from, filters.to],
  );

  const { data = [], isPending, isFetching } = useGetSellerStats(queryParams);
  const hasStats = data.length > 0;

  return (
    <Stack gap={5}>
      <SellerStatsFilters value={filters} onChange={setFilters} />

      {isFetching && !isPending && (
        <Center py={1}>
          <Spinner size="sm" color="della.primary" />
        </Center>
      )}

      {isPending ? (
        <Center py={16}>
          <VStack color="della.accent">
            <Spinner />
            <Text>Завантаження статистики продавців...</Text>
          </VStack>
        </Center>
      ) : !hasStats ? (
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
            Статистики немає
          </Text>

          <Text mt={2} color="gray.500">
            Оберіть інший період або перевірте, чи є замовлення з продавцями.
          </Text>
        </Box>
      ) : (
        <>
          <SellerStatsSummary stats={data} />
          <SellerStatsTable stats={data} />
        </>
      )}
    </Stack>
  );
}
