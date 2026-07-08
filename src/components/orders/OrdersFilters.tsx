'use client';

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

export type OrdersFiltersValue = {
  search: string;
  from: string;
  to: string;
};

type Props = {
  value: OrdersFiltersValue;
  onChange: (value: OrdersFiltersValue) => void;
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

export const getDefaultOrdersFilters = (): OrdersFiltersValue => {
  const today = new Date();

  return {
    search: '',
    from: getDateInputValue(addDays(today, -60)),
    to: getDateInputValue(today),
  };
};

export const OrdersFilters = ({ value, onChange }: Props) => {
  const updateValue = (nextValue: Partial<OrdersFiltersValue>) => {
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
              Пошук замовлень
            </Text>

            <Text fontSize="sm" color="gray.500">
              Імʼя, прізвище, телефон або email
            </Text>
          </Box>

          <Button
            variant="outline"
            onClick={() => onChange(getDefaultOrdersFilters())}
          >
            Скинути
          </Button>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
          <Input
            value={value.search}
            onChange={(event) => updateValue({ search: event.target.value })}
            placeholder="Наприклад: Ірина, 380..., email"
            bg="white"
          />

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

          <Button size="sm" variant="outline" onClick={() => setQuickRange(60)}>
            2 місяці
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
};
