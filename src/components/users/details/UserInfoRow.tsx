import { Flex, Text } from '@chakra-ui/react';

type Props = {
  label: string;
  value?: string | number | null;
};

export const UserInfoRow = ({ label, value }: Props) => {
  return (
    <Flex justify="space-between" gap={4} py={2}>
      <Text color="gray.500">{label}</Text>

      <Text fontWeight="700" color="della.text" textAlign="right">
        {value || '—'}
      </Text>
    </Flex>
  );
};
