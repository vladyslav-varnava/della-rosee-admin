'use client';

import { useMemo } from 'react';

import {
  Box,
  Button,
  Field,
  Grid,
  GridItem,
  HStack,
  Input,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { LuSave } from 'react-icons/lu';

import { useUpdateOrder } from '@/hooks/mutations/order/useUpdateOrder';
import { useGetSellers } from '@/hooks/query/useGetSellers';
import {
  deliveryTypeOptions,
  Order,
  PaymentStatus,
  PaymentType,
  paymentStatusOptions,
  paymentTypeOptions,
  DeliveryType,
  UpdateOrderPayload,
} from '@/types/order';

import { NativeSelectField } from './NativeSelectField';
import { SectionCard } from './SectionCard';

type FormValues = {
  amount: number;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  deliveryType: DeliveryType;
  addressString: string;
  warehouse: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sellerId: string;
};

type Props = {
  order: Order;
  onCancel?: () => void;
  onSaved?: () => void;
};

const getDefaultValues = (order: Order): FormValues => {
  return {
    amount: order.amount,
    paymentType: order.paymentType,
    paymentStatus: order.paymentStatus,
    deliveryType: order.deliveryType,
    addressString: order.addressString ?? '',
    warehouse: order.warehouse ?? '',
    firstName: order.firstName ?? '',
    lastName: order.lastName ?? '',
    email: order.email ?? '',
    phone: order.phone ?? '',
    sellerId: order.sellerId ? String(order.sellerId) : '',
  };
};

export const OrderEditForm = ({ order, onCancel, onSaved }: Props) => {
  const updateOrder = useUpdateOrder();
  const { data: sellers = [] } = useGetSellers();

  const sellerOptions = useMemo(
    () => [
      { label: 'Без продавця', value: '' },
      ...sellers.map((seller) => ({
        label: seller.name,
        value: String(seller.id),
      })),
    ],
    [sellers],
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: getDefaultValues(order),
  });

  const onSubmit = handleSubmit((values) => {
    const payload: UpdateOrderPayload = {
      amount: Number(values.amount) || 0,
      paymentType: values.paymentType,
      paymentStatus: values.paymentStatus,
      deliveryType: values.deliveryType,
      addressString: values.addressString.trim(),
      warehouse: values.warehouse.trim(),
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      sellerId: values.sellerId ? Number(values.sellerId) : undefined,
    };

    updateOrder.mutate(
      {
        id: order.id,
        data: payload,
      },
      {
        onSuccess: (updatedOrder) => {
          reset(getDefaultValues(updatedOrder));
          onSaved?.();
        },
      },
    );
  });

  return (
    <form onSubmit={onSubmit}>
      <SectionCard title="Редагування замовлення">
        <Stack gap={6}>
          <Box>
            <Text fontWeight="900" color="della.text">
              Продавець
            </Text>

            <Text fontSize="sm" color="gray.500">
              Вкажіть менеджера, який обробляє замовлення.
            </Text>

            <Grid
              mt={4}
              templateColumns={{ base: '1fr', md: '1fr 1fr' }}
              gap={4}
            >
              <GridItem>
                <Controller
                  control={control}
                  name="sellerId"
                  render={({ field }) => (
                    <NativeSelectField
                      label="Продавець"
                      value={field.value}
                      options={sellerOptions}
                      placeholder="Оберіть продавця"
                      onChange={field.onChange}
                    />
                  )}
                />
              </GridItem>
            </Grid>
          </Box>

          <Box>
            <Text fontWeight="900" color="della.text">
              Контактні дані
            </Text>

            <SimpleGrid mt={4} columns={{ base: 1, md: 2 }} gap={4}>
              <Field.Root invalid={!!errors.firstName}>
                <Field.Label>Імʼя</Field.Label>
                <Input
                  {...register('firstName', {
                    required: 'Вкажіть імʼя',
                  })}
                />
                <Field.ErrorText>{errors.firstName?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.lastName}>
                <Field.Label>Прізвище</Field.Label>
                <Input
                  {...register('lastName', {
                    required: 'Вкажіть прізвище',
                  })}
                />
                <Field.ErrorText>{errors.lastName?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.email}>
                <Field.Label>Email</Field.Label>
                <Input
                  type="email"
                  {...register('email', {
                    required: 'Вкажіть email',
                  })}
                />
                <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.phone}>
                <Field.Label>Телефон</Field.Label>
                <Input
                  {...register('phone', {
                    required: 'Вкажіть телефон',
                  })}
                />
                <Field.ErrorText>{errors.phone?.message}</Field.ErrorText>
              </Field.Root>
            </SimpleGrid>
          </Box>

          <Box>
            <Text fontWeight="900" color="della.text">
              Оплата
            </Text>

            <SimpleGrid mt={4} columns={{ base: 1, md: 2 }} gap={4}>
              <Controller
                control={control}
                name="paymentType"
                render={({ field }) => (
                  <NativeSelectField
                    label="Тип оплати"
                    value={field.value}
                    options={paymentTypeOptions}
                    placeholder="Оберіть тип оплати"
                    onChange={field.onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="paymentStatus"
                render={({ field }) => (
                  <NativeSelectField
                    label="Статус оплати"
                    value={field.value}
                    options={paymentStatusOptions}
                    placeholder="Оберіть статус оплати"
                    onChange={field.onChange}
                  />
                )}
              />

              <Field.Root>
                <Field.Label>Сума до оплати</Field.Label>
                <Input
                  type="number"
                  min={0}
                  {...register('amount', {
                    valueAsNumber: true,
                  })}
                />
              </Field.Root>
            </SimpleGrid>
          </Box>

          <Box>
            <Text fontWeight="900" color="della.text">
              Доставка
            </Text>

            <SimpleGrid mt={4} columns={{ base: 1, md: 2 }} gap={4}>
              <Controller
                control={control}
                name="deliveryType"
                render={({ field }) => (
                  <NativeSelectField
                    label="Тип доставки"
                    value={field.value}
                    options={deliveryTypeOptions}
                    placeholder="Оберіть тип доставки"
                    onChange={field.onChange}
                  />
                )}
              />

              <Field.Root>
                <Field.Label>Відділення / склад</Field.Label>
                <Input {...register('warehouse')} />
              </Field.Root>

              <Field.Root>
                <Field.Label>Адреса</Field.Label>
                <Input {...register('addressString')} />
              </Field.Root>
            </SimpleGrid>
          </Box>

          <HStack gap={3}>
            <Button
              type="submit"
              loading={updateOrder.isPending}
              disabled={!isDirty}
              bg="della.primary"
              color="della.text"
              _hover={{ bg: 'della.primaryHover' }}
            >
              <LuSave />
              Зберегти зміни
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={updateOrder.isPending}
              onClick={onCancel}
            >
              Скасувати
            </Button>
          </HStack>
        </Stack>
      </SectionCard>
    </form>
  );
};
