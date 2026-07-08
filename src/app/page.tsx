import NextLink from 'next/link';

import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';

const features = [
  {
    title: 'Замовлення',
    description:
      'Перегляд нових замовлень, зміна статусів, контроль оплат і доставки.',
  },
  {
    title: 'Продукти',
    description:
      'Створення, редагування та керування товарами, варіантами, цінами й залишками.',
  },
  {
    title: 'Акції',
    description:
      'Керування промо-сторінками, знижками, таймерами та товарами в акціях.',
  },
  {
    title: 'Відгуки',
    description:
      'Модерація відгуків клієнтів, підтвердження або приховування коментарів.',
  },
  {
    title: 'Лікарі',
    description:
      'Додавання та редагування лікарів для косметологічної частини сайту.',
  },
  {
    title: 'Процедури',
    description:
      'Керування напрямками, процедурами та заявками на запис до клініки.',
  },
];

export default function LandingPage() {
  return (
    <Box minH="100vh" bg="della.backgroundSecondary">
      <Container maxW="1200px" py={{ base: 8, md: 14 }}>
        <Flex
          as="header"
          align="center"
          justify="space-between"
          mb={{ base: 12, md: 20 }}
        >
          <Text fontSize="xl" fontWeight="700" color="della.text">
            Della Rosee Admin
          </Text>

          <Button
            asChild
            bg="della.primary"
            _hover={{ bg: 'della.primaryHover' }}
          >
            <NextLink href="/login">Sign In</NextLink>
          </Button>
        </Flex>

        <VStack gap={6} textAlign="center" maxW="820px" mx="auto" mb={14}>
          <Badge
            px={4}
            py={2}
            borderRadius="full"
            bg="white"
            color="della.accent"
          >
            Admin panel
          </Badge>

          <Heading
            as="h1"
            fontSize={{ base: '4xl', md: '6xl' }}
            lineHeight="1.05"
            color="della.text"
          >
            Керування магазином і клінікою Della Rosee в одному місці
          </Heading>

          <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.600">
            Адмін-панель дозволяє керувати товарами, замовленнями, акціями,
            відгуками, лікарями та процедурами без доступу до основного
            клієнтського сайту.
          </Text>

          <Flex gap={4} wrap="wrap" justify="center" pt={4}>
            <Button
              asChild
              size="lg"
              bg="della.primary"
              color="della.text"
              _hover={{ bg: 'della.primaryHover' }}
            >
              <NextLink href="/login">Увійти в адмінку</NextLink>
            </Button>

            <Button asChild size="lg" variant="outline">
              <NextLink href="https://dellarosee.com">Відкрити сайт</NextLink>
            </Button>
          </Flex>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {features.map((feature) => (
            <Box
              key={feature.title}
              bg="white"
              p={6}
              borderRadius="2xl"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.100"
            >
              <Heading as="h2" size="md" mb={3} color="della.text">
                {feature.title}
              </Heading>

              <Text color="gray.600" lineHeight="1.7">
                {feature.description}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        <Box
          mt={14}
          p={{ base: 6, md: 8 }}
          bg="white"
          borderRadius="2xl"
          textAlign="center"
          boxShadow="sm"
        >
          <Heading as="h2" size="lg" mb={3} color="della.text">
            Окремий admin frontend
          </Heading>

          <Text color="gray.600" maxW="720px" mx="auto">
            Цей проєкт працює як незалежна Next.js адмінка та використовує
            існуючий Della Rosee API для авторизації, товарів, замовлень,
            відгуків, процедур і лікарів.
          </Text>
        </Box>
      </Container>
    </Box>
  );
}
