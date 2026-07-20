'use client';

import { Box, Flex, HStack, Spinner, Stack, Text } from '@chakra-ui/react';

import { AdminOrderCartItem } from '@/components/orders/create/AdminOrderCartItem';
import { Cart } from '@/types/cart';

type Props = {
  cart?: Cart;
  cartId: string;
  userId: number;
  isLoading?: boolean;
  shouldNotCheckInStock?: boolean;
};

const formatMoney = (value?: number) => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
  }).format(value ?? 0);
};

export const AdminOrderCartPreview = ({
  cart,
  cartId,
  userId,
  isLoading,
  shouldNotCheckInStock = false,
}: Props) => {
  const items = cart?.items ?? [];

  return (
    <Box
      position="relative"
      border="1px solid"
      borderColor="blackAlpha.100"
      borderRadius="xl"
      p={4}
      bg="gray.50"
    >
      {isLoading && (
        <Flex
          position="absolute"
          inset={0}
          zIndex={2}
          align="center"
          justify="center"
          bg="rgba(255,255,255,0.72)"
          borderRadius="xl"
        >
          <HStack>
            <Spinner size="sm" />
            <Text fontSize="sm" fontWeight="700">
              Оновлюємо кошик...
            </Text>
          </HStack>
        </Flex>
      )}

      <Stack gap={4}>
        <Text fontWeight="900" color="della.text">
          Кошик замовлення
        </Text>

        {items.length === 0 ? (
          <Box
            border="1px dashed"
            borderColor="blackAlpha.200"
            borderRadius="lg"
            p={8}
            bg="white"
            textAlign="center"
          >
            <Text color="gray.500">Додайте продукти через пошук вище.</Text>
          </Box>
        ) : (
          <Stack gap={3}>
            {items.map((item) => (
              <AdminOrderCartItem
                key={item.id}
                item={item}
                cartId={cartId}
                userId={userId}
                shouldNotCheckInStock={shouldNotCheckInStock}
              />
            ))}
          </Stack>
        )}

        <Box bg="white" borderRadius="lg" p={4}>
          <Flex justify="space-between" gap={4}>
            <Text color="gray.500">Повна сума</Text>
            <Text fontWeight="900">{formatMoney(cart?.fullSum)}</Text>
          </Flex>

          <Flex justify="space-between" gap={4} mt={2}>
            <Text color="gray.500">Знижка</Text>
            <Text fontWeight="900" color="green.600">
              -{formatMoney(cart?.discountTotal)}
            </Text>
          </Flex>

          <Flex justify="space-between" gap={4} mt={2}>
            <Text color="gray.500">До оплати</Text>
            <Text fontWeight="900" fontSize="xl" color="della.text">
              {formatMoney(cart?.sum)}
            </Text>
          </Flex>
        </Box>
      </Stack>
    </Box>
  );
};
