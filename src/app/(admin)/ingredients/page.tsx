'use client';

import { useMemo, useRef, useState } from 'react';

import { Box, Center, Spinner, Stack, Text, VStack } from '@chakra-ui/react';

import { AdminPagination } from '@/components/admin/AdminPagination';
import { IngredientsFilters } from '@/components/ingredients/IngredientsFilters';
import { IngredientsTable } from '@/components/ingredients/IngredientsTable';
import {
  useCreateIngredient,
  useDeleteIngredient,
  useUpdateIngredient,
} from '@/hooks/mutations/ingredient/useIngredientMutations';
import { useGetIngredients } from '@/hooks/query/useGetIngredients';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { Ingredient, IngredientPayload } from '@/types/product';

const INGREDIENTS_PAGE_SIZE = 20;

const matchesIngredient = (ingredient: Ingredient, search: string) => {
  const normalizedSearch = search.toLowerCase();

  return [
    ingredient.id,
    ingredient.label,
    ingredient.value,
  ].some((value) => String(value).toLowerCase().includes(normalizedSearch));
};

export default function IngredientsPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');

  const debouncedSearch = useDebouncedValue(searchInput.trim(), 400);
  const { data = [], isPending, isFetching } = useGetIngredients();

  const createIngredient = useCreateIngredient();
  const updateIngredient = useUpdateIngredient();
  const deleteIngredient = useDeleteIngredient();

  const filteredIngredients = useMemo(() => {
    if (!debouncedSearch) {
      return data;
    }

    return data.filter((ingredient) =>
      matchesIngredient(ingredient, debouncedSearch),
    );
  }, [data, debouncedSearch]);

  const total = filteredIngredients.length;
  const totalPages = Math.max(1, Math.ceil(total / INGREDIENTS_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const skip = (safePage - 1) * INGREDIENTS_PAGE_SIZE;
  const ingredients = filteredIngredients.slice(
    skip,
    skip + INGREDIENTS_PAGE_SIZE,
  );
  const hasIngredients = ingredients.length > 0;

  const changeSearch = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchInput('');
    setPage(1);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const createIngredientItem = async (payload: IngredientPayload) => {
    await createIngredient.mutateAsync(payload);
  };

  const updateIngredientItem = async (
    id: number,
    payload: IngredientPayload,
  ) => {
    await updateIngredient.mutateAsync({ id, payload });
  };

  const deleteIngredientItem = (id: number) => {
    const shouldDelete = window.confirm(
      'Видалити інгредієнт? Це може вплинути на продукти, які його використовують.',
    );

    if (shouldDelete) {
      deleteIngredient.mutate(id);
    }
  };

  return (
    <Stack gap={5}>
      <IngredientsFilters
        search={searchInput}
        inputRef={inputRef}
        isCreating={createIngredient.isPending}
        onSearchChange={changeSearch}
        onClearSearch={clearSearch}
        onCreate={createIngredientItem}
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
            <Text>Завантаження інгредієнтів...</Text>
          </VStack>
        </Center>
      ) : !hasIngredients ? (
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
            Інгредієнтів не знайдено
          </Text>

          <Text mt={2} color="gray.500">
            Змініть пошук або додайте перший інгредієнт.
          </Text>
        </Box>
      ) : (
        <>
          <IngredientsTable
            data={ingredients}
            deletingIngredientId={deleteIngredient.variables}
            updatingIngredientId={updateIngredient.variables?.id}
            onDelete={deleteIngredientItem}
            onUpdate={updateIngredientItem}
          />

          <AdminPagination
            page={safePage}
            pageSize={INGREDIENTS_PAGE_SIZE}
            total={total}
            onPageChange={setPage}
          />
        </>
      )}
    </Stack>
  );
}
