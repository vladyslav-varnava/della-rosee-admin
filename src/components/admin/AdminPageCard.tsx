import { ReactNode } from 'react';

import { Box, Heading, Text } from '@chakra-ui/react';

type Props = {
  title: string;
  description: string;
  children?: ReactNode;
};

export const AdminPageCard = ({ title, description, children }: Props) => {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="blackAlpha.100"
      borderRadius="2xl"
      p={{ base: 5, md: 7 }}
      boxShadow="sm"
    >
      <Heading as="h2" size="lg" color="della.text" mb={2}>
        {title}
      </Heading>

      <Text color="gray.500" mb={children ? 6 : 0}>
        {description}
      </Text>

      {children}
    </Box>
  );
};
