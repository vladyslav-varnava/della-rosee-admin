'use client';

import { Badge } from '@chakra-ui/react';

type Props = {
  isApproved: boolean;
};

export const FeedbackStatusBadge = ({ isApproved }: Props) => {
  return (
    <Badge
      colorPalette={isApproved ? 'green' : 'orange'}
      borderRadius="full"
      px={3}
      py={1}
      fontWeight="800"
    >
      {isApproved ? 'Опубліковано' : 'Очікує модерації'}
    </Badge>
  );
};
