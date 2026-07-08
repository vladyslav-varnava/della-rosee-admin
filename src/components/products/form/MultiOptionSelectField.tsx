'use client';

import { useMemo, useState } from 'react';

import {
  Badge,
  Box,
  Button,
  Field,
  Flex,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';

import { ProductOption } from '@/types/product';

type Props = {
  label: string;
  value: string[];
  options: ProductOption[];
  placeholder?: string;
  helperText?: string;
  searchable?: boolean;
  onChange: (value: string[]) => void;
};

const normalize = (value: string) => value.toLowerCase().trim();

export const MultiOptionSelectField = ({
  label,
  value,
  options,
  placeholder = 'Пошук...',
  helperText,
  searchable = true,
  onChange,
}: Props) => {
  const [search, setSearch] = useState('');

  const selectedSet = useMemo(() => new Set(value), [value]);

  const filteredOptions = useMemo(() => {
    const searchValue = normalize(search);

    if (!searchValue) {
      return options;
    }

    return options.filter((option) => {
      return (
        normalize(option.label).includes(searchValue) ||
        normalize(option.value).includes(searchValue) ||
        normalize(option.groupLabel ?? '').includes(searchValue)
      );
    });
  }, [options, search]);

  const toggleValue = (nextValue: string) => {
    if (selectedSet.has(nextValue)) {
      onChange(value.filter((item) => item !== nextValue));
      return;
    }

    onChange([...value, nextValue]);
  };

  const clearSelected = () => {
    onChange([]);
  };

  return (
    <Field.Root>
      <Stack gap={3}>
        <Flex align="center" justify="space-between" gap={3}>
          <Box>
            <Field.Label>{label}</Field.Label>

            {helperText && (
              <Text mt={1} fontSize="xs" color="gray.500">
                {helperText}
              </Text>
            )}
          </Box>

          {value.length > 0 && (
            <Button size="xs" variant="ghost" onClick={clearSelected}>
              Очистити
            </Button>
          )}
        </Flex>

        {searchable && (
          <Input
            value={search}
            placeholder={placeholder}
            onChange={(event) => setSearch(event.target.value)}
          />
        )}

        {value.length > 0 && (
          <Flex gap={2} wrap="wrap">
            {value.map((selectedValue) => {
              const option = options.find(
                (item) => item.value === selectedValue,
              );

              return (
                <Badge
                  key={selectedValue}
                  colorPalette="purple"
                  borderRadius="full"
                  px={3}
                  py={1}
                >
                  {option?.label ?? selectedValue}
                </Badge>
              );
            })}
          </Flex>
        )}

        <Box
          maxH="260px"
          overflowY="auto"
          border="1px solid"
          borderColor="blackAlpha.100"
          borderRadius="xl"
          p={3}
          bg="gray.50"
        >
          <Flex gap={2} wrap="wrap">
            {filteredOptions.map((option) => {
              const isSelected = selectedSet.has(option.value);

              return (
                <Button
                  key={option.value}
                  type="button"
                  size="sm"
                  variant={isSelected ? 'solid' : 'outline'}
                  bg={isSelected ? 'della.primary' : 'white'}
                  color={isSelected ? 'della.text' : 'gray.700'}
                  borderColor={isSelected ? 'della.primary' : 'blackAlpha.200'}
                  _hover={{
                    bg: isSelected ? 'della.primaryHover' : 'blackAlpha.50',
                  }}
                  onClick={() => toggleValue(option.value)}
                >
                  {option.area ? `${option.area} ` : ''}
                  {option.label}
                </Button>
              );
            })}
          </Flex>

          {filteredOptions.length === 0 && (
            <Text py={4} textAlign="center" color="gray.500" fontSize="sm">
              Нічого не знайдено
            </Text>
          )}
        </Box>
      </Stack>
    </Field.Root>
  );
};
