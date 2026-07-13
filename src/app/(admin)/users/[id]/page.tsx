import { UserDetailsPageClient } from '@/components/users/details/UserDetailsPageClient';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserDetailsPage({ params }: Props) {
  const { id } = await params;

  return <UserDetailsPageClient userId={Number(id)} />;
}
