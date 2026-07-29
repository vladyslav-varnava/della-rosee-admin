export const PROMOTION_CONDITIONS = [
  { type: 'cartTotalGte', label: 'Сума кошика від' },
  { type: 'cartTotalLte', label: 'Сума кошика до' },
  { type: 'hasProduct', label: 'Є продукт' },
  { type: 'hasAllProducts', label: 'Є всі продукти' },
  { type: 'hasBrand', label: 'Є бренд' },
  { type: 'hasCategory', label: 'Є категорія' },
  { type: 'minQuantityOfProduct', label: 'Мін. кількість продукту' },
  { type: 'maxQuantityOfProduct', label: 'Макс. кількість продукту' },
  { type: 'usageLimitNotReached', label: 'Ліміт використання не досягнуто' },
  {
    type: 'perUserLimitNotReached',
    label: 'Ліміт на користувача не досягнуто',
  },
  { type: 'dateBetween', label: 'Дата в діапазоні' },
] as const;

export const PROMOTION_EFFECTS = [
  { type: 'fixedDiscount', label: 'Фіксована знижка' },
  { type: 'percentDiscount', label: 'Відсоткова знижка' },
  {
    type: 'percentDiscountOnEveryProduct',
    label: 'Відсоткова знижка на кожен продукт',
  },
  { type: 'percentDiscountOnProduct', label: 'Відсоткова знижка на продукти' },
  { type: 'fixedDiscountOnProduct', label: 'Фіксована знижка на продукти' },
  { type: 'percentDiscountOnBrand', label: 'Відсоткова знижка на бренд' },
  { type: 'bundlePercentDiscount', label: 'Відсоткова знижка на набір' },
  { type: 'productGift', label: 'Продукт-подарунок' },
  { type: 'freeProduct', label: 'Безкоштовний продукт' },
  { type: 'freeCheapestItem', label: 'Найдешевший товар безкоштовно' },
  { type: 'none', label: 'Без додаткового ефекту' },
] as const;

export type PromotionConditionType =
  (typeof PROMOTION_CONDITIONS)[number]['type'];

export type PromotionEffectType = (typeof PROMOTION_EFFECTS)[number]['type'];

export type PromotionRuleItem = {
  type: string;
  value: unknown;
};

export const emptyRule = (): PromotionRuleItem => ({
  type: '',
  value: '',
});
