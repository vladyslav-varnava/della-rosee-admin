'use client';

import Link from 'next/link';
import { RefObject } from 'react';

import {
  Box,
  Button,
  CloseButton,
  Flex,
  HStack,
  Input,
  InputGroup,
  SegmentGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { LuChartColumn, LuPlus, LuSearch } from 'react-icons/lu';

import { SellerFormDialog } from '@/components/sellers/SellerFormDialog';
import { SellerPayload, UpdateSellerPayload } from '@/types/seller';

export type SellerActivityFilter = 'all' | 'active' | 'inactive';

type Props = {
  search: string;
  activityFilter: SellerActivityFilter;
  inputRef: RefObject<HTMLInputElement | null>;
  isCreating?: boolean;
  onSearchChange: (value: string) => void;
  onActivityFilterChange: (value: SellerActivityFilter) => void;
  onClearSearch: () => void;
  onCreate: (payload: SellerPayload | UpdateSellerPayload) => Promise<void>;
};

const activityFilterItems = [
  { value: 'all', label: 'Усі' },
  { value: 'active', label: 'Активні' },
  { value: 'inactive', label: 'Неактивні' },
];

export const SellersFilters = ({
  search,
  activityFilter,
  inputRef,
  isCreating,
  onSearchChange,
  onActivityFilterChange,
  onClearSearch,
  onCreate,
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
              Продавці
            </Text>

            <Text fontSize="sm" color="gray.500">
              Пошук за іменем, телефоном, email або ID
            </Text>
          </Box>

          <HStack gap={2} wrap="wrap">
            <Button asChild variant="outline">
              <Link href="/sellers/stats">
                <LuChartColumn />
                Статистика
              </Link>
            </Button>

            <SellerFormDialog
              isLoading={isCreating}
              onSubmit={onCreate}
              trigger={
                <Button
                  bg="della.primary"
                  color="della.text"
                  _hover={{ bg: 'della.primaryHover' }}
                >
                  <LuPlus />
                  Додати продавця
                </Button>
              }
            />
          </HStack>
        </Flex>

        <SegmentGroup.Root
          value={activityFilter}
          onValueChange={(details) => {
            if (details.value) {
              onActivityFilterChange(details.value as SellerActivityFilter);
            }
          }}
        >
          <SegmentGroup.Indicator />
          <SegmentGroup.Items items={activityFilterItems} />
        </SegmentGroup.Root>

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
            placeholder="Наприклад: Марія, +380, email..."
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </InputGroup>
      </Stack>
    </Box>
  );
};
