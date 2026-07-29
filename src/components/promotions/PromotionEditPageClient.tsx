'use client';

import { useRouter } from 'next/navigation';

import { Box, Center, Spinner, Text, VStack } from '@chakra-ui/react';

import { PromotionForm } from '@/components/promotions/PromotionForm';
import { useUpdatePromotion } from '@/hooks/mutations/promotion/usePromotionMutations';
import { useGetPromotion } from '@/hooks/query/usePromotionsAdmin';
import { PromotionPayload } from '@/types/promotion';

type Props = {
  promotionId: string;
};

export const PromotionEditPageClient = ({ promotionId }: Props) => {
  const router = useRouter();
  const { data: promotion, isPending, isError } = useGetPromotion(promotionId);
  const updatePromotion = useUpdatePromotion();

  const updatePromotionItem = async (payload: PromotionPayload) => {
    await updatePromotion.mutateAsync({
      id: promotionId,
      payload,
    });
    router.push('/promotions');
  };

  if (isPending) {
    return (
      <Center py={16}>
        <VStack color="della.accent">
          <Spinner />
          <Text>Завантаження акції...</Text>
        </VStack>
      </Center>
    );
  }

  if (isError || !promotion) {
    return (
      <Box
        bg="white"
        border="1px solid"
        borderColor="blackAlpha.100"
        borderRadius="2xl"
        p={10}
        textAlign="center"
        boxShadow="sm"
      >
        <Text fontSize="xl" fontWeight="800" color="della.text">
          Акцію не знайдено
        </Text>

        <Text mt={2} color="gray.500">
          Перевірте ID або поверніться до списку акцій.
        </Text>
      </Box>
    );
  }

  return (
    <PromotionForm
      promotion={promotion}
      isLoading={updatePromotion.isPending}
      onSubmit={updatePromotionItem}
    />
  );
};
