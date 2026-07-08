'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

import { Box, HStack, Link, Text } from '@chakra-ui/react';

import { AdminNavItem } from '@/config/admin-navigation';

type Props = {
  item: AdminNavItem;
  compact?: boolean;
  collapsed?: boolean;
};

const isRouteActive = (pathname: string, href: string) => {
  return pathname === href || pathname.startsWith(`${href}/`);
};

export const AdminNavLink = ({
  item,
  compact = false,
  collapsed = false,
}: Props) => {
  const pathname = usePathname();
  const isActive = isRouteActive(pathname, item.href);
  const Icon = item.icon;

  return (
    <Link
      asChild
      display="block"
      borderRadius="xl"
      bg={isActive ? 'della.primary' : 'transparent'}
      color={isActive ? 'della.text' : 'gray.700'}
      title={collapsed ? item.label : undefined}
      _hover={{
        bg: isActive ? 'della.primary' : 'blackAlpha.50',
        textDecoration: 'none',
      }}
    >
      <NextLink href={item.href} aria-label={item.label}>
        <Box px={collapsed ? 3 : compact ? 4 : 5} py={compact ? 3 : 4}>
          <HStack justify={collapsed ? 'center' : 'flex-start'} gap={3}>
            <Box as={Icon} boxSize="20px" flexShrink={0} />

            {!collapsed && (
              <Box minW={0}>
                <Text fontWeight="700" whiteSpace="nowrap">
                  {item.label}
                </Text>

                {!compact && (
                  <Text
                    mt={1}
                    fontSize="sm"
                    color={isActive ? 'gray.700' : 'gray.500'}
                    lineClamp={1}
                  >
                    {item.description}
                  </Text>
                )}
              </Box>
            )}
          </HStack>
        </Box>
      </NextLink>
    </Link>
  );
};
