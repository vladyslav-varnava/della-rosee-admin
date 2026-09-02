'use client';

import {
  Box,
  Button,
  Center,
  Spinner,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { LuArrowLeft } from 'react-icons/lu';

import { ProductForm } from '@/components/products/form/ProductForm';
import { ProductVariantEditPageClient } from '@/components/products/variants/ProductVariantEditPageClient';
import { useGetProduct } from '@/hooks/query/useProductsAdmin';

type Props = {
  productId: number;
  variantId?: number;
};

const ProductEditFormPage = ({ productId }: Pick<Props, 'productId'>) => {
  const { data: product, isPending, isError } = useGetProduct(productId);

  if (isPending) {
    return (
      <Center py={16}>
        <VStack color="della.accent">
          <Spinner />
          <Text>Завантаження продукту...</Text>
        </VStack>
      </Center>
    );
  }

  if (isError || !product) {
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
          Не вдалося завантажити продукт
        </Text>

        <Text mt={2} color="gray.500">
          Перевірте ID продукту або спробуйте оновити сторінку.
        </Text>

        <Button asChild mt={6} variant="outline">
          <Link href="/products">
            <LuArrowLeft />
            До продуктів
          </Link>
        </Button>
      </Box>
    );
  }

  return (
    <Stack gap={5}>
      <Button asChild variant="outline" w="fit-content">
        <Link href="/products">
          <LuArrowLeft />
          До продуктів
        </Link>
      </Button>

      <ProductForm product={product} />
    </Stack>
  );
};

export const ProductEditPageClient = ({ productId, variantId }: Props) => {
  if (variantId && Number.isFinite(variantId) && variantId > 0) {
    return (
      <ProductVariantEditPageClient
        productId={productId}
        variantId={variantId}
      />
    );
  }

  return <ProductEditFormPage productId={productId} />;
};
