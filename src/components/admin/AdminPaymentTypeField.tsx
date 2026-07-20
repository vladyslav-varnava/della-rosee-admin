'use client';

import { RadioGroup, Stack } from '@chakra-ui/react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

type PaymentTypeOption = {
  value: string;
  label: string;
};

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  options: PaymentTypeOption[];
};

export const AdminPaymentTypeField = <T extends FieldValues>({
  control,
  name,
  options,
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <RadioGroup.Root
          name={field.name}
          value={field.value}
          onValueChange={({ value }) => field.onChange(value)}
        >
          <Stack direction={{ base: 'column', md: 'row' }} gap={5}>
            {options.map((item) => (
              <RadioGroup.Item key={item.value} value={item.value}>
                <RadioGroup.ItemHiddenInput onBlur={field.onBlur} />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
              </RadioGroup.Item>
            ))}
          </Stack>
        </RadioGroup.Root>
      )}
    />
  );
};
