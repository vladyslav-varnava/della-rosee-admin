import { ReactNode } from 'react';

import { Box, Heading, Stack, Text } from '@chakra-ui/react';

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
};

export const ProductFormSection = ({ title, description, children }: Props) => {
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
            {title}
          </Heading>

          {description && (
            <Text mt={1} color="gray.500" fontSize="sm">
              {description}
            </Text>
          )}
        </Box>

        {children}
      </Stack>
    </Box>
  );
};
