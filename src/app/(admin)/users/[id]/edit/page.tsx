import { AdminPageCard } from '@/components/admin/AdminPageCard';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditUserPage({ params }: Props) {
  const { id } = await params;

  return (
    <AdminPageCard
      title={`Користувач #${id}`}
      description="Тут буде редагування користувача, перегляд адрес, замовлень та інформації про лояльність."
    />
  );
}
