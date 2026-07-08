'use client';

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
import { RefObject } from 'react';
import { LuMail, LuPhone, LuSearch, LuUser } from 'react-icons/lu';

import { USER_SEARCH_TYPES, UserSearchType } from '@/types/user';

type Props = {
  searchType: UserSearchType;
  searchValue: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onSearchTypeChange: (value: UserSearchType) => void;
  onSearchValueChange: (value: string) => void;
  onClearSearch: () => void;
};

const searchTypeItems = [
  {
    value: USER_SEARCH_TYPES.PHONE,
    label: (
      <HStack gap={2}>
        <LuPhone />
        <Text>Телефон</Text>
      </HStack>
    ),
  },
  {
    value: USER_SEARCH_TYPES.EMAIL,
    label: (
      <HStack gap={2}>
        <LuMail />
        <Text>Email</Text>
      </HStack>
    ),
  },
  {
    value: USER_SEARCH_TYPES.LAST_NAME,
    label: (
      <HStack gap={2}>
        <LuUser />
        <Text>Прізвище</Text>
      </HStack>
    ),
  },
];

const getPlaceholder = (searchType: UserSearchType) => {
  const placeholders: Record<UserSearchType, string> = {
    phone: 'Наприклад: 380, 097, 050...',
    email: 'Наприклад: client@gmail.com',
    lastName: 'Наприклад: Петренко',
  };

  return placeholders[searchType];
};

export const UsersFilters = ({
  searchType,
  searchValue,
  inputRef,
  onSearchTypeChange,
  onSearchValueChange,
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
              Користувачі
            </Text>

            <Text fontSize="sm" color="gray.500">
              Шукайте клієнтів за телефоном, email або прізвищем
            </Text>
          </Box>

          <Button variant="outline" onClick={onClearSearch}>
            Очистити
          </Button>
        </Flex>

        <SegmentGroup.Root
          value={searchType}
          onValueChange={(details) => {
            if (details.value) {
              onSearchTypeChange(details.value as UserSearchType);
            }
          }}
        >
          <SegmentGroup.Indicator />
          <SegmentGroup.Items items={searchTypeItems} />
        </SegmentGroup.Root>

        <InputGroup
          startElement={<LuSearch />}
          endElement={
            searchValue ? (
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
            value={searchValue}
            placeholder={getPlaceholder(searchType)}
            onChange={(event) => onSearchValueChange(event.target.value)}
          />
        </InputGroup>
      </Stack>
    </Box>
  );
};
