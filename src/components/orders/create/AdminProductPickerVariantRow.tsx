'use client';

import { Badge, Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import { LuPlus } from 'react-icons/lu';

import { ProductVariant } from '@/types/product';

type AddProductPayload = {
  cardId: number;
  productId: number;
  brand: string;
};

type Props = {
  variant: ProductVariant;
  productTitle: string;
  brand: string;
  isAdding: boolean;
  onAddVariant: (payload: AddProductPayload) => Promise<void> | void;
};

const formatMoney = (value?: number) => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
  }).format(value ?? 0);
};

export const AdminProductPickerVariantRow = ({
  variant,
  productTitle,
  brand,
  isAdding,
  onAddVariant,
}: Props) => {
  const title = `${productTitle} · ${variant.value} ${variant.unit}`;

  const canAdd = Boolean(variant.cardId);

  return (
    <Flex
      justify="space-between"
      align={{ base: 'start', md: 'center' }}
      direction={{ base: 'column', md: 'row' }}
      gap={3}
      p={3}
      border="1px solid"
      borderColor="blackAlpha.100"
      borderRadius="lg"
      bg="white"
    >
      <Box flex={1}>
        <HStack gap={2} wrap="wrap">
          <Text fontWeight="800" color="della.text">
            {variant.value} {variant.unit}
          </Text>

          <Badge
            colorPalette={variant.isVisible ? 'green' : 'gray'}
            borderRadius="full"
          >
            {variant.isVisible ? 'Активний' : 'Неактивний'}
          </Badge>

          {variant.quantity > 0 ? (
            <Badge colorPalette="blue" borderRadius="full">
              В наявності: {variant.quantity}
            </Badge>
          ) : (
            <Badge colorPalette="red" borderRadius="full">
              Немає в наявності
            </Badge>
          )}
        </HStack>

        <Text mt={1} color="gray.500" fontSize="sm">
          Артикул: {variant.code || '—'} · cardId: {variant.cardId || '—'}
        </Text>

        <Text mt={1} fontWeight="900" color="della.text">
          {formatMoney(variant.price)}
        </Text>
      </Box>

      <Button
        type="button"
        size="sm"
        loading={isAdding}
        disabled={!canAdd}
        bg="della.primary"
        color="della.text"
        _hover={{ bg: 'della.primaryHover' }}
        onClick={() =>
          onAddVariant({
            cardId: variant.cardId,
            /**
             * Важливо:
             * старий flow передавав сюди variant.id.
             * Backend поле називається productId, але фактично використовується id варіанту/item.
             */
            productId: variant.id,
            brand,
          })
        }
      >
        <LuPlus />
        Додати
      </Button>

      {!canAdd && (
        <Text fontSize="xs" color="red.500">
          Немає cardId
        </Text>
      )}
    </Flex>
  );
};
