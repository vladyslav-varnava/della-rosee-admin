import { SimpleGrid } from '@chakra-ui/react';
import { LuBadgePercent, LuMail, LuPhone, LuUser } from 'react-icons/lu';

import { translateLoyaltyLevel, User } from '@/types/user';

import { UserInfoList } from './UserInfoList';
import { UserInfoRow } from './UserInfoRow';
import { UserSectionCard } from './UserSectionCard';

type Props = {
  user: User;
};

export const UserSummaryCards = ({ user }: Props) => {
  return (
    <SimpleGrid columns={{ base: 1, xl: 2 }} gap={5}>
      <UserSectionCard title="Контактні дані" icon={<LuUser />}>
        <UserInfoList>
          <UserInfoRow label="Імʼя" value={user.firstName} />
          <UserInfoRow label="Прізвище" value={user.lastName} />
          <UserInfoRow label="Email" value={user.email} />
          <UserInfoRow label="Телефон" value={user.phone} />
        </UserInfoList>
      </UserSectionCard>

      <UserSectionCard title="Лояльність" icon={<LuBadgePercent />}>
        <UserInfoList>
          <UserInfoRow
            label="Рівень"
            value={translateLoyaltyLevel(user.loyaltyLevel)}
          />
          <UserInfoRow
            label="Витрачено цього року"
            value={`${user.totalSpentThisYear ?? 0} грн`}
          />
        </UserInfoList>
      </UserSectionCard>
    </SimpleGrid>
  );
};
