import type { IconType } from 'react-icons';
import {
  LuBadgePercent,
  LuCalendarDays,
  LuClipboardList,
  LuLeaf,
  LuMessageSquare,
  LuPackage,
  LuShoppingBag,
  LuStethoscope,
  LuStore,
  LuUsers,
} from 'react-icons/lu';

export type AdminNavigationSection = 'shop' | 'clinic';

export type AdminNavItem = {
  href: string;
  label: string;
  description: string;
  icon: IconType;
};

export type AdminNavGroup = {
  id: AdminNavigationSection;
  title: string;
  sidebarTitle: string;
  sidebarDescription: string;
  switchLabel: string;
  icon: IconType;
  items: AdminNavItem[];
};

export const adminNavigationGroups: AdminNavGroup[] = [
  {
    id: 'shop',
    title: 'Магазин',
    sidebarTitle: 'Della Rosee Shop',
    sidebarDescription: 'Адмінка магазину',
    switchLabel: 'Магазин',
    icon: LuShoppingBag,
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
    id: 'clinic',
    title: 'Клініка',
    sidebarTitle: 'Della Rosee Clinic',
    sidebarDescription: 'Адмінка клініки',
    switchLabel: 'Клініка',
    icon: LuStethoscope,
    items: [
      {
        href: '/crm/calendar',
        label: 'Календар',
        description: 'Записи клієнтів і розклад прийомів',
        icon: LuCalendarDays,
      },
      {
        href: '/crm/clients',
        label: 'Клієнти',
        description: 'Картки клієнтів, контакти та історія записів',
        icon: LuUsers,
      },
      {
        href: '/crm/services',
        label: 'Послуги',
        description: 'Лікарі, категорії та процедури клініки',
        icon: LuStethoscope,
      },
      {
        href: '/crm/equipment',
        label: 'Обладнання',
        description: 'Типи обладнання, ресурси та доступність',
        icon: LuPackage,
      },
      {
        href: '/crm/schedule',
        label: 'Графіки',
        description: 'Робочі години лікарів і винятки',
        icon: LuClipboardList,
      },
    ],
  },
];

export const adminNavigation = adminNavigationGroups.flatMap(
  (group) => group.items,
);
