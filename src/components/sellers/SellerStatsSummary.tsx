'use client';

import { Box, SimpleGrid, Text } from '@chakra-ui/react';

import { SellerStats } from '@/types/seller';

type Props = {
  stats: SellerStats[];
};

const formatMoney = (value: number) => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('uk-UA').format(value);
};

const getTotals = (stats: SellerStats[]) => {
  return stats.reduce(
    (result, seller) => ({
      totalOrders: result.totalOrders + seller.totalOrders,
      totalAmount: result.totalAmount + seller.totalAmount,
      totalFullAmount: result.totalFullAmount + seller.totalFullAmount,
      totalDiscount: result.totalDiscount + seller.totalDiscount,
    }),
    {
      totalOrders: 0,
      totalAmount: 0,
      totalFullAmount: 0,
      totalDiscount: 0,
    },
  );
};

const SummaryCard = ({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) => (
  <Box
    bg="white"
    border="1px solid"
    borderColor="blackAlpha.100"
    borderRadius="2xl"
    p={5}
    boxShadow="sm"
  >
    <Text fontSize="sm" color="gray.500">
      {label}
    </Text>

    <Text mt={2} fontSize="2xl" fontWeight="900" color="della.text">
      {value}
    </Text>

    <Text mt={1} fontSize="sm" color="gray.500">
      {helper}
    </Text>
  </Box>
);

export const SellerStatsSummary = ({ stats }: Props) => {
  const totals = getTotals(stats);
  const topSeller =
    [...stats].sort((a, b) => b.totalAmount - a.totalAmount)[0] ?? null;
  const averageOrder = totals.totalOrders
    ? totals.totalAmount / totals.totalOrders
    : 0;
  const discountRate = totals.totalFullAmount
    ? (totals.totalDiscount / totals.totalFullAmount) * 100
    : 0;

  return (
    <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap={4}>
      <SummaryCard
        label="Замовлення"
        value={formatNumber(totals.totalOrders)}
        helper={`${stats.length} продавців у звіті`}
      />

      <SummaryCard
        label="Оплачено"
        value={formatMoney(totals.totalAmount)}
        helper={`Середній чек ${formatMoney(averageOrder)}`}
      />

      <SummaryCard
        label="До знижок"
        value={formatMoney(totals.totalFullAmount)}
        helper={`Знижка ${discountRate.toFixed(1)}%`}
      />

      <SummaryCard
        label="Лідер періоду"
        value={topSeller?.name ?? '—'}
        helper={topSeller ? formatMoney(topSeller.totalAmount) : 'Немає даних'}
      />
    </SimpleGrid>
  );
};
