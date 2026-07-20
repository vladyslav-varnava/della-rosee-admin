'use client';

import { ChangeEvent, useDeferredValue, useMemo, useState } from 'react';

import {
  Box,
  Button,
  Center,
  Dialog,
  HStack,
  IconButton,
  Input,
  Portal,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { LuPlus, LuSearch, LuSearchX, LuX } from 'react-icons/lu';

import { useAdminProductPickerSearch } from '@/hooks/query/useAdminProductPickerSearch';

import { AdminProductPickerPagination } from './AdminProductPickerPagination';
import { AdminProductPickerProductCard } from './AdminProductPickerProductCard';

type AddProductPayload = {
  cardId: number;
  productId: number;
  brand: string;
};

type Props = {
  onAddVariant: (payload: AddProductPayload) => Promise<void> | void;
};

const PRODUCTS_PER_PAGE = 8;
const MIN_SEARCH_LENGTH = 2;

export const AdminProductPickerDialog = ({ onAddVariant }: Props) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [addingVariantId, setAddingVariantId] = useState<number | null>(null);

  const deferredSearch = useDeferredValue(search);
  const normalizedSearch = deferredSearch.trim();
  const shouldSearch = normalizedSearch.length >= MIN_SEARCH_LENGTH;

  const { data, isFetching, isError } = useAdminProductPickerSearch({
    search: shouldSearch ? normalizedSearch : '',
    page,
    take: PRODUCTS_PER_PAGE,
  });

  const products = useMemo(() => {
    if (!shouldSearch) return [];

    return data?.items ?? [];
  }, [data?.items, shouldSearch]);

  const total = data?.paging.total ?? 0;

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
    setPage(1);
  };

  const clearSearch = () => {
    setSearch('');
    setPage(1);
  };

  const handleAddVariant = async (payload: AddProductPayload) => {
    setAddingVariantId(payload.productId);

    try {
      await onAddVariant(payload);
    } finally {
      setAddingVariantId(null);
    }
  };

  return (
    <Dialog.Root
      lazyMount
      size="xl"
      scrollBehavior="inside"
      open={open}
      onOpenChange={({ open: nextOpen }) => setOpen(nextOpen)}
    >
      <Dialog.Trigger asChild>
        <Button type="button" mt={6} variant="outline">
          <LuPlus />
          Додати продукт до замовлення
        </Button>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />

        <Dialog.Positioner>
          <Dialog.Content
            maxW={{ base: 'calc(100% - 24px)', md: '960px' }}
            borderRadius="2xl"
            overflow="hidden"
          >
            <Dialog.Header
              borderBottom="1px solid"
              borderColor="blackAlpha.100"
            >
              <Box>
                <Dialog.Title color="della.text">
                  Додати продукт до замовлення
                </Dialog.Title>

                <Text mt={1} color="gray.500" fontSize="sm">
                  Шукайте продукт за назвою, брендом, активом або артикулом.
                  Додавання відбувається на рівні варіанту.
                </Text>
              </Box>
            </Dialog.Header>

            <Dialog.Body p={5}>
              <Stack gap={5}>
                <Box position="relative">
                  <Box
                    position="absolute"
                    left={3}
                    top="50%"
                    transform="translateY(-50%)"
                    color="gray.400"
                    zIndex={1}
                    pointerEvents="none"
                  >
                    <LuSearch size={18} />
                  </Box>

                  <Input
                    value={search}
                    h="46px"
                    pl={10}
                    pr={12}
                    borderRadius="xl"
                    placeholder="Наприклад: SPF, ретинол, Azelogy, код..."
                    onChange={handleSearchChange}
                  />

                  {search && (
                    <IconButton
                      aria-label="Очистити пошук"
                      size="xs"
                      variant="ghost"
                      position="absolute"
                      right={2}
                      top="50%"
                      transform="translateY(-50%)"
                      onClick={clearSearch}
                    >
                      <LuX />
                    </IconButton>
                  )}

                  {isFetching && shouldSearch && (
                    <Center
                      position="absolute"
                      right={10}
                      top="50%"
                      transform="translateY(-50%)"
                    >
                      <Spinner size="sm" />
                    </Center>
                  )}
                </Box>

                {!shouldSearch && (
                  <Center
                    py={10}
                    px={4}
                    border="1px dashed"
                    borderColor="blackAlpha.200"
                    borderRadius="xl"
                    bg="gray.50"
                    textAlign="center"
                  >
                    <Stack align="center" gap={2}>
                      <LuSearch size={28} />
                      <Text fontWeight="900" color="della.text">
                        Почніть пошук
                      </Text>
                      <Text color="gray.500" fontSize="sm">
                        Введіть мінімум {MIN_SEARCH_LENGTH} символи.
                      </Text>
                    </Stack>
                  </Center>
                )}

                {isError && (
                  <Center
                    py={10}
                    px={4}
                    borderRadius="xl"
                    bg="red.50"
                    textAlign="center"
                  >
                    <Text color="red.600" fontWeight="800">
                      Не вдалося виконати пошук
                    </Text>
                  </Center>
                )}

                {shouldSearch &&
                  !isFetching &&
                  !isError &&
                  products.length === 0 && (
                    <Center
                      py={10}
                      px={4}
                      borderRadius="xl"
                      bg="gray.50"
                      textAlign="center"
                    >
                      <Stack align="center" gap={2}>
                        <LuSearchX size={28} />
                        <Text fontWeight="900" color="della.text">
                          Нічого не знайдено
                        </Text>
                        <Text color="gray.500" fontSize="sm">
                          Спробуйте іншу назву або код товару.
                        </Text>
                      </Stack>
                    </Center>
                  )}

                {products.length > 0 && (
                  <Stack gap={3}>
                    <HStack justify="space-between">
                      <Text fontWeight="900" color="della.text">
                        Результати
                      </Text>

                      <Text color="gray.500" fontSize="sm">
                        Знайдено: {total}
                      </Text>
                    </HStack>

                    <Stack gap={3}>
                      {products.map((product) => (
                        <AdminProductPickerProductCard
                          key={product.id}
                          product={product}
                          addingVariantId={addingVariantId}
                          onAddVariant={handleAddVariant}
                        />
                      ))}
                    </Stack>

                    <AdminProductPickerPagination
                      page={page}
                      take={PRODUCTS_PER_PAGE}
                      total={total}
                      onPageChange={setPage}
                    />
                  </Stack>
                )}
              </Stack>
            </Dialog.Body>

            <Dialog.CloseTrigger asChild>
              <IconButton
                aria-label="Закрити"
                position="absolute"
                top={4}
                right={4}
                size="sm"
                variant="ghost"
              >
                <LuX />
              </IconButton>
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
