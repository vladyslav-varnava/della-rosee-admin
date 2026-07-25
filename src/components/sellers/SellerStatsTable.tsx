'use client';

import {
  Badge,
  Box,
  HStack,
  Table,
  Text,
  VStack,
} from '@chakra-ui/react';

import {
  getOrderStatusColor,
  ORDER_STATUS_OPTIONS,
  translateOrderStatus,
} from '@/types/order';
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

const getStatusEntries = (seller: SellerStats) => {
  const knownStatuses = ORDER_STATUS_OPTIONS.map((status) => String(status));
  const allStatuses = Array.from(
    new Set([...knownStatuses, ...Object.keys(seller.ordersByStatus ?? {})]),
  );

  return allStatuses
    .map((status) => ({
      status,
      count: seller.ordersByStatus?.[status] ?? 0,
    }))
    .filter((item) => item.count > 0);
};

export const SellerStatsTable = ({ stats }: Props) => {
  const sortedStats = [...stats].sort((a, b) => b.totalAmount - a.totalAmount);
  const maxAmount = Math.max(
    ...sortedStats.map((seller) => seller.totalAmount),
    1,
  );

  return (
    <Box
      w="100%"
      overflowX="auto"
      bg="white"
      border="1px solid"
      borderColor="blackAlpha.100"
      borderRadius="2xl"
      boxShadow="sm"
    >
      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row bg="gray.50">
            <Table.ColumnHeader>Продавець</Table.ColumnHeader>
            <Table.ColumnHeader>Замовлення</Table.ColumnHeader>
            <Table.ColumnHeader>Оплачено</Table.ColumnHeader>
            <Table.ColumnHeader>До знижок</Table.ColumnHeader>
            <Table.ColumnHeader>Знижка</Table.ColumnHeader>
            <Table.ColumnHeader>Статуси</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {sortedStats.map((seller) => {
            const amountPercent = Math.round(
              (seller.totalAmount / maxAmount) * 100,
            );
            const discountRate = seller.totalFullAmount
              ? (seller.totalDiscount / seller.totalFullAmount) * 100
              : 0;
            const statusEntries = getStatusEntries(seller);

            return (
              <Table.Row key={seller.id} _hover={{ bg: 'gray.50' }}>
                <Table.Cell minW="220px">
                  <VStack align="start" gap={1}>
                    <Text fontWeight="900" color="della.text">
                      {seller.name}
                    </Text>

                    <Text fontSize="sm" color="gray.500">
                      {seller.phone || seller.email || `ID #${seller.id}`}
                    </Text>
                  </VStack>
                </Table.Cell>

                <Table.Cell fontWeight="800">
                  {formatNumber(seller.totalOrders)}
                </Table.Cell>

                <Table.Cell minW="180px">
                  <VStack align="stretch" gap={2}>
                    <Text fontWeight="900">
                      {formatMoney(seller.totalAmount)}
                    </Text>
                    <Box h="6px" bg="blackAlpha.100" borderRadius="full">
                      <Box
                        h="100%"
                        w={`${amountPercent}%`}
                        bg="della.primary"
                        borderRadius="full"
                      />
                    </Box>
                  </VStack>
                </Table.Cell>

                <Table.Cell fontWeight="700">
                  {formatMoney(seller.totalFullAmount)}
                </Table.Cell>

                <Table.Cell minW="150px">
                  <Text fontWeight="800">
                    {formatMoney(seller.totalDiscount)}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {discountRate.toFixed(1)}%
                  </Text>
                </Table.Cell>

                <Table.Cell minW="260px">
                  {statusEntries.length ? (
                    <HStack gap={2} wrap="wrap">
                      {statusEntries.map((item) => (
                        <Badge
                          key={item.status}
                          colorPalette={getOrderStatusColor(item.status)}
                        >
                          {translateOrderStatus(item.status)}: {item.count}
                        </Badge>
                      ))}
                    </HStack>
                  ) : (
                    <Text color="gray.500">—</Text>
                  )}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
