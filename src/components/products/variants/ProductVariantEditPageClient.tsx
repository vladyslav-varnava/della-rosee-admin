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

import { useGetProduct } from '@/hooks/query/useProductsAdmin';

import { ProductVariantForm } from './ProductVariantForm';

type Props = {
  productId: number;
  variantId: number;
};

export const ProductVariantEditPageClient = ({
  productId,
  variantId,
}: Props) => {
  const { data: product, isPending, isError } = useGetProduct(productId);

  const variant = product?.items?.find((item) => item.id === variantId);

  if (isPending) {
    return (
      <Center py={16}>
        <VStack color="della.accent">
          <Spinner />
          <Text>Завантаження варіанту...</Text>
        </VStack>
      </Center>
    );
  }

  if (isError || !product || !variant) {
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
          <Link href={`/products/${productId}/edit`}>
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
        <Link href={`/products/${productId}/edit`}>
          <LuArrowLeft />
          До продукту
        </Link>
      </Button>

      <ProductVariantForm
        productId={product.id}
        productTitle={product.title}
        variant={variant}
      />
    </Stack>
  );
};
