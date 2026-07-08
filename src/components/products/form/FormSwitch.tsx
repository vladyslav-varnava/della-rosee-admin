'use client';

import { Control, Controller, FieldPath } from 'react-hook-form';

import { HStack, Switch, Text } from '@chakra-ui/react';

import { ProductFormValues } from '@/types/product';

type Props = {
  control: Control<ProductFormValues>;
  name: FieldPath<ProductFormValues>;
  label: string;
  description?: string;
};

export const FormSwitch = ({ control, name, label, description }: Props) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Switch.Root
          checked={Boolean(field.value)}
          onCheckedChange={(details) => field.onChange(details.checked)}
        >
          <HStack gap={3} align="center">
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>

            <Switch.Label>
              <Text fontWeight="700">{label}</Text>
              {description && (
                <Text fontSize="xs" color="gray.500">
                  {description}
                </Text>
              )}
            </Switch.Label>
          </HStack>
        </Switch.Root>
      )}
    />
  );
};
