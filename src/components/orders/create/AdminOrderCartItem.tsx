'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Box, Card, Flex, HStack, Image, Text, VStack } from '@chakra-ui/react';

import { AdminQuantityStepperInput } from '@/components/orders/create/AdminQuantityStepperInput';
import { useUpdateCartItem } from '@/hooks/mutations/cart/useUpdateCartItem';
import { CartItem } from '@/types/cart';

type Props = {
  item: CartItem;
  cartId: string;
  userId: number;
  shouldNotCheckInStock?: boolean;
};

const UPDATE_DELAY = 700;

const formatMoney = (value?: number) => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
  }).format(value ?? 0);
};

const getCartItemId = (item: CartItem) => {
  return item.id;
};

export const AdminOrderCartItem = ({
  item,
  cartId,
  userId,
  shouldNotCheckInStock = false,
}: Props) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [draftQuantity, setDraftQuantity] = useState<number | null>(null);

  const updateCartItem = useUpdateCartItem({ cartId, userId });

  const cartItemId = getCartItemId(item);
  const currentQuantity = draftQuantity ?? item.quantity;

  const maxQuantity = shouldNotCheckInStock
    ? 99
    : Math.max(1, Math.min(item.quantityInStock ?? 99, 99));

  useEffect(() => {
    if (draftQuantity === null) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      updateCartItem.mutate(
        {
          cartItemId,
          quantity: draftQuantity,
          productId: item.productId,
          cardId: item.cardId,
          cartId,
          shouldNotCheckInStock,
        },
        {
          onSuccess: () => {
            setDraftQuantity(null);
          },
          onError: () => {
            setDraftQuantity(null);
          },
        },
      );
    }, UPDATE_DELAY);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    cartId,
    cartItemId,
    draftQuantity,
    item.cardId,
    item.productId,
    shouldNotCheckInStock,
    updateCartItem,
  ]);

  const onValueChange = useCallback(
    (event: { value: string; valueAsNumber: number }) => {
      const nextQuantity = event.valueAsNumber;

      if (!Number.isFinite(nextQuantity)) return;
      if (nextQuantity < 1) return;
      if (nextQuantity > maxQuantity) return;

      setDraftQuantity(nextQuantity === item.quantity ? null : nextQuantity);
    },
    [item.quantity, maxQuantity],
  );

  const hasDiscount = item.basePrice > item.price;
  const totalPrice = item.price * currentQuantity;
  const totalBasePrice = item.basePrice * currentQuantity;

  return (
    <Card.Root
      width="100%"
      border="1px solid"
      borderColor="blackAlpha.100"
      borderRadius="xl"
      bg="white"
      overflow="hidden"
      boxShadow="sm"
    >
      <Card.Body p={3}>
        <Flex gap={3} align="flex-start">
          <Box
            width={{ base: '76px', md: '86px' }}
            height={{ base: '86px', md: '94px' }}
            borderRadius="lg"
            bg="gray.50"
            overflow="hidden"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            {item.image ? (
              <Image
                width="100%"
                height="100%"
                src={item.image}
                alt={item.title}
                objectFit="contain"
              />
            ) : null}
          </Box>

          <VStack flex="1" minW={0} align="stretch" gap={3}>
            <Box minW={0}>
              <Text
                color="della.text"
                fontSize={{ base: '13px', md: '14px' }}
                fontWeight={900}
                lineHeight="1.3"
                lineClamp={2}
              >
                {item.title}
              </Text>

              <Text mt={1} fontSize="12px" color="gray.500" fontWeight={700}>
                Артикул: {item.code || '—'}
              </Text>

              {item.volume ? (
                <Text mt={0.5} fontSize="12px" color="gray.500">
                  {item.volume}
                </Text>
              ) : null}
            </Box>

            <HStack width="100%" justify="space-between" align="center" gap={3}>
              <Box
                borderRadius="full"
                bg="gray.50"
                px={1}
                py={1}
                flexShrink={0}
                opacity={updateCartItem.isPending ? 0.65 : 1}
              >
                <AdminQuantityStepperInput
                  min={1}
                  max={maxQuantity}
                  value={currentQuantity.toString()}
                  disabled={updateCartItem.isPending}
                  onValueChange={onValueChange}
                />
              </Box>

              <Box textAlign="right">
                {hasDiscount && (
                  <Text
                    fontSize="xs"
                    color="gray.400"
                    textDecoration="line-through"
                    fontWeight={700}
                  >
                    {formatMoney(totalBasePrice)}
                  </Text>
                )}

                <Text fontSize="md" color="della.text" fontWeight={900}>
                  {formatMoney(totalPrice)}
                </Text>

                <Text fontSize="xs" color="gray.500">
                  {formatMoney(item.price)} / шт.
                </Text>
              </Box>
            </HStack>

            {!shouldNotCheckInStock && item.quantityInStock !== undefined && (
              <Text fontSize="xs" color="gray.500">
                Доступно на складі: {item.quantityInStock}
              </Text>
            )}
          </VStack>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};
