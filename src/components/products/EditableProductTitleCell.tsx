'use client';

import { KeyboardEvent, useEffect, useRef, useState } from 'react';

import { HStack, IconButton, Input, Table, Text } from '@chakra-ui/react';
import { LuCheck, LuPencil, LuX } from 'react-icons/lu';

import { useUpdateProduct } from '@/hooks/mutations/product/useUpdateProduct';

type Props = {
  product: {
    id: number;
    title: string;
  };
};

export const EditableProductTitleCell = ({ product }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(product.title);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const { mutate: updateProduct, isPending } = useUpdateProduct(product.id);

  useEffect(() => {
    setValue(product.title);
  }, [product.title]);

  const cancelEditing = () => {
    setValue(product.title);
    setIsEditing(false);
  };

  const submit = () => {
    const title = value.trim();

    if (!title || title === product.title) {
      cancelEditing();
      return;
    }

    updateProduct(
      { title },
      {
        onSuccess: () => {
          setValue(title);
        },
        onError: cancelEditing,
        onSettled: () => {
          setIsEditing(false);
        },
      },
    );
  };

  const startEditing = () => {
    setIsEditing(true);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      submit();
    }

    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <Table.Cell minW="320px">
      {isEditing ? (
        <HStack gap={2}>
          <Input
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending}
            size="sm"
          />

          <IconButton
            size="sm"
            aria-label="Зберегти назву"
            loading={isPending}
            onClick={submit}
          >
            <LuCheck />
          </IconButton>

          <IconButton
            size="sm"
            variant="outline"
            aria-label="Скасувати"
            disabled={isPending}
            onClick={cancelEditing}
          >
            <LuX />
          </IconButton>
        </HStack>
      ) : (
        <HStack gap={2} align="start">
          <Text fontWeight="700" color="della.text">
            {product.title}
          </Text>

          <IconButton
            aria-label="Редагувати назву продукту"
            variant="ghost"
            size="xs"
            onClick={startEditing}
            disabled={isPending}
          >
            <LuPencil />
          </IconButton>
        </HStack>
      )}
    </Table.Cell>
  );
};
