'use client';

import { FormEvent, ReactNode, useState } from 'react';

import {
  Box,
  Button,
  Dialog,
  Field,
  HStack,
  IconButton,
  Input,
  Portal,
  Stack,
  Text,
} from '@chakra-ui/react';
import { LuSave, LuX } from 'react-icons/lu';

import { Ingredient, IngredientPayload } from '@/types/product';

const VALUE_PATTERN = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;

type FormValues = IngredientPayload;

type Props = {
  ingredient?: Ingredient;
  trigger: ReactNode;
  isLoading?: boolean;
  onSubmit: (payload: IngredientPayload) => Promise<void>;
};

const getInitialValues = (ingredient?: Ingredient): FormValues => ({
  label: ingredient?.label ?? '',
  value: ingredient?.value ?? '',
});

const validateValues = (values: FormValues) => {
  const errors: Partial<Record<keyof FormValues, string>> = {};

  if (!values.label.trim()) {
    errors.label = 'Введіть назву інгредієнта';
  }

  if (!values.value.trim()) {
    errors.value = 'Введіть value';
  } else if (!VALUE_PATTERN.test(values.value.trim())) {
    errors.value = 'Використовуйте lowercase латиницю, цифри та underscore';
  }

  return errors;
};

export const IngredientFormDialog = ({
  ingredient,
  trigger,
  isLoading,
  onSubmit,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<FormValues>(() =>
    getInitialValues(ingredient),
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormValues, string>>
  >({});

  const title = ingredient ? 'Редагувати інгредієнт' : 'Додати інгредієнт';

  const resetForm = () => {
    setValues(getInitialValues(ingredient));
    setErrors({});
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      resetForm();
    }

    setOpen(nextOpen);
  };

  const handleSubmit = async (event: FormEvent<HTMLElement>) => {
    event.preventDefault();

    const payload = {
      label: values.label.trim(),
      value: values.value.trim(),
    };
    const nextErrors = validateValues(payload);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      await onSubmit(payload);
      setOpen(false);
      resetForm();
    } catch {
      // Mutation hooks already show the toast; keep the dialog open.
    }
  };

  return (
    <Dialog.Root
      lazyMount
      open={open}
      onOpenChange={({ open: nextOpen }) => handleOpenChange(nextOpen)}
    >
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />

        <Dialog.Positioner>
          <Dialog.Content
            as="form"
            maxW={{ base: 'calc(100% - 24px)', md: '560px' }}
            borderRadius="2xl"
            onSubmit={handleSubmit}
          >
            <Dialog.Header borderBottom="1px solid" borderColor="blackAlpha.100">
              <Box>
                <Dialog.Title color="della.text">{title}</Dialog.Title>

                <Text mt={1} color="gray.500" fontSize="sm">
                  Label показується на PDP, value використовується як технічний
                  ключ.
                </Text>
              </Box>
            </Dialog.Header>

            <Dialog.Body p={5}>
              <Stack gap={4}>
                <Box
                  border="1px solid"
                  borderColor="orange.200"
                  borderRadius="xl"
                  bg="orange.50"
                  p={4}
                >
                  <Text fontWeight="800" color="orange.800">
                    Формат value
                  </Text>

                  <Text mt={1} fontSize="sm" color="orange.700">
                    Якщо label: Вітамін B, то value має бути: vitamin_b.
                    Використовуйте lowercase, латиницю та underscore.
                  </Text>
                </Box>

                <Field.Root invalid={Boolean(errors.label)} required>
                  <Field.Label>Label</Field.Label>
                  <Input
                    value={values.label}
                    placeholder="Вітамін B"
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        label: event.target.value,
                      }))
                    }
                  />
                  <Field.ErrorText>{errors.label}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={Boolean(errors.value)} required>
                  <Field.Label>Value</Field.Label>
                  <Input
                    value={values.value}
                    placeholder="vitamin_b"
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        value: event.target.value,
                      }))
                    }
                  />
                  <Field.HelperText>
                    Наприклад: vitamin_b, hyaluronic_acid, niacinamide
                  </Field.HelperText>
                  <Field.ErrorText>{errors.value}</Field.ErrorText>
                </Field.Root>
              </Stack>
            </Dialog.Body>

            <Dialog.Footer borderTop="1px solid" borderColor="blackAlpha.100">
              <HStack justify="flex-end" gap={3}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Скасувати
                </Button>

                <Button
                  type="submit"
                  loading={isLoading}
                  bg="della.primary"
                  color="della.text"
                  _hover={{ bg: 'della.primaryHover' }}
                >
                  <LuSave />
                  Зберегти
                </Button>
              </HStack>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <IconButton
                aria-label="Закрити"
                position="absolute"
                top={4}
                right={4}
                size="sm"
                variant="ghost"
              >
                <LuX />
              </IconButton>
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
