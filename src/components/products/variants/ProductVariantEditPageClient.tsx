'use client';

import Link from 'next/link';

import {
  Box,
  Button,
  Center,
  Spinner,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { LuArrowLeft } from 'react-icons/lu';

import {
  useGetProduct,
  useGetProductVariant,
} from '@/hooks/query/useProductsAdmin';

import { ProductVariantForm } from './ProductVariantForm';

type Props = {
  productId: number;
  variantId: number;
};

export const ProductVariantEditPageClient = ({
  productId,
  variantId,
}: Props) => {
  const {
    data: variant,
    isPending: isVariantPending,
    isError: isVariantError,
  } = useGetProductVariant(variantId);
  const resolvedProductId = variant?.productId ?? productId;
  const { data: product } = useGetProduct(resolvedProductId);

  if (isVariantPending) {
    return (
      <Center py={16}>
        <VStack color="della.accent">
          <Spinner />
          <Text>Завантаження варіанту...</Text>
        </VStack>
      </Center>
    );
  }

  if (isVariantError || !variant) {
    return (
      <Box
        bg="white"
        border="1px solid"
        borderColor="red.100"
        borderRadius="2xl"
        p={10}
        textAlign="center"
        boxShadow="sm"
      >
        <Text fontSize="xl" fontWeight="800" color="della.text">
          Варіант не знайдено
        </Text>

        <Text mt={2} color="gray.500">
          Перевірте ID продукту або ID варіанту.
        </Text>

        <Button asChild mt={6} variant="outline">
          <Link href={`/products/${resolvedProductId}/edit`}>
            <LuArrowLeft />
            До продукту
          </Link>
        </Button>
      </Box>
    );
  }

  return (
    <Stack gap={5}>
      <Button asChild variant="outline" w="fit-content">
        <Link href={`/products/${resolvedProductId}/edit`}>
          <LuArrowLeft />
          До продукту
        </Link>
      </Button>

      <ProductVariantForm
        productId={resolvedProductId}
        productTitle={product?.title ?? `Product #${resolvedProductId}`}
        variant={variant}
      />
    </Stack>
  );
};
