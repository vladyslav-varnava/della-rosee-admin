'use client';

import { useCallback, useState } from 'react';

import {
  Box,
  Checkbox,
  Field,
  Flex,
  Grid,
  GridItem,
  Link,
  RadioCard,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  Control,
  Controller,
  FieldErrors, UseFormClearErrors, UseFormSetError,
  UseFormSetValue,
} from 'react-hook-form';

import { AdminNativeSelectField } from '@/components/admin/AdminNativeSelectField';
import {
  Address,
  adminDeliveryTypeOptions,
  DropdownItem,
  getDeliveryTypeRef,
  NEW_POST_WAREHOUSE_TYPE_REFS,
} from '@/types/delivery';

import { AdminOrderCreateFormValues } from '@/types/admin-order';

import { SettlementsCombobox } from './SettlementsCombobox';
import { WarehousesCombobox } from './WarehousesCombobox';

type Props = {
  control: Control<AdminOrderCreateFormValues>;
  setValue: UseFormSetValue<AdminOrderCreateFormValues>;
  errors: FieldErrors<AdminOrderCreateFormValues>;
  clearErrors: UseFormClearErrors<AdminOrderCreateFormValues>;
  addresses?: Address[];
  deliveryType: string;
  addressString: string;
  warehouse: string;
  deliverySettlementRefValue: string;
};

export const AdminOrderDeliveryInfo = ({
  addresses = [],
  control,
  setValue,
                                         clearErrors,
  deliveryType,
  addressString,
  warehouse,
  deliverySettlementRefValue,
  errors,
}: Props) => {
  const [isShowAddAddressForm, setIsShowAddressForm] = useState(
    addresses.length === 0,
  );

  const isPickupSelected = deliveryType === NEW_POST_WAREHOUSE_TYPE_REFS.PICKUP;

  const isNewPostSelected =
    deliveryType === NEW_POST_WAREHOUSE_TYPE_REFS.WAREHOUSE ||
    deliveryType === NEW_POST_WAREHOUSE_TYPE_REFS.POSTMAT;

  const setDeliveryValues = useCallback(
    (deliveryData: Address) => {
      clearErrors()
      setValue('firstName', deliveryData.firstName);
      setValue('lastName', deliveryData.lastName);
      setValue('phone', deliveryData.phone);
      setValue('addressString', deliveryData.city, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true
      });
      setValue('warehouse', deliveryData.warehouseNumber,
        {
          shouldDirty: true,
          shouldValidate: true,
          shouldTouch: true
        });
      setValue(
        'deliverySettlementRef',
        deliveryData.deliverySettlementRefValue,
        {
          shouldDirty: true,
          shouldValidate: true,
          shouldTouch: true
        }
      );
      setValue('deliveryType', getDeliveryTypeRef(deliveryData.deliveryType));
      setValue('warehouseRef', '');
    },
    [clearErrors, setValue],
  );

  const onSavedAddressClick = useCallback(
    (id?: number) => {
      if (!id) return;

      const address = addresses.find((item) => item.id === id);

      if (address) {
        setIsShowAddressForm(false);
        setDeliveryValues(address);
      }
    },
    [addresses, setDeliveryValues],
  );

  const onAddNewAddressClick = useCallback(() => {
    setIsShowAddressForm(true);
    setValue('addressString', '', {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue('warehouse', '',
      {
        shouldDirty: true,
        shouldValidate: true,
      });
    setValue('warehouseRef', '');
    setValue('deliverySettlementRef', '');
    setValue('deliveryType', NEW_POST_WAREHOUSE_TYPE_REFS.WAREHOUSE);
  }, [setValue]);

  const onDeliveryTypeChange = useCallback(
    (value: string) => {
      setValue('deliveryType', value);
      setValue('warehouse', '');
      setValue('warehouseRef', '');
      setValue('addressString', '', {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue('deliverySettlementRef', '',
        {
          shouldDirty: true,
          shouldValidate: true,
        });
    },
    [setValue],
  );

  const onSettlementClear = useCallback(() => {
    setValue('warehouse', '');
    setValue('warehouseRef', '');
    setValue('addressString', '', {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue('deliverySettlementRef', '');
  }, [setValue]);

  const onWarehouseClear = useCallback(() => {
    setValue('warehouse', '');
    setValue('warehouseRef', '');
  }, [setValue]);

  const onWarehouseSelect = useCallback(
    (warehouseItem: DropdownItem) => {
      clearErrors()
      setValue('warehouse', warehouseItem.label);
      setValue('warehouseRef', warehouseItem.id);
    },
    [clearErrors, setValue],
  );

  const onSettlementSelect = useCallback(
    (settlementItem: DropdownItem) => {
      setValue('addressString', settlementItem.label, {
        shouldValidate: true
      });
      setValue('deliverySettlementRef', settlementItem.value);
      setValue('warehouse', '');
      setValue('warehouseRef', '');
    },
    [setValue],
  );

  return (
    <VStack align="stretch" gap={5}>
      {addresses.length > 0 && (
        <RadioCard.Root gap={4}>
          <RadioCard.Label>Обрати збережену адресу</RadioCard.Label>

          <VStack gap={3}>
            {addresses.map((address) => (
              <RadioCard.Item
                key={`${address.id}-${address.warehouseNumber}`}
                width="full"
                value={address.warehouseNumber}
                onClick={() => onSavedAddressClick(address.id)}
              >
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl>
                  <RadioCard.ItemIndicator />
                  <RadioCard.ItemContent>
                    <RadioCard.ItemText>{address.city}</RadioCard.ItemText>
                    <RadioCard.ItemDescription>
                      {address.warehouseNumber}
                    </RadioCard.ItemDescription>
                  </RadioCard.ItemContent>
                </RadioCard.ItemControl>
              </RadioCard.Item>
            ))}

            <RadioCard.Item
              width="full"
              value="new-address"
              onClick={onAddNewAddressClick}
            >
              <RadioCard.ItemHiddenInput />
              <RadioCard.ItemControl>
                <RadioCard.ItemIndicator />
                <RadioCard.ItemContent>
                  <RadioCard.ItemText>
                    Використати нову адресу
                  </RadioCard.ItemText>
                </RadioCard.ItemContent>
              </RadioCard.ItemControl>
            </RadioCard.Item>
          </VStack>
        </RadioCard.Root>
      )}

      {isShowAddAddressForm && (
        <Box
          bg="gray.50"
          border="1px solid"
          borderColor="blackAlpha.100"
          borderRadius="xl"
          p={4}
        >
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={4}>
            <GridItem>
              <Controller
                control={control}
                name="deliveryType"
                render={({ field }) => (
                  <AdminNativeSelectField
                    label="Тип доставки"
                    value={field.value}
                    options={adminDeliveryTypeOptions}
                    placeholder="Оберіть тип доставки"
                    onChange={onDeliveryTypeChange}
                  />
                )}
              />

              {errors.deliveryType && (
                <Text mt={1} fontSize="xs" color="red.500">
                  {errors.deliveryType.message}
                </Text>
              )}
            </GridItem>

            {isNewPostSelected && (
              <GridItem>
                <SettlementsCombobox
                  onSelect={onSettlementSelect}
                  onClear={onSettlementClear}
                  defaultValue={addressString}
                />

                {errors.addressString && (
                  <Text mt={1} fontSize="xs" color="red.500">
                    {errors.addressString.message}
                  </Text>
                )}
              </GridItem>
            )}

            {isNewPostSelected && deliverySettlementRefValue && (
              <GridItem>
                <WarehousesCombobox
                  settlementRef={deliverySettlementRefValue}
                  warehouseType={deliveryType}
                  onSelect={onWarehouseSelect}
                  onClear={onWarehouseClear}
                  defaultValue={warehouse}
                />

                {errors.warehouse && (
                  <Text mt={1} fontSize="xs" color="red.500">
                    {errors.warehouse.message}
                  </Text>
                )}
              </GridItem>
            )}

            {isPickupSelected && (
              <GridItem colSpan={{ base: 1, lg: 2 }}>
                <Flex direction="column" gap={3}>
                  <Text fontSize="sm" color="della.text" fontWeight={700}>
                    Адреса: м. Вінниця, вул. Дмитра Майбороди, 12
                  </Text>

                  <Link
                    variant="underline"
                    href="https://www.google.com.ua/maps/place/Dmytra+Maiborody+St,+12,+Vinnytsia"
                    target="_blank"
                    color="blue.600"
                  >
                    Дивитись на карті
                  </Link>
                </Flex>
              </GridItem>
            )}

            <GridItem colSpan={{ base: 1, lg: 2 }}>
              <Controller
                name="isSaveAddress"
                control={control}
                render={({ field }) => (
                  <Field.Root>
                    <Checkbox.Root
                      checked={Boolean(field.value)}
                      onCheckedChange={({ checked }) => {
                        field.onChange(checked);

                        if (!checked) {
                          setValue('isMakeAddressDefault', false);
                        }
                      }}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label>
                        Зберегти адресу доставки для майбутніх замовлень
                      </Checkbox.Label>
                    </Checkbox.Root>
                  </Field.Root>
                )}
              />
            </GridItem>

            <GridItem colSpan={{ base: 1, lg: 2 }}>
              <Controller
                name="isMakeAddressDefault"
                control={control}
                render={({ field }) => (
                  <Field.Root>
                    <Checkbox.Root
                      checked={Boolean(field.value)}
                      onCheckedChange={({ checked }) => {
                        field.onChange(checked);

                        if (checked) {
                          setValue('isSaveAddress', true);
                        }
                      }}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label>Зробити адресу основною</Checkbox.Label>
                    </Checkbox.Root>
                  </Field.Root>
                )}
              />
            </GridItem>
          </Grid>
        </Box>
      )}
    </VStack>
  );
};
