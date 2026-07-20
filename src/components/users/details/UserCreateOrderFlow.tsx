'use client';

import { useState } from 'react';

import { Button, HStack, Stack, Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { LuPlus, LuX } from 'react-icons/lu';

import { UserSectionCard } from '@/components/users/details/UserSectionCard';
import { useCreateCart } from '@/hooks/mutations/cart/useCreateCart';
import { cartKeys } from '@/hooks/query/useCart';
import { User } from '@/types/user';

import { AdminCreateUserOrderForm } from '@/components/orders/create/AdminCreateUserOrderForm';

type Props = {
  user: User;
};

const getStorageKey = (userId: number) => {
  return `adminCartId:${userId}`;
};

export const UserCreateOrderFlow = ({ user }: Props) => {
  const queryClient = useQueryClient();
  const createCart = useCreateCart();

  const [cartId, setCartId] = useState(() => {
    if (typeof window === 'undefined') return '';

    return sessionStorage.getItem(getStorageKey(user.id)) ?? '';
  });

  const startOrderCreation = async () => {
    const cart = await createCart.mutateAsync();
    const nextCartId = String(cart.id);

    sessionStorage.setItem(getStorageKey(user.id), nextCartId);
    setCartId(nextCartId);
  };

  const cancelOrderCreation = () => {
    if (cartId) {
      queryClient.removeQueries({
        queryKey: cartKeys.details(cartId, user.id),
      });
    }

    sessionStorage.removeItem(getStorageKey(user.id));
    setCartId('');
  };

  if (cartId) {
    return (
      <Stack gap={4}>
        <HStack justify="space-between" align="center">
          <Text fontWeight="900" color="della.text">
            Створення замовлення активне
          </Text>

          <Button
            type="button"
            size="sm"
            variant="outline"
            colorPalette="red"
            onClick={cancelOrderCreation}
          >
            <LuX />
            Скасувати
          </Button>
        </HStack>

        <AdminCreateUserOrderForm
          cartId={cartId}
          user={user}
          onOrderCreated={cancelOrderCreation}
        />
      </Stack>
    );
  }

  return (
    <UserSectionCard title="Створення замовлення">
      <Stack gap={4}>
        <Text color="gray.500">
          Можна створити замовлення від імені користувача. Спочатку буде
          створено окремий адмінський кошик.
        </Text>

        <Button
          type="button"
          variant="outline"
          w="fit-content"
          loading={createCart.isPending}
          onClick={startOrderCreation}
        >
          <LuPlus />
          Почати створення замовлення
        </Button>
      </Stack>
    </UserSectionCard>
  );
};
