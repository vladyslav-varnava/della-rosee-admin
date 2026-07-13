import { OrderDetailsPageClient } from '@/components/orders/OrderDetailsPageClient';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderDetailsPage({ params }: Props) {
  const { id } = await params;

  return <OrderDetailsPageClient orderId={Number(id)} />;
}
