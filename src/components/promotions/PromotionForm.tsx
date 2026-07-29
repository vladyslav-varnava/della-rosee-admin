'use client';

import { FormEvent, useEffect } from 'react';
import Link from 'next/link';

import {
  Box,
  Button,
  Field,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Input,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  VStack,
  chakra,
} from '@chakra-ui/react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { LuArrowLeft, LuPlus, LuSave, LuTrash2 } from 'react-icons/lu';

import { AdminSwitchField } from '@/components/admin/AdminSwitchField';
import { FileUploadField } from '@/components/admin/FileUploadField';
import { ProductFormSection } from '@/components/products/form/ProductFormSection';
import { PromotionConditionValueInput } from '@/components/promotions/PromotionConditionValueInput';
import { PromotionEffectValueInput } from '@/components/promotions/PromotionEffectValueInput';
import {
  emptyRule,
  PROMOTION_CONDITIONS,
  PROMOTION_EFFECTS,
  PromotionRuleItem,
} from '@/components/promotions/promotion-rule-config';
import {
  PROMOTION_TYPES,
  Promotion,
  PromotionPayload,
  PromotionType,
} from '@/types/promotion';

export type PromotionFormValues = {
  title: string;
  slug: string;
  description: string;
  type: PromotionType;
  priority: string;
  stackable: boolean;
  imageUrl: string;
  imageUrlMobile: string;
  productText: string;
  isPageVisible: boolean;
  isShowTimer: boolean;
  startAt: string;
  endAt: string;
  isActive: boolean;
  usageLimit: string;
  perUserLimit: string;
  conditions: PromotionRuleItem[];
  effects: PromotionRuleItem[];
};

type Props = {
  promotion?: Promotion | null;
  isLoading?: boolean;
  onSubmit: (payload: PromotionPayload) => Promise<void>;
};

const StyledSelect = chakra('select');

const toDatetimeLocal = (value?: string | null) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  return localDate.toISOString().slice(0, 16);
};

const toIsoString = (value: string) => {
  return value ? new Date(value).toISOString() : null;
};

const numberOrNull = (value: string) => {
  if (!value.trim()) {
    return null;
  }

  return Number(value);
};

const splitList = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .map(String)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return String(value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const joinList = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  return String(value ?? '');
};

const objectValue = (value: unknown) => {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
};

const conditionValueToForm = (type: string, value: unknown) => {
  const currentValue = objectValue(value);

  switch (type) {
    case 'hasProduct':
    case 'hasAllProducts':
      return {
        productIds: joinList(currentValue.productIds ?? value),
      };

    case 'hasBrand':
      return {
        brandIds: joinList(currentValue.brandIds ?? value),
      };

    case 'hasCategory':
      return {
        categoryIds: joinList(currentValue.categoryIds ?? value),
      };

    case 'minQuantityOfProduct':
    case 'maxQuantityOfProduct':
      return {
        productId: String(currentValue.productId ?? ''),
        quantity: String(currentValue.quantity ?? currentValue.qty ?? ''),
      };

    case 'dateBetween':
      return {
        from: toDatetimeLocal(String(currentValue.from ?? '')),
        to: toDatetimeLocal(String(currentValue.to ?? '')),
      };

    default:
      return value ?? '';
  }
};

const effectValueToForm = (type: string, value: unknown) => {
  const currentValue = objectValue(value);

  switch (type) {
    case 'percentDiscountOnProduct':
    case 'fixedDiscountOnProduct':
    case 'bundlePercentDiscount':
      return {
        productIds: joinList(currentValue.productIds ?? currentValue.productId),
        percent: String(currentValue.percent ?? ''),
        amount: String(currentValue.amount ?? ''),
      };

    case 'percentDiscountOnBrand':
      return {
        brandIds: joinList(currentValue.brandIds),
        percent: String(currentValue.percent ?? ''),
      };

    case 'productGift':
    case 'freeProduct':
      return {
        productId: String(currentValue.productId ?? ''),
        quantity: String(currentValue.quantity ?? ''),
      };

    default:
      return value ?? '';
  }
};

const payloadToFormRules = (
  payload: unknown,
  valueMapper: (type: string, value: unknown) => unknown,
) => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return [];
  }

  return Object.entries(payload).map(([type, value]) => ({
    type,
    value: valueMapper(type, value),
  }));
};

const getDefaultValues = (
  promotion?: Promotion | null,
): PromotionFormValues => {
  return {
    title: promotion?.title ?? '',
    slug: promotion?.slug ?? '',
    description: promotion?.description ?? '',
    type: promotion?.type ?? 'PRODUCT_DISCOUNT',
    priority: String(promotion?.priority ?? 0),
    stackable: Boolean(promotion?.stackable),
    imageUrl: promotion?.imageUrl ?? '',
    imageUrlMobile: promotion?.imageUrlMobile ?? '',
    productText: promotion?.productText ?? '',
    isPageVisible: promotion?.isPageVisible ?? true,
    isShowTimer: Boolean(promotion?.isShowTimer),
    startAt: promotion?.startAt
      ? toDatetimeLocal(promotion.startAt)
      : toDatetimeLocal(new Date().toISOString()),
    endAt: toDatetimeLocal(promotion?.endAt),
    isActive: promotion?.isActive ?? true,
    usageLimit: promotion?.usageLimit ? String(promotion.usageLimit) : '',
    perUserLimit: promotion?.perUserLimit ? String(promotion.perUserLimit) : '',
    conditions: payloadToFormRules(promotion?.conditions, conditionValueToForm),
    effects: payloadToFormRules(promotion?.effects, effectValueToForm),
  };
};

const getDefaultConditionValue = (type: string) => {
  switch (type) {
    case 'hasProduct':
    case 'hasAllProducts':
      return { productIds: '' };
    case 'hasBrand':
      return { brandIds: '' };
    case 'hasCategory':
      return { categoryIds: '' };
    case 'minQuantityOfProduct':
    case 'maxQuantityOfProduct':
      return { productId: '', quantity: '' };
    case 'dateBetween':
      return { from: '', to: '' };
    case 'usageLimitNotReached':
    case 'perUserLimitNotReached':
      return null;
    default:
      return '';
  }
};

const getDefaultEffectValue = (type: string) => {
  switch (type) {
    case 'percentDiscountOnProduct':
    case 'fixedDiscountOnProduct':
    case 'bundlePercentDiscount':
      return { productIds: '', percent: '', amount: '' };
    case 'percentDiscountOnBrand':
      return { brandIds: '', percent: '' };
    case 'productGift':
    case 'freeProduct':
      return { productId: '', quantity: '' };
    case 'freeCheapestItem':
    case 'none':
      return null;
    default:
      return '';
  }
};

const serializeConditionValue = (type: string, value: unknown) => {
  const currentValue = objectValue(value);

  switch (type) {
    case 'cartTotalGte':
    case 'cartTotalLte':
      return Number(value);
    case 'hasProduct':
    case 'hasAllProducts':
      return { productIds: splitList(currentValue.productIds ?? value) };
    case 'hasBrand':
      return { brandIds: splitList(currentValue.brandIds ?? value) };
    case 'hasCategory':
      return { categoryIds: splitList(currentValue.categoryIds ?? value) };
    case 'minQuantityOfProduct':
    case 'maxQuantityOfProduct':
      return {
        productId: String(currentValue.productId ?? ''),
        quantity: Number(currentValue.quantity ?? currentValue.qty ?? 0),
      };
    case 'dateBetween':
      return {
        from: toIsoString(String(currentValue.from ?? '')),
        to: toIsoString(String(currentValue.to ?? '')),
      };
    case 'usageLimitNotReached':
    case 'perUserLimitNotReached':
      return null;
    default:
      return value ?? null;
  }
};

const serializeEffectValue = (type: string, value: unknown) => {
  const currentValue = objectValue(value);

  switch (type) {
    case 'fixedDiscount':
    case 'percentDiscount':
    case 'percentDiscountOnEveryProduct':
      return Number(value);
    case 'percentDiscountOnProduct':
      return {
        productIds: splitList(currentValue.productIds),
        percent: Number(currentValue.percent ?? 0),
      };
    case 'fixedDiscountOnProduct':
      return {
        productIds: splitList(currentValue.productIds),
        amount: Number(currentValue.amount ?? 0),
      };
    case 'percentDiscountOnBrand':
      return {
        brandIds: splitList(currentValue.brandIds),
        percent: Number(currentValue.percent ?? 0),
      };
    case 'bundlePercentDiscount':
      return {
        productIds: splitList(currentValue.productIds),
        percent: Number(currentValue.percent ?? 0),
      };
    case 'productGift':
    case 'freeProduct':
      return {
        productId: String(currentValue.productId ?? ''),
        quantity: Number(currentValue.quantity ?? 0),
      };
    case 'freeCheapestItem':
    case 'none':
      return null;
    default:
      return value ?? null;
  }
};

const serializeRules = (
  rules: PromotionRuleItem[],
  valueSerializer: (type: string, value: unknown) => unknown,
) => {
  return rules.reduce<Record<string, unknown>>((result, rule) => {
    if (!rule.type) {
      return result;
    }

    result[rule.type] = valueSerializer(rule.type, rule.value);

    return result;
  }, {});
};

export const PromotionForm = ({ promotion, isLoading, onSubmit }: Props) => {
  const {
    control,
    register,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<PromotionFormValues>({
    defaultValues: getDefaultValues(promotion),
  });

  const conditions = useFieldArray({
    control,
    name: 'conditions',
  });
  const effects = useFieldArray({
    control,
    name: 'effects',
  });

  useEffect(() => {
    reset(getDefaultValues(promotion));
  }, [promotion, reset]);

  const title = promotion ? 'Редагувати акцію' : 'Створити акцію';

  const submitForm = handleSubmit(async (values) => {
    const payload: PromotionPayload = {
      title: values.title.trim(),
      slug: values.slug.trim(),
      description: values.description.trim(),
      type: values.type,
      priority: Number(values.priority || 0),
      stackable: values.stackable,
      imageUrl: values.imageUrl,
      imageUrlMobile: values.imageUrlMobile,
      productText: values.productText.trim(),
      isPageVisible: values.isPageVisible,
      isShowTimer: values.isShowTimer,
      startAt: toIsoString(values.startAt) ?? new Date().toISOString(),
      endAt: toIsoString(values.endAt),
      isActive: values.isActive,
      usageLimit: numberOrNull(values.usageLimit),
      perUserLimit: numberOrNull(values.perUserLimit),
      conditions: serializeRules(values.conditions, serializeConditionValue),
      effects: serializeRules(values.effects, serializeEffectValue),
    };

    await onSubmit(payload);
  });

  const handleSubmitEvent = (event: FormEvent<HTMLElement>) => {
    event.preventDefault();
    void submitForm();
  };

  return (
    <Box as="form" onSubmit={handleSubmitEvent}>
      <Stack gap={5}>
        <HStack justify="space-between" align="start" gap={4} wrap="wrap">
          <Box>
            <Text fontSize="2xl" fontWeight="900" color="della.text">
              {title}
            </Text>
            <Text mt={1} color="gray.500" fontSize="sm">
              Conditions та effects зберігаються як JSON payload для backend
              promotion engine.
            </Text>
          </Box>

          <Button asChild variant="outline">
            <Link href="/promotions">
              <LuArrowLeft />
              До акцій
            </Link>
          </Button>
        </HStack>

        <Stack gap={5}>
          <ProductFormSection title="Про акцію">
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
              <Controller
                control={control}
                name="imageUrl"
                render={({ field }) => (
                  <FileUploadField
                    label="Зображення промоакції (16:9)"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="imageUrlMobile"
                render={({ field }) => (
                  <FileUploadField
                    label="Зображення для мобільного (4:5)"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </SimpleGrid>

            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
              gap={4}
            >
              <GridItem>
                <Field.Root invalid={Boolean(errors.type)} required>
                  <Field.Label>Тип акції</Field.Label>
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <StyledSelect
                        value={field.value}
                        h="40px"
                        w="100%"
                        px={3}
                        border="1px solid"
                        borderColor="blackAlpha.200"
                        borderRadius="lg"
                        bg="white"
                        onChange={(event) =>
                          field.onChange(event.currentTarget.value)
                        }
                      >
                        {PROMOTION_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </StyledSelect>
                    )}
                  />
                </Field.Root>
              </GridItem>

              <GridItem>
                <Field.Root invalid={Boolean(errors.priority)} required>
                  <Field.Label>Пріоритет</Field.Label>
                  <Input
                    type="number"
                    {...register('priority', {
                      required: 'Введіть пріоритет',
                    })}
                  />
                  <Field.ErrorText>{errors.priority?.message}</Field.ErrorText>
                </Field.Root>
              </GridItem>

              <GridItem>
                <Field.Root invalid={Boolean(errors.title)} required>
                  <Field.Label>Назва</Field.Label>
                  <Input
                    {...register('title', {
                      required: 'Введіть назву',
                    })}
                  />
                  <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                </Field.Root>
              </GridItem>

              <GridItem>
                <Field.Root invalid={Boolean(errors.slug)} required>
                  <Field.Label>Slug</Field.Label>
                  <Input
                    placeholder="summer-sale"
                    {...register('slug', {
                      required: 'Введіть slug',
                    })}
                  />
                  <Field.ErrorText>{errors.slug?.message}</Field.ErrorText>
                </Field.Root>
              </GridItem>

              <GridItem>
                <Field.Root>
                  <Field.Label>Текст знижки на продукті</Field.Label>
                  <Input {...register('productText')} />
                </Field.Root>
              </GridItem>

              <GridItem>
                <Field.Root invalid={Boolean(errors.startAt)} required>
                  <Field.Label>Початок</Field.Label>
                  <Input
                    type="datetime-local"
                    {...register('startAt', {
                      required: 'Вкажіть дату початку',
                    })}
                  />
                  <Field.ErrorText>{errors.startAt?.message}</Field.ErrorText>
                </Field.Root>
              </GridItem>

              <GridItem>
                <Field.Root>
                  <Field.Label>Закінчення</Field.Label>
                  <Input type="datetime-local" {...register('endAt')} />
                </Field.Root>
              </GridItem>

              <GridItem>
                <Field.Root>
                  <Field.Label>Загальний ліміт</Field.Label>
                  <Input
                    type="number"
                    placeholder="Без ліміту"
                    {...register('usageLimit')}
                  />
                </Field.Root>
              </GridItem>

              <GridItem>
                <Field.Root>
                  <Field.Label>Ліміт на користувача</Field.Label>
                  <Input
                    type="number"
                    placeholder="Без ліміту"
                    {...register('perUserLimit')}
                  />
                </Field.Root>
              </GridItem>

              <GridItem colSpan={{ base: 1, md: 2 }}>
                <Field.Root>
                  <Field.Label>Опис</Field.Label>
                  <Textarea
                    minH="120px"
                    placeholder="HTML або текст опису..."
                    {...register('description')}
                  />
                </Field.Root>
              </GridItem>
            </Grid>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <AdminSwitchField
                control={control}
                name="stackable"
                label="Можна поєднувати з іншими акціями"
              />
              <AdminSwitchField
                control={control}
                name="isActive"
                label="Активовано"
              />
              <AdminSwitchField
                control={control}
                name="isShowTimer"
                label="Показувати таймер"
              />
              <AdminSwitchField
                control={control}
                name="isPageVisible"
                label="Показувати банер та сторінку акції"
              />
            </SimpleGrid>
          </ProductFormSection>

          <ProductFormSection
            title="Conditions"
            description="Умови, за яких promotion engine застосує акцію."
          >
            <VStack align="stretch" gap={4}>
              {conditions.fields.map((field, index) => (
                <Box
                  key={field.id}
                  p={4}
                  border="1px solid"
                  borderColor="blackAlpha.100"
                  borderRadius="xl"
                >
                  <HStack align="start" gap={3}>
                    <VStack align="stretch" flex={1} gap={3}>
                      <Controller
                        control={control}
                        name={`conditions.${index}.type`}
                        render={({ field: typeField }) => (
                          <StyledSelect
                            value={typeField.value}
                            h="40px"
                            w="100%"
                            px={3}
                            border="1px solid"
                            borderColor="blackAlpha.200"
                            borderRadius="lg"
                            bg="white"
                            onChange={(event) => {
                              const nextType = event.currentTarget.value;
                              typeField.onChange(nextType);
                              setValue(
                                `conditions.${index}.value`,
                                getDefaultConditionValue(nextType),
                              );
                            }}
                          >
                            <option value="">Оберіть умову</option>
                            {PROMOTION_CONDITIONS.map((condition) => (
                              <option
                                key={condition.type}
                                value={condition.type}
                              >
                                {condition.label}
                              </option>
                            ))}
                          </StyledSelect>
                        )}
                      />

                      <PromotionConditionValueInput
                        index={index}
                        control={control}
                        watch={watch}
                      />
                    </VStack>

                    <IconButton
                      type="button"
                      variant="outline"
                      colorPalette="red"
                      aria-label="Видалити умову"
                      onClick={() => conditions.remove(index)}
                    >
                      <LuTrash2 />
                    </IconButton>
                  </HStack>
                </Box>
              ))}

              <Button
                type="button"
                variant="outline"
                w="fit-content"
                onClick={() => conditions.append(emptyRule())}
              >
                <LuPlus />
                Додати умову
              </Button>
            </VStack>
          </ProductFormSection>

          <ProductFormSection
            title="Effects"
            description="Дії, які promotion engine застосує після виконання умов."
          >
            <VStack align="stretch" gap={4}>
              {effects.fields.map((field, index) => (
                <Box
                  key={field.id}
                  p={4}
                  border="1px solid"
                  borderColor="blackAlpha.100"
                  borderRadius="xl"
                >
                  <HStack align="start" gap={3}>
                    <VStack align="stretch" flex={1} gap={3}>
                      <Controller
                        control={control}
                        name={`effects.${index}.type`}
                        render={({ field: typeField }) => (
                          <StyledSelect
                            value={typeField.value}
                            h="40px"
                            w="100%"
                            px={3}
                            border="1px solid"
                            borderColor="blackAlpha.200"
                            borderRadius="lg"
                            bg="white"
                            onChange={(event) => {
                              const nextType = event.currentTarget.value;
                              typeField.onChange(nextType);
                              setValue(
                                `effects.${index}.value`,
                                getDefaultEffectValue(nextType),
                              );
                            }}
                          >
                            <option value="">Оберіть ефект</option>
                            {PROMOTION_EFFECTS.map((effect) => (
                              <option key={effect.type} value={effect.type}>
                                {effect.label}
                              </option>
                            ))}
                          </StyledSelect>
                        )}
                      />

                      <PromotionEffectValueInput
                        index={index}
                        control={control}
                        watch={watch}
                      />
                    </VStack>

                    <IconButton
                      type="button"
                      variant="outline"
                      colorPalette="red"
                      aria-label="Видалити ефект"
                      onClick={() => effects.remove(index)}
                    >
                      <LuTrash2 />
                    </IconButton>
                  </HStack>
                </Box>
              ))}

              <Button
                type="button"
                variant="outline"
                w="fit-content"
                onClick={() => effects.append(emptyRule())}
              >
                <LuPlus />
                Додати ефект
              </Button>
            </VStack>
          </ProductFormSection>
        </Stack>

        <Box
          position="sticky"
          bottom={0}
          zIndex={1}
          bg="della.backgroundSecondary"
          py={4}
        >
          <HStack justify="flex-end" gap={3}>
            <Button asChild type="button" variant="outline">
              <Link href="/promotions">Скасувати</Link>
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
        </Box>
      </Stack>
    </Box>
  );
};
