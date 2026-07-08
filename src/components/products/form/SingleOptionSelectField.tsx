'use client';

import { chakra, Field } from '@chakra-ui/react';

import { ProductOption } from '@/types/product';

type Props = {
  label: string;
  value: string;
  options: ProductOption[];
  placeholder?: string;
  helperText?: string;
  onChange: (value: string) => void;
};

const StyledSelect = chakra('select');

export const SingleOptionSelectField = ({
  label,
  value,
  options,
  placeholder = 'Оберіть значення',
  helperText,
  onChange,
}: Props) => {
  return (
    <Field.Root>
      <Field.Label>{label}</Field.Label>

      <StyledSelect
        value={value}
        h="40px"
        w="100%"
        px={3}
        border="1px solid"
        borderColor="blackAlpha.200"
        borderRadius="lg"
        bg="white"
        color="della.text"
        outline="none"
        cursor="pointer"
        _focus={{
          borderColor: 'della.primary',
          boxShadow: '0 0 0 1px var(--chakra-colors-della-primary)',
        }}
        onChange={(event) => onChange(event.currentTarget.value)}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>

      {helperText && <Field.HelperText>{helperText}</Field.HelperText>}
    </Field.Root>
  );
};
