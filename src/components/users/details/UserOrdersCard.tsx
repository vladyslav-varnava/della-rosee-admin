'use client';

import Link from 'next/link';

import {
  Badge,
  Box,
  Button,
  Flex,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { LuExternalLink, LuShoppingBag } from 'react-icons/lu';

import {
  getOrderStatusColor,
  Order,
  translateOrderStatus,
} from '@/types/order';

import { UserSectionCard } from './UserSectionCard';

type Props = {
  orders: Order[];
};

const formatMoney = (value?: number) => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
  }).format(value ?? 0);
};

const formatDate = (value?: string) => {
  if (!value) return '—';

  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
};

export const UserOrdersCard = ({ orders }: Props) => {
  return (
    <UserSectionCard
      title={`Замовлення користувача (${orders.length})`}
      icon={<LuShoppingBag />}
    >
      {orders.length === 0 ? (
        <Box
          border="1px dashed"
          borderColor="blackAlpha.200"
          borderRadius="xl"
          p={8}
          bg="gray.50"
          textAlign="center"
        >
          <Text color="gray.500">У користувача ще немає замовлень</Text>
        </Box>
      ) : (
        <Stack gap={3}>
          {orders.map((order) => (
            <Box
              key={order.id}
              border="1px solid"
              borderColor="blackAlpha.100"
              borderRadius="xl"
              p={4}
              bg="gray.50"
            >
              <Flex
                justify="space-between"
                align={{ base: 'start', md: 'center' }}
                direction={{ base: 'column', md: 'row' }}
                gap={4}
              >
                <Box>
                  <Flex align="center" gap={3} wrap="wrap">
                    <Text fontWeight="900" color="della.text">
                      Замовлення #{order.id}
                    </Text>

                    <Badge
                      colorPalette={getOrderStatusColor(order.status)}
                      borderRadius="full"
                      px={3}
                      py={1}
                    >
                      {translateOrderStatus(order.status)}
                    </Badge>
                  </Flex>

                  <Text mt={1} color="gray.500" fontSize="sm">
                    {formatDate(order.createdAt)}
                  </Text>
                </Box>

                <Button asChild size="sm" variant="outline">
                  <Link href={`/orders/${order.id}`}>
                    <LuExternalLink />
                    Деталі
                  </Link>
                </Button>
              </Flex>

              <SimpleGrid columns={{ base: 2, md: 4 }} gap={3} mt={4}>
                <Box>
                  <Text fontSize="xs" color="gray.500">
                    До оплати
                  </Text>
                  <Text fontWeight="800">{formatMoney(order.amount)}</Text>
                </Box>

                <Box>
                  <Text fontSize="xs" color="gray.500">
                    Повна сума
                  </Text>
                  <Text fontWeight="800">{formatMoney(order.fulAmount)}</Text>
                </Box>

                <Box>
                  <Text fontSize="xs" color="gray.500">
                    Товарів
                  </Text>
                  <Text fontWeight="800">{order.orderItems?.length ?? 0}</Text>
                </Box>

                <Box>
                  <Text fontSize="xs" color="gray.500">
                    Створено
                  </Text>
                  <Text fontWeight="800">
                    {order.isFormedByAdmin ? 'Адміном' : 'Клієнтом'}
                  </Text>
                </Box>
              </SimpleGrid>
            </Box>
          ))}
        </Stack>
      )}
    </UserSectionCard>
  );
};
