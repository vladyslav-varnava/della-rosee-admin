'use client';

import { Input, Stack, Text } from '@chakra-ui/react';
import { Control, Controller, Path, UseFormWatch } from 'react-hook-form';

import { PromotionFormValues } from '@/components/promotions/PromotionForm';

type Props = {
  index: number;
  control: Control<PromotionFormValues>;
  watch: UseFormWatch<PromotionFormValues>;
};

const toInputValue = (value: unknown) => {
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }

  return '';
};

export const PromotionEffectValueInput = ({ index, control, watch }: Props) => {
  const type = watch(`effects.${index}.type`);

  switch (type) {
    case 'fixedDiscount':
      return (
        <Controller
          control={control}
          name={`effects.${index}.value` as Path<PromotionFormValues>}
          render={({ field }) => (
            <Input
              ref={field.ref}
              name={field.name}
              value={toInputValue(field.value)}
              type="number"
              placeholder="Сума"
              onBlur={field.onBlur}
              onChange={field.onChange}
            />
          )}
        />
      );

    case 'percentDiscount':
    case 'percentDiscountOnEveryProduct':
      return (
        <Controller
          control={control}
          name={`effects.${index}.value` as Path<PromotionFormValues>}
          render={({ field }) => (
            <Input
              ref={field.ref}
              name={field.name}
              value={toInputValue(field.value)}
              type="number"
              placeholder="%"
              onBlur={field.onBlur}
              onChange={field.onChange}
            />
          )}
        />
      );

    case 'percentDiscountOnProduct':
      return (
        <Stack gap={2} w="100%">
          <Controller
            control={control}
            name={
              `effects.${index}.value.productIds` as Path<PromotionFormValues>
            }
            render={({ field }) => (
              <Input
                ref={field.ref}
                name={field.name}
                value={toInputValue(field.value)}
                placeholder="Product IDs через кому"
                onBlur={field.onBlur}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name={`effects.${index}.value.percent` as Path<PromotionFormValues>}
            render={({ field }) => (
              <Input
                ref={field.ref}
                name={field.name}
                value={toInputValue(field.value)}
                type="number"
                placeholder="%"
                onBlur={field.onBlur}
                onChange={field.onChange}
              />
            )}
          />
        </Stack>
      );

    case 'fixedDiscountOnProduct':
      return (
        <Stack gap={2} w="100%">
          <Controller
            control={control}
            name={
              `effects.${index}.value.productIds` as Path<PromotionFormValues>
            }
            render={({ field }) => (
              <Input
                ref={field.ref}
                name={field.name}
                value={toInputValue(field.value)}
                placeholder="Product IDs через кому"
                onBlur={field.onBlur}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name={`effects.${index}.value.amount` as Path<PromotionFormValues>}
            render={({ field }) => (
              <Input
                ref={field.ref}
                name={field.name}
                value={toInputValue(field.value)}
                type="number"
                placeholder="Сума"
                onBlur={field.onBlur}
                onChange={field.onChange}
              />
            )}
          />
        </Stack>
      );

    case 'percentDiscountOnBrand':
      return (
        <Stack gap={2} w="100%">
          <Controller
            control={control}
            name={
              `effects.${index}.value.brandIds` as Path<PromotionFormValues>
            }
            render={({ field }) => (
              <Input
                ref={field.ref}
                name={field.name}
                value={toInputValue(field.value)}
                placeholder="Brand IDs через кому"
                onBlur={field.onBlur}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name={`effects.${index}.value.percent` as Path<PromotionFormValues>}
            render={({ field }) => (
              <Input
                ref={field.ref}
                name={field.name}
                value={toInputValue(field.value)}
                type="number"
                placeholder="%"
                onBlur={field.onBlur}
                onChange={field.onChange}
              />
            )}
          />
        </Stack>
      );

    case 'bundlePercentDiscount':
      return (
        <Stack gap={2} w="100%">
          <Controller
            control={control}
            name={
              `effects.${index}.value.productIds` as Path<PromotionFormValues>
            }
            render={({ field }) => (
              <Input
                ref={field.ref}
                name={field.name}
                value={toInputValue(field.value)}
                placeholder="Product IDs через кому"
                onBlur={field.onBlur}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name={`effects.${index}.value.percent` as Path<PromotionFormValues>}
            render={({ field }) => (
              <Input
                ref={field.ref}
                name={field.name}
                value={toInputValue(field.value)}
                type="number"
                placeholder="%"
                onBlur={field.onBlur}
                onChange={field.onChange}
              />
            )}
          />
        </Stack>
      );

    case 'productGift':
    case 'freeProduct':
      return (
        <Stack gap={2} w="100%">
          <Controller
            control={control}
            name={
              `effects.${index}.value.productId` as Path<PromotionFormValues>
            }
            render={({ field }) => (
              <Input
                ref={field.ref}
                name={field.name}
                value={toInputValue(field.value)}
                placeholder="Product ID подарунка"
                onBlur={field.onBlur}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name={
              `effects.${index}.value.quantity` as Path<PromotionFormValues>
            }
            render={({ field }) => (
              <Input
                ref={field.ref}
                name={field.name}
                value={toInputValue(field.value)}
                type="number"
                placeholder="Кількість"
                onBlur={field.onBlur}
                onChange={field.onChange}
              />
            )}
          />
        </Stack>
      );

    case 'freeCheapestItem':
      return (
        <Text fontSize="sm" color="gray.500">
          Найдешевший товар у кошику буде безкоштовним
        </Text>
      );

    case 'none':
      return <Text color="gray.500">Додаткові параметри не потрібні</Text>;

    default:
      return null;
  }
};
