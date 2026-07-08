'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { Box, Center, Spinner, Stack, Text, VStack } from '@chakra-ui/react';
import { LuSearch } from 'react-icons/lu';

import { AdminPagination } from '@/components/admin/AdminPagination';
import { UsersFilters } from '@/components/users/UsersFilters';
import { UsersTable } from '@/components/users/UsersTable';
import { useGetUsers } from '@/hooks/query/useGetUsers';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { USER_SEARCH_TYPES, UserSearchType } from '@/types/user';

const USERS_PAGE_SIZE = 20;

const getSearchParams = (searchType: UserSearchType, searchValue: string) => {
  const value = searchValue.trim();

  if (!value) {
    return {};
  }

  return {
    [searchType]: value,
  };
};

export default function UsersPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [page, setPage] = useState(1);
  const [searchType, setSearchType] = useState<UserSearchType>(
    USER_SEARCH_TYPES.PHONE,
  );
  const [searchValue, setSearchValue] = useState('');

  const debouncedSearchValue = useDebouncedValue(searchValue, 400);

  const queryParams = useMemo(
    () => ({
      page,
      limit: USERS_PAGE_SIZE,
      ...getSearchParams(searchType, debouncedSearchValue),
    }),
    [page, searchType, debouncedSearchValue],
  );

  const { data, isPending, isFetching, isError } = useGetUsers(queryParams);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [page]);

  const handleSearchValueChange = (value: string) => {
    setSearchValue(value);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchValue('');
    setPage(1);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const changeSearchType = (value: UserSearchType) => {
    setSearchType(value);
    setSearchValue('');
    setPage(1);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const users = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const hasUsers = users.length > 0;

  return (
    <Stack gap={5}>
      <UsersFilters
        searchType={searchType}
        searchValue={searchValue}
        inputRef={inputRef}
        onSearchTypeChange={changeSearchType}
        onSearchValueChange={handleSearchValueChange}
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
            <Text>Завантаження користувачів...</Text>
          </VStack>
        </Center>
      ) : isError ? (
        <Box
          bg="white"
          border="1px solid"
          borderColor="red.100"
          borderRadius="2xl"
          p={10}
          textAlign="center"
          boxShadow="sm"
        >
          <Center mb={3} color="red.500" fontSize="3xl">
            <LuSearch />
          </Center>

          <Text fontSize="xl" fontWeight="800" color="della.text">
            Не вдалося завантажити користувачів
          </Text>

          <Text mt={2} color="gray.500">
            Перевірте API або спробуйте оновити сторінку.
          </Text>
        </Box>
      ) : !hasUsers ? (
        <Box
          bg="white"
          border="1px solid"
          borderColor="blackAlpha.100"
          borderRadius="2xl"
          p={10}
          textAlign="center"
          boxShadow="sm"
        >
          <Center mb={3} color="gray.400" fontSize="3xl">
            <LuSearch />
          </Center>

          <Text fontSize="xl" fontWeight="800" color="della.text">
            Користувачів не знайдено
          </Text>

          <Text mt={2} color="gray.500">
            Змініть параметри пошуку або очистіть поле.
          </Text>
        </Box>
      ) : (
        <>
          <UsersTable data={users} />

          <AdminPagination
            page={page}
            pageSize={USERS_PAGE_SIZE}
            total={total}
            onPageChange={setPage}
          />
        </>
      )}
    </Stack>
  );
}
