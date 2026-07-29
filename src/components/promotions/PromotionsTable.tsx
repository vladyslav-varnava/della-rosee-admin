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
import Link from 'next/link';
import { LuPencil, LuTrash2 } from 'react-icons/lu';

import { Promotion, PromotionType } from '@/types/promotion';

type Props = {
  data: Promotion[];
  deletingPromotionId?: string;
  onDelete: (promotion: Promotion) => void;
};

const promotionTypeLabels: Record<PromotionType, string> = {
  PRODUCT_DISCOUNT: 'Знижка на продукт',
  CATEGORY_DISCOUNT: 'Знижка на категорію',
  BRAND_DISCOUNT: 'Знижка на бренд',
  CART_DISCOUNT: 'Знижка на кошик',
  BUNDLE: 'Набір',
  BUY_X_GET_Y: 'Buy X Get Y',
  FREE_GIFT: 'Подарунок',
  FREE_SHIPPING: 'Безкоштовна доставка',
  PROMOCODE: 'Промокод',
  LOYALTY: 'Лояльність',
};

const formatDate = (value?: string | null) => {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

const getPromotionWindowStatus = (promotion: Promotion) => {
  const now = Date.now();
  const startAt = new Date(promotion.startAt).getTime();
  const endAt = promotion.endAt ? new Date(promotion.endAt).getTime() : null;

  if (startAt > now) {
    return {
      label: 'Заплановано',
      colorPalette: 'blue',
    };
  }

  if (endAt && endAt < now) {
    return {
      label: 'Завершено',
      colorPalette: 'gray',
    };
  }

  return {
    label: 'Триває',
    colorPalette: 'green',
  };
};

const formatUsage = (usageCount: number, usageLimit: number | null) => {
  if (!usageLimit) {
    return `${usageCount} / без ліміту`;
  }

  return `${usageCount} / ${usageLimit}`;
};

export const PromotionsTable = ({
  data,
  deletingPromotionId,
  onDelete,
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
            <Table.ColumnHeader>Акція</Table.ColumnHeader>
            <Table.ColumnHeader>Тип</Table.ColumnHeader>
            <Table.ColumnHeader>Статус</Table.ColumnHeader>
            <Table.ColumnHeader>Період</Table.ColumnHeader>
            <Table.ColumnHeader>Використання</Table.ColumnHeader>
            <Table.ColumnHeader>Промокоди</Table.ColumnHeader>
            <Table.ColumnHeader>Priority</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Дії</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data.map((promotion) => {
            const windowStatus = getPromotionWindowStatus(promotion);
            const activePromoCodes = promotion.promoCodes.filter(
              (promoCode) => promoCode.isActive,
            );

            return (
              <Table.Row key={promotion.id} _hover={{ bg: 'gray.50' }}>
                <Table.Cell minW="260px">
                  <VStack align="start" gap={1}>
                    <Text fontWeight="900" color="della.text">
                      {promotion.title}
                    </Text>
                  </VStack>
                </Table.Cell>

                <Table.Cell minW="170px">
                  <Badge colorPalette="purple">
                    {promotionTypeLabels[promotion.type]}
                  </Badge>
                </Table.Cell>

                <Table.Cell minW="180px">
                  <VStack align="start" gap={1}>
                    <Badge colorPalette={promotion.isActive ? 'green' : 'red'}>
                      {promotion.isActive ? 'Активна' : 'Неактивна'}
                    </Badge>

                    <Badge colorPalette={windowStatus.colorPalette}>
                      {windowStatus.label}
                    </Badge>

                    <HStack gap={1} wrap="wrap">
                      {promotion.isPageVisible && (
                        <Badge colorPalette="blue">Сторінка</Badge>
                      )}
                      {promotion.isShowTimer && (
                        <Badge colorPalette="orange">Таймер</Badge>
                      )}
                      {promotion.stackable && (
                        <Badge colorPalette="cyan">Stackable</Badge>
                      )}
                    </HStack>
                  </VStack>
                </Table.Cell>

                <Table.Cell minW="190px">
                  <VStack align="start" gap={1}>
                    <Text fontSize="sm">з {formatDate(promotion.startAt)}</Text>
                    <Text fontSize="sm" color="gray.500">
                      до {formatDate(promotion.endAt)}
                    </Text>
                  </VStack>
                </Table.Cell>

                <Table.Cell minW="140px">
                  <Text fontWeight="800">
                    {formatUsage(promotion.usageCount, promotion.usageLimit)}
                  </Text>

                  {promotion.perUserLimit && (
                    <Text fontSize="xs" color="gray.500">
                      {promotion.perUserLimit} / користувач
                    </Text>
                  )}
                </Table.Cell>

                <Table.Cell minW="220px">
                  {promotion.promoCodes.length ? (
                    <VStack align="start" gap={1}>
                      <Text fontWeight="800">
                        {activePromoCodes.length} активних з{' '}
                        {promotion.promoCodes.length}
                      </Text>

                      <HStack gap={1} wrap="wrap">
                        {promotion.promoCodes.slice(0, 3).map((promoCode) => (
                          <Badge
                            key={promoCode.id}
                            colorPalette={promoCode.isActive ? 'green' : 'gray'}
                          >
                            {promoCode.code}
                          </Badge>
                        ))}
                      </HStack>
                    </VStack>
                  ) : (
                    <Text color="gray.500">—</Text>
                  )}
                </Table.Cell>

                <Table.Cell fontWeight="900">{promotion.priority}</Table.Cell>

                <Table.Cell>
                  <HStack justify="flex-end" gap={2}>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/promotions/${promotion.id}/edit`}>
                        <LuPencil />
                        Редагувати
                      </Link>
                    </Button>

                    <IconButton
                      size="sm"
                      variant="outline"
                      colorPalette="red"
                      aria-label="Деактивувати акцію"
                      loading={deletingPromotionId === promotion.id}
                      onClick={() => onDelete(promotion)}
                    >
                      <LuTrash2 />
                    </IconButton>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
