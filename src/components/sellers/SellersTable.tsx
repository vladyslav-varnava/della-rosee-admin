'use client';

import {
  Badge,
  Box,
  Button,
  HStack,
  IconButton,
  Table,
  Text,
  VStack,
} from '@chakra-ui/react';
import { LuPencil, LuTrash2 } from 'react-icons/lu';

import { SellerFormDialog } from '@/components/sellers/SellerFormDialog';
import { Seller, SellerPayload, UpdateSellerPayload } from '@/types/seller';

type Props = {
  data: Seller[];
  deletingSellerId?: number;
  updatingSellerId?: number;
  onDelete: (id: number) => void;
  onUpdate: (
    id: number,
    payload: SellerPayload | UpdateSellerPayload,
  ) => Promise<void>;
};

const formatDate = (value?: string) => {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
};

export const SellersTable = ({
  data,
  deletingSellerId,
  updatingSellerId,
  onDelete,
  onUpdate,
}: Props) => {
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
            <Table.ColumnHeader>Продавець</Table.ColumnHeader>
            <Table.ColumnHeader>Контакти</Table.ColumnHeader>
            <Table.ColumnHeader>Статус</Table.ColumnHeader>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Створено</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Дії</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data.map((seller) => (
            <Table.Row key={seller.id} _hover={{ bg: 'gray.50' }}>
              <Table.Cell minW="180px">
                <Text fontWeight="800" color="della.text">
                  {seller.name}
                </Text>
              </Table.Cell>

              <Table.Cell minW="220px">
                <VStack align="start" gap={1}>
                  <Text>{seller.phone || '—'}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {seller.email || '—'}
                  </Text>
                </VStack>
              </Table.Cell>

              <Table.Cell>
                <Badge colorPalette={seller.isActive ? 'green' : 'gray'}>
                  {seller.isActive ? 'Активний' : 'Неактивний'}
                </Badge>
              </Table.Cell>

              <Table.Cell fontWeight="700">#{seller.id}</Table.Cell>

              <Table.Cell minW="130px" color="gray.600">
                {formatDate(seller.createdAt)}
              </Table.Cell>

              <Table.Cell>
                <HStack justify="flex-end" gap={2}>
                  <SellerFormDialog
                    seller={seller}
                    isLoading={updatingSellerId === seller.id}
                    onSubmit={(payload) => onUpdate(seller.id, payload)}
                    trigger={
                      <Button size="sm" variant="outline">
                        <LuPencil />
                        Редагувати
                      </Button>
                    }
                  />

                  <IconButton
                    size="sm"
                    variant="outline"
                    colorPalette="red"
                    aria-label="Видалити продавця"
                    loading={deletingSellerId === seller.id}
                    onClick={() => onDelete(seller.id)}
                  >
                    <LuTrash2 />
                  </IconButton>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
