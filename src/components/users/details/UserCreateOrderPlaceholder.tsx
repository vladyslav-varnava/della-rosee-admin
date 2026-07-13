import { Button, Stack, Text } from '@chakra-ui/react';
import { LuPlus } from 'react-icons/lu';

import { UserSectionCard } from './UserSectionCard';

export const UserCreateOrderPlaceholder = () => {
  return (
    <UserSectionCard title="Створення замовлення">
      <Stack gap={4}>
        <Text color="gray.500">
          Створення замовлення для користувача перенесемо окремим кроком.
        </Text>

        <Button type="button" variant="outline" w="fit-content" disabled>
          <LuPlus />
          Створити замовлення
        </Button>
      </Stack>
    </UserSectionCard>
  );
};
