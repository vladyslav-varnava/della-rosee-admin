'use client';

import {
  Box,
  Button,
  CloseButton,
  Flex,
  Input,
  InputGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { RefObject } from 'react';
import { LuPlus } from 'react-icons/lu';
import Link from 'next/link';

type Props = {
  search: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
};

export const ProductsFilters = ({
  search,
  inputRef,
  onSearchChange,
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
              Продукти
            </Text>

            <Text fontSize="sm" color="gray.500">
              Пошук за назвою, брендом, slug, кодом або ID
            </Text>
          </Box>

          <Button
            asChild
            bg="della.primary"
            color="della.text"
            _hover={{ bg: 'della.primaryHover' }}
          >
            <Link href="/products/create">
              <LuPlus />
              Додати продукт
            </Link>
          </Button>
        </Flex>

        <InputGroup
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
            placeholder="Наприклад: Obagi, SPF, tretinoin, 123"
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </InputGroup>
      </Stack>
    </Box>
  );
};
