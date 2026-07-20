import Link from 'next/link';

import { Badge, Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import { LuArrowLeft } from 'react-icons/lu';

import {
  getLoyaltyLevelColor,
  translateLoyaltyLevel,
  User,
} from '@/types/user';

type Props = {
  user: User;
};

const getFullName = (user: User) => {
  return (
    `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Користувач'
  );
};

export const UserDetailsHeader = ({ user }: Props) => {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="blackAlpha.100"
      borderRadius="2xl"
      p={{ base: 5, md: 6 }}
      boxShadow="sm"
    >
      <Flex
        justify="space-between"
        align={{ base: 'start', md: 'center' }}
        direction={{ base: 'column', md: 'row' }}
        gap={4}
      >
        <Box>
          <Button asChild variant="outline" size="sm" mb={4}>
            <Link href="/users">
              <LuArrowLeft />
              До користувачів
            </Link>
          </Button>

          <HStack gap={3} wrap="wrap">
            <Text fontSize="2xl" fontWeight="900" color="della.text">
              {getFullName(user)}
            </Text>

            <Badge
              colorPalette={getLoyaltyLevelColor(user.loyaltyLevel)}
              borderRadius="full"
              px={3}
              py={1}
            >
              {translateLoyaltyLevel(user.loyaltyLevel)}
            </Badge>
          </HStack>

          <Text mt={1} color="gray.500">
            ID користувача: #{user.id}
          </Text>
        </Box>

        <Box textAlign={{ base: 'left', md: 'right' }}>
          <Text color="gray.500">Витрачено цього року</Text>
          <Text fontSize="3xl" fontWeight="900" color="della.text">
            {user.totalSpentThisYear ?? 0} грн
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};
