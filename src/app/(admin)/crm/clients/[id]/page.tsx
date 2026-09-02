import { CrmDashboard } from '@/components/crm/CrmDashboard';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CrmClientDetailsPage({ params }: Props) {
  const { id } = await params;

  return <CrmDashboard view="client" clientId={Number(id)} />;
}
