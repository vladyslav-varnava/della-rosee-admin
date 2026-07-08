'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { Box, Center, Spinner, Stack, Text, VStack } from '@chakra-ui/react';

import { AdminPagination } from '@/components/admin/AdminPagination';
import { ProductsFilters } from '@/components/products/ProductsFilters';
import { ProductsTable } from '@/components/products/ProductsTable';
import { useProductsAdmin } from '@/hooks/query/useProductsAdmin';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { Product } from '@/types/product';

const PRODUCTS_PAGE_SIZE = 20;

const getProductUrl = (slug: string) => {
  const storeUrl =
    process.env.NEXT_PUBLIC_STORE_URL ??
    process.env.NEXT_PUBLIC_URL ??
    'https://dellarosee.com';

  return `${storeUrl}/product/${slug}`;
};

export default function ProductsPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [copiedProductId, setCopiedProductId] = useState<number | null>(null);

  const debouncedSearch = useDebouncedValue(searchInput.trim(), 400);
  const skip = (page - 1) * PRODUCTS_PAGE_SIZE;

  const queryParams = useMemo(
    () => ({
      take: PRODUCTS_PAGE_SIZE,
      skip,
      search: debouncedSearch || undefined,
    }),
    [skip, debouncedSearch],
  );

  const { data, isPending, isFetching } = useProductsAdmin(queryParams);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [page]);

  const clearSearch = () => {
    setSearchInput('');
    setPage(1);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const copyProductLink = async (product: Product) => {
    await navigator.clipboard.writeText(getProductUrl(product.slug));

    setCopiedProductId(product.id);

    window.setTimeout(() => {
      setCopiedProductId(null);
    }, 1200);
  };

  const products = data?.items ?? [];
  const total = data?.paging.total ?? 0;
  const hasProducts = products.length > 0;

  return (
    <Stack gap={5}>
      <ProductsFilters
        search={searchInput}
        inputRef={inputRef}
        onSearchChange={setSearchInput}
        onClearSearch={clearSearch}
      />

      {isFetching && !isPending && (
        <Center py={1}>
          <Spinner size="sm" color="della.primary" />
        </Center>
      )}

      {isPending ? (
        <Center py={16}>
          <VStack color="della.accent">
            <Spinner />
            <Text>Завантаження продуктів...</Text>
          </VStack>
        </Center>
      ) : !hasProducts ? (
        <Box
          bg="white"
          border="1px solid"
          borderColor="blackAlpha.100"
          borderRadius="2xl"
          p={10}
          textAlign="center"
          boxShadow="sm"
        >
          <Text fontSize="xl" fontWeight="800" color="della.text">
            Продуктів не знайдено
          </Text>

          <Text mt={2} color="gray.500">
            Змініть пошук або очистіть поле.
          </Text>
        </Box>
      ) : (
        <>
          <ProductsTable
            data={products}
            copiedProductId={copiedProductId}
            onCopyLink={copyProductLink}
          />

          <AdminPagination
            page={page}
            pageSize={PRODUCTS_PAGE_SIZE}
            total={total}
            onPageChange={setPage}
          />
        </>
      )}
    </Stack>
  );
}
