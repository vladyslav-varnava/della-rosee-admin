'use client';

import { useMemo } from 'react';

import {
  Badge,
  Box,
  Button,
  Field,
  Flex,
  HStack,
  Input,
  NumberInput,
  Separator,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { LuRefreshCw, LuSave, LuTrash2 } from 'react-icons/lu';

import { FileUploadField } from '@/components/admin/FileUploadField';
import {
  useDeleteProductVariant,
  useSyncSmartKasaStock,
  useToggleProductVariantVisibility,
  useUpdateProductVariant,
} from '@/hooks/mutations/productVariant/useProductVariantMutations';
import { ProductVariant, ProductVariantPayload } from '@/types/product';

import { VariantUnitSelect } from './VariantUnitSelect';

type Props = {
  productId: number;
  productTitle: string;
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
  images: string[];
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
    images: variant.images ?? [],
  };
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
    image: values.image,
    imageSecondary: values.imageSecondary,
    images: values.images,
  };
};

export const ProductVariantForm = ({
  productId,
  productTitle,
  variant,
}: Props) => {
  const updateVariant = useUpdateProductVariant(variant.id, productId);
  const toggleVisibility = useToggleProductVariantVisibility(variant);
  const deleteVariant = useDeleteProductVariant(variant.id, productId);
  const syncStock = useSyncSmartKasaStock(variant);

  const {
    control,
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

  const image = watch('image');
  const imageSecondary = watch('imageSecondary');
  const galleryImages = watch('images');

  const pageTitle = useMemo(() => {
    return `${variant.title} · ${variant.value} ${variant.unit}`;
  }, [variant.title, variant.unit, variant.value]);

  const submit = handleSubmit((values) => {
    updateVariant.mutate(buildPayload(values), {
      onSuccess: (updatedVariant) => {
        reset(getDefaultValues(updatedVariant));
      },
    });
  });

  const removeVariant = () => {
    const confirmed = window.confirm('Видалити цей варіант продукту?');

    if (confirmed) {
      deleteVariant.mutate();
    }
  };

  const addGalleryImage = () => {
    setValue('images', [...galleryImages, ''], {
      shouldDirty: true,
    });
  };

  const updateGalleryImage = (index: number, value: string) => {
    setValue(
      'images',
      galleryImages.map((item, imageIndex) =>
        imageIndex === index ? value : item,
      ),
      {
        shouldDirty: true,
      },
    );
  };

  const removeGalleryImage = (index: number) => {
    setValue(
      'images',
      galleryImages.filter((_, imageIndex) => imageIndex !== index),
      {
        shouldDirty: true,
      },
    );
  };

  return (
    <form onSubmit={submit}>
      <Stack gap={5}>
        <Box
          bg="white"
          border="1px solid"
          borderColor="blackAlpha.100"
          borderRadius="2xl"
          p={{ base: 4, md: 6 }}
          boxShadow="sm"
        >
          <Stack gap={4}>
            <Flex
              justify="space-between"
              align={{ base: 'start', md: 'center' }}
              direction={{ base: 'column', md: 'row' }}
              gap={3}
            >
              <Box>
                <Text fontSize="sm" color="gray.500">
                  {productTitle}
                </Text>

                <Text fontSize="2xl" fontWeight="900" color="della.text">
                  {pageTitle}
                </Text>

                <Text mt={1} color="gray.500">
                  Variant ID #{variant.id} · SmartKasa {variant.cardId}
                </Text>
              </Box>

              <HStack gap={2} wrap="wrap">
                <Badge colorPalette={variant.isVisible ? 'green' : 'red'}>
                  {variant.isVisible ? 'Активний' : 'Не активний'}
                </Badge>

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
              </HStack>
            </Flex>
          </Stack>
        </Box>

        <Box
          bg="white"
          border="1px solid"
          borderColor="blackAlpha.100"
          borderRadius="2xl"
          p={{ base: 4, md: 6 }}
          boxShadow="sm"
        >
          <Stack gap={5}>
            <Box>
              <Text fontSize="lg" fontWeight="900" color="della.text">
                Основна інформація
              </Text>
              <Text fontSize="sm" color="gray.500">
                Назва, код, ціни, залишки та SmartKasa.
              </Text>
            </Box>

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
                  onValueChange={({ value }) =>
                    setValue('value', value, { shouldDirty: true })
                  }
                >
                  <NumberInput.Control />
                  <NumberInput.Input />
                </NumberInput.Root>
              </Field.Root>

              <Controller
                control={control}
                name="unit"
                render={({ field }) => (
                  <VariantUnitSelect
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />

              <Field.Root>
                <Field.Label>Ціна без знижки</Field.Label>
                <NumberInput.Root
                  value={watch('basePrice')}
                  onValueChange={({ value }) =>
                    setValue('basePrice', value, { shouldDirty: true })
                  }
                >
                  <NumberInput.Control />
                  <NumberInput.Input />
                </NumberInput.Root>
              </Field.Root>

              <Field.Root>
                <Field.Label>Ціна зі знижкою</Field.Label>
                <NumberInput.Root
                  value={watch('price')}
                  onValueChange={({ value }) =>
                    setValue('price', value, { shouldDirty: true })
                  }
                >
                  <NumberInput.Control />
                  <NumberInput.Input />
                </NumberInput.Root>
              </Field.Root>

              <Field.Root>
                <Field.Label>Кількість</Field.Label>
                <NumberInput.Root
                  value={watch('quantity')}
                  onValueChange={({ value }) =>
                    setValue('quantity', value, { shouldDirty: true })
                  }
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
                    setValue('reservedCount', value, { shouldDirty: true })
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
                <Input placeholder="20%, -100 грн" {...register('discount')} />
              </Field.Root>
            </SimpleGrid>
          </Stack>
        </Box>

        <Box
          bg="white"
          border="1px solid"
          borderColor="blackAlpha.100"
          borderRadius="2xl"
          p={{ base: 4, md: 6 }}
          boxShadow="sm"
        >
          <Stack gap={5}>
            <Box>
              <Text fontSize="lg" fontWeight="900" color="della.text">
                Фото
              </Text>

              <Text fontSize="sm" color="gray.500">
                Оберіть файл. Після завантаження у форму буде записано S3 URL.
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={5}>
              <FileUploadField
                label="Основне фото"
                value={image}
                onChange={(value) =>
                  setValue('image', value, { shouldDirty: true })
                }
              />

              <FileUploadField
                label="Друге фото"
                value={imageSecondary}
                onChange={(value) =>
                  setValue('imageSecondary', value, { shouldDirty: true })
                }
              />
            </SimpleGrid>

            <Separator />

            <Stack gap={4}>
              <Flex justify="space-between" align="center" gap={3}>
                <Box>
                  <Text fontWeight="800" color="della.text">
                    Галерея
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Можна додати декілька фото.
                  </Text>
                </Box>

                <Button
                  type="button"
                  variant="outline"
                  onClick={addGalleryImage}
                >
                  Додати фото
                </Button>
              </Flex>

              {galleryImages.length === 0 ? (
                <Box
                  p={8}
                  border="1px dashed"
                  borderColor="blackAlpha.200"
                  borderRadius="xl"
                  textAlign="center"
                  bg="gray.50"
                >
                  <Text color="gray.500">Фото в галереї ще немає</Text>
                </Box>
              ) : (
                <SimpleGrid columns={{ base: 1, lg: 2 }} gap={5}>
                  {galleryImages.map((galleryImage, index) => (
                    <Box key={`${galleryImage}-${index}`}>
                      <FileUploadField
                        label={`Фото ${index + 1}`}
                        value={galleryImage}
                        onChange={(value) => updateGalleryImage(index, value)}
                      />

                      <Button
                        type="button"
                        mt={3}
                        size="sm"
                        colorPalette="red"
                        variant="outline"
                        onClick={() => removeGalleryImage(index)}
                      >
                        Видалити з галереї
                      </Button>
                    </Box>
                  ))}
                </SimpleGrid>
              )}
            </Stack>
          </Stack>
        </Box>

        <Box
          position="sticky"
          bottom={4}
          zIndex={20}
          bg="white"
          border="1px solid"
          borderColor="blackAlpha.100"
          borderRadius="2xl"
          p={4}
          boxShadow="0 16px 48px rgba(45, 45, 45, 0.14)"
        >
          <Flex
            justify="space-between"
            align={{ base: 'stretch', md: 'center' }}
            direction={{ base: 'column', md: 'row' }}
            gap={3}
          >
            <Box>
              <Text fontWeight="800" color="della.text">
                {isDirty ? 'Є незбережені зміни' : 'Змін поки немає'}
              </Text>

              <Text fontSize="sm" color="gray.500">
                Фото завантажуються в S3 одразу, але URL варіанту зберігається
                після натискання “Зберегти”.
              </Text>
            </Box>

            <HStack gap={3} wrap="wrap">
              <Button
                type="button"
                colorPalette="red"
                variant="outline"
                loading={deleteVariant.isPending}
                onClick={() => {
                  const confirmed = window.confirm(
                    'Видалити цей варіант продукту?',
                  );

                  if (confirmed) {
                    deleteVariant.mutate();
                  }
                }}
              >
                <LuTrash2 />
                Видалити
              </Button>

              <Button
                type="submit"
                loading={updateVariant.isPending || isPending}
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
        </Box>
      </Stack>
    </form>
  );
};
