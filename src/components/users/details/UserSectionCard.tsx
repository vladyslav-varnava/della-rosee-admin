import type { ReactNode } from 'react';

import { Card, HStack } from '@chakra-ui/react';

type Props = {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
};

export const UserSectionCard = ({ title, icon, children }: Props) => {
  return (
    <Card.Root
      bg="white"
      border="1px solid"
      borderColor="blackAlpha.100"
      borderRadius="2xl"
      boxShadow="sm"
      overflow="hidden"
    >
      <Card.Header pb={3}>
        <HStack gap={3}>
          {icon}
          <Card.Title color="della.text">{title}</Card.Title>
        </HStack>
      </Card.Header>

      <Card.Body pt={0}>{children}</Card.Body>
    </Card.Root>
  );
};
