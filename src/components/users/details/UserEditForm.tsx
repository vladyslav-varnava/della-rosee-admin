'use client';

import {
  Button,
  Field,
  HStack,
  Input,
  SimpleGrid,
  Stack,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { LuSave } from 'react-icons/lu';

import { useUpdateUserAdmin } from '@/hooks/mutations/user/useUpdateUserAdmin';
import { isValidUaPhone, normalizeUaPhone } from '@/lib/phone';
import {
  LoyaltyLevel,
  loyaltyLevelOptions,
  UpdateUserAdminPayload,
  User,
} from '@/types/user';

import { UserNativeSelectField } from './UserNativeSelectField';
import { UserSectionCard } from './UserSectionCard';

type FormValues = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  loyaltyLevel: LoyaltyLevel;
  totalSpentThisYear: number;
};

type Props = {
  user: User;
  onCancel?: () => void;
  onSaved?: () => void;
};

const getDefaultValues = (user: User): FormValues => {
  return {
    email: user.email ?? '',
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    phone: user.phone ?? '',
    loyaltyLevel: user.loyaltyLevel,
    totalSpentThisYear: user.totalSpentThisYear ?? 0,
  };
};

export const UserEditForm = ({ user, onCancel, onSaved }: Props) => {
  const updateUser = useUpdateUserAdmin();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: getDefaultValues(user),
  });

  const onSubmit = handleSubmit((values) => {
    const payload: UpdateUserAdminPayload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: normalizeUaPhone(values.phone),
      loyaltyLevel: values.loyaltyLevel,
      totalSpentThisYear: Number(values.totalSpentThisYear) || 0,
    };

    updateUser.mutate(
      {
        userId: user.id,
        data: payload,
      },
      {
        onSuccess: (updatedUser) => {
          reset(getDefaultValues(updatedUser));
          onSaved?.();
        },
      },
    );
  });

  return (
    <form onSubmit={onSubmit}>
      <UserSectionCard title="Редагування користувача">
        <Stack gap={5}>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <Field.Root invalid={!!errors.firstName}>
              <Field.Label>Імʼя</Field.Label>
              <Input {...register('firstName')} />
              <Field.ErrorText>{errors.firstName?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.lastName}>
              <Field.Label>Прізвище</Field.Label>
              <Input {...register('lastName')} />
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
                placeholder="+380971234567"
                {...register('phone', {
                  validate: (value) =>
                    !value ||
                    isValidUaPhone(value) ||
                    'Вкажіть телефон у форматі +380971234567',
                })}
              />
              <Field.ErrorText>{errors.phone?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.totalSpentThisYear}>
              <Field.Label>Витрачено цього року</Field.Label>
              <Input
                type="number"
                min={0}
                {...register('totalSpentThisYear', {
                  valueAsNumber: true,
                })}
              />
              <Field.ErrorText>
                {errors.totalSpentThisYear?.message}
              </Field.ErrorText>
            </Field.Root>

            <Controller
              control={control}
              name="loyaltyLevel"
              render={({ field }) => (
                <UserNativeSelectField
                  label="Рівень лояльності"
                  value={field.value}
                  options={loyaltyLevelOptions}
                  placeholder="Оберіть рівень"
                  onChange={field.onChange}
                />
              )}
            />
          </SimpleGrid>

          <HStack gap={3}>
            <Button
              type="submit"
              loading={updateUser.isPending}
              disabled={!isDirty}
              bg="della.primary"
              color="della.text"
              _hover={{ bg: 'della.primaryHover' }}
            >
              <LuSave />
              Зберегти
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={updateUser.isPending}
              onClick={onCancel}
            >
              Скасувати
            </Button>
          </HStack>
        </Stack>
      </UserSectionCard>
    </form>
  );
};
