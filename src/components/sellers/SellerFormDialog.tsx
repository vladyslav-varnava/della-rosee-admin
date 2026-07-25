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
  Switch,
  Text,
} from '@chakra-ui/react';
import { LuSave, LuX } from 'react-icons/lu';

import { Seller, SellerPayload, UpdateSellerPayload } from '@/types/seller';

type FormValues = {
  name: string;
  phone: string;
  email: string;
  isActive: boolean;
};

type Props = {
  seller?: Seller;
  trigger: ReactNode;
  isLoading?: boolean;
  onSubmit: (payload: SellerPayload | UpdateSellerPayload) => Promise<void>;
};

const getInitialValues = (seller?: Seller): FormValues => ({
  name: seller?.name ?? '',
  phone: seller?.phone ?? '',
  email: seller?.email ?? '',
  isActive: seller?.isActive ?? true,
});

const validateValues = (values: FormValues) => {
  const errors: Partial<Record<keyof FormValues, string>> = {};

  if (!values.name.trim()) {
    errors.name = 'Введіть імʼя продавця';
  }

  if (values.email.trim() && !values.email.includes('@')) {
    errors.email = 'Перевірте email';
  }

  return errors;
};

export const SellerFormDialog = ({
  seller,
  trigger,
  isLoading,
  onSubmit,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<FormValues>(() =>
    getInitialValues(seller),
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormValues, string>>
  >({});

  const title = seller ? 'Редагувати продавця' : 'Додати продавця';

  const resetForm = () => {
    setValues(getInitialValues(seller));
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

    const nextErrors = validateValues(values);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const payload: SellerPayload | UpdateSellerPayload = seller
      ? {
          name: values.name.trim(),
          phone: values.phone.trim(),
          email: values.email.trim(),
          isActive: values.isActive,
        }
      : {
          name: values.name.trim(),
          phone: values.phone.trim() || undefined,
          email: values.email.trim() || undefined,
        };

    try {
      await onSubmit(payload);
      setOpen(false);
      resetForm();
    } catch {
      // Mutation hooks show the error toast and keep the form open.
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
                  Контакти використовуються для внутрішньої роботи з
                  замовленнями.
                </Text>
              </Box>
            </Dialog.Header>

            <Dialog.Body p={5}>
              <Stack gap={4}>
                <Field.Root invalid={Boolean(errors.name)} required>
                  <Field.Label>Імʼя</Field.Label>
                  <Input
                    value={values.name}
                    placeholder="Наприклад: Марія"
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                  />
                  <Field.ErrorText>{errors.name}</Field.ErrorText>
                </Field.Root>

                <Field.Root>
                  <Field.Label>Телефон</Field.Label>
                  <Input
                    value={values.phone}
                    placeholder="+380..."
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                  />
                </Field.Root>

                <Field.Root invalid={Boolean(errors.email)}>
                  <Field.Label>Email</Field.Label>
                  <Input
                    type="email"
                    value={values.email}
                    placeholder="seller@example.com"
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                  />
                  <Field.ErrorText>{errors.email}</Field.ErrorText>
                </Field.Root>

                {seller && (
                  <Field.Root>
                    <Switch.Root
                      checked={values.isActive}
                      onCheckedChange={({ checked }) =>
                        setValues((current) => ({
                          ...current,
                          isActive: checked,
                        }))
                      }
                    >
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                      <Switch.Label>Активний продавець</Switch.Label>
                    </Switch.Root>
                    <Field.HelperText>
                      Неактивних продавців можна залишати для історії
                      замовлень.
                    </Field.HelperText>
                  </Field.Root>
                )}
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
