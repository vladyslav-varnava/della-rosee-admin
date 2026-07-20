'use client';

import { useEffect, useMemo, useState } from 'react';

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

import { useNovaPoshtaSettlements } from '@/hooks/query/useNovaPoshtaSettlements';
import { DropdownItem, NovaPoshtaSettlement } from '@/types/delivery';

type Props = {
  onSelect: (item: DropdownItem) => void;
  onClear: () => void;
  defaultValue?: string;
  label?: string;
};

const MIN_SEARCH_LENGTH = 2;
const SEARCH_DELAY = 350;

export const SettlementsCombobox = ({
  onSelect,
  onClear,
  defaultValue = '',
  label = 'Місто',
}: Props) => {
  const [value, setValue] = useState<string[]>([]);
  const [search, setSearch] = useState(defaultValue);
  const [debouncedSearch, setDebouncedSearch] = useState(defaultValue);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, SEARCH_DELAY);

    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    setSearch(defaultValue);
    setDebouncedSearch(defaultValue);

    if (!defaultValue) {
      setValue([]);
    }
  }, [defaultValue]);

  const shouldSearch = debouncedSearch.length >= MIN_SEARCH_LENGTH;

  const { data, isError, isPending } = useNovaPoshtaSettlements(
    shouldSearch ? debouncedSearch : '',
  );

  const settlements: NovaPoshtaSettlement[] = useMemo(
    () => data?.data?.[0]?.Addresses ?? [],
    [data],
  );

  const items = useMemo(
    () =>
      settlements.map((settlement) => ({
        id: settlement.Ref,
        value: settlement.Ref,
        label: settlement.Present,
      })),
    [settlements],
  );

  const collection = useMemo(() => createListCollection({ items }), [items]);

  const handleClear = () => {
    setValue([]);
    setSearch('');
    setDebouncedSearch('');
    onClear();
  };

  return (
    <Combobox.Root
      width="100%"
      collection={collection}
      value={value}
      inputValue={search}
      positioning={{ sameWidth: true, placement: 'bottom-start' }}
      onInputValueChange={(event) => {
        if (event.reason !== 'item-select') {
          setSearch(event.inputValue);
        }
      }}
      onValueChange={({ items: selectedItems, value: nextValue }) => {
        setValue(nextValue);

        const selectedItem = selectedItems[0];

        if (!selectedItem) {
          handleClear();
          return;
        }

        setSearch(selectedItem.label);
        onSelect(selectedItem);
      }}
    >
      <Combobox.Label>
        <Text mb={1.5} color="gray.700" fontSize="13px" fontWeight={800}>
          {label}
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
            placeholder="Оберіть місто"
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
            maxH="320px"
            overflowY="auto"
            borderRadius="xl"
            bg="white"
            border="1px solid"
            borderColor="blackAlpha.100"
            boxShadow="xl"
          >
            {!shouldSearch ? (
              <VStack align="center" gap={2} px={4} py={6} textAlign="center">
                <LuMapPin size={20} />
                <Text color="gray.600" fontSize="sm" fontWeight={800}>
                  Почніть вводити назву міста
                </Text>
              </VStack>
            ) : isPending ? (
              <HStack p={4} gap={3}>
                <Spinner size="sm" />
                <Text fontSize="sm">Шукаємо місто...</Text>
              </HStack>
            ) : isError ? (
              <HStack p={4} gap={3} color="red.500">
                <LuCircleX size={18} />
                <Text fontSize="sm" fontWeight={800}>
                  Не вдалося завантажити міста
                </Text>
              </HStack>
            ) : items.length > 0 ? (
              items.map((item) => (
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
                      overflow="hidden"
                      whiteSpace="nowrap"
                      textOverflow="ellipsis"
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
                  Місто не знайдено
                </Text>
              </VStack>
            )}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
};
