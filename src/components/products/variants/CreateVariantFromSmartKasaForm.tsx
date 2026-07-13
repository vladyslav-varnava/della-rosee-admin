'use client';

import { useRouter } from 'next/navigation';

import { Button, Field, Flex, Input, Stack, Text } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { LuPlus } from 'react-icons/lu';

import { useCreateVariantFromSmartKasa } from '@/hooks/mutations/productVariant/useProductVariantMutations';

type Props = {
  productId: number;
};

type FormValues = {
  cardId: string;
};

export const CreateVariantFromSmartKasaForm = ({ productId }: Props) => {
  const router = useRouter();
  const createVariant = useCreateVariantFromSmartKasa();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      cardId: '',
    },
  });

  const onSubmit = handleSubmit((values) => {
    createVariant.mutate(
      {
        productId,
        cardId: values.cardId.trim(),
      },
      {
        onSuccess: (variant) => {
          router.push(`/products/${productId}/variants/${variant.id}/edit`);
        },
      },
    );
  });

  return (
    <form onSubmit={onSubmit}>
      <Stack gap={3}>
        <Text fontSize="sm" color="gray.500">
          Введіть ID товару зі SmartKasa. Після створення відкриється окрема
          сторінка редагування варіанту.
        </Text>

        <Flex gap={3} direction={{ base: 'column', md: 'row' }}>
          <Field.Root invalid={!!errors.cardId} flex={1}>
            <Field.Label>SmartKasa cardId</Field.Label>

            <Input
              placeholder="Наприклад: 123456"
              {...register('cardId', {
                required: 'Вкажіть SmartKasa cardId',
              })}
            />

            <Field.ErrorText>{errors.cardId?.message}</Field.ErrorText>
          </Field.Root>

          <Button
            alignSelf={{ base: 'stretch', md: 'end' }}
            type="submit"
            loading={createVariant.isPending}
            disabled={!isDirty}
            bg="della.primary"
            color="della.text"
            _hover={{ bg: 'della.primaryHover' }}
          >
            <LuPlus />
            Створити
          </Button>
        </Flex>
      </Stack>
    </form>
  );
};
