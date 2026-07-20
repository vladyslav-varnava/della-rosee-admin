'use client';

import { useMemo, useState } from 'react';

import {
  Box,
  Combobox,
  HStack,
  Portal,
  Spinner,
  Text,
  VStack,
  createListCollection,
} from '@chakra-ui/react';
import { LuCircleX, LuMapPin, LuSearch } from 'react-icons/lu';

import { useNovaPoshtaWarehouses } from '@/hooks/query/useNovaPoshtaWarehouses';
import {
  DropdownItem,
  NEW_POST_WAREHOUSE_TYPE_REFS,
  NovaPoshtaWarehouse,
} from '@/types/delivery';

type Props = {
  settlementRef: string;
  warehouseType: string;
  onSelect: (item: DropdownItem) => void;
  onClear: () => void;
  defaultValue?: string;
};

export const WarehousesCombobox = ({
  settlementRef,
  warehouseType,
  onSelect,
  onClear,
  defaultValue = '',
}: Props) => {
  const [value, setValue] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState(defaultValue);

  const {
    data = [],
    isPending,
    isError,
  } = useNovaPoshtaWarehouses({
    settlementRef,
    typeOfWarehouseRef: warehouseType,
  });

  const warehouseTypeLabel =
    warehouseType === NEW_POST_WAREHOUSE_TYPE_REFS.POSTMAT
      ? 'Поштомат'
      : 'Відділення';

  const transformedItems = useMemo(
    () =>
      data.map((warehouse: NovaPoshtaWarehouse) => ({
        id: warehouse.siteKey ?? warehouse.ref,
        value: warehouse.siteKey ?? warehouse.ref,
        label: warehouse.description,
      })),
    [data],
  );

  const filteredItems = useMemo(() => {
    const search = inputValue.trim().toLowerCase();

    if (!search) return transformedItems;

    return transformedItems.filter((item) =>
      item.label.toLowerCase().includes(search),
    );
  }, [inputValue, transformedItems]);

  const collection = useMemo(
    () => createListCollection({ items: filteredItems }),
    [filteredItems],
  );

  const handleClear = () => {
    setValue([]);
    setInputValue('');
    onClear();
  };

  if (isPending) {
    return (
      <Box
        w="100%"
        h="42px"
        px={4}
        borderRadius="lg"
        bg="gray.50"
        display="flex"
        alignItems="center"
      >
        <HStack gap={2}>
          <Spinner size="sm" />
          <Text fontSize="sm" fontWeight={700}>
            Завантажуємо...
          </Text>
        </HStack>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={4} borderRadius="lg" bg="red.50" color="red.600">
        <HStack gap={2}>
          <LuCircleX size={18} />
          <Text fontSize="sm" fontWeight={800}>
            Не вдалося завантажити відділення
          </Text>
        </HStack>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box p={4} borderRadius="lg" bg="gray.50">
        <HStack gap={2}>
          <LuMapPin size={18} />
          <Text fontSize="sm" color="gray.600">
            Для вибраного міста немає доступних відділень
          </Text>
        </HStack>
      </Box>
    );
  }

  return (
    <Combobox.Root
      width="100%"
      collection={collection}
      value={value}
      inputValue={inputValue}
      positioning={{ sameWidth: true, placement: 'bottom-start' }}
      openOnClick
      onInputValueChange={(event) => {
        if (event.reason !== 'item-select') {
          setInputValue(event.inputValue);
        }
      }}
      onValueChange={({ items, value: nextValue }) => {
        setValue(nextValue);

        const selectedItem = items[0];

        if (!selectedItem) {
          handleClear();
          return;
        }

        setInputValue(selectedItem.label);
        onSelect(selectedItem);
      }}
    >
      <Combobox.Label>
        <Text mb={1.5} color="gray.700" fontSize="13px" fontWeight={800}>
          {warehouseTypeLabel}
        </Text>
      </Combobox.Label>

      <Combobox.Control>
        <Box position="relative" width="100%">
          <Box
            position="absolute"
            left={3}
            top="50%"
            transform="translateY(-50%)"
            color="gray.400"
            pointerEvents="none"
            zIndex={1}
          >
            <LuSearch size={17} />
          </Box>

          <Combobox.Input
            h="42px"
            w="100%"
            pl={10}
            pr={16}
            borderRadius="lg"
            bg="white"
            border="1px solid"
            borderColor="blackAlpha.200"
            color="della.text"
            placeholder={`Оберіть ${warehouseTypeLabel.toLowerCase()}`}
            _focusVisible={{
              borderColor: 'della.primary',
              boxShadow: '0 0 0 1px var(--chakra-colors-della-primary)',
            }}
          />

          <Combobox.IndicatorGroup
            position="absolute"
            right={2}
            top="50%"
            transform="translateY(-50%)"
            color="gray.400"
          >
            <Combobox.ClearTrigger onClick={handleClear} />
            <Combobox.Trigger />
          </Combobox.IndicatorGroup>
        </Box>
      </Combobox.Control>

      <Portal>
        <Combobox.Positioner zIndex={1400}>
          <Combobox.Content
            mt={2}
            p={2}
            maxH="340px"
            overflowY="auto"
            borderRadius="xl"
            bg="white"
            border="1px solid"
            borderColor="blackAlpha.100"
            boxShadow="xl"
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <Combobox.Item
                  key={item.value}
                  item={item}
                  borderRadius="lg"
                  px={3}
                  py={3}
                  cursor="pointer"
                  _highlighted={{ bg: 'gray.50' }}
                >
                  <HStack width="100%" justify="space-between" gap={3}>
                    <Text
                      color="della.text"
                      fontSize="sm"
                      fontWeight={700}
                      lineHeight="1.35"
                    >
                      {item.label}
                    </Text>

                    <Combobox.ItemIndicator />
                  </HStack>
                </Combobox.Item>
              ))
            ) : (
              <VStack align="center" gap={2} px={4} py={6} textAlign="center">
                <Text color="gray.600" fontSize="sm" fontWeight={800}>
                  {warehouseTypeLabel} не знайдено
                </Text>
              </VStack>
            )}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
};
