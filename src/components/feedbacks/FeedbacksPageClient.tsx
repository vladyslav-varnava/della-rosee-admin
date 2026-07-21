'use client';

import { useMemo, useState } from 'react';

import {
  Box,
  ButtonGroup,
  Center,
  Container,
  HStack,
  Heading,
  IconButton,
  Pagination,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';

import { useFeedbacksAdmin } from '@/hooks/query/useFeedbacksAdmin';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { FeedbackAdminCard } from './FeedbackAdminCard';

const FEEDBACKS_PER_PAGE = 20;

export const FeedbacksPageClient = () => {
  const [page, setPage] = useState(1);

  const { data, isPending, isError } = useFeedbacksAdmin({
    page,
    take: FEEDBACKS_PER_PAGE,
  });

  const feedbacks = useMemo(() => {
    return (data?.items ?? []).filter((feedback) => !feedback.parentId);
  }, [data?.items]);

  const total = data?.paging.total ?? 0;

  if (isPending) {
    return (
      <Center minH="320px">
        <Stack align="center" gap={3}>
          <Spinner />
          <Text color="gray.500">Завантажуємо відгуки...</Text>
        </Stack>
      </Center>
    );
  }

  if (isError) {
    return (
      <Center minH="320px">
        <Text color="red.500" fontWeight="800">
          Не вдалося завантажити відгуки
        </Text>
      </Center>
    );
  }

  return (
    <Container maxW="6xl" py={6}>
      <Stack gap={6}>
        <Box>
          <Heading size="lg" color="della.text">
            Відгуки
          </Heading>

          <Text mt={1} color="gray.500">
            Модерація відгуків, відповіді клієнтам та керування видимістю.
          </Text>
        </Box>

        <Box
          border="1px solid"
          borderColor="blackAlpha.100"
          borderRadius="2xl"
          bg="gray.50"
          p={{ base: 4, md: 5 }}
        >
          <HStack justify="space-between" gap={4} wrap="wrap">
            <Box>
              <Text fontSize="sm" color="gray.500">
                Всього відгуків
              </Text>

              <Text fontSize="2xl" fontWeight="900" color="della.text">
                {total}
              </Text>
            </Box>

            <Text color="gray.500" fontSize="sm">
              Сторінка {page}
            </Text>
          </HStack>
        </Box>

        {feedbacks.length === 0 ? (
          <Center
            minH="220px"
            border="1px dashed"
            borderColor="blackAlpha.200"
            borderRadius="2xl"
            bg="gray.50"
          >
            <Text color="gray.500">Відгуків поки немає.</Text>
          </Center>
        ) : (
          <Stack gap={4}>
            {feedbacks.map((feedback) => (
              <FeedbackAdminCard key={feedback.id} feedback={feedback} />
            ))}
          </Stack>
        )}

        <Pagination.Root
          count={total}
          pageSize={FEEDBACKS_PER_PAGE}
          page={page}
          onPageChange={({ page: nextPage }) => setPage(nextPage)}
        >
          <ButtonGroup variant="outline" size="sm" justifyContent="center">
            <Pagination.PrevTrigger asChild>
              <IconButton aria-label="Попередня сторінка">
                <LuChevronLeft />
              </IconButton>
            </Pagination.PrevTrigger>

            <Pagination.Items
              render={(pageItem) => (
                <IconButton
                  key={pageItem.value}
                  aria-label={`Сторінка ${pageItem.value}`}
                  variant={pageItem.value === page ? 'solid' : 'outline'}
                  bg={pageItem.value === page ? 'della.primary' : undefined}
                  color={pageItem.value === page ? 'della.text' : undefined}
                  onClick={() => setPage(pageItem.value)}
                >
                  {pageItem.value}
                </IconButton>
              )}
            />

            <Pagination.NextTrigger asChild>
              <IconButton aria-label="Наступна сторінка">
                <LuChevronRight />
              </IconButton>
            </Pagination.NextTrigger>
          </ButtonGroup>
        </Pagination.Root>
      </Stack>
    </Container>
  );
};
