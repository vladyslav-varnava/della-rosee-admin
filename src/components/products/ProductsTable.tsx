'use client';

import Link from 'next/link';

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
import { LuCopy, LuExternalLink, LuPencil } from 'react-icons/lu';

import { Product } from '@/types/product';

import { EditableProductTitleCell } from './EditableProductTitleCell';

type Props = {
  data: Product[];
  copiedProductId?: number | null;
  onCopyLink: (product: Product) => void;
};

const formatList = (values: Array<string | number | null | undefined>) => {
  const filteredValues = values.filter(Boolean);

  return filteredValues.length ? filteredValues.join(', ') : '—';
};

export const ProductsTable = ({ data, copiedProductId, onCopyLink }: Props) => {
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
            <Table.ColumnHeader>Статус</Table.ColumnHeader>
            <Table.ColumnHeader>Продукт</Table.ColumnHeader>
            <Table.ColumnHeader>Бренд</Table.ColumnHeader>
            <Table.ColumnHeader>Варіанти</Table.ColumnHeader>
            <Table.ColumnHeader>СмартКаса</Table.ColumnHeader>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Дії</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data.map((product) => (
            <Table.Row key={product.id} _hover={{ bg: 'gray.50' }}>
              <Table.Cell>
                <VStack align="start" gap={1}>
                  <Badge colorPalette={product.isVisible ? 'green' : 'red'}>
                    {product.isVisible ? 'Опубліковано' : 'Не опубліковано'}
                  </Badge>

                  {product.hasActivePromotion && (
                    <Badge colorPalette="purple">Акція</Badge>
                  )}

                  {product.isComingSoon && (
                    <Badge colorPalette="orange">Скоро</Badge>
                  )}
                </VStack>
              </Table.Cell>

              <EditableProductTitleCell
                product={{
                  id: product.id,
                  title: product.title,
                }}
              />

              <Table.Cell minW="140px">
                <Text fontWeight="600">{product.brand || '—'}</Text>
              </Table.Cell>

              <Table.Cell minW="160px">
                <VStack align="start" gap={1}>
                  <Text fontSize="sm">
                    ID: {formatList(product.items.map((item) => item.id))}
                  </Text>

                  <Text fontSize="xs" color="gray.500">
                    К-сть:{' '}
                    {formatList(product.items.map((item) => item.quantity))}
                  </Text>
                </VStack>
              </Table.Cell>

              <Table.Cell minW="140px">
                {formatList(product.items.map((item) => item.cardId))}
              </Table.Cell>

              <Table.Cell fontWeight="700">#{product.id}</Table.Cell>

              <Table.Cell>
                <HStack justify="flex-end" gap={2}>
                  <IconButton
                    size="sm"
                    variant="outline"
                    aria-label="Скопіювати посилання"
                    onClick={() => onCopyLink(product)}
                  >
                    {copiedProductId === product.id ? '✓' : <LuCopy />}
                  </IconButton>

                  <Button asChild size="sm" variant="outline">
                    <Link href={`/product/${product.slug}`} target="_blank">
                      <LuExternalLink />
                      Сайт
                    </Link>
                  </Button>

                  <Button
                    asChild
                    size="sm"
                    bg="della.primary"
                    color="della.text"
                    _hover={{ bg: 'della.primaryHover' }}
                  >
                    <Link href={`/products/${product.id}/edit`}>
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
