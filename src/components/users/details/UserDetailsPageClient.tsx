'use client';

import { Box, Center, Spinner, Stack, Text, VStack } from '@chakra-ui/react';

import { useGetUserById } from '@/hooks/query/useUsers';

import { UserCreateOrderFlow } from './UserCreateOrderFlow';
import { UserDetailsHeader } from './UserDetailsHeader';
import { UserEditFormToggle } from './UserEditFormToggle';
import { UserOrdersCard } from './UserOrdersCard';
import { UserSummaryCards } from './UserSummaryCards';

type Props = {
  userId: number;
};

export const UserDetailsPageClient = ({ userId }: Props) => {
  const { data: user, isPending, isError } = useGetUserById(userId);

  if (isPending) {
    return (
      <Center py={16}>
        <VStack color="della.accent">
          <Spinner />
          <Text>Завантаження користувача...</Text>
        </VStack>
      </Center>
    );
  }

  if (isError || !user) {
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
          Користувача не знайдено
        </Text>

        <Text mt={2} color="gray.500">
          Перевірте ID користувача або спробуйте оновити сторінку.
        </Text>
      </Box>
    );
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const orders = user.orders ?? user.Order ?? [];

  return (
    <Stack gap={5}>
      <UserDetailsHeader user={user} />

      <UserSummaryCards user={user} />

      <UserEditFormToggle user={user} />

      <UserCreateOrderFlow user={user} />

      <UserOrdersCard orders={orders} />
    </Stack>
  );
};
