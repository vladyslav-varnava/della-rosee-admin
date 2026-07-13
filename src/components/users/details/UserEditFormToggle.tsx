'use client';

import { useState } from 'react';

import { Button, Stack, Text } from '@chakra-ui/react';
import { LuPencil } from 'react-icons/lu';

import { User } from '@/types/user';

import { UserEditForm } from './UserEditForm';
import { UserSectionCard } from './UserSectionCard';

type Props = {
  user: User;
};

export const UserEditFormToggle = ({ user }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) {
    return (
      <UserEditForm
        user={user}
        onCancel={() => setIsOpen(false)}
        onSaved={() => setIsOpen(false)}
      />
    );
  }

  return (
    <UserSectionCard title="Редагування">
      <Stack gap={4}>
        <Text color="gray.500">
          Тут можна змінити контактні дані, рівень лояльності та суму витрат за
          рік.
        </Text>

        <Button
          type="button"
          variant="outline"
          w="fit-content"
          onClick={() => setIsOpen(true)}
        >
          <LuPencil />
          Редагувати користувача
        </Button>
      </Stack>
    </UserSectionCard>
  );
};
