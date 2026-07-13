'use client';

import { useState } from 'react';

import {
  Badge,
  Box,
  Button,
  Field,
  Flex,
  HStack,
  IconButton,
  Image,
  Input,
  NumberInput,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { LuRefreshCw, LuSave, LuTrash2, LuX } from 'react-icons/lu';
import { useForm } from 'react-hook-form';

import {
  useDeleteProductVariant,
  useSyncSmartKasaStock,
  useToggleProductVariantVisibility,
  useUpdateProductVariant,
} from '@/hooks/mutations/productVariant/useProductVariantMutations';
import { ProductVariant, ProductVariantPayload } from '@/types/product';

import { VariantUnitSelect } from './VariantUnitSelect';

const S3_BASE_URL = 'https://dellaroseebucket.s3.us-east-1.amazonaws.com/';

type Props = {
  variant: ProductVariant;
};

type FormValues = {
  title: string;
  code: string;
  value: string;
  unit: string;
  basePrice: string;
  price: string;
  discount: string;
  quantity: string;
  reservedCount: string;
  cardId: string;
  image: string;
  imageSecondary: string;
  imagesText: string;
};

const getDefaultValues = (variant: ProductVariant): FormValues => {
  return {
    title: variant.title ?? '',
    code: variant.code ?? '',
    value: String(variant.value ?? ''),
    unit: variant.unit ?? 'ml',
    basePrice: String(variant.basePrice ?? ''),
    price: String(variant.price ?? variant.basePrice ?? ''),
    discount: variant.discount ?? '',
    quantity: String(variant.quantity ?? 0),
    reservedCount: String(variant.reservedCount ?? 0),
    cardId: String(variant.cardId ?? ''),
    image: variant.image ?? '',
    imageSecondary: variant.imageSecondary ?? '',
    imagesText: variant.images?.join('\n') ?? '',
  };
};

const parseImages = (value: string) => {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
};

const buildImageUrl = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) return '';

  if (trimmedValue.startsWith('http')) {
    return trimmedValue;
  }

  return `${S3_BASE_URL}${trimmedValue}`;
};

const buildPayload = (values: FormValues): ProductVariantPayload => {
  const basePrice = Number(values.basePrice) || 0;
  const price = Number(values.price) || basePrice;

  return {
    title: values.title.trim(),
    code: values.code.trim(),
    value: Number(values.value) || 0,
    unit: values.unit,
    basePrice,
    price,
    discount: values.discount.trim(),
    quantity: Number(values.quantity) || 0,
    reservedCount: Number(values.reservedCount) || 0,
    cardId: Number(values.cardId),
    image: buildImageUrl(values.image),
    imageSecondary: buildImageUrl(values.imageSecondary),
    images: parseImages(values.imagesText).map(buildImageUrl),
  };
};

export const ProductVariantCard = ({ variant }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const updateVariant = useUpdateProductVariant(variant.id, variant.productId);
  const toggleVisibility = useToggleProductVariantVisibility(variant);
  const deleteVariant = useDeleteProductVariant(variant.id, variant.productId);
  const syncStock = useSyncSmartKasaStock(variant);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: getDefaultValues(variant),
  });

  const isPending =
    updateVariant.isPending ||
    toggleVisibility.isPending ||
    deleteVariant.isPending ||
    syncStock.isPending;

  const submit = handleSubmit((values) => {
    updateVariant.mutate(buildPayload(values), {
      onSuccess: (updatedVariant) => {
        reset(getDefaultValues(updatedVariant));
        setIsEditing(false);
      },
    });
  });

  const cancelEditing = () => {
    reset(getDefaultValues(variant));
    setIsEditing(false);
  };

  const removeVariant = () => {
    const confirmed = window.confirm('Видалити цей варіант продукту?');

    if (confirmed) {
      deleteVariant.mutate();
    }
  };

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="blackAlpha.100"
      borderRadius="2xl"
      p={{ base: 4, md: 5 }}
      boxShadow="sm"
    >
      <form onSubmit={submit}>
        <Stack gap={5}>
          <Flex
            align={{ base: 'start', md: 'center' }}
            justify="space-between"
            gap={4}
            direction={{ base: 'column', md: 'row' }}
          >
            <HStack gap={4} align="center">
              <Box
                w="72px"
                h="72px"
                borderRadius="xl"
                overflow="hidden"
                bg="gray.50"
                border="1px solid"
                borderColor="blackAlpha.100"
              >
                {variant.image ? (
                  <Image
                    src={variant.image}
                    alt={variant.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                ) : (
                  <Flex h="100%" align="center" justify="center">
                    <Text fontSize="xs" color="gray.400">
                      No image
                    </Text>
                  </Flex>
                )}
              </Box>

              <Box>
                <HStack gap={2} wrap="wrap">
                  <Text fontWeight="900" color="della.text">
                    {variant.title}
                  </Text>

                  <Badge colorPalette={variant.isVisible ? 'green' : 'red'}>
                    {variant.isVisible ? 'Активний' : 'Не активний'}
                  </Badge>
                </HStack>

                <Text mt={1} fontSize="sm" color="gray.500">
                  ID #{variant.id} · SmartKasa {variant.cardId} ·{' '}
                  {variant.value} {variant.unit}
                </Text>
              </Box>
            </HStack>

            <HStack gap={2} wrap="wrap">
              <Button
                type="button"
                size="sm"
                variant="outline"
                loading={syncStock.isPending}
                onClick={() => syncStock.mutate()}
              >
                <LuRefreshCw />
                Sync stock
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                loading={toggleVisibility.isPending}
                onClick={() => toggleVisibility.mutate()}
              >
                {variant.isVisible ? 'Деактивувати' : 'Активувати'}
              </Button>

              {!isEditing ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  bg="della.primary"
                  color="della.text"
                  _hover={{ bg: 'della.primaryHover' }}
                >
                  Редагувати
                </Button>
              ) : (
                <IconButton
                  type="button"
                  size="sm"
                  variant="outline"
                  aria-label="Скасувати редагування"
                  onClick={cancelEditing}
                >
                  <LuX />
                </IconButton>
              )}
            </HStack>
          </Flex>

          {!isEditing ? (
            <SimpleGrid columns={{ base: 2, md: 4 }} gap={3}>
              <Box>
                <Text fontSize="xs" color="gray.500">
                  Ціна
                </Text>
                <Text fontWeight="800">{variant.price} ₴</Text>
              </Box>

              <Box>
                <Text fontSize="xs" color="gray.500">
                  Без знижки
                </Text>
                <Text fontWeight="800">{variant.basePrice} ₴</Text>
              </Box>

              <Box>
                <Text fontSize="xs" color="gray.500">
                  На складі
                </Text>
                <Text fontWeight="800">{variant.quantity}</Text>
              </Box>

              <Box>
                <Text fontSize="xs" color="gray.500">
                  Зарезервовано
                </Text>
                <Text fontWeight="800">{variant.reservedCount}</Text>
              </Box>
            </SimpleGrid>
          ) : (
            <Stack gap={5}>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <Field.Root invalid={!!errors.title}>
                  <Field.Label>Назва варіанту</Field.Label>
                  <Input
                    {...register('title', {
                      required: 'Вкажіть назву варіанту',
                    })}
                  />
                  <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.code}>
                  <Field.Label>Код продукту</Field.Label>
                  <Input
                    {...register('code', {
                      required: 'Вкажіть код',
                    })}
                  />
                  <Field.ErrorText>{errors.code?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root>
                  <Field.Label>Обʼєм / кількість</Field.Label>
                  <NumberInput.Root
                    value={watch('value')}
                    onValueChange={({ value }) => setValue('value', value)}
                  >
                    <NumberInput.Control />
                    <NumberInput.Input />
                  </NumberInput.Root>
                </Field.Root>

                <VariantUnitSelect
                  value={watch('unit')}
                  onChange={(value) =>
                    setValue('unit', value, {
                      shouldDirty: true,
                    })
                  }
                />

                <Field.Root>
                  <Field.Label>Ціна без знижки</Field.Label>
                  <NumberInput.Root
                    value={watch('basePrice')}
                    onValueChange={({ value }) => setValue('basePrice', value)}
                  >
                    <NumberInput.Control />
                    <NumberInput.Input />
                  </NumberInput.Root>
                </Field.Root>

                <Field.Root>
                  <Field.Label>Ціна зі знижкою</Field.Label>
                  <NumberInput.Root
                    value={watch('price')}
                    onValueChange={({ value }) => setValue('price', value)}
                  >
                    <NumberInput.Control />
                    <NumberInput.Input />
                  </NumberInput.Root>
                </Field.Root>

                <Field.Root>
                  <Field.Label>Кількість</Field.Label>
                  <NumberInput.Root
                    value={watch('quantity')}
                    onValueChange={({ value }) => setValue('quantity', value)}
                  >
                    <NumberInput.Control />
                    <NumberInput.Input />
                  </NumberInput.Root>
                </Field.Root>

                <Field.Root>
                  <Field.Label>Зарезервовано</Field.Label>
                  <NumberInput.Root
                    value={watch('reservedCount')}
                    onValueChange={({ value }) =>
                      setValue('reservedCount', value)
                    }
                  >
                    <NumberInput.Control />
                    <NumberInput.Input />
                  </NumberInput.Root>
                </Field.Root>

                <Field.Root>
                  <Field.Label>SmartKasa cardId</Field.Label>
                  <Input {...register('cardId')} />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Знижка текстом</Field.Label>
                  <Input
                    placeholder="20%, -100 грн"
                    {...register('discount')}
                  />
                </Field.Root>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <Field.Root>
                  <Field.Label>Основне фото</Field.Label>
                  <Input
                    placeholder={`${S3_BASE_URL}... або назва файлу`}
                    {...register('image')}
                  />
                  <Field.HelperText>
                    Можна вставити повний URL або шлях у S3 bucket.
                  </Field.HelperText>
                </Field.Root>

                <Field.Root>
                  <Field.Label>Друге фото</Field.Label>
                  <Input
                    placeholder={`${S3_BASE_URL}... або назва файлу`}
                    {...register('imageSecondary')}
                  />
                </Field.Root>
              </SimpleGrid>

              <Field.Root>
                <Field.Label>Галерея фото</Field.Label>
                <Textarea
                  minH="110px"
                  placeholder="Кожне фото з нового рядка"
                  {...register('imagesText')}
                />
                <Field.HelperText>
                  Якщо ввести тільки назву файлу, буде додано S3 prefix.
                </Field.HelperText>
              </Field.Root>

              <Flex justify="space-between" gap={3} wrap="wrap">
                <Button
                  type="button"
                  colorPalette="red"
                  variant="outline"
                  loading={deleteVariant.isPending}
                  onClick={removeVariant}
                >
                  <LuTrash2 />
                  Видалити
                </Button>

                <HStack gap={2}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEditing}
                  >
                    Скасувати
                  </Button>

                  <Button
                    type="submit"
                    loading={updateVariant.isPending}
                    disabled={!isDirty || isPending}
                    bg="della.primary"
                    color="della.text"
                    _hover={{ bg: 'della.primaryHover' }}
                  >
                    <LuSave />
                    Зберегти
                  </Button>
                </HStack>
              </Flex>
            </Stack>
          )}
        </Stack>
      </form>
    </Box>
  );
};
