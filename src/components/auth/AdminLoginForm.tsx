'use client';

import { useState } from 'react';

import { useAuth } from '@/hooks/mutations/useAuth';
import { Box, Button, Card, Field, Input, Stack, Text } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

interface FormValues {
  email: string;
  password: string;
}

const AdminLoginForm = () => {
  const { signIn, isLoading, error, isError } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit((data) => {
    signIn(data.email, data.password);
  });

  return (
    <Card.Root
      as="section"
      w="100%"
      maxW="500px"
      border="1px solid"
      borderColor="blackAlpha.100"
      borderRadius="2xl"
      boxShadow="0 24px 80px rgba(45, 45, 45, 0.12)"
      overflow="hidden"
      bg="white"
    >
      <Card.Header pb={2}>
        <Stack gap={2}>
          <Text
            fontSize="xs"
            fontWeight="700"
            letterSpacing="0.16em"
            textTransform="uppercase"
            color="della.accent"
          >
            Admin access
          </Text>

          <Card.Title fontSize="2xl" color="della.text">
            Вхід в адмін-панель
          </Card.Title>

          <Card.Description color="gray.600">
            Увійдіть в аккаунт адміністратора, щоб керувати товарами,
            замовленнями, акціями та клінікою.
          </Card.Description>
        </Stack>
      </Card.Header>

      <form onSubmit={onSubmit}>
        <Card.Body pt={6}>
          <Stack gap={5}>
            {isError && error && (
              <Box
                px={4}
                py={3}
                borderRadius="lg"
                bg="red.50"
                border="1px solid"
                borderColor="red.100"
                color="red.700"
                fontSize="sm"
              >
                {error}
              </Box>
            )}

            <Field.Root invalid={!!errors.email} required>
              <Field.Label>Електронна адреса</Field.Label>

              <Input
                type="email"
                placeholder="admin@dellarosee.com"
                autoComplete="email"
                size="lg"
                {...register('email', {
                  required: 'Вкажіть email',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Вкажіть коректний email',
                  },
                })}
              />

              <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.password} required>
              <Field.Label>Пароль</Field.Label>

              <Box position="relative">
                <Input
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="Введіть пароль"
                  autoComplete="current-password"
                  size="lg"
                  pe="96px"
                  {...register('password', {
                    required: 'Вкажіть пароль',
                    minLength: {
                      value: 6,
                      message: 'Пароль має містити мінімум 6 символів',
                    },
                  })}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  position="absolute"
                  top="50%"
                  insetEnd="2"
                  transform="translateY(-50%)"
                  onClick={() =>
                    setIsPasswordVisible((currentValue) => !currentValue)
                  }
                >
                  {isPasswordVisible ? 'Сховати' : 'Показати'}
                </Button>
              </Box>

              <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
            </Field.Root>
          </Stack>
        </Card.Body>

        <Card.Footer pt={2}>
          <Button
            w="100%"
            size="lg"
            loading={isLoading}
            bg="della.primary"
            color="della.text"
            _hover={{
              bg: 'della.primaryHover',
            }}
            type="submit"
          >
            Увійти
          </Button>
        </Card.Footer>
      </form>
    </Card.Root>
  );
};

export default AdminLoginForm;
