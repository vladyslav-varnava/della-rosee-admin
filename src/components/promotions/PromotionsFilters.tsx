'use client';

import { RefObject } from 'react';

import {
  Box,
  CloseButton,
  Flex,
  HStack,
  Input,
  InputGroup,
  SegmentGroup,
  Stack,
  Text,
  chakra,
} from '@chakra-ui/react';
import { LuSearch } from 'react-icons/lu';

import {
  PROMOTION_TYPES,
  PromotionActiveFilter,
  PromotionType,
} from '@/types/promotion';

type Props = {
  search: string;
  activeFilter: PromotionActiveFilter;
  typeFilter: PromotionType | '';
  inputRef: RefObject<HTMLInputElement | null>;
  onSearchChange: (value: string) => void;
  onActiveFilterChange: (value: PromotionActiveFilter) => void;
  onTypeFilterChange: (value: PromotionType | '') => void;
  onClearSearch: () => void;
};

const StyledSelect = chakra('select');

const activeFilterItems = [
  { value: 'all', label: 'Усі' },
  { value: 'active', label: 'Активні' },
  { value: 'inactive', label: 'Неактивні' },
];

const formatPromotionType = (type: PromotionType) => {
  return type
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

export const PromotionsFilters = ({
  search,
  activeFilter,
  typeFilter,
  inputRef,
  onSearchChange,
  onActiveFilterChange,
  onTypeFilterChange,
  onClearSearch,
}: Props) => {
  return (
    <Box
      w="100%"
      bg="white"
      border="1px solid"
      borderColor="blackAlpha.100"
      borderRadius="2xl"
      p={{ base: 4, md: 5 }}
      boxShadow="sm"
    >
      <Stack gap={4}>
        <Flex
          align={{ base: 'stretch', md: 'center' }}
          justify="space-between"
          direction={{ base: 'column', md: 'row' }}
          gap={3}
        >
          <Box>
            <Text fontWeight="800" color="della.text">
              Акції
            </Text>

            <Text fontSize="sm" color="gray.500">
              Пошук за назвою, slug, описом, ID або промокодом
            </Text>
          </Box>

          <HStack gap={3} wrap="wrap">
            <SegmentGroup.Root
              value={activeFilter}
              onValueChange={(details) => {
                if (details.value) {
                  onActiveFilterChange(details.value as PromotionActiveFilter);
                }
              }}
            >
              <SegmentGroup.Indicator />
              <SegmentGroup.Items items={activeFilterItems} />
            </SegmentGroup.Root>

            <StyledSelect
              value={typeFilter}
              h="40px"
              minW={{ base: '100%', md: '220px' }}
              px={3}
              border="1px solid"
              borderColor="blackAlpha.200"
              borderRadius="lg"
              bg="white"
              color="della.text"
              cursor="pointer"
              onChange={(event) =>
                onTypeFilterChange(event.currentTarget.value as PromotionType)
              }
            >
              <option value="">Усі типи</option>

              {PROMOTION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {formatPromotionType(type)}
                </option>
              ))}
            </StyledSelect>
          </HStack>
        </Flex>

        <InputGroup
          startElement={<LuSearch />}
          endElement={
            search ? (
              <CloseButton
                size="sm"
                me="-2"
                onClick={onClearSearch}
                aria-label="Очистити пошук"
              />
            ) : undefined
          }
        >
          <Input
            ref={inputRef}
            value={search}
            placeholder="Наприклад: summer, spf, PROMOCODE, код..."
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </InputGroup>
      </Stack>
    </Box>
  );
};
