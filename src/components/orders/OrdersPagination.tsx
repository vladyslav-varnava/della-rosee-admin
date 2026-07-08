'use client';

import { Button, Flex, Text } from '@chakra-ui/react';

type Props = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

type PaginationItem = number | 'ellipsis';

const getPaginationItems = (
  currentPage: number,
  totalPages: number,
): PaginationItem[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>();

  pages.add(1);
  pages.add(totalPages);
  pages.add(currentPage);
  pages.add(currentPage - 1);
  pages.add(currentPage + 1);

  const validPages = Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const result: PaginationItem[] = [];

  validPages.forEach((page, index) => {
    const previousPage = validPages[index - 1];

    if (previousPage && page - previousPage > 1) {
      result.push('ellipsis');
    }

    result.push(page);
  });

  return result;
};

export const OrdersPagination = ({
  page,
  pageSize,
  total,
  onPageChange,
}: Props) => {
  const totalPages = Math.ceil(total / pageSize);
  const paginationItems = getPaginationItems(page, totalPages);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Flex
      mt={5}
      align="center"
      justify="center"
      gap={2}
      wrap="wrap"
      color="gray.600"
    >
      <Button
        size="sm"
        variant="outline"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Назад
      </Button>

      {paginationItems.map((item, index) => {
        if (item === 'ellipsis') {
          return (
            <Text key={`ellipsis-${index}`} px={2} color="gray.400">
              ...
            </Text>
          );
        }

        const isActive = item === page;

        return (
          <Button
            key={item}
            size="sm"
            minW="40px"
            variant={isActive ? 'solid' : 'outline'}
            bg={isActive ? 'della.primary' : undefined}
            color={isActive ? 'della.text' : undefined}
            _hover={{
              bg: isActive ? 'della.primaryHover' : 'blackAlpha.50',
            }}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onPageChange(item)}
          >
            {item}
          </Button>
        );
      })}

      <Button
        size="sm"
        variant="outline"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Далі
      </Button>
    </Flex>
  );
};
``;
