import { AdminPageCard } from '@/components/admin/AdminPageCard';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  return (
    <AdminPageCard
      title={`Редагування продукту #${id}`}
      description="Тут буде форма редагування продукту."
    />
  );
}
