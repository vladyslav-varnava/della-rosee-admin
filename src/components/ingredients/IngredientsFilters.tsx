'use client';

import { RefObject } from 'react';

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
import { LuPlus } from 'react-icons/lu';

import { IngredientFormDialog } from '@/components/ingredients/IngredientFormDialog';
import { IngredientPayload } from '@/types/product';

type Props = {
  search: string;
  inputRef: RefObject<HTMLInputElement | null>;
  isCreating?: boolean;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onCreate: (payload: IngredientPayload) => Promise<void>;
};

export const IngredientsFilters = ({
  search,
  inputRef,
  isCreating,
  onSearchChange,
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
              Інгредієнти
            </Text>

            <Text fontSize="sm" color="gray.500">
              Пошук за label, value або ID
            </Text>
          </Box>

          <IngredientFormDialog
            isLoading={isCreating}
            onSubmit={onCreate}
            trigger={
              <Button
                bg="della.primary"
                color="della.text"
                _hover={{ bg: 'della.primaryHover' }}
              >
                <LuPlus />
                Додати інгредієнт
              </Button>
            }
          />
        </Flex>

        <Box
          border="1px solid"
          borderColor="orange.200"
          borderRadius="xl"
          bg="orange.50"
          p={4}
        >
          <Text fontSize="sm" color="orange.700">
            Value має бути у форматі lowercase + underscore: label
            “Вітамін B” → value “vitamin_b”.
          </Text>
        </Box>

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
            placeholder="Наприклад: Вітамін B, vitamin_b, 12"
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </InputGroup>
      </Stack>
    </Box>
  );
};
