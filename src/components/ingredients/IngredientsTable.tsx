'use client';

import {
  Box,
  Button,
  HStack,
  IconButton,
  Table,
  Text,
  VStack,
} from '@chakra-ui/react';
import { LuPencil, LuTrash2 } from 'react-icons/lu';

import { IngredientFormDialog } from '@/components/ingredients/IngredientFormDialog';
import { Ingredient, IngredientPayload } from '@/types/product';

type Props = {
  data: Ingredient[];
  deletingIngredientId?: number;
  updatingIngredientId?: number;
  onDelete: (id: number) => void;
  onUpdate: (id: number, payload: IngredientPayload) => Promise<void>;
};

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

export const IngredientsTable = ({
  data,
  deletingIngredientId,
  updatingIngredientId,
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
            <Table.ColumnHeader>Інгредієнт</Table.ColumnHeader>
            <Table.ColumnHeader>Value</Table.ColumnHeader>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Оновлено</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Дії</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data.map((ingredient) => (
            <Table.Row key={ingredient.id} _hover={{ bg: 'gray.50' }}>
              <Table.Cell minW="220px">
                <VStack align="start" gap={1}>
                  <Text fontWeight="800" color="della.text">
                    {ingredient.label}
                  </Text>

                  <Text fontSize="xs" color="gray.500">
                    Створено: {formatDate(ingredient.createdAt)}
                  </Text>
                </VStack>
              </Table.Cell>

              <Table.Cell minW="180px">
                <Text fontFamily="mono" fontWeight="700">
                  {ingredient.value}
                </Text>
              </Table.Cell>

              <Table.Cell fontWeight="700">#{ingredient.id}</Table.Cell>

              <Table.Cell minW="160px" color="gray.600">
                {formatDate(ingredient.updatedAt)}
              </Table.Cell>

              <Table.Cell>
                <HStack justify="flex-end" gap={2}>
                  <IngredientFormDialog
                    ingredient={ingredient}
                    isLoading={updatingIngredientId === ingredient.id}
                    onSubmit={(payload) => onUpdate(ingredient.id, payload)}
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
                    aria-label="Видалити інгредієнт"
                    loading={deletingIngredientId === ingredient.id}
                    onClick={() => onDelete(ingredient.id)}
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
