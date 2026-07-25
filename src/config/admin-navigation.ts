import type { IconType } from 'react-icons';
import {
  LuBadgePercent,
  LuClipboardList,
  LuLeaf,
  LuMessageSquare,
  LuPackage,
  LuStethoscope,
  LuStore,
  LuUsers,
  LuUserRound,
} from 'react-icons/lu';

export type AdminNavItem = {
  href: string;
  label: string;
  description: string;
  icon: IconType;
};

export type AdminNavGroup = {
  title: string;
  items: AdminNavItem[];
};

export const adminNavigationGroups: AdminNavGroup[] = [
  {
    title: 'Магазин',
    items: [
      {
        href: '/orders',
        label: 'Замовлення',
        description: 'Контроль замовлень, оплат і доставки',
        icon: LuClipboardList,
      },
      {
        href: '/products',
        label: 'Продукти',
        description: 'Товари, варіанти, ціни та залишки',
        icon: LuPackage,
      },
      {
        href: '/users',
        label: 'Користувачі',
        description: 'Зареєстровані клієнти, контакти та лояльність',
        icon: LuUsers,
      },
      {
        href: '/feedbacks',
        label: 'Відгуки',
        description: 'Модерація відгуків клієнтів',
        icon: LuMessageSquare,
      },
      {
        href: '/ingredients',
        label: 'Інгредієнти',
        description: 'Довідник назв і технічних value для PDP',
        icon: LuLeaf,
      },
      {
        href: '/sellers',
        label: 'Продавці',
        description: 'Команда продажів, контакти та статистика',
        icon: LuStore,
      },
      {
        href: '/promotions',
        label: 'Акції',
        description: 'Промо, знижки та акційні сторінки',
        icon: LuBadgePercent,
      },
    ],
  },
  {
    title: 'Клініка',
    items: [
      {
        href: '/doctors',
        label: 'Лікарі',
        description: 'Профілі лікарів клініки',
        icon: LuUserRound,
      },
      {
        href: '/procedures',
        label: 'Процедури',
        description: 'Напрямки, процедури та записи',
        icon: LuStethoscope,
      },
    ],
  },
];

export const adminNavigation = adminNavigationGroups.flatMap(
  (group) => group.items,
);
