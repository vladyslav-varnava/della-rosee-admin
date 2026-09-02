import { ProductEditPageClient } from '@/components/products/ProductEditPageClient';

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    variantId?: string;
  }>;
};

export default async function EditProductPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { variantId } = await searchParams;

  return (
    <ProductEditPageClient
      productId={Number(id)}
      variantId={variantId ? Number(variantId) : undefined}
    />
  );
}
