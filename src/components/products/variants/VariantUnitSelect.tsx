'use client';

import { chakra, Field } from '@chakra-ui/react';

const StyledSelect = chakra('select');

const units = [
  { label: 'мл', value: 'ml' },
  { label: 'л', value: 'l' },
  { label: 'г', value: 'g' },
  { label: 'кг', value: 'kg' },
  { label: 'шт', value: 'items' },
  { label: '%', value: '%' },
  { label: 'Тон', value: 'ton' },
  { label: 'Тон refill', value: 'ton refill' },
  { label: 'мл - refill', value: 'ml refill' },
  { label: 'г - refill', value: 'g refill' },
];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const VariantUnitSelect = ({ value, onChange }: Props) => {
  return (
    <Field.Root>
      <Field.Label>Одиниця</Field.Label>

      <StyledSelect
        value={value}
        h="40px"
        w="100%"
        px={3}
        border="1px solid"
        borderColor="blackAlpha.200"
        borderRadius="lg"
        bg="white"
        cursor="pointer"
        onChange={(event) => onChange(event.currentTarget.value)}
      >
        {units.map((unit) => (
          <option key={unit.value} value={unit.value}>
            {unit.label}
          </option>
        ))}
      </StyledSelect>
    </Field.Root>
  );
};
