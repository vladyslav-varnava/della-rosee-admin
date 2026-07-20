'use client';

import { Children, Fragment, ReactNode, useState } from 'react';
import Link from 'next/link';

import {
  Badge,
  Box,
  Button,
  Card,
  Center,
  Flex,
  Grid,
  GridItem,
  HStack,
  Image,
  Separator,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  VStack,
  chakra,
} from '@chakra-ui/react';
import {
  LuArrowLeft,
  LuExternalLink,
  LuPackage,
  LuSave,
  LuTruck,
  LuUser,
} from 'react-icons/lu';

import { useUpdateOrderStatus } from '@/hooks/mutations/order/useUpdateOrderStatus';
import { useGetOrder } from '@/hooks/query/useOrders';
import {
  getOrderStatusColor,
  ORDER_STATUS_OPTIONS,
  Order,
  OrderStatus,
  translateDeliveryType,
  translateOrderStatus,
  translatePaymentStatus,
  translatePaymentType,
} from '@/types/order';
import { OrderEditFormToggle } from '@/components/orders/details/OrderEditFormToggle';

type Props = {
  orderId: number;
};

const StyledSelect = chakra('select');

const formatMoney = (value?: number) => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
  }).format(value ?? 0);
};

const formatDateTime = (value: string) => {
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

const getCustomerName = (order: Order) => {
  return `${order.firstName || ''} ${order.lastName || ''}`.trim() || '—';
};

const getDiscountTitle = (discount: Record<string, unknown>) => {
  return (
    String(discount.title ?? '') ||
    String(discount.reason ?? '') ||
    String(discount.promoCode ?? '') ||
    'Знижка'
  );
};

const getDiscountAmount = (discount: Record<string, unknown>) => {
  const amount = discount.amount ?? discount.discount;

  return Number(amount) || 0;
};

type InfoListProps = {
  children: ReactNode;
};

const InfoList = ({ children }: InfoListProps) => {
  const items = Children.toArray(children);

  return (
    <Stack gap={0}>
      {items.map((child, index) => (
        <Fragment key={index}>
          {index > 0 && <Separator />}
          {child}
        </Fragment>
      ))}
    </Stack>
  );
};

type InfoRowProps = {
  label: string;
  value?: ReactNode;
};

const InfoRow = ({ label, value }: InfoRowProps) => {
  const hasValue = value !== null && value !== undefined && value !== '';

  return (
    <Flex justify="space-between" gap={4} py={2}>
      <Text color="gray.500">{label}</Text>

      <Box fontWeight="700" color="della.text" textAlign="right">
        {hasValue ? value : '—'}
      </Box>
    </Flex>
  );
};

type SectionCardProps = {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
};

const SectionCard = ({ title, icon, children }: SectionCardProps) => {
  return (
    <Card.Root
      bg="white"
      border="1px solid"
      borderColor="blackAlpha.100"
      borderRadius="2xl"
      boxShadow="sm"
      overflow="hidden"
    >
      <Card.Header pb={3}>
        <HStack gap={3}>
          {icon}
          <Card.Title color="della.text">{title}</Card.Title>
        </HStack>
      </Card.Header>

      <Card.Body pt={0}>{children}</Card.Body>
    </Card.Root>
  );
};

type StatusCardProps = {
  order: Order;
};

const StatusCard = ({ order }: StatusCardProps) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(
    null,
  );
  const updateStatus = useUpdateOrderStatus();

  const status = selectedStatus ?? order.status;
  const isChanged = selectedStatus !== null && selectedStatus !== order.status;

  const saveStatus = () => {
    if (!isChanged) return;

    updateStatus.mutate(
      {
        id: order.id,
        status,
      },
      {
        onSuccess: () => {
          setSelectedStatus(null);
        },
      },
    );
  };

  return (
    <SectionCard title="Статус замовлення" icon={<LuPackage />}>
      <Stack gap={4}>
        <HStack gap={3} wrap="wrap">
          <Badge
            colorPalette={getOrderStatusColor(order.status)}
            borderRadius="full"
            px={3}
            py={1}
          >
            Поточний: {translateOrderStatus(order.status)}
          </Badge>

          {order.isFormedByAdmin && (
            <Badge colorPalette="purple" borderRadius="full" px={3} py={1}>
              Сформовано адміном
            </Badge>
          )}
        </HStack>

        <Flex gap={3} direction={{ base: 'column', md: 'row' }}>
          <StyledSelect
            value={status}
            h="40px"
            maxW={{ base: '100%', md: '280px' }}
            px={3}
            border="1px solid"
            borderColor="blackAlpha.200"
            borderRadius="lg"
            bg="white"
            cursor="pointer"
            onChange={(event) =>
              setSelectedStatus(event.currentTarget.value as OrderStatus)
            }
          >
            {ORDER_STATUS_OPTIONS.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {translateOrderStatus(statusOption)}
              </option>
            ))}
          </StyledSelect>

          <Button
            loading={updateStatus.isPending}
            disabled={!isChanged}
            bg="della.primary"
            color="della.text"
            _hover={{ bg: 'della.primaryHover' }}
            onClick={saveStatus}
          >
            <LuSave />
            Оновити статус
          </Button>
        </Flex>

        <Box
          bg="gray.50"
          border="1px solid"
          borderColor="blackAlpha.100"
          borderRadius="xl"
          p={4}
        >
          <Text fontWeight="800" mb={2}>
            Памʼятка
          </Text>

          <Stack gap={1} fontSize="sm" color="gray.600">
            <Text>
              <b>Очікується</b> — робота над замовленням ще не почалася.
            </Text>
            <Text>
              <b>В обробці</b> — замовлення підтверджено, початок пакування.
            </Text>
            <Text>
              <b>Оброблено</b> — пакування завершено, списання через SmartKasa
              проведено.
            </Text>
            <Text>
              <b>Завершено</b> — клієнт отримав замовлення.
            </Text>
            <Text>
              <b>Скасовано</b> — клієнт або адміністратор скасував замовлення.
            </Text>
          </Stack>
        </Box>
      </Stack>
    </SectionCard>
  );
};

type OrderItemsCardProps = {
  order: Order;
};

const OrderItemsCard = ({ order }: OrderItemsCardProps) => {
  const items = order.orderItems ?? [];

  return (
    <SectionCard title={`Товари (${items.length})`} icon={<LuPackage />}>
      {items.length === 0 ? (
        <Box
          border="1px dashed"
          borderColor="blackAlpha.200"
          borderRadius="xl"
          p={8}
          textAlign="center"
          bg="gray.50"
        >
          <Text color="gray.500">У замовленні немає товарів</Text>
        </Box>
      ) : (
        <Stack gap={3}>
          {items.map((item) => (
            <Box
              key={item.id}
              border="1px solid"
              borderColor="blackAlpha.100"
              borderRadius="xl"
              p={4}
              bg="gray.50"
            >
              <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
                <Box
                  w={{ base: '100%', md: '96px' }}
                  h="96px"
                  bg="white"
                  border="1px solid"
                  borderColor="blackAlpha.100"
                  borderRadius="lg"
                  overflow="hidden"
                  flexShrink={0}
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      w="100%"
                      h="100%"
                      objectFit="contain"
                    />
                  ) : null}
                </Box>

                <Box flex={1} minW={0}>
                  <Flex
                    justify="space-between"
                    align={{ base: 'start', md: 'center' }}
                    gap={3}
                    direction={{ base: 'column', md: 'row' }}
                  >
                    <Box>
                      <Text fontWeight="900" color="della.text">
                        {item.title}
                      </Text>

                      <Text mt={1} fontSize="sm" color="gray.500">
                        Артикул: {item.code || '—'} · Product ID:{' '}
                        {item.productId}
                      </Text>
                    </Box>

                    <Button asChild size="sm" variant="outline">
                      <Link href={`/products/${item.productId}/edit`}>
                        <LuExternalLink />
                        Продукт
                      </Link>
                    </Button>
                  </Flex>

                  <SimpleGrid columns={{ base: 2, md: 4 }} gap={3} mt={4}>
                    <Box>
                      <Text fontSize="xs" color="gray.500">
                        Кількість
                      </Text>
                      <Text fontWeight="800">{item.quantity}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="xs" color="gray.500">
                        Ціна
                      </Text>
                      <Text fontWeight="800">{formatMoney(item.price)}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="xs" color="gray.500">
                        Сума
                      </Text>
                      <Text fontWeight="800">
                        {formatMoney(item.price * item.quantity)}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="xs" color="gray.500">
                        На складі
                      </Text>
                      <Text fontWeight="800">
                        {item.quantityInStock ?? '—'}
                      </Text>
                    </Box>
                  </SimpleGrid>
                </Box>
              </Flex>
            </Box>
          ))}
        </Stack>
      )}
    </SectionCard>
  );
};

export const OrderDetailsPageClient = ({ orderId }: Props) => {
  const { data: order, isPending, isError } = useGetOrder(orderId);

  if (isPending) {
    return (
      <Center py={16}>
        <VStack color="della.accent">
          <Spinner />
          <Text>Завантаження замовлення...</Text>
        </VStack>
      </Center>
    );
  }

  if (isError || !order) {
    return (
      <Box
        bg="white"
        border="1px solid"
        borderColor="red.100"
        borderRadius="2xl"
        p={10}
        textAlign="center"
        boxShadow="sm"
      >
        <Text fontSize="xl" fontWeight="800" color="della.text">
          Замовлення не знайдено
        </Text>

        <Text mt={2} color="gray.500">
          Перевірте номер замовлення або спробуйте оновити сторінку.
        </Text>

        <Button asChild mt={6} variant="outline">
          <Link href="/orders">
            <LuArrowLeft />
            До замовлень
          </Link>
        </Button>
      </Box>
    );
  }

  const discounts = order.discounts ?? [];
  const userId = order.userId ?? order.user?.id;

  return (
    <Stack gap={5}>
      <Button asChild variant="outline" w="fit-content">
        <Link href="/orders">
          <LuArrowLeft />
          До замовлень
        </Link>
      </Button>

      <Box
        bg="white"
        border="1px solid"
        borderColor="blackAlpha.100"
        borderRadius="2xl"
        p={{ base: 5, md: 6 }}
        boxShadow="sm"
      >
        <Flex
          justify="space-between"
          align={{ base: 'start', md: 'center' }}
          direction={{ base: 'column', md: 'row' }}
          gap={4}
        >
          <Box>
            <HStack gap={3} wrap="wrap">
              <Text fontSize="2xl" fontWeight="900" color="della.text">
                Замовлення #{order.id}
              </Text>

              <Badge
                colorPalette={getOrderStatusColor(order.status)}
                borderRadius="full"
                px={3}
                py={1}
              >
                {translateOrderStatus(order.status)}
              </Badge>
            </HStack>

            <Text mt={1} color="gray.500">
              Створено: {formatDateTime(order.createdAt)}
            </Text>
          </Box>

          <Box textAlign={{ base: 'left', md: 'right' }}>
            <Text color="gray.500">Сума до оплати</Text>
            <Text fontSize="3xl" fontWeight="900" color="della.text">
              {formatMoney(order.amount)}
            </Text>
          </Box>
        </Flex>
      </Box>

      <Grid templateColumns={{ base: '1fr', xl: '1fr' }} gap={5}>
        <GridItem>
          <Stack gap={5}>
            <StatusCard order={order} />
            <OrderItemsCard order={order} />
          </Stack>
        </GridItem>

        <GridItem>
          <Stack gap={5}>
            <SectionCard title="Клієнт" icon={<LuUser />}>
              <InfoList>
                <InfoRow
                  label="Імʼя"
                  value={
                    userId ? (
                      <Link href={`/users/${userId}`}>
                        <Text
                          as="span"
                          color="blue.600"
                          fontWeight="800"
                          _hover={{ textDecoration: 'underline' }}
                        >
                          {getCustomerName(order)}
                        </Text>
                      </Link>
                    ) : (
                      getCustomerName(order)
                    )
                  }
                />
                <InfoRow label="Телефон" value={order.phone} />
                <InfoRow label="Email" value={order.email} />
                <InfoRow
                  label="Джерело"
                  value={
                    order.isFormedByAdmin
                      ? 'Сформовано адміном'
                      : 'Створено клієнтом'
                  }
                />
              </InfoList>
            </SectionCard>

            <SectionCard title="Оплата і доставка" icon={<LuTruck />}>
              <InfoList>
                <InfoRow
                  label="Тип оплати"
                  value={translatePaymentType(order.paymentType)}
                />
                <InfoRow
                  label="Статус оплати"
                  value={translatePaymentStatus(order.paymentStatus)}
                />
                <InfoRow
                  label="Доставка"
                  value={translateDeliveryType(order.deliveryType)}
                />
                <InfoRow label="Відділення / склад" value={order.warehouse} />
                <InfoRow label="Адреса" value={order.addressString} />
              </InfoList>
            </SectionCard>

            <SectionCard title="Сума і знижки">
              <InfoList>
                <InfoRow
                  label="Повна сума"
                  value={formatMoney(order.fulAmount)}
                />
                <InfoRow label="До оплати" value={formatMoney(order.amount)} />

                {discounts.length > 0 && (
                  <Box pt={3}>
                    <Text fontWeight="800" mb={2}>
                      Застосовані знижки
                    </Text>

                    <Stack gap={2}>
                      {discounts.map((discount, index) => (
                        <Flex
                          key={index}
                          justify="space-between"
                          gap={4}
                          fontSize="sm"
                        >
                          <Text color="gray.600">
                            {getDiscountTitle(
                              discount as Record<string, unknown>,
                            )}
                          </Text>

                          <Text fontWeight="800" color="green.600">
                            -
                            {formatMoney(
                              getDiscountAmount(
                                discount as Record<string, unknown>,
                              ),
                            )}
                          </Text>
                        </Flex>
                      ))}
                    </Stack>
                  </Box>
                )}
              </InfoList>
            </SectionCard>
          </Stack>
        </GridItem>
        <OrderEditFormToggle order={order} />
      </Grid>
    </Stack>
  );
};
