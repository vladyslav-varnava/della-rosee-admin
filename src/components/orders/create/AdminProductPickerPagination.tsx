'use client';

import { Button, Flex, HStack, Text } from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

type Props = {
  page: number;
  take: number;
  total: number;
  onPageChange: (page: number) => void;
};

export const AdminProductPickerPagination = ({
  page,
  take,
  total,
  onPageChange,
}: Props) => {
  const totalPages = Math.max(1, Math.ceil(total / take));
  const from = total > 0 ? (page - 1) * take + 1 : 0;
  const to = Math.min(page * take, total);

  return (
    <Flex
      justify="space-between"
      align={{ base: 'stretch', md: 'center' }}
      direction={{ base: 'column', md: 'row' }}
      gap={3}
      pt={3}
    >
      <Text color="gray.500" fontSize="sm">
        Показано {from}–{to} з {total}
      </Text>

      <HStack gap={2}>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <LuChevronLeft />
          Назад
        </Button>

        <Text minW="80px" textAlign="center" fontSize="sm" fontWeight="800">
          {page} / {totalPages}
        </Text>

        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Далі
          <LuChevronRight />
        </Button>
      </HStack>
    </Flex>
  );
};
