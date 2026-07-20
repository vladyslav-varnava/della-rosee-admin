'use client';

import { Field, Switch } from '@chakra-ui/react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  helperText?: string;
};

export const AdminSwitchField = <T extends FieldValues>({
  control,
  name,
  label,
  helperText,
}: Props<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field.Root>
          <Switch.Root
            checked={Boolean(field.value)}
            onCheckedChange={({ checked }) => field.onChange(checked)}
          >
            <Switch.HiddenInput name={field.name} onBlur={field.onBlur} />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Label>{label}</Switch.Label>
          </Switch.Root>

          {helperText && <Field.HelperText>{helperText}</Field.HelperText>}
        </Field.Root>
      )}
    />
  );
};
