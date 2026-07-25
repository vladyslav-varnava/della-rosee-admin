'use client';

import Link from 'next/link';

import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { LuArrowLeft } from 'react-icons/lu';

export type SellerStatsFiltersValue = {
  from: string;
  to: string;
};

type Props = {
  value: SellerStatsFiltersValue;
  onChange: (value: SellerStatsFiltersValue) => void;
};

const getDateInputValue = (date: Date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  return localDate.toISOString().slice(0, 10);
};

const addDays = (date: Date, days: number) => {
  const nextDate = new Date(date);

  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
};

export const getDefaultSellerStatsFilters = (): SellerStatsFiltersValue => {
  const today = new Date();

  return {
    from: getDateInputValue(addDays(today, -30)),
    to: getDateInputValue(today),
  };
};

export const SellerStatsFilters = ({ value, onChange }: Props) => {
  const updateValue = (nextValue: Partial<SellerStatsFiltersValue>) => {
    onChange({
      ...value,
      ...nextValue,
    });
  };

  const setQuickRange = (days: number) => {
    const today = new Date();

    updateValue({
      from: getDateInputValue(addDays(today, -days)),
      to: getDateInputValue(today),
    });
  };

  return (
    <Box
      w="100%"
      bg="white"
      border="1px solid"
      borderColor="blackAlpha.100"
      borderRadius="2xl"
      p={{ base: 4, md: 5 }}
      boxShadow="sm"
    >
      <Stack gap={4}>
        <Flex
          align={{ base: 'stretch', md: 'center' }}
          justify="space-between"
          direction={{ base: 'column', md: 'row' }}
          gap={3}
        >
          <Box>
            <Text fontWeight="800" color="della.text">
              Статистика продавців
            </Text>

            <Text fontSize="sm" color="gray.500">
              Аналіз замовлень, оплат і знижок за період
            </Text>
          </Box>

          <Button asChild variant="outline">
            <Link href="/sellers">
              <LuArrowLeft />
              До продавців
            </Link>
          </Button>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
          <Input
            type="date"
            value={value.from}
            onChange={(event) => updateValue({ from: event.target.value })}
          />

          <Input
            type="date"
            value={value.to}
            onChange={(event) => updateValue({ to: event.target.value })}
          />
        </SimpleGrid>

        <HStack gap={2} wrap="wrap">
          <Button size="sm" variant="outline" onClick={() => setQuickRange(7)}>
            7 днів
          </Button>

          <Button size="sm" variant="outline" onClick={() => setQuickRange(30)}>
            30 днів
          </Button>

          <Button size="sm" variant="outline" onClick={() => setQuickRange(90)}>
            90 днів
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onChange(getDefaultSellerStatsFilters())}
          >
            Скинути
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
};
