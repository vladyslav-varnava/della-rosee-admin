'use client';

import { useEffect, useMemo } from 'react';

import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

import { useAddItemToCartById } from '@/hooks/mutations/cart/useAddItemToCartById';
import { cartKeys, useGetCartById } from '@/hooks/query/useCart';

import { AdminOrderCartPreview } from './AdminOrderCartPreview';
import { AdminProductPickerDialog } from './AdminProductPickerDialog';

import { AdminNativeSelectField } from '@/components/admin/AdminNativeSelectField';
import { AdminSwitchField } from '@/components/admin/AdminSwitchField';
import { SectionCard } from '@/components/orders/details/SectionCard';
import { useGetSellers } from '@/hooks/query/useGetSellers';
import { AdminOrderCreateFormValues } from '@/types/admin-order';
import { PAYMENT_TYPE, PaymentType } from '@/types/order';
import { User } from '@/types/user';
import { AdminPaymentTypeField } from '@/components/admin/AdminPaymentTypeField';
import { NEW_POST_WAREHOUSE_TYPE_REFS } from '@/types/delivery';
import { AdminOrderDeliveryInfo } from '@/components/orders/create/AdminOrderDeliveryInfo';
import { useFormOrder } from '@/hooks/mutations/order/useFormOrder';
import { DELIVERY_TYPE } from '@/types/order';
import { getDeliveryTypeById } from '@/types/delivery';
import { normalizeUaPhone } from '@/lib/phone';
import { FormOrder } from '@/types/admin-order';
import { reset } from 'next/dist/lib/picocolors';

type Props = {
  cartId: string;
  user: User;
  onOrderCreated?: () => void;
};

const adminPaymentTypeOptions = [
  {
    value: PAYMENT_TYPE.CASH,
    label: 'Готівка при отриманні',
  },
  {
    value: PAYMENT_TYPE.CARD_AFTER_DELIVERY,
    label: 'Карткою при отриманні',
  },
  {
    value: PAYMENT_TYPE.COMBINED_PAY,
    label: 'Комбінована оплата',
  },
  {
    value: PAYMENT_TYPE.PAY_ON_IBAN,
    label: 'Оплата на IBAN',
  },
];

export const AdminCreateUserOrderForm = ({
  cartId,
  user,
  onOrderCreated,
}: Props) => {
  const { data: sellers = [] } = useGetSellers();
  const queryClient = useQueryClient();

  const {
    data: cart,
    isPending: isCartPending,
    isRefetching: isCartRefetching,
  } = useGetCartById(cartId, user.id);

  const addItemToCart = useAddItemToCartById({
    cartId,
    userId: user.id,
  });

  const handleAddVariantToCart = async ({
    cardId,
    productId,
    brand,
  }: {
    cardId: number;
    productId: number;
    brand: string;
  }) => {
    await addItemToCart.mutateAsync({
      cardId,
      cartId,
      quantity: 1,
      productId,
      brandId: brand,
      userId: user.id,
      // shouldNotCheckInStock: !isCheckIsProductsAvailable,
    });

    await queryClient.invalidateQueries({
      queryKey: cartKeys.details(cartId, user.id),
    });
  };
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
    setValue,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<AdminOrderCreateFormValues>({
    defaultValues: {
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      phone: user.phone ?? '',
      email: user.email ?? '',

      sellerId: '',
      paymentType: PAYMENT_TYPE.CASH as PaymentType,

      deliveryType: NEW_POST_WAREHOUSE_TYPE_REFS.WAREHOUSE,
      addressString: '',
      deliverySettlementRef: '',
      warehouse: '',
      warehouseRef: '',

      isSaveAddress: false,
      isMakeAddressDefault: false,
      isCheckIsProductsAvailable: true,
      isSendEmailToCustomer: true,
      isSendMessageToTelegram: true,
    },
  });

  const formOrder = useFormOrder(cartId, user.id);

  const onSubmit = handleSubmit((values) => {
    console.log('====> values onSubmit', values)
    const deliveryType = getDeliveryTypeById(values.deliveryType);
    const hasItems = Boolean(cart?.items?.length);

    if (!hasItems) {
      return;
    }

    if (!values.deliveryType) {
      setError('deliveryType', {
        message: `Поле "Тип доставки" є обовʼязковим`,
      });

      return;
    }

    if (deliveryType !== DELIVERY_TYPE.PICKUP) {
      console.log('======> values', values)
      if (!values.addressString) {
        setError('addressString', {
          message: `Поле "Місто" є обовʼязковим`,
        });

        return;
      }

      if (!values.warehouse) {
        setError('warehouse', {
          message: `Поле "Відділення" є обовʼязковим`,
        });

        return;
      }
    }

    const payload: FormOrder = {
      cartId,
      userId: user.id,
      paymentType: values.paymentType,
      deliveryType,
      addressString:
        deliveryType === DELIVERY_TYPE.PICKUP
          ? 'м. Вінниця, вул. Дмитра Майбороди, 12'
          : values.addressString,
      warehouse:
        deliveryType === DELIVERY_TYPE.PICKUP ? 'Самовивіз' : values.warehouse,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: normalizeUaPhone(values.phone),
      isSaveAddress: values.isSaveAddress,
      isMakeAddressDefault: values.isMakeAddressDefault,
      isSendEmailToCustomer: values.isSendEmailToCustomer,
      isSendMessageToTelegram: values.isSendMessageToTelegram,
      isCheckIsProductsAvailable: values.isCheckIsProductsAvailable,
      deliverySettlementRefValue: values.deliverySettlementRef,
      sellerId: values.sellerId ? Number(values.sellerId) : undefined,
    };

    formOrder.mutate(payload, {
      onSuccess: (response) => {
        if (response.success) {
          onOrderCreated?.();
        }
      },
    });
  });

  const isCheckIsProductsAvailable =
    useWatch({
      control,
      name: 'isCheckIsProductsAvailable',
    }) ?? true;

  const deliveryTypeValue =
    useWatch({
      control,
      name: 'deliveryType',
    }) ?? NEW_POST_WAREHOUSE_TYPE_REFS.WAREHOUSE;

  const addressStringValue =
    useWatch({
      control,
      name: 'addressString',
    }) ?? '';

  useEffect(() => {
    if (addressStringValue) {
      clearErrors()
    }
  }, [addressStringValue, clearErrors])


  const warehouseValue =
    useWatch({
      control,
      name: 'warehouse',
    }) ?? '';

  useEffect(() => {
    if (warehouseValue) {
      clearErrors()
    }
  }, [warehouseValue, clearErrors])

  const deliverySettlementRefValue =
    useWatch({
      control,
      name: 'deliverySettlementRef',
    }) ?? '';

  const isCartEmpty = !cart?.items?.length;

  return (
    <form onSubmit={onSubmit}>
      <SectionCard title="Формування замовлення">
        <Stack gap={6}>
          <Box>
            <Heading size="sm" color="della.text">
              Кошик
            </Heading>

            <Text mt={1} color="gray.500" fontSize="sm">
              Cart ID: {cartId}
            </Text>

            <Text mt={1} color="gray.500" fontSize="sm">
              Користувач: {user.firstName} {user.lastName} · {user.email}
            </Text>
          </Box>

          <Box>
            <Heading size="sm" color="della.text" mb={4}>
              Налаштування
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <Controller
                control={control}
                name="sellerId"
                render={({ field }) => (
                  <AdminNativeSelectField
                    label="Продавець"
                    value={field.value}
                    options={sellerOptions}
                    placeholder="Оберіть продавця"
                    onChange={field.onChange}
                  />
                )}
              />
            </SimpleGrid>

            <Stack gap={4} mt={5}>
              <AdminSwitchField
                control={control}
                name="isCheckIsProductsAvailable"
                label="Перевіряти наявність продуктів"
                helperText={
                  isCheckIsProductsAvailable
                    ? 'Система перевірятиме залишки перед створенням замовлення.'
                    : 'Замовлення можна буде створити без перевірки залишків.'
                }
              />

              <AdminSwitchField
                control={control}
                name="isSendEmailToCustomer"
                label="Відправити повідомлення на email клієнта"
              />

              <AdminSwitchField
                control={control}
                name="isSendMessageToTelegram"
                label="Відправити інформацію про замовлення у Telegram"
              />
            </Stack>
          </Box>

          <Box>
            <Heading size="sm" color="della.text" mb={4}>
              Оплата
            </Heading>

            <AdminPaymentTypeField<AdminOrderCreateFormValues>
              control={control}
              name="paymentType"
              options={adminPaymentTypeOptions}
            />
          </Box>

          <Box>
            <Heading size="sm" color="della.text" mb={4}>
              Доставка
            </Heading>

            <AdminOrderDeliveryInfo
              control={control}
              setValue={setValue}
              errors={errors}
              addresses={user.addresses ?? []}
              deliveryType={deliveryTypeValue}
              addressString={addressStringValue}
              clearErrors={clearErrors}
              warehouse={warehouseValue}
              deliverySettlementRefValue={deliverySettlementRefValue}
            />
          </Box>
          <Box>
            <Heading size="sm" color="della.text" mb={4}>
              Товари
            </Heading>

            <AdminProductPickerDialog onAddVariant={handleAddVariantToCart} />

            <Box mt={4}>
              <AdminOrderCartPreview
                cartId={cartId}
                userId={user.id}
                shouldNotCheckInStock={!isCheckIsProductsAvailable}
                cart={cart}
                isLoading={
                  isCartPending || isCartRefetching || addItemToCart.isPending
                }
              />
            </Box>
          </Box>
          <Button
            type="submit"
            size="lg"
            w={{ base: '100%', md: 'fit-content' }}
            loading={formOrder.isPending}
            disabled={isCartEmpty || isCartPending || isCartRefetching}
            bg="della.primary"
            color="della.text"
            _hover={{ bg: 'della.primaryHover' }}
          >
            Створити замовлення
          </Button>

          {isCartEmpty && (
            <Text color="gray.500" fontSize="sm">
              Щоб створити замовлення, додайте хоча б один продукт.
            </Text>
          )}
        </Stack>
      </SectionCard>
    </form>
  );
};
