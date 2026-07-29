'use client';

import { HStack, Input, Text } from '@chakra-ui/react';
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

export const PromotionConditionValueInput = ({
  index,
  control,
  watch,
}: Props) => {
  const type = watch(`conditions.${index}.type`);

  switch (type) {
    case 'cartTotalGte':
    case 'cartTotalLte':
      return (
        <Controller
          control={control}
          name={`conditions.${index}.value` as Path<PromotionFormValues>}
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

    case 'hasProduct':
    case 'hasAllProducts':
      return (
        <Controller
          control={control}
          name={
            `conditions.${index}.value.productIds` as Path<PromotionFormValues>
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
      );

    case 'hasBrand':
      return (
        <Controller
          control={control}
          name={
            `conditions.${index}.value.brandIds` as Path<PromotionFormValues>
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
      );

    case 'hasCategory':
      return (
        <Controller
          control={control}
          name={
            `conditions.${index}.value.categoryIds` as Path<PromotionFormValues>
          }
          render={({ field }) => (
            <Input
              ref={field.ref}
              name={field.name}
              value={toInputValue(field.value)}
              placeholder="Category IDs через кому"
              onBlur={field.onBlur}
              onChange={field.onChange}
            />
          )}
        />
      );

    case 'minQuantityOfProduct':
    case 'maxQuantityOfProduct':
      return (
        <HStack w="100%" gap={2}>
          <Controller
            control={control}
            name={
              `conditions.${index}.value.productId` as Path<PromotionFormValues>
            }
            render={({ field }) => (
              <Input
                ref={field.ref}
                name={field.name}
                value={toInputValue(field.value)}
                placeholder="Product ID"
                onBlur={field.onBlur}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name={
              `conditions.${index}.value.quantity` as Path<PromotionFormValues>
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
        </HStack>
      );

    case 'dateBetween':
      return (
        <HStack w="100%" gap={2}>
          <Controller
            control={control}
            name={`conditions.${index}.value.from` as Path<PromotionFormValues>}
            render={({ field }) => (
              <Input
                ref={field.ref}
                name={field.name}
                value={toInputValue(field.value)}
                type="datetime-local"
                onBlur={field.onBlur}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name={`conditions.${index}.value.to` as Path<PromotionFormValues>}
            render={({ field }) => (
              <Input
                ref={field.ref}
                name={field.name}
                value={toInputValue(field.value)}
                type="datetime-local"
                onBlur={field.onBlur}
                onChange={field.onChange}
              />
            )}
          />
        </HStack>
      );

    case 'usageLimitNotReached':
    case 'perUserLimitNotReached':
      return (
        <Text fontSize="sm" color="gray.500">
          Додаткові параметри не потрібні
        </Text>
      );

    default:
      return null;
  }
};
