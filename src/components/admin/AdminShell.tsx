'use client';

import { ReactNode, useState } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Link,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  LuExternalLink,
  LuLogOut,
  LuPanelLeftClose,
  LuPanelLeftOpen,
} from 'react-icons/lu';

import {
  adminNavigation,
  adminNavigationGroups,
} from '@/config/admin-navigation';
import { useAuth } from '@/hooks/mutations/useAuth';

import { AdminNavLink } from './AdminNavLink';

type Props = {
  children: ReactNode;
};

const getCurrentPage = (pathname: string) => {
  return adminNavigation.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
};

export const AdminShell = ({ children }: Props) => {
  const pathname = usePathname();
  const currentPage = getCurrentPage(pathname);
  const { signOut, isSignOutLoading } = useAuth();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <Flex minH="100vh" bg="della.backgroundSecondary">
      <Box
        as="aside"
        display={{ base: 'none', lg: 'flex' }}
        position="sticky"
        top={0}
        h="100vh"
        w={isSidebarCollapsed ? '88px' : '300px'}
        flexShrink={0}
        flexDirection="column"
        bg="white"
        borderRight="1px solid"
        borderColor="blackAlpha.100"
        transition="width 0.2s ease"
      >
        <Flex
          align="center"
          justify={isSidebarCollapsed ? 'center' : 'space-between'}
          gap={3}
          px={isSidebarCollapsed ? 3 : 6}
          py={6}
        >
          {!isSidebarCollapsed && (
            <Box minW={0}>
              <Text fontSize="xl" fontWeight="900" color="della.text">
                Della Rosee
              </Text>

              <Text mt={1} fontSize="sm" color="gray.500">
                Admin panel
              </Text>
            </Box>
          )}

          <IconButton
            size="sm"
            variant="outline"
            aria-label={
              isSidebarCollapsed ? 'Розгорнути меню' : 'Згорнути меню'
            }
            onClick={() => setIsSidebarCollapsed((value) => !value)}
          >
            {isSidebarCollapsed ? <LuPanelLeftOpen /> : <LuPanelLeftClose />}
          </IconButton>
        </Flex>

        <VStack
          align="stretch"
          gap={isSidebarCollapsed ? 3 : 6}
          px={isSidebarCollapsed ? 3 : 4}
          flex={1}
          overflowY="auto"
        >
          {adminNavigationGroups.map((group) => (
            <Box key={group.title}>
              {!isSidebarCollapsed ? (
                <Text
                  px={3}
                  mb={2}
                  fontSize="xs"
                  fontWeight="800"
                  color="gray.400"
                  letterSpacing="0.12em"
                  textTransform="uppercase"
                >
                  {group.title}
                </Text>
              ) : (
                <Box h="1px" mx={3} mb={2} bg="blackAlpha.100" aria-hidden />
              )}

              <Stack gap={1}>
                {group.items.map((item) => (
                  <AdminNavLink
                    key={item.href}
                    item={item}
                    collapsed={isSidebarCollapsed}
                  />
                ))}
              </Stack>
            </Box>
          ))}
        </VStack>

        <Box
          p={isSidebarCollapsed ? 3 : 4}
          borderTop="1px solid"
          borderColor="blackAlpha.100"
        >
          <Link asChild _hover={{ textDecoration: 'none' }}>
            <NextLink
              href="https://dellarosee.com"
              target="_blank"
              aria-label="Відкрити сайт"
              title={isSidebarCollapsed ? 'Відкрити сайт' : undefined}
            >
              <Button w="100%" variant="outline">
                <LuExternalLink />
                {!isSidebarCollapsed && 'Відкрити сайт'}
              </Button>
            </NextLink>
          </Link>
        </Box>
      </Box>

      <Box flex={1} minW={0}>
        <Box
          display={{ base: 'block', lg: 'none' }}
          position="sticky"
          top={0}
          zIndex={10}
          bg="white"
          borderBottom="1px solid"
          borderColor="blackAlpha.100"
        >
          <Box px={4} py={4}>
            <Flex align="center" justify="space-between" gap={4} mb={4}>
              <Box>
                <Text fontWeight="900" color="della.text">
                  Della Rosee
                </Text>

                <Text fontSize="sm" color="gray.500">
                  Admin panel
                </Text>
              </Box>

              <Button
                size="sm"
                variant="outline"
                loading={isSignOutLoading}
                onClick={() => signOut()}
              >
                <LuLogOut />
                Вийти
              </Button>
            </Flex>

            <HStack gap={2} overflowX="auto" pb={1}>
              {adminNavigation.map((item) => (
                <AdminNavLink key={item.href} item={item} compact />
              ))}
            </HStack>
          </Box>
        </Box>

        <Box
          as="header"
          display={{ base: 'none', lg: 'block' }}
          bg="white"
          borderBottom="1px solid"
          borderColor="blackAlpha.100"
          px={8}
          py={5}
        >
          <Flex align="center" justify="space-between" gap={6}>
            <Box>
              <HStack gap={3} mb={1}>
                <Text fontSize="2xl" fontWeight="900" color="della.text">
                  {currentPage?.label ?? 'Адмінка'}
                </Text>

                <Badge
                  px={3}
                  py={1}
                  borderRadius="full"
                  bg="della.primary"
                  color="della.text"
                >
                  {process.env.NEXT_PUBLIC_ENV ?? 'admin'}
                </Badge>
              </HStack>

              <Text color="gray.500">
                {currentPage?.description ??
                  'Керування магазином і клінікою Della Rosee'}
              </Text>
            </Box>

            <HStack gap={3}>
              <Link asChild _hover={{ textDecoration: 'none' }}>
                <NextLink href="https://dellarosee.com" target="_blank">
                  <Button variant="outline">
                    <LuExternalLink />
                    Сайт
                  </Button>
                </NextLink>
              </Link>

              <Button
                loading={isSignOutLoading}
                bg="della.primary"
                color="della.text"
                _hover={{ bg: 'della.primaryHover' }}
                onClick={() => signOut()}
              >
                <LuLogOut />
                Вийти
              </Button>
            </HStack>
          </Flex>
        </Box>

        <Box as="main" p={{ base: 4, md: 6, lg: 8 }}>
          {children}
        </Box>
      </Box>
    </Flex>
  );
};
