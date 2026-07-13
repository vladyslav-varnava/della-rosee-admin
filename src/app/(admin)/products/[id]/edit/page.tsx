import { ProductEditPageClient } from '@/components/products/ProductEditPageClient';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  return <ProductEditPageClient productId={Number(id)} />;
}
