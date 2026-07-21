'use client';

import NextLink from 'next/link';

import {
  Box,
  Button,
  Card,
  Flex,
  HStack,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import {
  LuExternalLink,
  LuEye,
  LuEyeOff,
  LuMail,
  LuPencil,
  LuTrash2,
  LuUser,
} from 'react-icons/lu';

import {
  useApproveFeedback,
  useDeleteFeedback,
  useDisapproveFeedback,
} from '@/hooks/mutations/feedback/useFeedbackAdminMutations';
import { Feedback } from '@/types/feedback';

import { FeedbackRating } from './FeedbackRating';
import { FeedbackReplyForm } from './FeedbackReplyForm';
import { FeedbackStatusBadge } from './FeedbackStatusBadge';

type Props = {
  feedback: Feedback;
};

const formatDate = (value?: Date | string) => {
  if (!value) return '—';

  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

const isVideoLink = (value: string) => {
  const pathname = value.split('?')[0]?.toLowerCase() ?? '';

  return ['.mp4', '.mov', '.webm', '.m4v'].some((extension) =>
    pathname.endsWith(extension),
  );
};

export const FeedbackAdminCard = ({ feedback }: Props) => {
  const approveFeedback = useApproveFeedback();
  const disapproveFeedback = useDisapproveFeedback();
  const deleteFeedback = useDeleteFeedback();

  const isPending =
    approveFeedback.isPending ||
    disapproveFeedback.isPending ||
    deleteFeedback.isPending;

  const toggleApproved = () => {
    const confirmed = window.confirm(
      feedback.isApproved ? 'Сховати цей відгук?' : 'Опублікувати цей відгук?',
    );

    if (!confirmed) return;

    if (feedback.isApproved) {
      disapproveFeedback.mutate(feedback.id);
      return;
    }

    approveFeedback.mutate(feedback.id);
  };

  const removeFeedback = () => {
    const confirmed = window.confirm(
      'Видалити відгук? Цю дію неможливо скасувати.',
    );

    if (!confirmed) return;

    deleteFeedback.mutate(feedback.id);
  };

  return (
    <Card.Root
      border="1px solid"
      borderColor="blackAlpha.100"
      borderRadius="2xl"
      overflow="hidden"
      bg="white"
      boxShadow="sm"
    >
      <Card.Body p={{ base: 3, md: 4 }}>
        <Stack gap={3}>
          <Flex
            justify="space-between"
            align={{ base: 'start', md: 'center' }}
            gap={3}
            direction={{ base: 'column', md: 'row' }}
          >
            <Stack gap={1}>
              <HStack gap={2} wrap="wrap">
                <FeedbackStatusBadge isApproved={feedback.isApproved} />
                <FeedbackRating value={feedback.averageRating} />
              </HStack>

              <Text fontSize="xs" color="gray.500">
                {formatDate(feedback.createdAt)}
              </Text>
            </Stack>

            <HStack gap={2} wrap="wrap">
              <Button
                type="button"
                size="xs"
                minH="34px"
                variant={feedback.isApproved ? 'outline' : 'solid'}
                colorPalette={feedback.isApproved ? 'orange' : 'green'}
                loading={isPending}
                onClick={toggleApproved}
              >
                {feedback.isApproved ? <LuEyeOff /> : <LuEye />}
                {feedback.isApproved ? 'Сховати' : 'Опублікувати'}
              </Button>

              <Button
                type="button"
                size="xs"
                minH="34px"
                variant="outline"
                colorPalette="red"
                loading={isPending}
                onClick={removeFeedback}
              >
                <LuTrash2 />
                Видалити
              </Button>
            </HStack>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={2}>
            <HStack gap={1.5} color="gray.600" fontSize="sm" fontWeight="700">
              <LuUser />
              <Text lineClamp={1}>{feedback.name || '—'}</Text>
            </HStack>

            <HStack gap={1.5} color="gray.600" fontSize="sm" fontWeight="700">
              <LuMail />
              <Text lineClamp={1}>{feedback.email || '—'}</Text>
            </HStack>
          </SimpleGrid>

          <HStack gap={2} wrap="wrap">
            {feedback.slug && (
              <Button
                asChild
                type="button"
                size="xs"
                minH="34px"
                variant="outline"
              >
                <NextLink
                  href={`https://dellarosee.com/product/${feedback.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LuExternalLink />
                  На сайті
                </NextLink>
              </Button>
            )}

            <Button
              asChild
              type="button"
              size="xs"
              minH="34px"
              variant="outline"
            >
              <NextLink href={`/products/${feedback.productId}/edit`}>
                <LuPencil />
                Редагувати товар
              </NextLink>
            </Button>
          </HStack>

          <Box
            border="1px solid"
            borderColor="blackAlpha.100"
            bg="gray.50"
            borderRadius="xl"
            p={3}
          >
            <Text
              color="della.text"
              fontSize="sm"
              fontWeight="700"
              lineHeight="1.55"
              whiteSpace="pre-wrap"
            >
              {feedback.message || 'Без тексту'}
            </Text>
          </Box>

          {feedback.mediaLinks?.length ? (
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={3}>
              {feedback.mediaLinks.map((mediaLink, index) => (
                <Box
                  key={`${mediaLink}-${index}`}
                  border="1px solid"
                  borderColor="blackAlpha.100"
                  bg="gray.50"
                  borderRadius="xl"
                  overflow="hidden"
                  aspectRatio="4 / 3"
                >
                  {isVideoLink(mediaLink) ? (
                    <video
                      src={mediaLink}
                      controls
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Image
                      src={mediaLink}
                      alt={`Медіа відгуку ${index + 1}`}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />
                  )}
                </Box>
              ))}
            </SimpleGrid>
          ) : null}

          <FeedbackReplyForm feedback={feedback} />
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
