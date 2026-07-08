import {
  Badge,
  Box,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';

import AdminLoginForm from '@/components/auth/AdminLoginForm';

const adminFeatures = [
  'Замовлення',
  'Продукти',
  'Акції',
  'Відгуки',
  'Лікарі',
  'Процедури',
];

export default function LoginPage() {
  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #fff 0%, #F7F7F7 45%, #F7E8E8 100%)"
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="-180px"
        right="-180px"
        w="420px"
        h="420px"
        borderRadius="full"
        bg="rgba(214, 183, 183, 0.35)"
        filter="blur(8px)"
      />

      <Box
        position="absolute"
        bottom="-220px"
        left="-160px"
        w="460px"
        h="460px"
        borderRadius="full"
        bg="rgba(47, 72, 88, 0.08)"
        filter="blur(8px)"
      />

      <Container
        maxW="1200px"
        minH="100vh"
        py={{ base: 8, md: 12 }}
        position="relative"
        zIndex={1}
      >
        <Flex
          as="header"
          align="center"
          justify="space-between"
          mb={{ base: 12, lg: 20 }}
        >
          <Text fontSize="xl" fontWeight="800" color="della.text">
            Della Rosee Admin
          </Text>

          <Badge
            px={4}
            py={2}
            borderRadius="full"
            bg="white"
            color="della.accent"
            boxShadow="sm"
          >
            Secure area
          </Badge>
        </Flex>

        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          gap={{ base: 10, lg: 16 }}
          alignItems="center"
        >
          <Stack gap={7} maxW="560px">
            <Badge
              w="fit-content"
              px={4}
              py={2}
              borderRadius="full"
              bg="white"
              color="della.accent"
              boxShadow="sm"
            >
              Admin panel
            </Badge>

            <Stack gap={4}>
              <Heading
                as="h1"
                fontSize={{ base: '4xl', md: '5xl', xl: '6xl' }}
                lineHeight="1.05"
                color="della.text"
              >
                Керуйте Della Rosee з одного місця
              </Heading>

              <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.600">
                Адмін-панель для контролю магазину, замовлень, товарів, акцій,
                відгуків, лікарів та процедур клініки.
              </Text>
            </Stack>

            <SimpleGrid columns={{ base: 2, sm: 3 }} gap={3}>
              {adminFeatures.map((feature) => (
                <Box
                  key={feature}
                  px={4}
                  py={3}
                  bg="white"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="blackAlpha.100"
                  boxShadow="sm"
                  fontWeight="600"
                  color="della.text"
                >
                  {feature}
                </Box>
              ))}
            </SimpleGrid>

            <Text fontSize="sm" color="gray.500">
              Доступ дозволений лише адміністраторам Della Rosee.
            </Text>
          </Stack>

          <Flex justify={{ base: 'center', lg: 'flex-end' }}>
            <AdminLoginForm />
          </Flex>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
