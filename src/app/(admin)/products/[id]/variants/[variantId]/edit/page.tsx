import { ProductVariantEditPageClient } from '@/components/products/variants/ProductVariantEditPageClient';

type Props = {
  params: Promise<{
    id: string;
    variantId: string;
  }>;
};

export default async function EditProductVariantPage({ params }: Props) {
  const { id, variantId } = await params;

  return (
    <ProductVariantEditPageClient
      productId={Number(id)}
      variantId={Number(variantId)}
    />
  );
}
