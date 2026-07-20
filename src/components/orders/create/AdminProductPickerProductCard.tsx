'use client';

import { Badge, Box, Flex, HStack, Image, Stack, Text } from '@chakra-ui/react';

import { Product } from '@/types/product';

import { AdminProductPickerVariantRow } from './AdminProductPickerVariantRow';

type AddProductPayload = {
  cardId: number;
  productId: number;
  brand: string;
};

type Props = {
  product: Product;
  addingVariantId: number | null;
  onAddVariant: (payload: AddProductPayload) => Promise<void> | void;
};

export const AdminProductPickerProductCard = ({
  product,
  addingVariantId,
  onAddVariant,
}: Props) => {
  const variants = product.items ?? [];
  const image = variants[0]?.image;

  return (
    <Box
      border="1px solid"
      borderColor="blackAlpha.100"
      borderRadius="xl"
      p={4}
      bg="gray.50"
    >
      <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
        <Box
          w={{ base: '100%', md: '92px' }}
          h="92px"
          bg="white"
          border="1px solid"
          borderColor="blackAlpha.100"
          borderRadius="lg"
          overflow="hidden"
          flexShrink={0}
        >
          {image ? (
            <Image
              src={image}
              alt={product.title}
              w="100%"
              h="100%"
              objectFit="contain"
            />
          ) : null}
        </Box>

        <Box flex={1} minW={0}>
          <HStack gap={2} wrap="wrap">
            <Text fontWeight="900" color="della.text">
              {product.title}
            </Text>

            <Badge colorPalette="purple" borderRadius="full">
              {product.brand || 'Без бренду'}
            </Badge>

            {product.isVisible ? (
              <Badge colorPalette="green" borderRadius="full">
                Видимий
              </Badge>
            ) : (
              <Badge colorPalette="gray" borderRadius="full">
                Прихований
              </Badge>
            )}
          </HStack>

          <Text mt={1} color="gray.500" fontSize="sm">
            Product ID: {product.id} · Варіантів: {variants.length}
          </Text>

          <Stack gap={2} mt={4}>
            {variants.length > 0 ? (
              variants.map((variant) => (
                <AdminProductPickerVariantRow
                  key={variant.id}
                  variant={variant}
                  productTitle={product.title}
                  brand={product.brand}
                  isAdding={addingVariantId === variant.id}
                  onAddVariant={onAddVariant}
                />
              ))
            ) : (
              <Box
                border="1px dashed"
                borderColor="blackAlpha.200"
                borderRadius="lg"
                p={4}
                bg="white"
              >
                <Text color="gray.500" fontSize="sm">
                  У продукту немає варіантів
                </Text>
              </Box>
            )}
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
};
