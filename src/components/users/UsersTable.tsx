'use client';

import Link from 'next/link';

import {
  Badge,
  Box,
  Button,
  HStack,
  Table,
  Text,
  VStack,
} from '@chakra-ui/react';
import { LuPencil } from 'react-icons/lu';

import {
  getLoyaltyColor,
  getUserRoleColor,
  translateLoyaltyLevel,
  translateUserRole,
  User,
} from '@/types/user';

type Props = {
  data: User[];
};

const formatDate = (value: string) => {
  return new Date(value).toLocaleString('uk-UA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatMoney = (value: number) => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
  }).format(value || 0);
};

export const UsersTable = ({ data }: Props) => {
  return (
    <Box
      w="100%"
      overflowX="auto"
      bg="white"
      border="1px solid"
      borderColor="blackAlpha.100"
      borderRadius="2xl"
      boxShadow="sm"
    >
      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row bg="gray.50">
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Користувач</Table.ColumnHeader>
            <Table.ColumnHeader>Контакти</Table.ColumnHeader>
            <Table.ColumnHeader>Роль</Table.ColumnHeader>
            <Table.ColumnHeader>Лояльність</Table.ColumnHeader>
            <Table.ColumnHeader>Витрати за рік</Table.ColumnHeader>
            <Table.ColumnHeader>Дата реєстрації</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Дії</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data.map((user) => (
            <Table.Row key={user.id} _hover={{ bg: 'gray.50' }}>
              <Table.Cell fontWeight="700">#{user.id}</Table.Cell>

              <Table.Cell minW="180px">
                <VStack align="start" gap={0}>
                  <Text fontWeight="700" color="della.text">
                    {user.firstName || '—'} {user.lastName || ''}
                  </Text>

                  <Text fontSize="xs" color="gray.500">
                    ID користувача: {user.id}
                  </Text>
                </VStack>
              </Table.Cell>

              <Table.Cell minW="220px">
                <VStack align="start" gap={0}>
                  <Text>{user.phone || '—'}</Text>

                  <Text fontSize="xs" color="gray.500">
                    {user.email || '—'}
                  </Text>
                </VStack>
              </Table.Cell>

              <Table.Cell>
                <Badge colorPalette={getUserRoleColor(user.role)}>
                  {translateUserRole(user.role)}
                </Badge>
              </Table.Cell>

              <Table.Cell>
                <HStack gap={2}>
                  <Badge colorPalette={getLoyaltyColor(user.loyaltyLevel)}>
                    {translateLoyaltyLevel(user.loyaltyLevel)}
                  </Badge>

                  {user.discountPercent > 0 && (
                    <Text fontSize="xs" color="gray.500">
                      {user.discountPercent}%
                    </Text>
                  )}
                </HStack>
              </Table.Cell>

              <Table.Cell fontWeight="700" whiteSpace="nowrap">
                {formatMoney(user.totalSpentThisYear)}
              </Table.Cell>

              <Table.Cell whiteSpace="nowrap">
                {formatDate(user.createdAt)}
              </Table.Cell>

              <Table.Cell>
                <HStack justify="flex-end">
                  <Button
                    asChild
                    size="sm"
                    bg="della.primary"
                    color="della.text"
                    _hover={{ bg: 'della.primaryHover' }}
                  >
                    <Link href={`/users/${user.id}`}>
                      <LuPencil />
                      Редагувати
                    </Link>
                  </Button>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
