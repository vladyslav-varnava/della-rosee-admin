'use client';

import {
  Badge,
  Box,
  Button,
  HStack,
  Table,
  Text,
  VStack,
} from '@chakra-ui/react';

import {
  getOrderStatusColor,
  Order,
  ORDER_STATUS,
  OrderStatus,
  translateDeliveryType,
  translateOrderStatus,
  translatePaymentType,
} from '@/types/order';

type Props = {
  data: Order[];
  updatingOrderId?: number;
  onOpenDetails: (id: number) => void;
  onStartProcessing: (id: number) => void;
};

const formatDate = (value: string) => {
  return new Date(value).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const formatTime = (value: string) => {
  return new Date(value).toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const OrdersTable = ({
  data,
  updatingOrderId,
  onOpenDetails,
  onStartProcessing,
}: Props) => {
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
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Статус</Table.ColumnHeader>
            <Table.ColumnHeader>Клієнт</Table.ColumnHeader>
            <Table.ColumnHeader>Контакт</Table.ColumnHeader>
            <Table.ColumnHeader>Сума</Table.ColumnHeader>
            <Table.ColumnHeader>Дата</Table.ColumnHeader>
            <Table.ColumnHeader>Оплата</Table.ColumnHeader>
            <Table.ColumnHeader>Доставка</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Дії</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data.map((order) => {
            const isPending = order.status === ORDER_STATUS.PENDING;
            const isUpdating = updatingOrderId === order.id;

            return (
              <Table.Row key={order.id} _hover={{ bg: 'gray.50' }}>
                <Table.Cell fontWeight="700">#{order.id}</Table.Cell>

                <Table.Cell>
                  <Badge colorPalette={getOrderStatusColor(order.status)}>
                    {translateOrderStatus(order.status)}
                  </Badge>
                </Table.Cell>

                <Table.Cell>
                  <VStack align="start" gap={0}>
                    <Text fontWeight="700">
                      {order.firstName} {order.lastName}
                    </Text>

                    {order.email && (
                      <Text fontSize="xs" color="gray.500">
                        {order.email}
                      </Text>
                    )}
                  </VStack>
                </Table.Cell>

                <Table.Cell>
                  <Text whiteSpace="nowrap">{order.phone || '—'}</Text>
                </Table.Cell>

                <Table.Cell fontWeight="700" whiteSpace="nowrap">
                  {formatAmount(order.amount)}
                </Table.Cell>

                <Table.Cell>
                  <VStack align="start" gap={0}>
                    <Text>{formatDate(order.createdAt)}</Text>
                    <Text fontSize="xs" color="gray.500">
                      {formatTime(order.createdAt)}
                    </Text>
                  </VStack>
                </Table.Cell>

                <Table.Cell>
                  {translatePaymentType(order.paymentType)}
                </Table.Cell>

                <Table.Cell>
                  {translateDeliveryType(order.deliveryType)}
                </Table.Cell>

                <Table.Cell>
                  <HStack justify="flex-end" gap={2}>
                    {isPending && (
                      <Button
                        size="sm"
                        variant="outline"
                        loading={isUpdating}
                        onClick={() => onStartProcessing(order.id)}
                      >
                        В обробку
                      </Button>
                    )}

                    <Button
                      size="sm"
                      bg="della.primary"
                      color="della.text"
                      _hover={{ bg: 'della.primaryHover' }}
                      onClick={() => onOpenDetails(order.id)}
                    >
                      Переглянути
                    </Button>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
