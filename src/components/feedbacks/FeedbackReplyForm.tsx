'use client';

import { FormEvent, useState } from 'react';

import {
  Box,
  Button,
  Field,
  HStack,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { LuMessageCircleReply, LuPencil, LuX } from 'react-icons/lu';

import {
  useReplyFeedback,
  useUpdateFeedbackReply,
} from '@/hooks/mutations/feedback/useFeedbackAdminMutations';
import { Feedback, ReplyFeedbackPayload } from '@/types/feedback';

type Props = {
  feedback: Feedback;
};

const STORE_REPLY_AUTHOR = {
  email: 'dellarosee@gmail.com',
  name: 'Della Rosee',
};

export const FeedbackReplyForm = ({ feedback }: Props) => {
  const firstReply = feedback.replies?.[0];
  const existingMessage = firstReply?.message ?? '';

  const [isEditing, setIsEditing] = useState(false);
  const [draftMessage, setDraftMessage] = useState(existingMessage);
  const [error, setError] = useState('');

  const replyFeedback = useReplyFeedback();
  const updateReply = useUpdateFeedbackReply();

  const isPending = replyFeedback.isPending || updateReply.isPending;
  const visibleMessage = firstReply?.message ?? draftMessage;
  const hasReply = Boolean(visibleMessage);

  const openEditor = () => {
    setDraftMessage(firstReply?.message ?? draftMessage);
    setError('');
    setIsEditing(true);
  };

  const closeEditor = () => {
    setDraftMessage(firstReply?.message ?? '');
    setError('');
    setIsEditing(false);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const message = draftMessage.trim();

    if (!message) {
      setError('Введіть текст відповіді');
      return;
    }

    if (firstReply) {
      updateReply.mutate(
        {
          id: firstReply.id,
          payload: {
            message,
          },
        },
        {
          onSuccess: () => {
            setDraftMessage(message);
            setIsEditing(false);
          },
        },
      );

      return;
    }

    const payload: ReplyFeedbackPayload = {
      productId: feedback.productId,
      email: STORE_REPLY_AUTHOR.email,
      name: STORE_REPLY_AUTHOR.name,
      message,
      averageRating: 5,
      isApproved: true,
    };

    replyFeedback.mutate(
      {
        id: feedback.id,
        payload,
      },
      {
        onSuccess: () => {
          setDraftMessage(message);
          setIsEditing(false);
        },
      },
    );
  };

  return (
    <Box
      border="1px solid"
      borderColor="blackAlpha.100"
      bg="gray.50"
      borderRadius="xl"
      p={3}
    >
      {!isEditing ? (
        <Stack gap={3}>
          <HStack justify="space-between" align="center" gap={3}>
            <Box>
              <Text fontSize="sm" fontWeight="900" color="della.text">
                Відповідь магазину
              </Text>

              {!hasReply && (
                <Text mt={0.5} fontSize="xs" color="gray.500">
                  Відповіді ще немає
                </Text>
              )}
            </Box>

            <Button
              type="button"
              size="xs"
              minH="34px"
              variant={hasReply ? 'outline' : 'solid'}
              bg={hasReply ? undefined : 'della.primary'}
              color={hasReply ? undefined : 'della.text'}
              _hover={hasReply ? undefined : { bg: 'della.primaryHover' }}
              onClick={openEditor}
            >
              {hasReply ? <LuPencil /> : <LuMessageCircleReply />}
              {hasReply ? 'Редагувати' : 'Відповісти'}
            </Button>
          </HStack>

          {hasReply && (
            <Text
              color="della.text"
              fontSize="sm"
              lineHeight="1.55"
              whiteSpace="pre-wrap"
            >
              {visibleMessage}
            </Text>
          )}
        </Stack>
      ) : (
        <form onSubmit={onSubmit}>
          <Stack gap={3}>
            <Field.Root invalid={Boolean(error)}>
              <Field.Label fontSize="sm">Текст відповіді</Field.Label>

              <Textarea
                value={draftMessage}
                minH="96px"
                bg="white"
                borderRadius="lg"
                resize="vertical"
                placeholder="Напишіть відповідь на відгук..."
                onChange={(event) => {
                  setDraftMessage(event.currentTarget.value);
                  setError('');
                }}
              />

              <Field.ErrorText>{error}</Field.ErrorText>
            </Field.Root>

            <HStack gap={2} justify="flex-end">
              <Button
                type="button"
                size="sm"
                minH="38px"
                variant="ghost"
                disabled={isPending}
                onClick={closeEditor}
              >
                <LuX />
                Скасувати
              </Button>

              <Button
                type="submit"
                size="sm"
                minH="38px"
                loading={isPending}
                bg="della.primary"
                color="della.text"
                _hover={{ bg: 'della.primaryHover' }}
              >
                <LuMessageCircleReply />
                {firstReply ? 'Зберегти' : 'Додати відповідь'}
              </Button>
            </HStack>
          </Stack>
        </form>
      )}
    </Box>
  );
};
