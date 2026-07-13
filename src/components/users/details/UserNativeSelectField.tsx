'use client';

import { chakra, Field } from '@chakra-ui/react';

type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  value: string;
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
};

const StyledSelect = chakra('select');

export const UserNativeSelectField = ({
                                        label,
                                        value,
                                        options,
                                        placeholder = 'Оберіть значення',
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
        cursor="pointer"
        onChange={(event) => onChange(event.currentTarget.value)}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
    </Field.Root>
  );
};
