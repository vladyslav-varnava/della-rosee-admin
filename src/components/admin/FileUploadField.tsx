'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';

import {
  Box,
  Button,
  Field,
  Flex,
  Image,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { HiUpload } from 'react-icons/hi';
import { LuTrash2 } from 'react-icons/lu';

import { useUploadFile } from '@/hooks/useUploadFile';

type Props = {
  label: string;
  value?: string;
  helperText?: string;
  accept?: string;
  onChange: (value: string) => void;
};

const isVideoUrl = (value?: string) => {
  return Boolean(value?.toLowerCase().endsWith('.mp4'));
};

export const FileUploadField = ({
  label,
  value,
  helperText,
  accept = 'image/*,video/mp4',
  onChange,
}: Props) => {
  const { uploadFile, isUploading } = useUploadFile();
  const [previewUrl, setPreviewUrl] = useState<string>();

  const displayUrl = previewUrl || value;

  const fileInputId = useMemo(() => {
    return `file-upload-${crypto.randomUUID()}`;
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (!file) return;

    const localPreviewUrl = URL.createObjectURL(file);

    setPreviewUrl(localPreviewUrl);

    const fileUrl = await uploadFile(file);

    onChange(fileUrl);
    setPreviewUrl(undefined);
    event.currentTarget.value = '';
  };

  const removeFile = () => {
    onChange('');
    setPreviewUrl(undefined);
  };

  return (
    <Field.Root>
      <Stack gap={3}>
        <Flex align="center" justify="space-between" gap={3}>
          <Box>
            <Field.Label>{label}</Field.Label>
            {helperText && <Field.HelperText>{helperText}</Field.HelperText>}
          </Box>

          {value && (
            <Button
              type="button"
              size="xs"
              variant="outline"
              colorPalette="red"
              onClick={removeFile}
            >
              <LuTrash2 />
              Видалити
            </Button>
          )}
        </Flex>

        <Box
          border="1px solid"
          borderColor="blackAlpha.100"
          borderRadius="xl"
          overflow="hidden"
          bg="gray.50"
          minH="220px"
        >
          {displayUrl ? (
            isVideoUrl(displayUrl) ? (
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              <Box as="video" src={displayUrl} controls w="100%" h="260px" />
            ) : (
              <Image
                src={displayUrl}
                alt={label}
                w="100%"
                h="260px"
                objectFit="contain"
              />
            )
          ) : (
            <Flex h="220px" align="center" justify="center">
              <Text color="gray.400" fontSize="sm">
                Файл ще не обрано
              </Text>
            </Flex>
          )}
        </Box>

        <Input
          id={fileInputId}
          type="file"
          accept={accept}
          display="none"
          onChange={handleFileChange}
        />

        <Button
          as="label"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          htmlFor={fileInputId}
          type="button"
          variant="outline"
          loading={isUploading}
          cursor="pointer"
          w="fit-content"
        >
          <HiUpload />
          Завантажити файл
        </Button>
      </Stack>
    </Field.Root>
  );
};
