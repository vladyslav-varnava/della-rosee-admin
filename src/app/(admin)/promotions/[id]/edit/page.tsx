import { PromotionEditPageClient } from '@/components/promotions/PromotionEditPageClient';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PromotionEditPage({ params }: Props) {
  const { id } = await params;

  return <PromotionEditPageClient promotionId={id} />;
}
