import { Field, Textarea } from '@chakra-ui/react';

type Props = {
  label: string;
  value: string;
  helperText?: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

export const TextListField = ({
  label,
  value,
  helperText,
  placeholder,
  onChange,
}: Props) => {
  return (
    <Field.Root>
      <Field.Label>{label}</Field.Label>

      <Textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        minH="90px"
      />

      {helperText && <Field.HelperText>{helperText}</Field.HelperText>}
    </Field.Root>
  );
};
