'use client';

import { useRouter } from 'next/navigation';

import { PromotionForm } from '@/components/promotions/PromotionForm';
import { useCreatePromotion } from '@/hooks/mutations/promotion/usePromotionMutations';
import { PromotionPayload } from '@/types/promotion';

export default function PromotionCreatePage() {
  const router = useRouter();
  const createPromotion = useCreatePromotion();

  const createPromotionItem = async (payload: PromotionPayload) => {
    await createPromotion.mutateAsync(payload);
    router.push('/promotions');
  };

  return (
    <PromotionForm
      isLoading={createPromotion.isPending}
      onSubmit={createPromotionItem}
    />
  );
}
