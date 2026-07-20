'use client';

import { HStack, IconButton, Input } from '@chakra-ui/react';
import { LuMinus, LuPlus } from 'react-icons/lu';

type ValueChangeDetails = {
  value: string;
  valueAsNumber: number;
};

type Props = {
  value: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  onValueChange: (details: ValueChangeDetails) => void;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const AdminQuantityStepperInput = ({
  value,
  min = 1,
  max = 99,
  disabled = false,
  onValueChange,
}: Props) => {
  const numericValue = Number(value) || min;

  const updateValue = (nextValue: number) => {
    const valueAsNumber = clamp(nextValue, min, max);

    onValueChange({
      value: String(valueAsNumber),
      valueAsNumber,
    });
  };

  return (
    <HStack gap={1}>
      <IconButton
        type="button"
        aria-label="Зменшити кількість"
        size="xs"
        variant="ghost"
        disabled={disabled || numericValue <= min}
        onClick={() => updateValue(numericValue - 1)}
      >
        <LuMinus />
      </IconButton>

      <Input
        value={value}
        type="number"
        min={min}
        max={max}
        w="54px"
        h="30px"
        px={1}
        textAlign="center"
        fontSize="sm"
        fontWeight="800"
        disabled={disabled}
        onChange={(event) => {
          const nextValue = Number(event.currentTarget.value);

          if (!Number.isFinite(nextValue)) return;

          updateValue(nextValue);
        }}
      />

      <IconButton
        type="button"
        aria-label="Збільшити кількість"
        size="xs"
        variant="ghost"
        disabled={disabled || numericValue >= max}
        onClick={() => updateValue(numericValue + 1)}
      >
        <LuPlus />
      </IconButton>
    </HStack>
  );
};
