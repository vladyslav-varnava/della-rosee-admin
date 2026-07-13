'use client';

import { useState } from 'react';

import { Button, HStack, Stack, Text } from '@chakra-ui/react';
import { LuPencil } from 'react-icons/lu';

import { Order } from '@/types/order';

import { OrderEditForm } from './OrderEditForm';
import { SectionCard } from './SectionCard';

type Props = {
  order: Order;
};

export const OrderEditFormToggle = ({ order }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) {
    return (
      <OrderEditForm
        order={order}
        onCancel={() => setIsOpen(false)}
        onSaved={() => setIsOpen(false)}
      />
    );
  }

  return (
    <SectionCard title="Редагування замовлення">
      <Stack gap={4}>
        <Text color="gray.500">
          Тут можна змінити контактні дані, оплату, доставку, суму та продавця.
        </Text>

        <HStack>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(true)}
          >
            <LuPencil />
            Редагувати замовлення
          </Button>
        </HStack>
      </Stack>
    </SectionCard>
  );
};
