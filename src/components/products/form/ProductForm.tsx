'use client';

import {
  bodyProductList,
  bodyTypesList,
  brandsList,
  commonProductTypesList,
  countriesTypesList,
  faceProductList,
  hairProductList,
  skinTypesList,
  treatsTypesList,
  useTimeList,
} from '@/constants/product-options';

import { MultiOptionSelectField } from './MultiOptionSelectField';
import { SingleOptionSelectField } from './SingleOptionSelectField';

import { useState } from 'react';
import { ProductVariantsSection } from '@/components/products/variants/ProductVariantsSection';
import dynamic from 'next/dynamic';

import {
  Badge,
  Box,
  Button,
  Center,
  Field,
  Flex,
  HStack,
  Input,
  Separator,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { LuPlus, LuSave, LuTrash2 } from 'react-icons/lu';

import { useActivateProduct } from '@/hooks/mutations/product/useActivateProduct';
import { useCreateProduct } from '@/hooks/mutations/product/useCreateProduct';
import { useDeactivateProduct } from '@/hooks/mutations/product/useDeactivateProduct';
import { useDeleteProduct } from '@/hooks/mutations/product/useDeleteProduct';
import { useUpdateProduct } from '@/hooks/mutations/product/useUpdateProduct';
import { useGetIngredients } from '@/hooks/query/useGetIngredients';
import {
  CreateProductInput,
  Product,
  ProductFormValues,
  UpdateProductPayload,
} from '@/types/product';

import { FormSwitch } from './FormSwitch';
import { ProductFormSection } from './ProductFormSection';
import { TextListField } from './TextListField';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
});

type Props = {
  product?: Product;
};

const splitValues = (value: string) => {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const joinValues = (values?: string[]) => {
  return values?.join(', ') ?? '';
};

const productTypeOptions = [
  ...faceProductList.map((item) => ({
    ...item,
    area: '💆‍♀️',
  })),
  ...bodyProductList.map((item) => ({
    ...item,
    area: '🧍‍♀️',
  })),
  ...hairProductList.map((item) => ({
    ...item,
    area: '👱‍♀️',
  })),
  ...commonProductTypesList.map((item) => ({
    ...item,
    area: '',
  })),
];

const getDefaultValues = (product?: Product): ProductFormValues => {
  return {
    title: product?.title ?? '',
    brand: product?.brand ?? '',
    shortDescription: product?.shortDescription ?? '',
    description: product?.description ?? '',
    syllable: product?.syllable ?? '',
    howToUse: product?.howToUse ?? '',

    country: product?.country ?? '',
    useTime: product?.useTime ?? '',

    isPopular: Boolean(product?.isPopular),
    isNew: Boolean(product?.isNew),
    isComingSoon: Boolean(product?.isComingSoon),
    isForMen: Boolean(product?.isForMen),
    isSet: Boolean(product?.isSet),
    hasActivePromotion: Boolean(product?.hasActivePromotion),

    types: product?.types ?? [],
    skinTypes: product?.skinTypes ?? [],
    treats: product?.treats ?? [],
    bodyType: product?.bodyType ?? [],
    ingredients: product?.ingredients ?? [],
  };
};

const buildPayload = (
  values: ProductFormValues,
  videos: string[],
  product?: Product,
): CreateProductInput => {
  return {
    isPopular: Boolean(values.isPopular),
    isNew: Boolean(values.isNew),
    isComingSoon: Boolean(values.isComingSoon),
    isForMen: Boolean(values.isForMen),
    isSet: Boolean(values.isSet),
    quantity: product?.quantity ?? 0,
    averageRating: 0,
    title: values.title.trim(),
    subtitle: product?.subtitle ?? '',
    description: values.description,
    shortDescription: values.shortDescription.trim(),
    syllable: values.syllable,
    hasActivePromotion: Boolean(values.hasActivePromotion),
    brand: values.brand.trim(),
    country: values.country,
    howToUse: values.howToUse,
    useTime: values.useTime,
    types: values.types,
    skinTypes: values.skinTypes,
    treats: values.treats,
    bodyType: values.bodyType,
    ingredients: values.ingredients,
    buyWith: [],
    videos: videos.map((video) => video.trim()).filter(Boolean),
  };
};

export const ProductForm = ({ product }: Props) => {
  const isEditMode = Boolean(product?.id);

  const [videos, setVideos] = useState<string[]>(product?.videos ?? []);

  const { data: ingredients, isPending: isIngredientsPending } =
    useGetIngredients();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct(product?.id ?? 0);
  const activateProduct = useActivateProduct(product?.id);
  const deactivateProduct = useDeactivateProduct(product?.id);
  const deleteProduct = useDeleteProduct(product?.id);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProductFormValues>({
    defaultValues: getDefaultValues(product),
  });

  const isPending =
    createProduct.isPending ||
    updateProduct.isPending ||
    activateProduct.isPending ||
    deactivateProduct.isPending ||
    deleteProduct.isPending ||
    isIngredientsPending;

  const isVisible = Boolean(product?.isVisible);

  const submitForm = handleSubmit((values) => {
    const payload = buildPayload(values, videos, product);

    if (isEditMode && product?.id) {
      updateProduct.mutate(payload as UpdateProductPayload);
      return;
    }

    createProduct.mutate(payload);
  });

  const toggleProductVisibility = () => {
    const confirmed = window.confirm(
      isVisible
        ? 'Деактивувати продукт? Він зникне з сайту.'
        : 'Активувати продукт? Він стане доступним на сайті.',
    );

    if (!confirmed) return;

    if (isVisible) {
      deactivateProduct.mutate();
      return;
    }

    activateProduct.mutate();
  };

  const removeProduct = () => {
    const confirmed = window.confirm(
      'Видалити продукт? Якщо треба лише сховати товар, краще деактивувати його.',
    );

    if (confirmed) {
      deleteProduct.mutate();
    }
  };

  const addVideo = () => {
    setVideos((currentVideos) => [...currentVideos, '']);
  };

  const updateVideo = (index: number, value: string) => {
    setVideos((currentVideos) =>
      currentVideos.map((video, videoIndex) =>
        videoIndex === index ? value : video,
      ),
    );
  };

  const removeVideo = (index: number) => {
    setVideos((currentVideos) =>
      currentVideos.filter((_, videoIndex) => videoIndex !== index),
    );
  };

  return (
    <Box position="relative">
      {isPending && (
        <Box
          position="fixed"
          inset={0}
          zIndex={1000}
          bg="whiteAlpha.700"
          backdropFilter="blur(2px)"
        >
          <Center h="100vh">
            <VStack>
              <Spinner color="della.primary" />
              <Text color="gray.600">Збереження...</Text>
            </VStack>
          </Center>
        </Box>
      )}
      <Stack gap={5}>
        <form onSubmit={submitForm}>
          <Stack gap={5}>
            <ProductFormSection
              title={isEditMode ? 'Редагування продукту' : 'Створення продукту'}
              description="Основна інформація, яка буде відображатися на сторінці товару."
            >
              <Flex gap={3} wrap="wrap">
                {isEditMode && (
                  <Badge
                    w="fit-content"
                    colorPalette={isVisible ? 'green' : 'red'}
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {isVisible ? 'Опубліковано' : 'Не опубліковано'}
                  </Badge>
                )}

                {watch('hasActivePromotion') && (
                  <Badge
                    w="fit-content"
                    colorPalette="purple"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    Акція
                  </Badge>
                )}

                {watch('isComingSoon') && (
                  <Badge
                    w="fit-content"
                    colorPalette="orange"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    Скоро
                  </Badge>
                )}
              </Flex>

              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <Field.Root invalid={!!errors.title}>
                  <Field.Label>Назва</Field.Label>
                  <Input
                    placeholder="Наприклад: Obagi Retinol 0.5"
                    {...register('title', {
                      required: 'Вкажіть назву продукту',
                    })}
                  />
                  <Field.HelperText>
                    Бренд бажано також вказувати в назві.
                  </Field.HelperText>
                  <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                </Field.Root>

                <Controller
                  control={control}
                  name="brand"
                  rules={{
                    required: 'Оберіть бренд',
                  }}
                  render={({ field }) => (
                    <SingleOptionSelectField
                      label="Бренд"
                      value={field.value}
                      options={brandsList}
                      placeholder="Оберіть бренд"
                      onChange={field.onChange}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="country"
                  render={({ field }) => (
                    <SingleOptionSelectField
                      label="Країна виробник"
                      value={field.value}
                      options={countriesTypesList}
                      placeholder="Оберіть країну"
                      onChange={field.onChange}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="useTime"
                  render={({ field }) => (
                    <SingleOptionSelectField
                      label="Час використання"
                      value={field.value}
                      options={useTimeList}
                      placeholder="Оберіть час використання"
                      onChange={field.onChange}
                    />
                  )}
                />
              </SimpleGrid>

              <Field.Root invalid={!!errors.shortDescription}>
                <Field.Label>Короткий опис</Field.Label>
                <Textarea
                  minH="120px"
                  placeholder="Короткий опис для картки та верхньої частини PDP"
                  {...register('shortDescription', {
                    required: 'Вкажіть короткий опис',
                  })}
                />
                <Field.ErrorText>
                  {errors.shortDescription?.message}
                </Field.ErrorText>
              </Field.Root>
            </ProductFormSection>

            <ProductFormSection
              title="Фільтри та категорії"
              description="Оберіть значення, які будуть використовуватись у фільтрах, меню та картках продукту."
            >
              <SimpleGrid columns={{ base: 1, xl: 2 }} gap={5}>
                <Controller
                  control={control}
                  name="bodyType"
                  render={({ field }) => (
                    <MultiOptionSelectField
                      label="Частина тіла"
                      value={field.value}
                      options={bodyTypesList}
                      helperText="Головний фільтр у шапці сайту."
                      onChange={field.onChange}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="types"
                  render={({ field }) => (
                    <MultiOptionSelectField
                      label="Типи товару"
                      value={field.value}
                      options={productTypeOptions}
                      helperText="Випадаюче меню в шапці сайту та фільтри."
                      placeholder="Пошук типу товару..."
                      onChange={field.onChange}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="skinTypes"
                  render={({ field }) => (
                    <MultiOptionSelectField
                      label="Тип шкіри"
                      value={field.value}
                      options={skinTypesList}
                      placeholder="Пошук типу шкіри..."
                      onChange={field.onChange}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="treats"
                  render={({ field }) => (
                    <MultiOptionSelectField
                      label="Проблеми / дія"
                      value={field.value}
                      options={treatsTypesList}
                      placeholder="Пошук проблеми..."
                      onChange={field.onChange}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="ingredients"
                  render={({ field }) => (
                    <MultiOptionSelectField
                      label="Інгредієнти"
                      value={field.value}
                      options={
                        ingredients
                          ?.slice()
                          .sort((a, b) => a.label.localeCompare(b.label, 'uk'))
                          .map((ingredient) => ({
                            value: ingredient.value,
                            label: ingredient.label,
                          })) ?? []
                      }
                      placeholder="Пошук інгредієнта..."
                      helperText="Список приходить з API /ingredients."
                      onChange={field.onChange}
                    />
                  )}
                />
              </SimpleGrid>
            </ProductFormSection>

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
                align={{ base: 'stretch', md: 'center' }}
                justify="space-between"
                direction={{ base: 'column', md: 'row' }}
                gap={3}
              >
                <Box>
                  <Text fontWeight="800" color="della.text">
                    {isDirty ? 'Є незбережені зміни' : 'Змін поки немає'}
                  </Text>

                  <Text fontSize="sm" color="gray.500">
                    Після створення продукт відкриється на сторінці редагування.
                  </Text>
                </Box>

                <HStack gap={3} wrap="wrap">
                  {isEditMode && (
                    <Button
                      type="button"
                      variant="outline"
                      loading={
                        activateProduct.isPending || deactivateProduct.isPending
                      }
                      onClick={toggleProductVisibility}
                    >
                      {isVisible ? 'Деактивувати' : 'Активувати'}
                    </Button>
                  )}

                  {isEditMode && (
                    <Button
                      type="button"
                      colorPalette="red"
                      variant="outline"
                      loading={deleteProduct.isPending}
                      onClick={removeProduct}
                    >
                      <LuTrash2 />
                      Видалити
                    </Button>
                  )}

                  <Button
                    type="submit"
                    bg="della.primary"
                    color="della.text"
                    _hover={{ bg: 'della.primaryHover' }}
                    loading={createProduct.isPending || updateProduct.isPending}
                    disabled={isEditMode ? !isDirty : false}
                  >
                    <LuSave />
                    {isEditMode ? 'Зберегти зміни' : 'Створити продукт'}
                  </Button>
                </HStack>
              </Flex>
            </Box>
          </Stack>
        </form>
        {isEditMode && product?.id && (
          <ProductVariantsSection
            productId={product.id}
            variants={product.items ?? []}
          />
        )}
      </Stack>
    </Box>
  );
};
