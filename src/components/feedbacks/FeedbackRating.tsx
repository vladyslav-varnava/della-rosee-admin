'use client';

import { HStack, Text } from '@chakra-ui/react';
import { LuStar } from 'react-icons/lu';

type Props = {
  value: number;
};

export const FeedbackRating = ({ value }: Props) => {
  return (
    <HStack gap={1}>
      {Array.from({ length: 5 }).map((_, index) => {
        const isActive = index < value;

        return (
          <Text
            key={index}
            color={isActive ? 'yellow.500' : 'gray.300'}
            lineHeight="1"
          >
            <LuStar fill="currentColor" />
          </Text>
        );
      })}
    </HStack>
  );
};
