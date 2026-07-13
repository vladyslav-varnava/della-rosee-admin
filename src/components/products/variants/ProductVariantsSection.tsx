'use client';

import Link from 'next/link';

import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { LuPencil } from 'react-icons/lu';

import { ProductVariant } from '@/types/product';

import { CreateVariantFromSmartKasaForm } from './CreateVariantFromSmartKasaForm';

type Props = {
  productId: number;
  variants: ProductVariant[];
};

export const ProductVariantsSection = ({ productId, variants }: Props) => {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="blackAlpha.100"
      borderRadius="2xl"
      p={{ base: 4, md: 6 }}
      boxShadow="sm"
    >
      <Stack gap={5}>
        <Box>
          <Heading size="md" color="della.text">
            Варіанти продукту
          </Heading>

          <Text mt={1} color="gray.500" fontSize="sm">
            Варіанти створюються зі SmartKasa, а редагуються на окремій
            сторінці.
          </Text>
        </Box>

        <CreateVariantFromSmartKasaForm productId={productId} />

        {variants.length === 0 ? (
          <Box
            border="1px dashed"
            borderColor="blackAlpha.200"
            borderRadius="xl"
            p={8}
            textAlign="center"
            bg="gray.50"
          >
            <Text fontWeight="800" color="della.text">
              Варіантів ще немає
            </Text>

            <Text mt={1} color="gray.500">
              Додайте перший варіант через SmartKasa cardId.
            </Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, xl: 2 }} gap={4}>
            {variants.map((variant) => (
              <Box
                key={variant.id}
                border="1px solid"
                borderColor="blackAlpha.100"
                borderRadius="xl"
                p={4}
                bg="gray.50"
              >
                <HStack align="start" gap={4}>
                  <Box
                    w="72px"
                    h="72px"
                    borderRadius="lg"
                    overflow="hidden"
                    bg="white"
                    border="1px solid"
                    borderColor="blackAlpha.100"
                    flexShrink={0}
                  >
                    {variant.image ? (
                      <Image
                        src={variant.image}
                        alt={variant.title}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                      />
                    ) : null}
                  </Box>

                  <Box flex={1} minW={0}>
                    <HStack gap={2} wrap="wrap">
                      <Text fontWeight="900" color="della.text">
                        {variant.title}
                      </Text>

                      <Badge colorPalette={variant.isVisible ? 'green' : 'red'}>
                        {variant.isVisible ? 'Активний' : 'Не активний'}
                      </Badge>
                    </HStack>

                    <Text mt={1} fontSize="sm" color="gray.500">
                      ID #{variant.id} · SmartKasa {variant.cardId}
                    </Text>

                    <Text mt={1} fontSize="sm">
                      {variant.value} {variant.unit} · {variant.price} ₴ ·
                      склад: {variant.quantity}
                    </Text>

                    <Button asChild size="sm" mt={3} variant="outline">
                      <Link
                        href={`/products/${productId}/variants/${variant.id}/edit`}
                      >
                        <LuPencil />
                        Редагувати
                      </Link>
                    </Button>
                  </Box>
                </HStack>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Box>
  );
};
