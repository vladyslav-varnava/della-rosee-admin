'use client';

import { useId } from 'react';

import { Field, Input } from '@chakra-ui/react';

import type { ProductOption } from '@/types/product';

type Props = {
  label: string;
  value: string;
  options: ProductOption[];
  placeholder?: string;
  errorText?: string;
  onBlur?: () => void;
  onChange: (value: string) => void;
};

export const BrandAutocompleteField = ({
  label,
  value,
  options,
  placeholder,
  errorText,
  onBlur,
  onChange,
}: Props) => {
  const inputId = useId();
  const listId = `${inputId}-brands`;

  return (
    <Field.Root invalid={Boolean(errorText)}>
      <Field.Label htmlFor={inputId}>{label}</Field.Label>

      <Input
        id={inputId}
        list={listId}
        value={value}
        placeholder={placeholder}
        onBlur={onBlur}
        onChange={(event) => onChange(event.currentTarget.value)}
      />

      <datalist id={listId}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </datalist>

      <Field.ErrorText>{errorText}</Field.ErrorText>
    </Field.Root>
  );
};
