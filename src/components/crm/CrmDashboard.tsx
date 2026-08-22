'use client';

import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from 'react';

import {
  Badge,
  Box,
  Button,
  Center,
  chakra,
  Dialog,
  Field,
  Flex,
  Grid,
  HStack,
  IconButton,
  Input,
  Portal,
  SimpleGrid,
  Spinner,
  Stack,
  Switch,
  Table,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  LuCalendarDays,
  LuChevronLeft,
  LuChevronRight,
  LuPencil,
  LuPlus,
  LuSave,
  LuSearch,
  LuTrash2,
  LuX,
} from 'react-icons/lu';

import { toaster } from '@/components/ui/toaster';
import { crmService } from '@/services/crm.service';
import {
  AppointmentSource,
  AppointmentStatus,
  CrmAppointment,
  CrmAppointmentPayload,
  CrmClient,
  CrmClientPayload,
  CrmDoctor,
  CrmDoctorPayload,
  CrmEquipment,
  CrmEquipmentPayload,
  CrmEquipmentType,
  CrmEquipmentTypePayload,
  CrmProcedure,
  CrmProcedureCategory,
  CrmProcedureCategoryPayload,
  CrmProcedurePayload,
  CrmScheduleException,
  CrmScheduleExceptionPayload,
  CrmSpecialistSchedule,
  CrmSpecialistSchedulePayload,
  ScheduleExceptionType,
} from '@/types/crm';

type CrmView = 'calendar' | 'clients' | 'catalog' | 'equipment' | 'schedule';
type CalendarMode = 'week' | 'day';
type CalendarScaleMinutes = 5 | 10 | 15 | 30;
type SlotCreateMode = 'choice' | 'appointment' | 'exception';

type SelectOption = {
  label: string;
  value: string;
};

type DialogProps = {
  trigger?: ReactNode;
  isLoading?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type CalendarSlotDraft = {
  startAt: Date;
  endAt: Date;
  doctorId?: number;
};

type AppointmentFormValues = {
  procedureIds: number[];
  doctorIds: number[];
  procedureSearch: string;
  doctorSearch: string;
  clientId: string;
  clientSearch: string;
  customDurationMinutes: string;
  startAt: string;
  clientFirstName: string;
  clientLastName: string;
  clientPhone: string;
  clientEmail: string;
  notes: string;
  internalNotes: string;
  status: AppointmentStatus;
  source: AppointmentSource;
};

type ClientFormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthDate: string;
  notes: string;
};

type DoctorFormValues = {
  name: string;
  image: string;
  description: string;
  isActive: boolean;
};

type ProcedureCategoryFormValues = {
  title: string;
  slug: string;
  description: string;
  order: string;
  isActive: boolean;
};

type ProcedureFormValues = {
  title: string;
  typeId: string;
  slug: string;
  price: string;
  basePrice: string;
  time: string;
  preparationMinutes: string;
  cleanupMinutes: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  image: string;
  isActive: boolean;
  isOnlineBookingAvailable: boolean;
  doctorIds: number[];
  equipmentRequirements: Array<{
    equipmentTypeId: string;
    quantity: string;
  }>;
};

type EquipmentTypeFormValues = {
  title: string;
  description: string;
  isActive: boolean;
};

type EquipmentFormValues = {
  name: string;
  equipmentTypeId: string;
  serialNumber: string;
  inventoryNumber: string;
  notes: string;
  isActive: boolean;
};

type ScheduleFormValues = {
  doctorId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
};

type ScheduleExceptionFormValues = {
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: ScheduleExceptionType;
  reason: string;
};

type MutationVariables<TPayload> = {
  id: number;
  payload: Partial<TPayload>;
};

const CRM_QUERY_KEY = ['crm'] as const;
const StyledSelect = chakra('select');

const appointmentStatuses: Array<{
  value: AppointmentStatus;
  label: string;
  color: string;
}> = [
  { value: 'PENDING', label: 'Очікує', color: 'yellow' },
  { value: 'CONFIRMED', label: 'Підтверджено', color: 'blue' },
  { value: 'ARRIVED', label: 'Клієнт прийшов', color: 'cyan' },
  { value: 'IN_PROGRESS', label: 'В роботі', color: 'purple' },
  { value: 'COMPLETED', label: 'Завершено', color: 'green' },
  { value: 'CANCELLED', label: 'Скасовано', color: 'red' },
  { value: 'NO_SHOW', label: 'Не прийшов', color: 'orange' },
];

const appointmentSources: Array<{ value: AppointmentSource; label: string }> = [
  { value: 'ADMIN', label: 'Адмінка' },
  { value: 'WEBSITE', label: 'Сайт' },
  { value: 'PHONE', label: 'Телефон' },
  { value: 'INSTAGRAM', label: 'Instagram' },
  { value: 'WALK_IN', label: 'На місці' },
];

const exceptionTypes: Array<{ value: ScheduleExceptionType; label: string }> = [
  { value: 'DAY_OFF', label: 'Вихідний' },
  { value: 'VACATION', label: 'Відпустка' },
  { value: 'SICK_LEAVE', label: 'Лікарняний' },
  { value: 'CUSTOM_HOURS', label: 'Індивідуальні години' },
  { value: 'BREAK', label: 'Перерва' },
  { value: 'OTHER', label: 'Інша подія' },
];

const weekDays = [
  'Неділя',
  'Понеділок',
  'Вівторок',
  'Середа',
  'Четвер',
  'Пʼятниця',
  'Субота',
];

const shortWeekDays = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const monthWeekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

const calendarModeItems: Array<{ value: CalendarMode; label: string }> = [
  { value: 'week', label: 'Тиждень' },
  { value: 'day', label: 'День' },
];
const calendarScaleItems: SelectOption[] = [
  { value: '5', label: '5 хв' },
  { value: '10', label: '10 хв' },
  { value: '15', label: '15 хв' },
  { value: '30', label: '30 хв' },
];

const crmViewMeta: Record<CrmView, { title: string; description: string }> = {
  calendar: {
    title: 'Календар клініки',
    description: 'Записи клієнтів, доступні слоти та розклад прийомів.',
  },
  clients: {
    title: 'Клієнти клініки',
    description: 'Картки клієнтів, контакти та історія записів.',
  },
  catalog: {
    title: 'Послуги клініки',
    description: 'Лікарі, категорії, процедури та вимоги до обладнання.',
  },
  equipment: {
    title: 'Обладнання клініки',
    description: 'Типи обладнання, ресурси та доступність для процедур.',
  },
  schedule: {
    title: 'Графіки клініки',
    description: 'Робочі години лікарів і винятки в розкладі.',
  },
};

const CALENDAR_START_HOUR = 8;
const CALENDAR_END_HOUR = 21;
const CALENDAR_HOUR_HEIGHT = 56;
const CALENDAR_HEADER_HEIGHT = '60px';
const CALENDAR_TIME_COLUMN_WIDTH = '64px';
const CALENDAR_DAY_COLUMN_MIN_WIDTH = '148px';
const CALENDAR_DOCTOR_COLUMN_MIN_WIDTH = '190px';
const CALENDAR_GRID_HEIGHT =
  (CALENDAR_END_HOUR - CALENDAR_START_HOUR) * CALENDAR_HOUR_HEIGHT;
const calendarHours = Array.from(
  { length: CALENDAR_END_HOUR - CALENDAR_START_HOUR + 1 },
  (_item, index) => CALENDAR_START_HOUR + index,
);

const crmErrorTranslations: Array<[RegExp, string]> = [
  [/Procedure with id \d+ not found/i, 'Процедуру не знайдено.'],
  [/Procedure is not active/i, 'Процедура неактивна.'],
  [
    /Cannot delete procedure because appointments already exist/i,
    'Неможливо видалити процедуру, оскільки для неї вже створено запис. Спершу скасуйте або видаліть повʼязані записи.',
  ],
  [
    /Foreign key constraint failed/i,
    'Неможливо видалити, оскільки цей запис уже використовується в інших даних.',
  ],
  [
    /Procedure duration must be greater than 0/i,
    'У цієї процедури некоректна тривалість: у полі “Тривалість, хв” вкажіть число більше 0 і збережіть процедуру.',
  ],
  [
    /Appointment duration must be greater than 0/i,
    'Тривалість запису має бути більшою за 0 хв.',
  ],
  [
    /Select at least one procedure and doctor/i,
    'Оберіть хоча б одну процедуру та одного лікаря.',
  ],
  [/Doctor with id \d+ not found/i, 'Лікаря не знайдено.'],
  [/Doctor is not active$/i, 'Лікар неактивний.'],
  [
    /Doctor is not assigned to this procedure/i,
    'Лікар не привʼязаний до цієї процедури.',
  ],
  [
    /Doctor is not assigned to selected procedures/i,
    'Один із лікарів не привʼязаний до вибраних процедур.',
  ],
  [
    /Doctor is not active for this procedure/i,
    'Лікар неактивний для цієї процедури.',
  ],
  [/Doctor is not working at this time/i, 'Лікар не працює у вибраний час.'],
  [
    /Doctor is already booked for this time/i,
    'На цей час у лікаря вже є запис.',
  ],
  [
    /Not enough equipment of type \d+ available/i,
    'Недостатньо доступного обладнання для цієї процедури.',
  ],
  [/stepMinutes must be greater than 0/i, 'Крок слотів має бути більшим за 0.'],
  [/date must be in YYYY-MM-DD format/i, 'Дата має бути у форматі РРРР-ММ-ДД.'],
  [
    /Schedule time must be in HH:mm format/i,
    'Час графіка має бути у форматі ГГ:ХХ.',
  ],
  [
    /This event type requires startTime and endTime/i,
    'Для цієї події вкажіть початок і кінець.',
  ],
  [/Time must be in HH:mm format/i, 'Час має бути у форматі ГГ:ХХ.'],
  [
    /endTime must be greater than startTime/i,
    'Час завершення має бути пізніше часу початку.',
  ],
  [
    /endAt must be greater than startAt/i,
    'Час завершення має бути пізніше часу початку.',
  ],
  [/Invalid appointment dates/i, 'Некоректні дати запису.'],
  [/procedureId must not be less than 1/i, 'Оберіть процедуру.'],
  [/doctorId must not be less than 1/i, 'Оберіть лікаря.'],
  [
    /stepMinutes must not be less than 1/i,
    'Крок слотів має бути більшим за 0.',
  ],
  [/procedureId must be an integer number/i, 'Оберіть процедуру.'],
  [/doctorId must be an integer number/i, 'Оберіть лікаря.'],
  [
    /Request failed with status code 400/i,
    'Некоректний запит. Перевірте заповнені поля.',
  ],
  [/Request failed with status code 404/i, 'Потрібний запис не знайдено.'],
  [/Request failed with status code 409/i, 'Вибраний час уже недоступний.'],
  [
    /Network Error/i,
    'Не вдалося зʼєднатися з API. Перевірте, чи запущений бекенд.',
  ],
  [/timeout/i, 'Сервер не відповів вчасно. Спробуйте ще раз.'],
  [/Bad Request/i, 'Некоректний запит. Перевірте заповнені поля.'],
  [/Not Found/i, 'Потрібний запис не знайдено.'],
  [/Conflict/i, 'Виник конфлікт із поточним станом розкладу.'],
];

const translateCrmErrorMessage = (message: string) => {
  for (const [pattern, translation] of crmErrorTranslations) {
    if (pattern.test(message)) {
      return translation;
    }
  }

  return message;
};

const getRecord = (value: unknown) => {
  return typeof value === 'object' && value !== null
    ? (value as Record<string, unknown>)
    : undefined;
};

const getMessageValues = (value: unknown): string[] => {
  if (typeof value === 'string') {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }

  return [];
};

const getResponseErrorMessages = (error: unknown) => {
  const errorRecord = getRecord(error);
  const errorData = getRecord(errorRecord?.data);
  const errorResponse = getRecord(errorRecord?.response);
  const responseData = getRecord(errorResponse?.data);

  return [responseData, errorData, errorRecord].flatMap((record) =>
    record
      ? [...getMessageValues(record.message), ...getMessageValues(record.error)]
      : [],
  );
};

const isGenericErrorMessage = (message: string) => {
  return /^(Request failed with status code \d+|Bad Request|Not Found|Conflict|Internal server error|Something went wrong)$/i.test(
    message.trim(),
  );
};

const getErrorMessage = (error: unknown, fallback = 'Спробуйте ще раз.') => {
  const messages = [
    ...getResponseErrorMessages(error),
    ...(error instanceof Error ? [error.message] : []),
  ].filter(Boolean);

  for (const originalMessage of messages) {
    const translatedMessage = translateCrmErrorMessage(originalMessage);

    if (translatedMessage !== originalMessage) {
      return translatedMessage;
    }
  }

  const responseMessage = messages.find(
    (message) => !isGenericErrorMessage(message),
  );

  return responseMessage ?? fallback;
};

const formatDate = (value?: string | Date) => {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
};

const formatTime = (value?: string | Date) => {
  if (!value) {
    return '--:--';
  }

  return new Intl.DateTimeFormat('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const toDateTimeLocalValue = (value?: string | Date) => {
  const date = value ? new Date(value) : new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const toTimeInputValue = (value: Date) => {
  const hours = String(value.getHours()).padStart(2, '0');
  const minutes = String(value.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};

const toIsoDateTime = (value: string) => {
  return new Date(value).toISOString();
};

const startOfWeek = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + diff);

  return next;
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);

  return next;
};

const addMinutes = (date: Date, minutes: number) => {
  const next = new Date(date);
  next.setMinutes(next.getMinutes() + minutes);

  return next;
};

const addWeeks = (date: Date, weeks: number) => {
  return addDays(date, weeks * 7);
};

const addMonths = (date: Date, months: number) => {
  const next = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const daysInTargetMonth = new Date(
    next.getFullYear(),
    next.getMonth() + 1,
    0,
  ).getDate();

  next.setDate(Math.min(date.getDate(), daysInTargetMonth));
  next.setHours(0, 0, 0, 0);

  return next;
};

const startOfMonth = (date: Date) => {
  const next = new Date(date);
  next.setDate(1);
  next.setHours(0, 0, 0, 0);

  return next;
};

const isSameCalendarDay = (left: Date, right: Date) => {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
};

const getAppointmentOffset = (appointment: CrmAppointment) => {
  const startAt = new Date(appointment.startAt);
  const minutes =
    (startAt.getHours() - CALENDAR_START_HOUR) * 60 + startAt.getMinutes();

  return Math.max(0, (minutes / 60) * CALENDAR_HOUR_HEIGHT);
};

const getCalendarSlotStart = (day: Date, minutesFromStart: number) => {
  const next = new Date(day);
  next.setHours(CALENDAR_START_HOUR, minutesFromStart, 0, 0);

  return next;
};

const getAppointmentHeight = (appointment: CrmAppointment) => {
  const startAt = new Date(appointment.startAt);
  const endAt = new Date(appointment.endAt);
  const durationMinutes = Math.max(
    15,
    (endAt.getTime() - startAt.getTime()) / 60000,
  );

  return Math.max(36, (durationMinutes / 60) * CALENDAR_HOUR_HEIGHT - 3);
};

const getScheduleExceptionDateTime = (
  exception: CrmScheduleException,
  time?: string | null,
) => {
  if (!time) {
    return undefined;
  }

  return new Date(`${exception.date.slice(0, 10)}T${time}:00`);
};

const getScheduleExceptionOffset = (exception: CrmScheduleException) => {
  const startAt = getScheduleExceptionDateTime(exception, exception.startTime);

  if (!startAt) {
    return 0;
  }

  const minutes =
    (startAt.getHours() - CALENDAR_START_HOUR) * 60 + startAt.getMinutes();

  return Math.max(0, (minutes / 60) * CALENDAR_HOUR_HEIGHT);
};

const getScheduleExceptionHeight = (exception: CrmScheduleException) => {
  const startAt = getScheduleExceptionDateTime(exception, exception.startTime);
  const endAt = getScheduleExceptionDateTime(exception, exception.endTime);

  if (!startAt || !endAt) {
    return CALENDAR_GRID_HEIGHT;
  }

  const durationMinutes = Math.max(
    15,
    (endAt.getTime() - startAt.getTime()) / 60000,
  );

  return Math.max(32, (durationMinutes / 60) * CALENDAR_HOUR_HEIGHT - 3);
};

const getStatusMeta = (status: AppointmentStatus) => {
  return appointmentStatuses.find((item) => item.value === status);
};

const getExceptionTypeMeta = (type: ScheduleExceptionType) => {
  return exceptionTypes.find((item) => item.value === type);
};

const isTimedScheduleException = (type: ScheduleExceptionType) => {
  return ['CUSTOM_HOURS', 'BREAK', 'OTHER'].includes(type);
};

const getClientName = (client: Pick<CrmClient, 'firstName' | 'lastName'>) => {
  return [client.firstName, client.lastName].filter(Boolean).join(' ');
};

const getAppointmentClientName = (appointment: CrmAppointment) => {
  return [appointment.clientFirstName, appointment.clientLastName]
    .filter(Boolean)
    .join(' ');
};

const getAppointmentProcedureNames = (appointment: CrmAppointment) => {
  const names =
    appointment.procedures
      ?.map((item) => item.procedure?.title)
      .filter(Boolean) ?? [];

  return names.length
    ? names.join(', ')
    : (appointment.procedure?.title ?? `#${appointment.procedureId}`);
};

const getAppointmentDoctorNames = (appointment: CrmAppointment) => {
  const names =
    appointment.doctors?.map((item) => item.doctor?.name).filter(Boolean) ?? [];

  return names.length
    ? names.join(', ')
    : (appointment.doctor?.name ?? `Лікар #${appointment.doctorId}`);
};

const slugify = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яіїєґ]+/gi, '-')
    .replace(/^-+|-+$/g, '');
};

const toOptionalString = (value: string) => {
  const trimmed = value.trim();
  return trimmed || undefined;
};

const toOptionalNumber = (value: string) => {
  return value ? Number(value) : undefined;
};

const toRequiredId = (value: string) => {
  const id = Number(value);

  return Number.isInteger(id) && id > 0 ? id : undefined;
};

const toCalendarScaleMinutes = (value: string): CalendarScaleMinutes => {
  const scale = Number(value);

  return scale === 5 || scale === 10 || scale === 15 || scale === 30
    ? scale
    : 15;
};

const matchesSearch = (value: string, search: string) => {
  return value.toLowerCase().includes(search.trim().toLowerCase());
};

const updateFormValue =
  <TValues extends object>(
    setValues: Dispatch<SetStateAction<TValues>>,
    key: keyof TValues,
  ) =>
  (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { value } = event.currentTarget;

    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  };

const useCrmMutation = <TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  messages: {
    success: string;
    error: string;
    errorDescription?: string;
    preferErrorDescription?: boolean;
  },
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onError: (error) => {
      toaster.create({
        title: messages.error,
        description:
          messages.preferErrorDescription && messages.errorDescription
            ? messages.errorDescription
            : getErrorMessage(error, messages.errorDescription),
        type: 'error',
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CRM_QUERY_KEY });

      toaster.create({
        title: messages.success,
        type: 'success',
      });
    },
  });
};

const SelectField = ({
  label,
  value,
  options,
  placeholder = 'Оберіть значення',
  required,
  onChange,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
}) => (
  <Field.Root required={required}>
    <Field.Label>{label}</Field.Label>
    <StyledSelect
      value={value}
      h="40px"
      w="100%"
      mt={2}
      px={3}
      border="1px solid"
      borderColor="blackAlpha.200"
      borderRadius="lg"
      bg="white"
      color="della.text"
      cursor="pointer"
      required={required}
      onChange={(event) => {
        const { value: nextValue } = event.currentTarget;

        onChange(nextValue);
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  </Field.Root>
);

const SearchMultiSelectField = ({
  label,
  searchValue,
  placeholder,
  selectedItems,
  options,
  onSearchChange,
  onToggle,
}: {
  label: string;
  searchValue: string;
  placeholder: string;
  selectedItems: Array<{
    id: number;
    label: string;
    detail?: string;
    disabled?: boolean;
  }>;
  options: Array<{
    id: number;
    label: string;
    detail?: string;
    disabled?: boolean;
  }>;
  onSearchChange: (value: string) => void;
  onToggle: (id: number) => void;
}) => (
  <Field.Root>
    <Field.Label>{label}</Field.Label>
    <Stack gap={2} mt={2}>
      <Input
        value={searchValue}
        placeholder={placeholder}
        onChange={(event) => onSearchChange(event.currentTarget.value)}
      />
      {selectedItems.length > 0 && (
        <HStack gap={2} wrap="wrap">
          {selectedItems.map((item) => (
            <Button
              key={item.id}
              size="xs"
              variant="outline"
              colorPalette={item.disabled ? 'orange' : undefined}
              onClick={() => onToggle(item.id)}
            >
              {item.label}
              <LuX />
            </Button>
          ))}
        </HStack>
      )}
      <Stack gap={2} maxH="184px" overflowY="auto">
        {options.map((item) => (
          <Button
            key={item.id}
            variant="outline"
            justifyContent="flex-start"
            h="auto"
            py={2}
            colorPalette={item.disabled ? 'orange' : undefined}
            onClick={() => onToggle(item.id)}
          >
            <Box textAlign="left" minW={0}>
              <Text fontWeight="900" lineClamp={1}>
                {item.label}
              </Text>
              {item.detail && (
                <Text fontSize="xs" color="gray.500" lineClamp={1}>
                  {item.detail}
                </Text>
              )}
            </Box>
          </Button>
        ))}
        {searchValue && options.length === 0 && (
          <Text fontSize="sm" color="gray.500">
            Нічого не знайдено.
          </Text>
        )}
      </Stack>
    </Stack>
  </Field.Root>
);

const DialogShell = ({
  title,
  description,
  trigger,
  open,
  maxW = '680px',
  children,
  footer,
  onOpenChange,
  onSubmit,
}: {
  title: string;
  description?: string;
  trigger?: ReactNode;
  open: boolean;
  maxW?: string | Record<string, string>;
  children: ReactNode;
  footer: ReactNode;
  onOpenChange: (open: boolean) => void;
  onSubmit: (event: FormEvent<HTMLElement>) => void;
}) => (
  <Dialog.Root
    lazyMount
    open={open}
    onOpenChange={({ open: nextOpen }) => onOpenChange(nextOpen)}
  >
    {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          as="form"
          maxW={{ base: 'calc(100% - 24px)', md: maxW }}
          borderRadius="2xl"
          onSubmit={onSubmit}
        >
          <Dialog.Header borderBottom="1px solid" borderColor="blackAlpha.100">
            <Box>
              <Dialog.Title color="della.text">{title}</Dialog.Title>
              {description && (
                <Text mt={1} color="gray.500" fontSize="sm">
                  {description}
                </Text>
              )}
            </Box>
          </Dialog.Header>
          <Dialog.Body p={5}>{children}</Dialog.Body>
          <Dialog.Footer borderTop="1px solid" borderColor="blackAlpha.100">
            {footer}
          </Dialog.Footer>
          <Dialog.CloseTrigger asChild>
            <IconButton
              aria-label="Закрити"
              position="absolute"
              top={4}
              right={4}
              size="sm"
              variant="ghost"
            >
              <LuX />
            </IconButton>
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
);

const DialogFooter = ({
  isLoading,
  submitLabel = 'Зберегти',
  onCancel,
}: {
  isLoading?: boolean;
  submitLabel?: string;
  onCancel: () => void;
}) => (
  <HStack justify="flex-end" gap={3}>
    <Button type="button" variant="outline" onClick={onCancel}>
      Скасувати
    </Button>
    <Button
      type="submit"
      loading={isLoading}
      bg="della.primary"
      color="della.text"
      _hover={{ bg: 'della.primaryHover' }}
    >
      <LuSave />
      {submitLabel}
    </Button>
  </HStack>
);

const CrmSwitch = ({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) => (
  <Switch.Root
    checked={checked}
    onCheckedChange={(details) => onChange(details.checked === true)}
  >
    <Switch.HiddenInput />
    <Switch.Control>
      <Switch.Thumb />
    </Switch.Control>
    <Switch.Label>{label}</Switch.Label>
  </Switch.Root>
);

const CalendarModeToggle = ({
  value,
  onChange,
}: {
  value: CalendarMode;
  onChange: (value: CalendarMode) => void;
}) => (
  <HStack
    w="fit-content"
    maxW="100%"
    gap={1}
    p={1}
    bg="gray.100"
    border="1px solid"
    borderColor="blackAlpha.100"
    borderRadius="lg"
    overflowX="auto"
  >
    {calendarModeItems.map((item) => {
      const isSelected = value === item.value;

      return (
        <Button
          key={item.value}
          type="button"
          size="sm"
          h="32px"
          minW="88px"
          px={4}
          flexShrink={0}
          variant="ghost"
          bg={isSelected ? 'white' : 'transparent'}
          color="della.text"
          boxShadow={isSelected ? 'sm' : undefined}
          border="1px solid"
          borderColor={isSelected ? 'blackAlpha.200' : 'transparent'}
          aria-pressed={isSelected}
          _hover={{ bg: isSelected ? 'white' : 'blackAlpha.100' }}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </Button>
      );
    })}
  </HStack>
);

const SlotCreateChoiceDialog = ({
  slot,
  open,
  onOpenChange,
  onSelectMode,
}: {
  slot?: CalendarSlotDraft;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectMode: (mode: Exclude<SlotCreateMode, 'choice'>) => void;
}) => (
  <Dialog.Root
    lazyMount
    open={open}
    onOpenChange={({ open: nextOpen }) => onOpenChange(nextOpen)}
  >
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          maxW={{ base: 'calc(100% - 24px)', md: '420px' }}
          borderRadius="2xl"
        >
          <Dialog.Header borderBottom="1px solid" borderColor="blackAlpha.100">
            <Box>
              <Dialog.Title color="della.text">Створити у слоті</Dialog.Title>
              <Text mt={1} color="gray.500" fontSize="sm">
                {slot
                  ? `${formatDate(slot.startAt)}, ${toTimeInputValue(
                      slot.startAt,
                    )} - ${toTimeInputValue(slot.endAt)}`
                  : 'Оберіть тип події календаря.'}
              </Text>
            </Box>
          </Dialog.Header>
          <Dialog.Body p={5}>
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
              <Button
                h="74px"
                variant="outline"
                justifyContent="flex-start"
                onClick={() => onSelectMode('appointment')}
              >
                <LuPlus />
                <Box textAlign="left">
                  <Text fontWeight="900">Запис</Text>
                  <Text fontSize="xs" color="gray.500">
                    Клієнт і процедура
                  </Text>
                </Box>
              </Button>
              <Button
                h="74px"
                variant="outline"
                justifyContent="flex-start"
                onClick={() => onSelectMode('exception')}
              >
                <LuCalendarDays />
                <Box textAlign="left">
                  <Text fontWeight="900">Подія</Text>
                  <Text fontSize="xs" color="gray.500">
                    Перерва або інше
                  </Text>
                </Box>
              </Button>
            </SimpleGrid>
          </Dialog.Body>
          <Dialog.CloseTrigger asChild>
            <IconButton
              aria-label="Закрити"
              position="absolute"
              top={4}
              right={4}
              size="sm"
              variant="ghost"
            >
              <LuX />
            </IconButton>
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
);

const AppointmentDialog = ({
  appointment,
  doctors,
  procedures,
  clients,
  initialStartAt,
  initialDoctorId,
  availabilityStepMinutes = 15,
  trigger,
  open: controlledOpen,
  isLoading,
  onOpenChange: controlledOnOpenChange,
  onSubmit,
}: DialogProps & {
  appointment?: CrmAppointment;
  doctors: CrmDoctor[];
  procedures: CrmProcedure[];
  clients: CrmClient[];
  initialStartAt?: Date;
  initialDoctorId?: number;
  availabilityStepMinutes?: CalendarScaleMinutes;
  onSubmit: (payload: CrmAppointmentPayload) => Promise<unknown>;
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [values, setValues] = useState<AppointmentFormValues>(() =>
    getAppointmentInitialValues(appointment, initialStartAt, initialDoctorId),
  );
  const open = controlledOpen ?? internalOpen;
  const setDialogOpen = (nextOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(nextOpen);
    }

    controlledOnOpenChange?.(nextOpen);
  };

  const selectedProcedures = procedures.filter((procedure) =>
    values.procedureIds.includes(procedure.id),
  );
  const selectedDoctors = doctors.filter((doctor) =>
    values.doctorIds.includes(doctor.id),
  );
  const selectedClient = clients.find(
    (client) => String(client.id) === values.clientId,
  );
  const filteredProcedures = procedures
    .filter(
      (procedure) =>
        !values.procedureIds.includes(procedure.id) &&
        matchesSearch(
          `${procedure.title} ${procedure.slug ?? ''} ${procedure.category?.title ?? ''}`,
          values.procedureSearch,
        ),
    )
    .slice(0, 8);
  const filteredDoctors = doctors
    .filter(
      (doctor) =>
        !values.doctorIds.includes(doctor.id) &&
        matchesSearch(doctor.name, values.doctorSearch),
    )
    .slice(0, 8);
  const filteredClients = clients
    .filter((client) =>
      matchesSearch(
        `${getClientName(client)} ${client.phone}`,
        values.clientSearch,
      ),
    )
    .slice(0, 8);
  const selectedProcedureId = values.procedureIds[0];
  const selectedDoctorId = values.doctorIds[0];
  const selectedProcedure = selectedProcedures[0];
  const availabilityDate = values.startAt.slice(0, 10);
  const selectedStartAt = values.startAt;
  const calculatedDurationMinutes = selectedProcedures.reduce(
    (total, procedure) =>
      total +
      procedure.time +
      procedure.preparationMinutes +
      procedure.cleanupMinutes,
    0,
  );
  const canLoadAvailability =
    open &&
    Boolean(
      selectedDoctorId &&
      selectedProcedureId &&
      availabilityDate &&
      selectedProcedure?.isActive,
    );
  const availabilityQuery = useQuery({
    queryKey: [
      ...CRM_QUERY_KEY,
      'availability',
      selectedProcedureId,
      selectedDoctorId,
      availabilityDate,
      availabilityStepMinutes,
      values.customDurationMinutes,
    ],
    queryFn: () => {
      if (!selectedProcedureId || !selectedDoctorId) {
        throw new Error('Procedure and doctor are required');
      }

      return crmService.getAvailability({
        procedureId: selectedProcedureId,
        doctorId: selectedDoctorId,
        date: availabilityDate,
        stepMinutes: availabilityStepMinutes,
        durationMinutes: toOptionalNumber(values.customDurationMinutes),
      });
    },
    enabled: canLoadAvailability,
    retry: false,
  });

  const title = appointment ? 'Редагувати запис' : 'Новий запис';

  const reset = () => {
    setValues(
      getAppointmentInitialValues(appointment, initialStartAt, initialDoctorId),
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      reset();
    }

    setDialogOpen(nextOpen);
  };

  const selectClient = (clientId: string) => {
    const client = clients.find((item) => String(item.id) === clientId);

    setValues((current) => ({
      ...current,
      clientId,
      clientSearch: client ? `${getClientName(client)} · ${client.phone}` : '',
      clientFirstName: client?.firstName ?? current.clientFirstName,
      clientLastName: client?.lastName ?? current.clientLastName,
      clientPhone: client?.phone ?? current.clientPhone,
      clientEmail: client?.email ?? current.clientEmail,
    }));
  };
  const clearClient = () => {
    setValues((current) => ({
      ...current,
      clientId: '',
      clientSearch: '',
      clientFirstName: '',
      clientLastName: '',
      clientPhone: '',
      clientEmail: '',
    }));
  };
  const toggleProcedure = (procedureId: number) => {
    setValues((current) => ({
      ...current,
      procedureIds: current.procedureIds.includes(procedureId)
        ? current.procedureIds.filter((id) => id !== procedureId)
        : [...current.procedureIds, procedureId],
      procedureSearch: '',
    }));
  };
  const toggleDoctor = (doctorId: number) => {
    setValues((current) => ({
      ...current,
      doctorIds: current.doctorIds.includes(doctorId)
        ? current.doctorIds.filter((id) => id !== doctorId)
        : [...current.doctorIds, doctorId],
      doctorSearch: '',
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLElement>) => {
    event.preventDefault();

    const procedureId = values.procedureIds[0];
    const doctorId = values.doctorIds[0];

    if (!values.procedureIds.length || !values.doctorIds.length) {
      toaster.create({
        title: 'Заповніть запис',
        description:
          'Оберіть хоча б одну процедуру та одного лікаря перед створенням запису.',
        type: 'error',
      });
      return;
    }

    if (selectedProcedures.some((procedure) => !procedure.isActive)) {
      toaster.create({
        title: 'Процедура неактивна',
        description: 'Активуйте всі вибрані процедури перед створенням запису.',
        type: 'error',
      });
      return;
    }

    await onSubmit({
      procedureId,
      doctorId,
      procedureIds: values.procedureIds,
      doctorIds: values.doctorIds,
      customDurationMinutes: toOptionalNumber(values.customDurationMinutes),
      clientId: toOptionalNumber(values.clientId),
      startAt: toIsoDateTime(values.startAt),
      clientFirstName: values.clientFirstName.trim(),
      clientLastName: toOptionalString(values.clientLastName),
      clientPhone: values.clientPhone.trim(),
      clientEmail: toOptionalString(values.clientEmail),
      notes: toOptionalString(values.notes),
      internalNotes: toOptionalString(values.internalNotes),
      status: values.status,
      source: values.source,
    });

    setDialogOpen(false);
  };

  return (
    <DialogShell
      title={title}
      description="Запис створюється з перевіркою графіка лікаря та доступності обладнання."
      trigger={trigger}
      open={open}
      maxW="760px"
      onOpenChange={handleOpenChange}
      onSubmit={handleSubmit}
      footer={
        <DialogFooter
          isLoading={isLoading}
          onCancel={() => setDialogOpen(false)}
        />
      }
    >
      <Stack gap={5}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
          <SearchMultiSelectField
            label="Процедури"
            searchValue={values.procedureSearch}
            placeholder="Пошук процедури"
            selectedItems={selectedProcedures.map((procedure) => ({
              id: procedure.id,
              label: procedure.title,
              detail: `${procedure.time} хв · ${procedure.price} грн`,
              disabled: !procedure.isActive,
            }))}
            options={filteredProcedures.map((procedure) => ({
              id: procedure.id,
              label: procedure.title,
              detail: `${procedure.category?.title ?? 'Без категорії'} · ${
                procedure.time
              } хв${procedure.isActive ? '' : ' · неактивна'}`,
              disabled: !procedure.isActive,
            }))}
            onSearchChange={(procedureSearch) =>
              setValues((current) => ({ ...current, procedureSearch }))
            }
            onToggle={toggleProcedure}
          />
          <SearchMultiSelectField
            label="Лікарі"
            searchValue={values.doctorSearch}
            placeholder="Пошук лікаря"
            selectedItems={selectedDoctors.map((doctor) => ({
              id: doctor.id,
              label: doctor.name,
              detail: doctor.isActive ? 'Активний' : 'Неактивний',
              disabled: !doctor.isActive,
            }))}
            options={filteredDoctors.map((doctor) => ({
              id: doctor.id,
              label: doctor.name,
              detail: doctor.isActive ? 'Активний' : 'Неактивний',
              disabled: !doctor.isActive,
            }))}
            onSearchChange={(doctorSearch) =>
              setValues((current) => ({ ...current, doctorSearch }))
            }
            onToggle={toggleDoctor}
          />
          <Field.Root required>
            <Field.Label>Початок</Field.Label>
            <Input
              type="datetime-local"
              value={values.startAt}
              onChange={updateFormValue(setValues, 'startAt')}
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Кастомна тривалість, хв</Field.Label>
            <Input
              type="number"
              min={1}
              placeholder={
                calculatedDurationMinutes
                  ? `Авто: ${calculatedDurationMinutes} хв`
                  : 'Автоматично'
              }
              value={values.customDurationMinutes}
              onChange={updateFormValue(setValues, 'customDurationMinutes')}
            />
          </Field.Root>
        </SimpleGrid>

        <Box
          border="1px solid"
          borderColor="blackAlpha.100"
          borderRadius="xl"
          p={4}
        >
          <Stack gap={3}>
            <Field.Root>
              <Field.Label>Клієнт</Field.Label>
              <Input
                value={values.clientSearch}
                placeholder="Пошук за імʼям або телефоном"
                onChange={updateFormValue(setValues, 'clientSearch')}
              />
            </Field.Root>
            {selectedClient ? (
              <HStack
                justify="space-between"
                gap={3}
                border="1px solid"
                borderColor="green.200"
                borderRadius="lg"
                bg="green.50"
                p={3}
              >
                <Box minW={0}>
                  <Text fontWeight="900" color="della.text" lineClamp={1}>
                    {getClientName(selectedClient)}
                  </Text>
                  <Text fontSize="sm" color="gray.600" lineClamp={1}>
                    {selectedClient.phone}
                  </Text>
                </Box>
                <Button size="xs" variant="outline" onClick={clearClient}>
                  Новий клієнт
                </Button>
              </HStack>
            ) : (
              values.clientSearch && (
                <Stack gap={2}>
                  {filteredClients.map((client) => (
                    <Button
                      key={client.id}
                      variant="outline"
                      justifyContent="flex-start"
                      h="auto"
                      py={2}
                      onClick={() => selectClient(String(client.id))}
                    >
                      <Box textAlign="left">
                        <Text fontWeight="900">{getClientName(client)}</Text>
                        <Text fontSize="xs" color="gray.500">
                          {client.phone}
                        </Text>
                      </Box>
                    </Button>
                  ))}
                </Stack>
              )
            )}
          </Stack>
        </Box>

        {values.procedureIds.length > 0 &&
        selectedProcedures.some((procedure) => !procedure.isActive) ? (
          <Box
            border="1px solid"
            borderColor="orange.200"
            borderRadius="xl"
            bg="orange.50"
            p={4}
          >
            <Text fontWeight="800" color="orange.800">
              Процедура неактивна
            </Text>
            <Text mt={1} fontSize="sm" color="orange.700">
              Активуйте процедуру в розділі “Послуги”, щоб переглядати слоти та
              створювати записи.
            </Text>
          </Box>
        ) : (
          canLoadAvailability && (
            <Box
              border="1px solid"
              borderColor="blackAlpha.100"
              borderRadius="xl"
              p={4}
            >
              <HStack justify="space-between" gap={3} mb={3}>
                <Text fontWeight="800" color="della.text">
                  Доступні слоти
                </Text>
                {availabilityQuery.isFetching && <Spinner size="sm" />}
              </HStack>

              {availabilityQuery.isError ? (
                <Text color="red.600" fontSize="sm">
                  {getErrorMessage(
                    availabilityQuery.error,
                    'Не вдалося завантажити доступні слоти. Перевірте процедуру, лікаря та дату.',
                  )}
                </Text>
              ) : availabilityQuery.data?.slots.length ? (
                <HStack gap={2} wrap="wrap">
                  {availabilityQuery.data.slots.slice(0, 24).map((slot) => {
                    const slotStartAt = toDateTimeLocalValue(slot.startAt);
                    const isSelected = slotStartAt === selectedStartAt;

                    return (
                      <Button
                        key={slot.startAt}
                        size="xs"
                        variant={isSelected ? 'solid' : 'outline'}
                        bg={isSelected ? 'della.primary' : undefined}
                        color={isSelected ? 'della.text' : undefined}
                        borderColor={isSelected ? 'della.primary' : undefined}
                        _hover={{
                          bg: isSelected ? 'della.primaryHover' : undefined,
                        }}
                        onClick={() =>
                          setValues((current) => ({
                            ...current,
                            startAt: slotStartAt,
                          }))
                        }
                      >
                        {formatTime(slot.startAt)}
                      </Button>
                    );
                  })}
                </HStack>
              ) : (
                <Text color="gray.500" fontSize="sm">
                  Немає вільних слотів для обраної комбінації.
                </Text>
              )}
            </Box>
          )
        )}

        {!values.clientId && (
          <Box
            border="1px solid"
            borderColor="blackAlpha.100"
            borderRadius="xl"
            p={4}
          >
            <Text mb={3} fontWeight="900" color="della.text">
              Новий клієнт
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <Field.Root required>
                <Field.Label>Імʼя клієнта</Field.Label>
                <Input
                  value={values.clientFirstName}
                  onChange={updateFormValue(setValues, 'clientFirstName')}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>Прізвище</Field.Label>
                <Input
                  value={values.clientLastName}
                  onChange={updateFormValue(setValues, 'clientLastName')}
                />
              </Field.Root>
              <Field.Root required>
                <Field.Label>Телефон</Field.Label>
                <Input
                  value={values.clientPhone}
                  placeholder="+380..."
                  onChange={updateFormValue(setValues, 'clientPhone')}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>Email</Field.Label>
                <Input
                  type="email"
                  value={values.clientEmail}
                  onChange={updateFormValue(setValues, 'clientEmail')}
                />
              </Field.Root>
            </SimpleGrid>
          </Box>
        )}

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          <SelectField
            label="Статус"
            value={values.status}
            options={appointmentStatuses.map((item) => ({
              value: item.value,
              label: item.label,
            }))}
            required
            onChange={(status) =>
              setValues((current) => ({
                ...current,
                status: status as AppointmentStatus,
              }))
            }
          />
          <SelectField
            label="Джерело"
            value={values.source}
            options={appointmentSources}
            required
            onChange={(source) =>
              setValues((current) => ({
                ...current,
                source: source as AppointmentSource,
              }))
            }
          />
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          <Field.Root>
            <Field.Label>Коментар клієнта</Field.Label>
            <Textarea
              value={values.notes}
              minH="110px"
              onChange={updateFormValue(setValues, 'notes')}
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Внутрішня нотатка</Field.Label>
            <Textarea
              value={values.internalNotes}
              minH="110px"
              onChange={updateFormValue(setValues, 'internalNotes')}
            />
          </Field.Root>
        </SimpleGrid>
      </Stack>
    </DialogShell>
  );
};

const getAppointmentInitialValues = (
  appointment?: CrmAppointment,
  initialStartAt?: Date,
  initialDoctorId?: number,
): AppointmentFormValues => ({
  procedureIds:
    appointment?.procedures?.map((item) => item.procedureId) ??
    (appointment?.procedureId ? [appointment.procedureId] : []),
  doctorIds:
    appointment?.doctors?.map((item) => item.doctorId) ??
    (appointment?.doctorId
      ? [appointment.doctorId]
      : initialDoctorId
        ? [initialDoctorId]
        : []),
  procedureSearch: '',
  doctorSearch: '',
  clientId: appointment?.clientId ? String(appointment.clientId) : '',
  clientSearch: appointment?.client
    ? `${getClientName(appointment.client)} · ${appointment.client.phone}`
    : '',
  customDurationMinutes: appointment?.durationMinutes
    ? String(appointment.durationMinutes)
    : '',
  startAt: toDateTimeLocalValue(appointment?.startAt ?? initialStartAt),
  clientFirstName: appointment?.clientFirstName ?? '',
  clientLastName: appointment?.clientLastName ?? '',
  clientPhone: appointment?.clientPhone ?? '',
  clientEmail: appointment?.clientEmail ?? '',
  notes: appointment?.notes ?? '',
  internalNotes: appointment?.internalNotes ?? '',
  status: appointment?.status ?? 'PENDING',
  source: appointment?.source ?? 'ADMIN',
});

const ClientDialog = ({
  client,
  trigger,
  isLoading,
  onSubmit,
}: DialogProps & {
  client?: CrmClient;
  onSubmit: (payload: CrmClientPayload) => Promise<unknown>;
}) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<ClientFormValues>(() =>
    getClientInitialValues(client),
  );

  const reset = () => setValues(getClientInitialValues(client));

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      reset();
    }

    setOpen(nextOpen);
  };

  const handleSubmit = async (event: FormEvent<HTMLElement>) => {
    event.preventDefault();

    await onSubmit({
      firstName: values.firstName.trim(),
      lastName: toOptionalString(values.lastName),
      phone: values.phone.trim(),
      email: toOptionalString(values.email),
      birthDate: toOptionalString(values.birthDate),
      notes: toOptionalString(values.notes),
    });

    setOpen(false);
  };

  return (
    <DialogShell
      title={client ? 'Редагувати клієнта' : 'Новий клієнт'}
      trigger={trigger}
      open={open}
      onOpenChange={handleOpenChange}
      onSubmit={handleSubmit}
      footer={
        <DialogFooter isLoading={isLoading} onCancel={() => setOpen(false)} />
      }
    >
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <Field.Root required>
          <Field.Label>Імʼя</Field.Label>
          <Input
            value={values.firstName}
            onChange={updateFormValue(setValues, 'firstName')}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Прізвище</Field.Label>
          <Input
            value={values.lastName}
            onChange={updateFormValue(setValues, 'lastName')}
          />
        </Field.Root>
        <Field.Root required>
          <Field.Label>Телефон</Field.Label>
          <Input
            value={values.phone}
            placeholder="+380..."
            onChange={updateFormValue(setValues, 'phone')}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Input
            type="email"
            value={values.email}
            onChange={updateFormValue(setValues, 'email')}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Дата народження</Field.Label>
          <Input
            type="date"
            value={values.birthDate}
            onChange={updateFormValue(setValues, 'birthDate')}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Нотатки</Field.Label>
          <Textarea
            value={values.notes}
            minH="90px"
            onChange={updateFormValue(setValues, 'notes')}
          />
        </Field.Root>
      </SimpleGrid>
    </DialogShell>
  );
};

const getClientInitialValues = (client?: CrmClient): ClientFormValues => ({
  firstName: client?.firstName ?? '',
  lastName: client?.lastName ?? '',
  phone: client?.phone ?? '',
  email: client?.email ?? '',
  birthDate: client?.birthDate ? client.birthDate.slice(0, 10) : '',
  notes: client?.notes ?? '',
});

const DoctorDialog = ({
  doctor,
  trigger,
  isLoading,
  onSubmit,
}: DialogProps & {
  doctor?: CrmDoctor;
  onSubmit: (payload: CrmDoctorPayload) => Promise<unknown>;
}) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<DoctorFormValues>(() =>
    getDoctorInitialValues(doctor),
  );

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setValues(getDoctorInitialValues(doctor));
    }

    setOpen(nextOpen);
  };

  const handleSubmit = async (event: FormEvent<HTMLElement>) => {
    event.preventDefault();

    await onSubmit({
      name: values.name.trim(),
      image: toOptionalString(values.image),
      description: toOptionalString(values.description),
      isActive: values.isActive,
    });

    setOpen(false);
  };

  return (
    <DialogShell
      title={doctor ? 'Редагувати лікаря' : 'Новий лікар'}
      trigger={trigger}
      open={open}
      onOpenChange={handleOpenChange}
      onSubmit={handleSubmit}
      footer={
        <DialogFooter isLoading={isLoading} onCancel={() => setOpen(false)} />
      }
    >
      <Stack gap={4}>
        <Field.Root required>
          <Field.Label>Імʼя</Field.Label>
          <Input
            value={values.name}
            onChange={updateFormValue(setValues, 'name')}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Фото</Field.Label>
          <Input
            value={values.image}
            placeholder="https://..."
            onChange={updateFormValue(setValues, 'image')}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Опис</Field.Label>
          <Textarea
            value={values.description}
            minH="120px"
            onChange={updateFormValue(setValues, 'description')}
          />
        </Field.Root>
        <CrmSwitch
          checked={values.isActive}
          label="Активний лікар"
          onChange={(checked) =>
            setValues((current) => ({ ...current, isActive: checked }))
          }
        />
      </Stack>
    </DialogShell>
  );
};

const getDoctorInitialValues = (doctor?: CrmDoctor): DoctorFormValues => ({
  name: doctor?.name ?? '',
  image: doctor?.image ?? '',
  description: doctor?.description ?? '',
  isActive: doctor?.isActive ?? true,
});

const ProcedureCategoryDialog = ({
  category,
  trigger,
  isLoading,
  onSubmit,
}: DialogProps & {
  category?: CrmProcedureCategory;
  onSubmit: (payload: CrmProcedureCategoryPayload) => Promise<unknown>;
}) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<ProcedureCategoryFormValues>(() =>
    getCategoryInitialValues(category),
  );

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setValues(getCategoryInitialValues(category));
    }

    setOpen(nextOpen);
  };

  const handleSubmit = async (event: FormEvent<HTMLElement>) => {
    event.preventDefault();

    await onSubmit({
      title: values.title.trim(),
      slug: values.slug.trim() || slugify(values.title),
      description: toOptionalString(values.description),
      order: Number(values.order || 0),
      isActive: values.isActive,
    });

    setOpen(false);
  };

  return (
    <DialogShell
      title={category ? 'Редагувати категорію' : 'Нова категорія'}
      trigger={trigger}
      open={open}
      onOpenChange={handleOpenChange}
      onSubmit={handleSubmit}
      footer={
        <DialogFooter isLoading={isLoading} onCancel={() => setOpen(false)} />
      }
    >
      <Stack gap={4}>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          <Field.Root required>
            <Field.Label>Назва</Field.Label>
            <Input
              value={values.title}
              onChange={updateFormValue(setValues, 'title')}
            />
          </Field.Root>
          <Field.Root required>
            <Field.Label>Slug</Field.Label>
            <Input
              value={values.slug}
              onChange={updateFormValue(setValues, 'slug')}
              onBlur={() =>
                setValues((current) => ({
                  ...current,
                  slug: current.slug || slugify(current.title),
                }))
              }
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Порядок</Field.Label>
            <Input
              type="number"
              value={values.order}
              onChange={updateFormValue(setValues, 'order')}
            />
          </Field.Root>
          <CrmSwitch
            checked={values.isActive}
            label="Активна категорія"
            onChange={(checked) =>
              setValues((current) => ({ ...current, isActive: checked }))
            }
          />
        </SimpleGrid>
        <Field.Root>
          <Field.Label>Опис</Field.Label>
          <Textarea
            value={values.description}
            minH="100px"
            onChange={updateFormValue(setValues, 'description')}
          />
        </Field.Root>
      </Stack>
    </DialogShell>
  );
};

const getCategoryInitialValues = (
  category?: CrmProcedureCategory,
): ProcedureCategoryFormValues => ({
  title: category?.title ?? '',
  slug: category?.slug ?? '',
  description: category?.description ?? '',
  order: String(category?.order ?? 0),
  isActive: category?.isActive ?? true,
});

const ProcedureDialog = ({
  procedure,
  doctors,
  categories,
  equipmentTypes,
  trigger,
  isLoading,
  onSubmit,
}: DialogProps & {
  procedure?: CrmProcedure;
  doctors: CrmDoctor[];
  categories: CrmProcedureCategory[];
  equipmentTypes: CrmEquipmentType[];
  onSubmit: (payload: CrmProcedurePayload) => Promise<unknown>;
}) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<ProcedureFormValues>(() =>
    getProcedureInitialValues(procedure),
  );
  const categoryOptions = categories.map((category) => ({
    value: String(category.id),
    label: category.title,
  }));

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setValues(getProcedureInitialValues(procedure));
    }

    setOpen(nextOpen);
  };

  const toggleDoctor = (doctorId: number) => {
    setValues((current) => ({
      ...current,
      doctorIds: current.doctorIds.includes(doctorId)
        ? current.doctorIds.filter((id) => id !== doctorId)
        : [...current.doctorIds, doctorId],
    }));
  };

  const addRequirement = () => {
    setValues((current) => ({
      ...current,
      equipmentRequirements: [
        ...current.equipmentRequirements,
        { equipmentTypeId: '', quantity: '1' },
      ],
    }));
  };

  const updateRequirement = (
    index: number,
    field: 'equipmentTypeId' | 'quantity',
    value: string,
  ) => {
    setValues((current) => ({
      ...current,
      equipmentRequirements: current.equipmentRequirements.map(
        (item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const removeRequirement = (index: number) => {
    setValues((current) => ({
      ...current,
      equipmentRequirements: current.equipmentRequirements.filter(
        (_item, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLElement>) => {
    event.preventDefault();

    const durationMinutes = Number(values.time || 0);

    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
      toaster.create({
        title: 'Некоректна тривалість процедури',
        description:
          'У полі “Тривалість, хв” вкажіть число більше 0, щоб процедура могла мати доступні слоти.',
        type: 'error',
      });
      return;
    }

    await onSubmit({
      title: values.title.trim(),
      typeId: values.typeId.trim(),
      slug: toOptionalString(values.slug),
      price: Number(values.price || 0),
      basePrice: Number(values.basePrice || 0),
      time: durationMinutes,
      preparationMinutes: Number(values.preparationMinutes || 0),
      cleanupMinutes: Number(values.cleanupMinutes || 0),
      categoryId: toOptionalNumber(values.categoryId),
      shortDescription: toOptionalString(values.shortDescription),
      description: toOptionalString(values.description),
      image: toOptionalString(values.image),
      isActive: values.isActive,
      isOnlineBookingAvailable: values.isOnlineBookingAvailable,
      doctorId: values.doctorIds,
      equipmentRequirements: values.equipmentRequirements
        .filter((item) => item.equipmentTypeId)
        .map((item) => ({
          equipmentTypeId: Number(item.equipmentTypeId),
          quantity: Number(item.quantity || 1),
        })),
    });

    setOpen(false);
  };

  return (
    <DialogShell
      title={procedure ? 'Редагувати процедуру' : 'Нова процедура'}
      trigger={trigger}
      open={open}
      maxW="860px"
      onOpenChange={handleOpenChange}
      onSubmit={handleSubmit}
      footer={
        <DialogFooter isLoading={isLoading} onCancel={() => setOpen(false)} />
      }
    >
      <Stack gap={5}>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
          <Field.Root required>
            <Field.Label>Назва</Field.Label>
            <Input
              value={values.title}
              onChange={updateFormValue(setValues, 'title')}
            />
          </Field.Root>
          <Field.Root required>
            <Field.Label>Тип</Field.Label>
            <Input
              value={values.typeId}
              placeholder="clinic"
              onChange={updateFormValue(setValues, 'typeId')}
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Slug</Field.Label>
            <Input
              value={values.slug}
              onChange={updateFormValue(setValues, 'slug')}
            />
          </Field.Root>
          <Field.Root required>
            <Field.Label>Ціна</Field.Label>
            <Input
              type="number"
              value={values.price}
              onChange={updateFormValue(setValues, 'price')}
            />
          </Field.Root>
          <Field.Root required>
            <Field.Label>Базова ціна</Field.Label>
            <Input
              type="number"
              value={values.basePrice}
              onChange={updateFormValue(setValues, 'basePrice')}
            />
          </Field.Root>
          <Field.Root required>
            <Field.Label>Тривалість, хв</Field.Label>
            <Input
              type="number"
              min={1}
              required
              value={values.time}
              onChange={updateFormValue(setValues, 'time')}
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Підготовка, хв</Field.Label>
            <Input
              type="number"
              value={values.preparationMinutes}
              onChange={updateFormValue(setValues, 'preparationMinutes')}
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Прибирання, хв</Field.Label>
            <Input
              type="number"
              value={values.cleanupMinutes}
              onChange={updateFormValue(setValues, 'cleanupMinutes')}
            />
          </Field.Root>
          <SelectField
            label="Категорія"
            value={values.categoryId}
            options={categoryOptions}
            onChange={(categoryId) =>
              setValues((current) => ({ ...current, categoryId }))
            }
          />
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          <Field.Root>
            <Field.Label>Короткий опис</Field.Label>
            <Textarea
              value={values.shortDescription}
              minH="100px"
              onChange={updateFormValue(setValues, 'shortDescription')}
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Опис</Field.Label>
            <Textarea
              value={values.description}
              minH="100px"
              onChange={updateFormValue(setValues, 'description')}
            />
          </Field.Root>
        </SimpleGrid>

        <Field.Root>
          <Field.Label>Зображення</Field.Label>
          <Input
            value={values.image}
            placeholder="https://..."
            onChange={updateFormValue(setValues, 'image')}
          />
        </Field.Root>

        <Box>
          <Text mb={2} fontWeight="800" color="della.text">
            Лікарі
          </Text>
          <HStack gap={2} wrap="wrap">
            {doctors.map((doctor) => {
              const isSelected = values.doctorIds.includes(doctor.id);

              return (
                <Button
                  key={doctor.id}
                  type="button"
                  size="sm"
                  variant={isSelected ? 'solid' : 'outline'}
                  bg={isSelected ? 'della.primary' : undefined}
                  color={isSelected ? 'della.text' : undefined}
                  onClick={() => toggleDoctor(doctor.id)}
                >
                  {doctor.name}
                </Button>
              );
            })}
          </HStack>
        </Box>

        <Box>
          <HStack justify="space-between" gap={3} mb={3}>
            <Text fontWeight="800" color="della.text">
              Вимоги до обладнання
            </Text>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addRequirement}
            >
              <LuPlus />
              Додати
            </Button>
          </HStack>
          <Stack gap={3}>
            {values.equipmentRequirements.map((requirement, index) => (
              <HStack key={index} gap={3} align="end">
                <Box flex={1}>
                  <SelectField
                    label="Тип обладнання"
                    value={requirement.equipmentTypeId}
                    options={equipmentTypes.map((type) => ({
                      value: String(type.id),
                      label: type.title,
                    }))}
                    onChange={(value) =>
                      updateRequirement(index, 'equipmentTypeId', value)
                    }
                  />
                </Box>
                <Field.Root w="120px">
                  <Field.Label>К-сть</Field.Label>
                  <Input
                    type="number"
                    value={requirement.quantity}
                    onChange={(event) => {
                      const { value: nextValue } = event.currentTarget;

                      updateRequirement(index, 'quantity', nextValue);
                    }}
                  />
                </Field.Root>
                <IconButton
                  type="button"
                  variant="outline"
                  colorPalette="red"
                  aria-label="Видалити вимогу"
                  onClick={() => removeRequirement(index)}
                >
                  <LuTrash2 />
                </IconButton>
              </HStack>
            ))}
          </Stack>
        </Box>

        <CrmSwitch
          checked={values.isActive}
          label="Активна процедура"
          onChange={(checked) =>
            setValues((current) => ({
              ...current,
              isActive: checked,
            }))
          }
        />

        <CrmSwitch
          checked={values.isOnlineBookingAvailable}
          label="Доступна для онлайн-запису"
          onChange={(checked) =>
            setValues((current) => ({
              ...current,
              isOnlineBookingAvailable: checked,
            }))
          }
        />
      </Stack>
    </DialogShell>
  );
};

const getProcedureInitialValues = (
  procedure?: CrmProcedure,
): ProcedureFormValues => ({
  title: procedure?.title ?? '',
  typeId: procedure?.typeId ?? 'clinic',
  slug: procedure?.slug ?? '',
  price: String(procedure?.price ?? 0),
  basePrice: String(procedure?.basePrice ?? procedure?.price ?? 0),
  time: String(procedure?.time ?? 60),
  preparationMinutes: String(procedure?.preparationMinutes ?? 0),
  cleanupMinutes: String(procedure?.cleanupMinutes ?? 0),
  categoryId: procedure?.categoryId ? String(procedure.categoryId) : '',
  shortDescription: procedure?.shortDescription ?? '',
  description: procedure?.description ?? '',
  image: procedure?.image ?? '',
  isActive: procedure?.isActive ?? true,
  isOnlineBookingAvailable: procedure?.isOnlineBookingAvailable ?? true,
  doctorIds:
    procedure?.specialists?.map((specialist) => specialist.doctorId) ??
    procedure?.doctors?.map((doctor) => doctor.id) ??
    [],
  equipmentRequirements:
    procedure?.equipmentRequirements?.map((requirement) => ({
      equipmentTypeId: String(requirement.equipmentTypeId),
      quantity: String(requirement.quantity),
    })) ?? [],
});

const EquipmentTypeDialog = ({
  equipmentType,
  trigger,
  isLoading,
  onSubmit,
}: DialogProps & {
  equipmentType?: CrmEquipmentType;
  onSubmit: (payload: CrmEquipmentTypePayload) => Promise<unknown>;
}) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<EquipmentTypeFormValues>(() =>
    getEquipmentTypeInitialValues(equipmentType),
  );

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setValues(getEquipmentTypeInitialValues(equipmentType));
    }

    setOpen(nextOpen);
  };

  const handleSubmit = async (event: FormEvent<HTMLElement>) => {
    event.preventDefault();

    await onSubmit({
      title: values.title.trim(),
      description: toOptionalString(values.description),
      isActive: values.isActive,
    });

    setOpen(false);
  };

  return (
    <DialogShell
      title={equipmentType ? 'Редагувати тип' : 'Новий тип обладнання'}
      trigger={trigger}
      open={open}
      onOpenChange={handleOpenChange}
      onSubmit={handleSubmit}
      footer={
        <DialogFooter isLoading={isLoading} onCancel={() => setOpen(false)} />
      }
    >
      <Stack gap={4}>
        <Field.Root required>
          <Field.Label>Назва</Field.Label>
          <Input
            value={values.title}
            onChange={updateFormValue(setValues, 'title')}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Опис</Field.Label>
          <Textarea
            value={values.description}
            minH="100px"
            onChange={updateFormValue(setValues, 'description')}
          />
        </Field.Root>
        <CrmSwitch
          checked={values.isActive}
          label="Активний тип"
          onChange={(checked) =>
            setValues((current) => ({ ...current, isActive: checked }))
          }
        />
      </Stack>
    </DialogShell>
  );
};

const getEquipmentTypeInitialValues = (
  equipmentType?: CrmEquipmentType,
): EquipmentTypeFormValues => ({
  title: equipmentType?.title ?? '',
  description: equipmentType?.description ?? '',
  isActive: equipmentType?.isActive ?? true,
});

const EquipmentDialog = ({
  equipment,
  equipmentTypes,
  trigger,
  isLoading,
  onSubmit,
}: DialogProps & {
  equipment?: CrmEquipment;
  equipmentTypes: CrmEquipmentType[];
  onSubmit: (payload: CrmEquipmentPayload) => Promise<unknown>;
}) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<EquipmentFormValues>(() =>
    getEquipmentInitialValues(equipment),
  );

  const typeOptions = equipmentTypes.map((type) => ({
    value: String(type.id),
    label: type.title,
  }));

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setValues(getEquipmentInitialValues(equipment));
    }

    setOpen(nextOpen);
  };

  const handleSubmit = async (event: FormEvent<HTMLElement>) => {
    event.preventDefault();

    await onSubmit({
      name: values.name.trim(),
      equipmentTypeId: Number(values.equipmentTypeId),
      serialNumber: toOptionalString(values.serialNumber),
      inventoryNumber: toOptionalString(values.inventoryNumber),
      notes: toOptionalString(values.notes),
      isActive: values.isActive,
    });

    setOpen(false);
  };

  return (
    <DialogShell
      title={equipment ? 'Редагувати обладнання' : 'Нове обладнання'}
      trigger={trigger}
      open={open}
      onOpenChange={handleOpenChange}
      onSubmit={handleSubmit}
      footer={
        <DialogFooter isLoading={isLoading} onCancel={() => setOpen(false)} />
      }
    >
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <Field.Root required>
          <Field.Label>Назва</Field.Label>
          <Input
            value={values.name}
            onChange={updateFormValue(setValues, 'name')}
          />
        </Field.Root>
        <SelectField
          label="Тип"
          value={values.equipmentTypeId}
          options={typeOptions}
          required
          onChange={(equipmentTypeId) =>
            setValues((current) => ({ ...current, equipmentTypeId }))
          }
        />
        <Field.Root>
          <Field.Label>Серійний номер</Field.Label>
          <Input
            value={values.serialNumber}
            onChange={updateFormValue(setValues, 'serialNumber')}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Інвентарний номер</Field.Label>
          <Input
            value={values.inventoryNumber}
            onChange={updateFormValue(setValues, 'inventoryNumber')}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Нотатки</Field.Label>
          <Textarea
            value={values.notes}
            minH="90px"
            onChange={updateFormValue(setValues, 'notes')}
          />
        </Field.Root>
        <CrmSwitch
          checked={values.isActive}
          label="Активне обладнання"
          onChange={(checked) =>
            setValues((current) => ({ ...current, isActive: checked }))
          }
        />
      </SimpleGrid>
    </DialogShell>
  );
};

const getEquipmentInitialValues = (
  equipment?: CrmEquipment,
): EquipmentFormValues => ({
  name: equipment?.name ?? '',
  equipmentTypeId: equipment?.equipmentTypeId
    ? String(equipment.equipmentTypeId)
    : '',
  serialNumber: equipment?.serialNumber ?? '',
  inventoryNumber: equipment?.inventoryNumber ?? '',
  notes: equipment?.notes ?? '',
  isActive: equipment?.isActive ?? true,
});

const ScheduleDialog = ({
  schedule,
  doctors,
  trigger,
  isLoading,
  onSubmit,
}: DialogProps & {
  schedule?: CrmSpecialistSchedule;
  doctors: CrmDoctor[];
  onSubmit: (payload: CrmSpecialistSchedulePayload) => Promise<unknown>;
}) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<ScheduleFormValues>(() =>
    getScheduleInitialValues(schedule),
  );
  const doctorOptions = doctors.map((doctor) => ({
    value: String(doctor.id),
    label: doctor.name,
  }));
  const dayOptions = weekDays.map((day, index) => ({
    value: String(index),
    label: day,
  }));

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setValues(getScheduleInitialValues(schedule));
    }

    setOpen(nextOpen);
  };

  const handleSubmit = async (event: FormEvent<HTMLElement>) => {
    event.preventDefault();

    await onSubmit({
      doctorId: Number(values.doctorId),
      dayOfWeek: Number(values.dayOfWeek),
      startTime: values.startTime,
      endTime: values.endTime,
      isActive: values.isActive,
    });

    setOpen(false);
  };

  return (
    <DialogShell
      title={schedule ? 'Редагувати графік' : 'Новий графік'}
      trigger={trigger}
      open={open}
      onOpenChange={handleOpenChange}
      onSubmit={handleSubmit}
      footer={
        <DialogFooter isLoading={isLoading} onCancel={() => setOpen(false)} />
      }
    >
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <SelectField
          label="Лікар"
          value={values.doctorId}
          options={doctorOptions}
          required
          onChange={(doctorId) =>
            setValues((current) => ({ ...current, doctorId }))
          }
        />
        <SelectField
          label="День"
          value={values.dayOfWeek}
          options={dayOptions}
          required
          onChange={(dayOfWeek) =>
            setValues((current) => ({ ...current, dayOfWeek }))
          }
        />
        <Field.Root required>
          <Field.Label>Початок</Field.Label>
          <Input
            type="time"
            value={values.startTime}
            onChange={updateFormValue(setValues, 'startTime')}
          />
        </Field.Root>
        <Field.Root required>
          <Field.Label>Кінець</Field.Label>
          <Input
            type="time"
            value={values.endTime}
            onChange={updateFormValue(setValues, 'endTime')}
          />
        </Field.Root>
        <CrmSwitch
          checked={values.isActive}
          label="Активний графік"
          onChange={(checked) =>
            setValues((current) => ({ ...current, isActive: checked }))
          }
        />
      </SimpleGrid>
    </DialogShell>
  );
};

const getScheduleInitialValues = (
  schedule?: CrmSpecialistSchedule,
): ScheduleFormValues => ({
  doctorId: schedule?.doctorId ? String(schedule.doctorId) : '',
  dayOfWeek: String(schedule?.dayOfWeek ?? 1),
  startTime: schedule?.startTime ?? '10:00',
  endTime: schedule?.endTime ?? '18:00',
  isActive: schedule?.isActive ?? true,
});

const ScheduleExceptionDialog = ({
  exception,
  doctors,
  initialDate,
  initialDoctorId,
  initialStartTime,
  initialEndTime,
  trigger,
  open: controlledOpen,
  isLoading,
  onOpenChange: controlledOnOpenChange,
  onSubmit,
}: DialogProps & {
  exception?: CrmScheduleException;
  doctors: CrmDoctor[];
  initialDate?: Date;
  initialDoctorId?: number;
  initialStartTime?: string;
  initialEndTime?: string;
  onSubmit: (payload: CrmScheduleExceptionPayload) => Promise<unknown>;
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [values, setValues] = useState<ScheduleExceptionFormValues>(() =>
    getScheduleExceptionInitialValues(
      exception,
      initialDate,
      initialDoctorId,
      initialStartTime,
      initialEndTime,
    ),
  );
  const open = controlledOpen ?? internalOpen;
  const setDialogOpen = (nextOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(nextOpen);
    }

    controlledOnOpenChange?.(nextOpen);
  };
  const doctorOptions = doctors.map((doctor) => ({
    value: String(doctor.id),
    label: doctor.name,
  }));

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setValues(
        getScheduleExceptionInitialValues(
          exception,
          initialDate,
          initialDoctorId,
          initialStartTime,
          initialEndTime,
        ),
      );
    }

    setDialogOpen(nextOpen);
  };

  const handleSubmit = async (event: FormEvent<HTMLElement>) => {
    event.preventDefault();
    const doctorId = toRequiredId(values.doctorId);
    const isTimed = isTimedScheduleException(values.type);

    if (!doctorId) {
      toaster.create({
        title: 'Оберіть лікаря',
        description: 'Подія календаря має бути привʼязана до лікаря.',
        type: 'error',
      });
      return;
    }

    if (
      isTimed &&
      (!toOptionalString(values.startTime) || !toOptionalString(values.endTime))
    ) {
      toaster.create({
        title: 'Вкажіть час події',
        description: 'Для перерви або іншої події потрібні початок і кінець.',
        type: 'error',
      });
      return;
    }

    await onSubmit({
      doctorId,
      date: values.date,
      startTime: isTimed ? toOptionalString(values.startTime) : undefined,
      endTime: isTimed ? toOptionalString(values.endTime) : undefined,
      type: values.type,
      reason: toOptionalString(values.reason),
    });

    setDialogOpen(false);
  };

  return (
    <DialogShell
      title={exception ? 'Редагувати подію' : 'Нова подія календаря'}
      trigger={trigger}
      open={open}
      onOpenChange={handleOpenChange}
      onSubmit={handleSubmit}
      footer={
        <DialogFooter
          isLoading={isLoading}
          onCancel={() => setDialogOpen(false)}
        />
      }
    >
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <SelectField
          label="Лікар"
          value={values.doctorId}
          options={doctorOptions}
          required
          onChange={(doctorId) =>
            setValues((current) => ({ ...current, doctorId }))
          }
        />
        <Field.Root required>
          <Field.Label>Дата</Field.Label>
          <Input
            type="date"
            value={values.date}
            onChange={updateFormValue(setValues, 'date')}
          />
        </Field.Root>
        <SelectField
          label="Тип"
          value={values.type}
          options={exceptionTypes}
          required
          onChange={(type) =>
            setValues((current) => ({
              ...current,
              type: type as ScheduleExceptionType,
            }))
          }
        />
        <Field.Root>
          <Field.Label>Причина</Field.Label>
          <Input
            value={values.reason}
            onChange={updateFormValue(setValues, 'reason')}
          />
        </Field.Root>
        {isTimedScheduleException(values.type) && (
          <>
            <Field.Root required>
              <Field.Label>Початок</Field.Label>
              <Input
                type="time"
                value={values.startTime}
                onChange={updateFormValue(setValues, 'startTime')}
              />
            </Field.Root>
            <Field.Root required>
              <Field.Label>Кінець</Field.Label>
              <Input
                type="time"
                value={values.endTime}
                onChange={updateFormValue(setValues, 'endTime')}
              />
            </Field.Root>
          </>
        )}
      </SimpleGrid>
    </DialogShell>
  );
};

const getScheduleExceptionInitialValues = (
  exception?: CrmScheduleException,
  initialDate?: Date,
  initialDoctorId?: number,
  initialStartTime?: string,
  initialEndTime?: string,
): ScheduleExceptionFormValues => ({
  doctorId: exception?.doctorId
    ? String(exception.doctorId)
    : initialDoctorId
      ? String(initialDoctorId)
      : '',
  date: exception?.date
    ? exception.date.slice(0, 10)
    : toDateInputValue(initialDate ?? new Date()),
  startTime: exception?.startTime ?? initialStartTime ?? '13:00',
  endTime: exception?.endTime ?? initialEndTime ?? '14:00',
  type: exception?.type ?? 'BREAK',
  reason: exception?.reason ?? '',
});

const MonthCalendar = ({
  displayMonth,
  selectedDate,
  onDisplayMonthChange,
  onSelectDate,
}: {
  displayMonth: Date;
  selectedDate: Date;
  onDisplayMonthChange: (date: Date) => void;
  onSelectDate: (date: Date) => void;
}) => {
  const monthStart = useMemo(() => startOfMonth(displayMonth), [displayMonth]);
  const monthDays = useMemo(() => {
    const gridStart = startOfWeek(monthStart);

    return Array.from({ length: 42 }, (_item, index) =>
      addDays(gridStart, index),
    );
  }, [monthStart]);
  const today = new Date();
  const monthLabel = new Intl.DateTimeFormat('uk-UA', {
    month: 'long',
    year: 'numeric',
  }).format(monthStart);

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="blackAlpha.100"
      borderRadius="2xl"
      boxShadow="sm"
      p={4}
    >
      <HStack justify="space-between" gap={3} mb={4}>
        <Text fontWeight="900" color="della.text" textTransform="capitalize">
          {monthLabel}
        </Text>

        <HStack gap={1}>
          <IconButton
            size="xs"
            variant="ghost"
            aria-label="Попередній місяць"
            onClick={() => onDisplayMonthChange(addMonths(displayMonth, -1))}
          >
            <LuChevronLeft />
          </IconButton>
          <IconButton
            size="xs"
            variant="ghost"
            aria-label="Наступний місяць"
            onClick={() => onDisplayMonthChange(addMonths(displayMonth, 1))}
          >
            <LuChevronRight />
          </IconButton>
        </HStack>
      </HStack>

      <SimpleGrid columns={7} gap={1} mb={1}>
        {monthWeekDays.map((day) => (
          <Center key={day} h={7}>
            <Text fontSize="xs" fontWeight="800" color="gray.500">
              {day}
            </Text>
          </Center>
        ))}
      </SimpleGrid>

      <SimpleGrid columns={7} gap={1}>
        {monthDays.map((day) => {
          const isSelected = isSameCalendarDay(day, selectedDate);
          const isToday = isSameCalendarDay(day, today);
          const isCurrentMonth = day.getMonth() === monthStart.getMonth();

          return (
            <Button
              key={day.toISOString()}
              h={8}
              minW={8}
              p={0}
              borderRadius="full"
              variant={isSelected ? 'solid' : 'ghost'}
              bg={isSelected ? 'della.primary' : undefined}
              color={
                isSelected
                  ? 'della.text'
                  : isCurrentMonth
                    ? 'della.text'
                    : 'gray.400'
              }
              border={isToday && !isSelected ? '1px solid' : undefined}
              borderColor={isToday && !isSelected ? 'della.primary' : undefined}
              fontSize="sm"
              fontWeight={isSelected || isToday ? '900' : '600'}
              aria-label={`Обрати ${formatDate(day)}`}
              aria-pressed={isSelected}
              _hover={{
                bg: isSelected ? 'della.primaryHover' : 'blackAlpha.100',
              }}
              onClick={() => {
                onDisplayMonthChange(startOfMonth(day));
                onSelectDate(day);
              }}
            >
              {day.getDate()}
            </Button>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export const CrmDashboard = ({ view = 'calendar' }: { view?: CrmView }) => {
  const [calendarMode, setCalendarMode] = useState<CalendarMode>('week');
  const [calendarScaleMinutes, setCalendarScaleMinutes] =
    useState<CalendarScaleMinutes>(15);
  const [slotDraft, setSlotDraft] = useState<CalendarSlotDraft>();
  const [slotCreateMode, setSlotCreateMode] =
    useState<SlotCreateMode>('choice');
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [monthCalendarDate, setMonthCalendarDate] = useState(() =>
    startOfMonth(new Date()),
  );
  const [doctorFilter, setDoctorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [clientSearch, setClientSearch] = useState('');

  const weekStart = useMemo(() => startOfWeek(selectedDate), [selectedDate]);
  const visibleStart = useMemo(() => {
    const next = calendarMode === 'week' ? weekStart : new Date(selectedDate);
    next.setHours(0, 0, 0, 0);

    return next;
  }, [calendarMode, selectedDate, weekStart]);
  const visibleEnd = useMemo(
    () => addDays(visibleStart, calendarMode === 'week' ? 7 : 1),
    [calendarMode, visibleStart],
  );
  const calendarDays = useMemo(
    () =>
      Array.from({ length: calendarMode === 'week' ? 7 : 1 }, (_item, index) =>
        addDays(visibleStart, index),
      ),
    [calendarMode, visibleStart],
  );

  const doctorsQuery = useQuery({
    queryKey: [...CRM_QUERY_KEY, 'doctors'],
    queryFn: crmService.getDoctors,
  });
  const proceduresQuery = useQuery({
    queryKey: [...CRM_QUERY_KEY, 'procedures'],
    queryFn: crmService.getProcedures,
  });
  const categoriesQuery = useQuery({
    queryKey: [...CRM_QUERY_KEY, 'procedure-categories'],
    queryFn: crmService.getProcedureCategories,
  });
  const clientsQuery = useQuery({
    queryKey: [...CRM_QUERY_KEY, 'clients', clientSearch.trim()],
    queryFn: () => crmService.getClients(clientSearch.trim()),
  });
  const equipmentTypesQuery = useQuery({
    queryKey: [...CRM_QUERY_KEY, 'equipment-types'],
    queryFn: crmService.getEquipmentTypes,
  });
  const equipmentQuery = useQuery({
    queryKey: [...CRM_QUERY_KEY, 'equipment'],
    queryFn: () => crmService.getEquipment(),
  });
  const schedulesQuery = useQuery({
    queryKey: [...CRM_QUERY_KEY, 'schedules'],
    queryFn: () => crmService.getSchedules(),
  });
  const exceptionsQuery = useQuery({
    queryKey: [...CRM_QUERY_KEY, 'schedule-exceptions'],
    queryFn: () => crmService.getScheduleExceptions(),
  });
  const appointmentsQuery = useQuery({
    queryKey: [
      ...CRM_QUERY_KEY,
      'appointments',
      calendarMode,
      visibleStart.toISOString(),
      doctorFilter,
      statusFilter,
    ],
    queryFn: () =>
      crmService.getAppointments({
        from: visibleStart.toISOString(),
        to: visibleEnd.toISOString(),
        doctorId: toOptionalNumber(doctorFilter),
        status: statusFilter ? (statusFilter as AppointmentStatus) : undefined,
      }),
  });

  const doctors = doctorsQuery.data ?? [];
  const procedures = proceduresQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];
  const clients = clientsQuery.data ?? [];
  const equipmentTypes = equipmentTypesQuery.data ?? [];
  const equipment = equipmentQuery.data ?? [];
  const schedules = schedulesQuery.data ?? [];
  const exceptions = exceptionsQuery.data ?? [];
  const appointments = useMemo(
    () => appointmentsQuery.data ?? [],
    [appointmentsQuery.data],
  );

  const createAppointment = useCrmMutation(crmService.createAppointment, {
    success: 'Запис створено',
    error: 'Не вдалося створити запис',
  });
  const updateAppointment = useCrmMutation(
    ({ id, payload }: MutationVariables<CrmAppointmentPayload>) =>
      crmService.updateAppointment(id, payload),
    {
      success: 'Запис оновлено',
      error: 'Не вдалося оновити запис',
    },
  );
  const deleteAppointment = useCrmMutation(crmService.deleteAppointment, {
    success: 'Запис видалено',
    error: 'Не вдалося видалити запис',
  });
  const createClient = useCrmMutation(crmService.createClient, {
    success: 'Клієнта створено',
    error: 'Не вдалося створити клієнта',
  });
  const updateClient = useCrmMutation(
    ({ id, payload }: MutationVariables<CrmClientPayload>) =>
      crmService.updateClient(id, payload),
    {
      success: 'Клієнта оновлено',
      error: 'Не вдалося оновити клієнта',
    },
  );
  const deleteClient = useCrmMutation(crmService.deleteClient, {
    success: 'Клієнта видалено',
    error: 'Не вдалося видалити клієнта',
  });
  const createDoctor = useCrmMutation(crmService.createDoctor, {
    success: 'Лікаря створено',
    error: 'Не вдалося створити лікаря',
  });
  const updateDoctor = useCrmMutation(
    ({ id, payload }: MutationVariables<CrmDoctorPayload>) =>
      crmService.updateDoctor(id, payload),
    {
      success: 'Лікаря оновлено',
      error: 'Не вдалося оновити лікаря',
    },
  );
  const deleteDoctor = useCrmMutation(crmService.deleteDoctor, {
    success: 'Лікаря видалено',
    error: 'Не вдалося видалити лікаря',
  });
  const createCategory = useCrmMutation(crmService.createProcedureCategory, {
    success: 'Категорію створено',
    error: 'Не вдалося створити категорію',
  });
  const updateCategory = useCrmMutation(
    ({ id, payload }: MutationVariables<CrmProcedureCategoryPayload>) =>
      crmService.updateProcedureCategory(id, payload),
    {
      success: 'Категорію оновлено',
      error: 'Не вдалося оновити категорію',
    },
  );
  const deleteCategory = useCrmMutation(crmService.deleteProcedureCategory, {
    success: 'Категорію видалено',
    error: 'Не вдалося видалити категорію',
  });
  const createProcedure = useCrmMutation(crmService.createProcedure, {
    success: 'Процедуру створено',
    error: 'Не вдалося створити процедуру',
  });
  const updateProcedure = useCrmMutation(
    ({ id, payload }: MutationVariables<CrmProcedurePayload>) =>
      crmService.updateProcedure(id, payload),
    {
      success: 'Процедуру оновлено',
      error: 'Не вдалося оновити процедуру',
    },
  );
  const deleteProcedure = useCrmMutation(crmService.deleteProcedure, {
    success: 'Процедуру видалено',
    error: 'Не вдалося видалити процедуру',
    errorDescription:
      'Неможливо видалити процедуру, оскільки для неї вже створено запис. Спершу скасуйте або видаліть повʼязані записи.',
    preferErrorDescription: true,
  });
  const createEquipmentType = useCrmMutation(crmService.createEquipmentType, {
    success: 'Тип обладнання створено',
    error: 'Не вдалося створити тип обладнання',
  });
  const updateEquipmentType = useCrmMutation(
    ({ id, payload }: MutationVariables<CrmEquipmentTypePayload>) =>
      crmService.updateEquipmentType(id, payload),
    {
      success: 'Тип обладнання оновлено',
      error: 'Не вдалося оновити тип обладнання',
    },
  );
  const deleteEquipmentType = useCrmMutation(crmService.deleteEquipmentType, {
    success: 'Тип обладнання видалено',
    error: 'Не вдалося видалити тип обладнання',
  });
  const createEquipment = useCrmMutation(crmService.createEquipment, {
    success: 'Обладнання створено',
    error: 'Не вдалося створити обладнання',
  });
  const updateEquipment = useCrmMutation(
    ({ id, payload }: MutationVariables<CrmEquipmentPayload>) =>
      crmService.updateEquipment(id, payload),
    {
      success: 'Обладнання оновлено',
      error: 'Не вдалося оновити обладнання',
    },
  );
  const deleteEquipment = useCrmMutation(crmService.deleteEquipment, {
    success: 'Обладнання видалено',
    error: 'Не вдалося видалити обладнання',
  });
  const createSchedule = useCrmMutation(crmService.createSchedule, {
    success: 'Графік створено',
    error: 'Не вдалося створити графік',
  });
  const updateSchedule = useCrmMutation(
    ({ id, payload }: MutationVariables<CrmSpecialistSchedulePayload>) =>
      crmService.updateSchedule(id, payload),
    {
      success: 'Графік оновлено',
      error: 'Не вдалося оновити графік',
    },
  );
  const deleteSchedule = useCrmMutation(crmService.deleteSchedule, {
    success: 'Графік видалено',
    error: 'Не вдалося видалити графік',
  });
  const createException = useCrmMutation(crmService.createScheduleException, {
    success: 'Подію створено',
    error: 'Не вдалося створити подію',
  });
  const updateException = useCrmMutation(
    ({ id, payload }: MutationVariables<CrmScheduleExceptionPayload>) =>
      crmService.updateScheduleException(id, payload),
    {
      success: 'Подію оновлено',
      error: 'Не вдалося оновити подію',
    },
  );
  const deleteException = useCrmMutation(crmService.deleteScheduleException, {
    success: 'Подію видалено',
    error: 'Не вдалося видалити подію',
  });

  const isInitialLoading =
    appointmentsQuery.isPending ||
    doctorsQuery.isPending ||
    proceduresQuery.isPending ||
    clientsQuery.isPending;

  const doctorOptions = doctors.map((doctor) => ({
    value: String(doctor.id),
    label: doctor.name,
  }));
  const statusOptions = appointmentStatuses.map((status) => ({
    value: status.value,
    label: status.label,
  }));
  const currentViewMeta = crmViewMeta[view];

  const confirmDelete = (message: string, action: () => void) => {
    if (window.confirm(message)) {
      action();
    }
  };
  const selectCalendarDate = (date: Date) => {
    setSelectedDate(date);
    setMonthCalendarDate(startOfMonth(date));
  };
  const openSlotDraft = (draft: CalendarSlotDraft) => {
    setSlotDraft(draft);
    setSlotCreateMode('choice');
  };
  const closeSlotDraft = () => {
    setSlotDraft(undefined);
    setSlotCreateMode('choice');
  };

  if (isInitialLoading) {
    return (
      <Center py={16}>
        <VStack color="della.accent">
          <Spinner />
          <Text>Завантаження CRM...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Stack gap={5}>
      {slotDraft && (
        <>
          <SlotCreateChoiceDialog
            slot={slotDraft}
            open={slotCreateMode === 'choice'}
            onOpenChange={(nextOpen) => {
              if (!nextOpen) {
                closeSlotDraft();
              }
            }}
            onSelectMode={setSlotCreateMode}
          />
          <AppointmentDialog
            doctors={doctors}
            procedures={procedures}
            clients={clients}
            initialStartAt={slotDraft.startAt}
            initialDoctorId={slotDraft.doctorId}
            availabilityStepMinutes={calendarScaleMinutes}
            open={slotCreateMode === 'appointment'}
            isLoading={createAppointment.isPending}
            onOpenChange={(nextOpen) => {
              if (!nextOpen) {
                closeSlotDraft();
              }
            }}
            onSubmit={(payload) => createAppointment.mutateAsync(payload)}
          />
          <ScheduleExceptionDialog
            doctors={doctors}
            initialDate={slotDraft.startAt}
            initialDoctorId={slotDraft.doctorId}
            initialStartTime={toTimeInputValue(slotDraft.startAt)}
            initialEndTime={toTimeInputValue(slotDraft.endAt)}
            open={slotCreateMode === 'exception'}
            isLoading={createException.isPending}
            onOpenChange={(nextOpen) => {
              if (!nextOpen) {
                closeSlotDraft();
              }
            }}
            onSubmit={(payload) => createException.mutateAsync(payload)}
          />
        </>
      )}

      <Box
        bg="white"
        border="1px solid"
        borderColor="blackAlpha.100"
        borderRadius="2xl"
        p={{ base: 4, md: 5 }}
        boxShadow="sm"
      >
        <Flex align="center" justify="space-between" gap={4}>
          <Box>
            <Text fontSize="xl" fontWeight="900" color="della.text">
              {currentViewMeta.title}
            </Text>
            <Text mt={1} color="gray.500">
              {currentViewMeta.description}
            </Text>
          </Box>

          {view !== 'calendar' && (
            <AppointmentDialog
              doctors={doctors}
              procedures={procedures}
              clients={clients}
              isLoading={createAppointment.isPending}
              onSubmit={(payload) => createAppointment.mutateAsync(payload)}
              trigger={
                <Button bg="della.primary" color="della.text">
                  <LuPlus />
                  Новий запис
                </Button>
              }
            />
          )}
        </Flex>
      </Box>

      {view === 'calendar' && (
        <Grid
          templateColumns={{ base: '1fr', xl: '280px minmax(0, 1fr)' }}
          gap={4}
          alignItems="start"
        >
          <Stack gap={3}>
            <MonthCalendar
              displayMonth={monthCalendarDate}
              selectedDate={selectedDate}
              onDisplayMonthChange={setMonthCalendarDate}
              onSelectDate={selectCalendarDate}
            />

            <Box
              bg="white"
              border="1px solid"
              borderColor="blackAlpha.100"
              borderRadius="2xl"
              boxShadow="sm"
              p={3}
            >
              <Stack gap={2}>
                <AppointmentDialog
                  doctors={doctors}
                  procedures={procedures}
                  clients={clients}
                  isLoading={createAppointment.isPending}
                  availabilityStepMinutes={calendarScaleMinutes}
                  onSubmit={(payload) => createAppointment.mutateAsync(payload)}
                  trigger={
                    <Button w="100%" bg="della.primary" color="della.text">
                      <LuPlus />
                      Новий запис
                    </Button>
                  }
                />
                <ScheduleExceptionDialog
                  doctors={doctors}
                  initialDate={selectedDate}
                  initialDoctorId={toOptionalNumber(doctorFilter)}
                  isLoading={createException.isPending}
                  onSubmit={(payload) => createException.mutateAsync(payload)}
                  trigger={
                    <Button w="100%" variant="outline">
                      <LuCalendarDays />
                      Нова подія
                    </Button>
                  }
                />
              </Stack>
            </Box>
          </Stack>

          <Stack gap={4} minW={0}>
            <Box
              bg="white"
              border="1px solid"
              borderColor="blackAlpha.100"
              borderRadius="2xl"
              p={{ base: 4, md: 5 }}
              boxShadow="sm"
            >
              <Flex
                align={{ base: 'stretch', xl: 'center' }}
                justify="space-between"
                direction={{ base: 'column', xl: 'row' }}
                gap={4}
              >
                <Stack gap={3}>
                  <HStack gap={2} wrap="wrap">
                    <IconButton
                      variant="outline"
                      aria-label="Попередній період"
                      onClick={() =>
                        selectCalendarDate(
                          calendarMode === 'week'
                            ? addWeeks(selectedDate, -1)
                            : addDays(selectedDate, -1),
                        )
                      }
                    >
                      <LuChevronLeft />
                    </IconButton>
                    <Button
                      variant="outline"
                      onClick={() => selectCalendarDate(new Date())}
                    >
                      Сьогодні
                    </Button>
                    <IconButton
                      variant="outline"
                      aria-label="Наступний період"
                      onClick={() =>
                        selectCalendarDate(
                          calendarMode === 'week'
                            ? addWeeks(selectedDate, 1)
                            : addDays(selectedDate, 1),
                        )
                      }
                    >
                      <LuChevronRight />
                    </IconButton>
                    <Text fontWeight="900" color="della.text">
                      {calendarMode === 'week'
                        ? `${formatDate(visibleStart)} - ${formatDate(
                            addDays(visibleEnd, -1),
                          )}`
                        : formatDate(selectedDate)}
                    </Text>
                  </HStack>

                  <CalendarModeToggle
                    value={calendarMode}
                    onChange={setCalendarMode}
                  />
                </Stack>

                <HStack gap={3} wrap="wrap">
                  <Box minW={{ base: '100%', md: '220px' }}>
                    <SelectField
                      label="Лікар"
                      value={doctorFilter}
                      options={doctorOptions}
                      placeholder="Всі лікарі"
                      onChange={setDoctorFilter}
                    />
                  </Box>
                  <Box minW={{ base: '100%', md: '220px' }}>
                    <SelectField
                      label="Статус"
                      value={statusFilter}
                      options={statusOptions}
                      placeholder="Всі статуси"
                      onChange={setStatusFilter}
                    />
                  </Box>
                  <Box minW={{ base: '100%', md: '150px' }}>
                    <SelectField
                      label="Масштаб"
                      value={String(calendarScaleMinutes)}
                      options={calendarScaleItems}
                      onChange={(scale) =>
                        setCalendarScaleMinutes(toCalendarScaleMinutes(scale))
                      }
                    />
                  </Box>
                </HStack>
              </Flex>
            </Box>

            {appointmentsQuery.isFetching && (
              <Center py={1}>
                <Spinner size="sm" color="della.primary" />
              </Center>
            )}

            <GoogleCalendarGrid
              mode={calendarMode}
              days={calendarDays}
              doctors={doctors}
              appointments={appointments}
              exceptions={exceptions}
              procedures={procedures}
              clients={clients}
              doctorFilter={doctorFilter}
              creatingAppointment={createAppointment.isPending}
              creatingException={createException.isPending}
              calendarScaleMinutes={calendarScaleMinutes}
              updatingAppointmentId={updateAppointment.variables?.id}
              deletingAppointmentId={deleteAppointment.variables}
              updatingExceptionId={updateException.variables?.id}
              deletingExceptionId={deleteException.variables}
              onSelectSlot={openSlotDraft}
              onCreate={(payload) => createAppointment.mutateAsync(payload)}
              onCreateException={(payload) =>
                createException.mutateAsync(payload)
              }
              onUpdate={(id, payload) =>
                updateAppointment.mutateAsync({ id, payload })
              }
              onUpdateException={(id, payload) =>
                updateException.mutateAsync({ id, payload })
              }
              onDelete={(id) =>
                confirmDelete('Видалити запис?', () =>
                  deleteAppointment.mutate(id),
                )
              }
              onDeleteException={(id) =>
                confirmDelete('Видалити подію?', () =>
                  deleteException.mutate(id),
                )
              }
            />
          </Stack>
        </Grid>
      )}

      {view === 'clients' && (
        <ClientsSection
          clients={clients}
          search={clientSearch}
          isFetching={clientsQuery.isFetching}
          creating={createClient.isPending}
          updatingId={updateClient.variables?.id}
          deletingId={deleteClient.variables}
          onSearchChange={setClientSearch}
          onCreate={(payload) => createClient.mutateAsync(payload)}
          onUpdate={(id, payload) => updateClient.mutateAsync({ id, payload })}
          onDelete={(id) =>
            confirmDelete('Видалити клієнта?', () => deleteClient.mutate(id))
          }
        />
      )}

      {view === 'catalog' && (
        <CatalogSection
          doctors={doctors}
          procedures={procedures}
          categories={categories}
          equipmentTypes={equipmentTypes}
          creatingDoctor={createDoctor.isPending}
          updatingDoctorId={updateDoctor.variables?.id}
          deletingDoctorId={deleteDoctor.variables}
          creatingCategory={createCategory.isPending}
          updatingCategoryId={updateCategory.variables?.id}
          deletingCategoryId={deleteCategory.variables}
          creatingProcedure={createProcedure.isPending}
          updatingProcedureId={updateProcedure.variables?.id}
          deletingProcedureId={deleteProcedure.variables}
          onCreateDoctor={(payload) => createDoctor.mutateAsync(payload)}
          onUpdateDoctor={(id, payload) =>
            updateDoctor.mutateAsync({ id, payload })
          }
          onDeleteDoctor={(id) =>
            confirmDelete('Видалити лікаря?', () => deleteDoctor.mutate(id))
          }
          onCreateCategory={(payload) => createCategory.mutateAsync(payload)}
          onUpdateCategory={(id, payload) =>
            updateCategory.mutateAsync({ id, payload })
          }
          onDeleteCategory={(id) =>
            confirmDelete('Видалити категорію?', () =>
              deleteCategory.mutate(id),
            )
          }
          onCreateProcedure={(payload) => createProcedure.mutateAsync(payload)}
          onUpdateProcedure={(id, payload) =>
            updateProcedure.mutateAsync({ id, payload })
          }
          onDeleteProcedure={(id) =>
            confirmDelete('Видалити процедуру?', () =>
              deleteProcedure.mutate(id),
            )
          }
        />
      )}

      {view === 'equipment' && (
        <EquipmentSection
          equipmentTypes={equipmentTypes}
          equipment={equipment}
          creatingType={createEquipmentType.isPending}
          updatingTypeId={updateEquipmentType.variables?.id}
          deletingTypeId={deleteEquipmentType.variables}
          creatingEquipment={createEquipment.isPending}
          updatingEquipmentId={updateEquipment.variables?.id}
          deletingEquipmentId={deleteEquipment.variables}
          onCreateType={(payload) => createEquipmentType.mutateAsync(payload)}
          onUpdateType={(id, payload) =>
            updateEquipmentType.mutateAsync({ id, payload })
          }
          onDeleteType={(id) =>
            confirmDelete('Видалити тип обладнання?', () =>
              deleteEquipmentType.mutate(id),
            )
          }
          onCreateEquipment={(payload) => createEquipment.mutateAsync(payload)}
          onUpdateEquipment={(id, payload) =>
            updateEquipment.mutateAsync({ id, payload })
          }
          onDeleteEquipment={(id) =>
            confirmDelete('Видалити обладнання?', () =>
              deleteEquipment.mutate(id),
            )
          }
        />
      )}

      {view === 'schedule' && (
        <ScheduleSection
          doctors={doctors}
          schedules={schedules}
          exceptions={exceptions}
          creatingSchedule={createSchedule.isPending}
          updatingScheduleId={updateSchedule.variables?.id}
          deletingScheduleId={deleteSchedule.variables}
          creatingException={createException.isPending}
          updatingExceptionId={updateException.variables?.id}
          deletingExceptionId={deleteException.variables}
          onCreateSchedule={(payload) => createSchedule.mutateAsync(payload)}
          onUpdateSchedule={(id, payload) =>
            updateSchedule.mutateAsync({ id, payload })
          }
          onDeleteSchedule={(id) =>
            confirmDelete('Видалити графік?', () => deleteSchedule.mutate(id))
          }
          onCreateException={(payload) => createException.mutateAsync(payload)}
          onUpdateException={(id, payload) =>
            updateException.mutateAsync({ id, payload })
          }
          onDeleteException={(id) =>
            confirmDelete('Видалити подію?', () => deleteException.mutate(id))
          }
        />
      )}
    </Stack>
  );
};

const GoogleCalendarGrid = ({
  mode,
  days,
  doctors,
  appointments,
  exceptions,
  procedures,
  clients,
  doctorFilter,
  creatingAppointment,
  creatingException,
  calendarScaleMinutes,
  updatingAppointmentId,
  deletingAppointmentId,
  updatingExceptionId,
  deletingExceptionId,
  onSelectSlot,
  onCreate,
  onCreateException,
  onUpdate,
  onUpdateException,
  onDelete,
  onDeleteException,
}: {
  mode: CalendarMode;
  days: Date[];
  doctors: CrmDoctor[];
  appointments: CrmAppointment[];
  exceptions: CrmScheduleException[];
  procedures: CrmProcedure[];
  clients: CrmClient[];
  doctorFilter: string;
  creatingAppointment?: boolean;
  creatingException?: boolean;
  calendarScaleMinutes: CalendarScaleMinutes;
  updatingAppointmentId?: number;
  deletingAppointmentId?: number;
  updatingExceptionId?: number;
  deletingExceptionId?: number;
  onSelectSlot: (draft: CalendarSlotDraft) => void;
  onCreate: (payload: CrmAppointmentPayload) => Promise<unknown>;
  onCreateException: (payload: CrmScheduleExceptionPayload) => Promise<unknown>;
  onUpdate: (
    id: number,
    payload: Partial<CrmAppointmentPayload>,
  ) => Promise<unknown>;
  onUpdateException: (
    id: number,
    payload: Partial<CrmScheduleExceptionPayload>,
  ) => Promise<unknown>;
  onDelete: (id: number) => void;
  onDeleteException: (id: number) => void;
}) => {
  const selectedDay = days[0] ?? new Date();
  const activeDoctors = doctorFilter
    ? doctors.filter((doctor) => String(doctor.id) === doctorFilter)
    : doctors;
  const selectedDoctorId = toRequiredId(doctorFilter);
  const columns =
    mode === 'day'
      ? activeDoctors.map((doctor) => ({
          id: `doctor-${doctor.id}`,
          title: doctor.name,
          subtitle: 'Лікар',
          doctorId: doctor.id,
          day: selectedDay,
        }))
      : days.map((day) => ({
          id: toDateInputValue(day),
          title: shortWeekDays[day.getDay()],
          subtitle: formatDate(day),
          day,
          doctorId: selectedDoctorId,
        }));

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="blackAlpha.100"
      borderRadius="2xl"
      boxShadow="sm"
      overflow="hidden"
    >
      <Box overflowX="auto">
        <Grid
          minW={
            mode === 'day'
              ? `calc(${CALENDAR_TIME_COLUMN_WIDTH} + ${Math.max(
                  columns.length,
                  1,
                )} * ${CALENDAR_DOCTOR_COLUMN_MIN_WIDTH})`
              : `calc(${CALENDAR_TIME_COLUMN_WIDTH} + 7 * ${CALENDAR_DAY_COLUMN_MIN_WIDTH})`
          }
          templateColumns={`${CALENDAR_TIME_COLUMN_WIDTH} repeat(${Math.max(
            columns.length,
            1,
          )}, minmax(${
            mode === 'day'
              ? CALENDAR_DOCTOR_COLUMN_MIN_WIDTH
              : CALENDAR_DAY_COLUMN_MIN_WIDTH
          }, 1fr))`}
        >
          <Box
            position="sticky"
            left={0}
            zIndex={3}
            bg="white"
            borderRight="1px solid"
            borderBottom="1px solid"
            borderColor="blackAlpha.100"
            h={CALENDAR_HEADER_HEIGHT}
          />

          {columns.length ? (
            columns.map((column) => (
              <CalendarColumnHeader
                key={column.id}
                column={column}
                mode={mode}
                doctors={doctors}
                procedures={procedures}
                clients={clients}
                creatingAppointment={creatingAppointment}
                creatingException={creatingException}
                availabilityStepMinutes={calendarScaleMinutes}
                onCreate={onCreate}
                onCreateException={onCreateException}
              />
            ))
          ) : (
            <Box
              h={CALENDAR_HEADER_HEIGHT}
              borderBottom="1px solid"
              borderColor="blackAlpha.100"
              px={4}
              py={3}
            >
              <Text fontWeight="900" color="della.text">
                Немає лікарів
              </Text>
            </Box>
          )}

          <CalendarTimeColumn />

          {columns.length ? (
            columns.map((column) => (
              <CalendarColumn
                key={column.id}
                column={column}
                mode={mode}
                appointments={appointments}
                exceptions={exceptions}
                doctors={doctors}
                procedures={procedures}
                clients={clients}
                updatingAppointmentId={updatingAppointmentId}
                deletingAppointmentId={deletingAppointmentId}
                updatingExceptionId={updatingExceptionId}
                deletingExceptionId={deletingExceptionId}
                calendarScaleMinutes={calendarScaleMinutes}
                onSelectSlot={onSelectSlot}
                onUpdate={onUpdate}
                onUpdateException={onUpdateException}
                onDelete={onDelete}
                onDeleteException={onDeleteException}
              />
            ))
          ) : (
            <Box
              position="relative"
              h={`${CALENDAR_GRID_HEIGHT}px`}
              bg="gray.50"
            />
          )}
        </Grid>
      </Box>
    </Box>
  );
};

type CalendarColumnData = {
  id: string;
  title: string;
  subtitle: string;
  day: Date;
  doctorId?: number;
};

const CalendarColumnHeader = ({
  column,
  mode,
  doctors,
  procedures,
  clients,
  creatingAppointment,
  creatingException,
  availabilityStepMinutes,
  onCreate,
  onCreateException,
}: {
  column: CalendarColumnData;
  mode: CalendarMode;
  doctors: CrmDoctor[];
  procedures: CrmProcedure[];
  clients: CrmClient[];
  creatingAppointment?: boolean;
  creatingException?: boolean;
  availabilityStepMinutes: CalendarScaleMinutes;
  onCreate: (payload: CrmAppointmentPayload) => Promise<unknown>;
  onCreateException: (payload: CrmScheduleExceptionPayload) => Promise<unknown>;
}) => {
  const isToday = toDateInputValue(column.day) === toDateInputValue(new Date());
  const initialStartAt = new Date(`${toDateInputValue(column.day)}T10:00:00`);

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={2}
      h={CALENDAR_HEADER_HEIGHT}
      bg={isToday ? 'yellow.50' : 'white'}
      borderRight="1px solid"
      borderBottom="1px solid"
      borderColor="blackAlpha.100"
      px={2}
      py={2}
    >
      <HStack justify="space-between" gap={3}>
        <Box minW={0}>
          <Text fontSize="sm" fontWeight="900" color="della.text" lineClamp={1}>
            {column.title}
          </Text>
          <Text fontSize="xs" color="gray.500" lineClamp={1}>
            {mode === 'day' ? formatDate(column.day) : column.subtitle}
          </Text>
        </Box>
        <HStack gap={1}>
          <ScheduleExceptionDialog
            doctors={doctors}
            initialDate={column.day}
            initialDoctorId={column.doctorId}
            isLoading={creatingException}
            onSubmit={onCreateException}
            trigger={
              <IconButton size="xs" variant="ghost" aria-label="Нова подія">
                <LuCalendarDays />
              </IconButton>
            }
          />
          <AppointmentDialog
            doctors={doctors}
            procedures={procedures}
            clients={clients}
            initialStartAt={initialStartAt}
            initialDoctorId={column.doctorId}
            availabilityStepMinutes={availabilityStepMinutes}
            isLoading={creatingAppointment}
            onSubmit={onCreate}
            trigger={
              <IconButton size="xs" variant="outline" aria-label="Новий запис">
                <LuPlus />
              </IconButton>
            }
          />
        </HStack>
      </HStack>
    </Box>
  );
};

const CalendarTimeColumn = () => (
  <Box
    position="sticky"
    left={0}
    zIndex={1}
    h={`${CALENDAR_GRID_HEIGHT}px`}
    bg="white"
    borderRight="1px solid"
    borderColor="blackAlpha.100"
  >
    {calendarHours.slice(0, -1).map((hour) => (
      <Box
        key={hour}
        h={`${CALENDAR_HOUR_HEIGHT}px`}
        borderBottom="1px solid"
        borderColor="blackAlpha.100"
        px={3}
        pt={2}
        textAlign="right"
      >
        <Text fontSize="2xs" color="gray.500">
          {String(hour).padStart(2, '0')}:00
        </Text>
      </Box>
    ))}
  </Box>
);

const CalendarColumn = ({
  column,
  mode,
  appointments,
  exceptions,
  doctors,
  procedures,
  clients,
  updatingAppointmentId,
  deletingAppointmentId,
  updatingExceptionId,
  deletingExceptionId,
  calendarScaleMinutes,
  onSelectSlot,
  onUpdate,
  onUpdateException,
  onDelete,
  onDeleteException,
}: {
  column: CalendarColumnData;
  mode: CalendarMode;
  appointments: CrmAppointment[];
  exceptions: CrmScheduleException[];
  doctors: CrmDoctor[];
  procedures: CrmProcedure[];
  clients: CrmClient[];
  updatingAppointmentId?: number;
  deletingAppointmentId?: number;
  updatingExceptionId?: number;
  deletingExceptionId?: number;
  calendarScaleMinutes: CalendarScaleMinutes;
  onSelectSlot: (draft: CalendarSlotDraft) => void;
  onUpdate: (
    id: number,
    payload: Partial<CrmAppointmentPayload>,
  ) => Promise<unknown>;
  onUpdateException: (
    id: number,
    payload: Partial<CrmScheduleExceptionPayload>,
  ) => Promise<unknown>;
  onDelete: (id: number) => void;
  onDeleteException: (id: number) => void;
}) => {
  const columnDate = toDateInputValue(column.day);
  const calendarScaleHeight =
    (calendarScaleMinutes / 60) * CALENDAR_HOUR_HEIGHT;
  const columnAppointments = appointments.filter((appointment) => {
    const isSameDay =
      toDateInputValue(new Date(appointment.startAt)) === columnDate;

    if (!isSameDay) {
      return false;
    }

    return mode === 'day' && column.doctorId
      ? appointment.doctorId === column.doctorId ||
          appointment.doctors?.some(
            (doctor) => doctor.doctorId === column.doctorId,
          )
      : true;
  });
  const columnExceptions = exceptions.filter((exception) => {
    const isSameDay = exception.date.slice(0, 10) === columnDate;

    if (!isSameDay) {
      return false;
    }

    return mode === 'day' && column.doctorId
      ? exception.doctorId === column.doctorId
      : true;
  });

  return (
    <Box
      position="relative"
      h={`${CALENDAR_GRID_HEIGHT}px`}
      borderRight="1px solid"
      borderColor="blackAlpha.100"
      bg="white"
      backgroundImage={[
        'linear-gradient(to bottom, var(--chakra-colors-blackAlpha-100) 1px, transparent 1px)',
        'linear-gradient(to bottom, var(--chakra-colors-blackAlpha-50) 1px, transparent 1px)',
      ].join(', ')}
      backgroundSize={`100% ${CALENDAR_HOUR_HEIGHT}px, 100% ${calendarScaleHeight}px`}
    >
      <CalendarSlotLayer
        column={column}
        calendarScaleMinutes={calendarScaleMinutes}
        onSelectSlot={onSelectSlot}
      />
      {columnExceptions.map((exception) => (
        <CalendarExceptionCard
          key={exception.id}
          exception={exception}
          doctors={doctors}
          compact={mode === 'week'}
          isUpdating={updatingExceptionId === exception.id}
          isDeleting={deletingExceptionId === exception.id}
          onUpdate={onUpdateException}
          onDelete={onDeleteException}
        />
      ))}
      {columnAppointments.map((appointment) => (
        <CalendarAppointmentCard
          key={appointment.id}
          appointment={appointment}
          doctors={doctors}
          procedures={procedures}
          clients={clients}
          compact={mode === 'week'}
          isUpdating={updatingAppointmentId === appointment.id}
          isDeleting={deletingAppointmentId === appointment.id}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
};

const CalendarSlotLayer = ({
  column,
  calendarScaleMinutes,
  onSelectSlot,
}: {
  column: CalendarColumnData;
  calendarScaleMinutes: CalendarScaleMinutes;
  onSelectSlot: (draft: CalendarSlotDraft) => void;
}) => {
  const slotCount =
    ((CALENDAR_END_HOUR - CALENDAR_START_HOUR) * 60) / calendarScaleMinutes;
  const slotHeight = (calendarScaleMinutes / 60) * CALENDAR_HOUR_HEIGHT;
  const slots = useMemo(
    () =>
      Array.from({ length: slotCount }, (_item, index) => {
        const startAt = getCalendarSlotStart(
          column.day,
          index * calendarScaleMinutes,
        );

        return {
          index,
          startAt,
          endAt: addMinutes(startAt, calendarScaleMinutes),
        };
      }),
    [calendarScaleMinutes, column.day, slotCount],
  );

  return (
    <Box position="absolute" inset={0} zIndex={0}>
      {slots.map((slot) => (
        <chakra.button
          key={`${column.id}-${slot.index}`}
          type="button"
          display="block"
          w="100%"
          h={`${slotHeight}px`}
          p={0}
          border={0}
          bg="transparent"
          appearance="none"
          cursor="copy"
          aria-label={`Створити у слоті ${formatDate(
            slot.startAt,
          )}, ${toTimeInputValue(slot.startAt)}`}
          _hover={{ bg: 'blackAlpha.50' }}
          _focusVisible={{
            outline: '2px solid',
            outlineColor: 'della.primary',
            outlineOffset: '-2px',
          }}
          onClick={() =>
            onSelectSlot({
              startAt: slot.startAt,
              endAt: slot.endAt,
              doctorId: column.doctorId,
            })
          }
        />
      ))}
    </Box>
  );
};

const CalendarExceptionCard = ({
  exception,
  doctors,
  compact,
  isUpdating,
  isDeleting,
  onUpdate,
  onDelete,
}: {
  exception: CrmScheduleException;
  doctors: CrmDoctor[];
  compact: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
  onUpdate: (
    id: number,
    payload: Partial<CrmScheduleExceptionPayload>,
  ) => Promise<unknown>;
  onDelete: (id: number) => void;
}) => {
  const meta = getExceptionTypeMeta(exception.type);
  const isFullDay = !exception.startTime || !exception.endTime;
  const tone =
    exception.type === 'BREAK'
      ? {
          border: 'purple.300',
          bg: 'purple.50',
          hover: 'purple.400',
          badge: 'purple',
        }
      : exception.type === 'OTHER'
        ? {
            border: 'blue.300',
            bg: 'blue.50',
            hover: 'blue.400',
            badge: 'blue',
          }
        : {
            border: 'gray.300',
            bg: 'gray.50',
            hover: 'gray.400',
            badge: 'gray',
          };

  return (
    <Box
      position="absolute"
      top={`${getScheduleExceptionOffset(exception)}px`}
      left={1.5}
      right={1.5}
      minH="32px"
      h={`${getScheduleExceptionHeight(exception)}px`}
      zIndex={1}
      overflow="hidden"
      border="1px dashed"
      borderColor={tone.border}
      borderRadius="lg"
      bg={tone.bg}
      p={1.5}
      opacity={isFullDay ? 0.86 : 1}
      boxShadow="xs"
      _hover={{ borderColor: tone.hover, boxShadow: 'sm' }}
    >
      <HStack justify="space-between" align="start" gap={2}>
        <Box minW={0}>
          <HStack gap={1} mb={1}>
            <Badge size="sm" colorPalette={tone.badge}>
              {meta?.label ?? exception.type}
            </Badge>
            {exception.startTime && exception.endTime && (
              <Text fontSize="2xs" fontWeight="900" color="della.text">
                {exception.startTime} - {exception.endTime}
              </Text>
            )}
          </HStack>
          <Text fontSize="xs" fontWeight="900" color="della.text" lineClamp={1}>
            {exception.reason || meta?.label || 'Подія календаря'}
          </Text>
          {!compact && (
            <Text fontSize="2xs" color="gray.600" lineClamp={1}>
              {exception.doctor?.name ?? `Лікар #${exception.doctorId}`}
            </Text>
          )}
        </Box>
        <HStack gap={1}>
          <ScheduleExceptionDialog
            exception={exception}
            doctors={doctors}
            isLoading={isUpdating}
            onSubmit={(payload) => onUpdate(exception.id, payload)}
            trigger={
              <IconButton size="2xs" variant="ghost" aria-label="Редагувати">
                <LuPencil />
              </IconButton>
            }
          />
          <IconButton
            size="2xs"
            variant="ghost"
            colorPalette="red"
            aria-label="Видалити подію"
            loading={isDeleting}
            onClick={() => onDelete(exception.id)}
          >
            <LuTrash2 />
          </IconButton>
        </HStack>
      </HStack>
    </Box>
  );
};

const CalendarAppointmentCard = ({
  appointment,
  doctors,
  procedures,
  clients,
  compact,
  isUpdating,
  isDeleting,
  onUpdate,
  onDelete,
}: {
  appointment: CrmAppointment;
  doctors: CrmDoctor[];
  procedures: CrmProcedure[];
  clients: CrmClient[];
  compact: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
  onUpdate: (
    id: number,
    payload: Partial<CrmAppointmentPayload>,
  ) => Promise<unknown>;
  onDelete: (id: number) => void;
}) => {
  const statusMeta = getStatusMeta(appointment.status);

  return (
    <Box
      position="absolute"
      top={`${getAppointmentOffset(appointment)}px`}
      left={1.5}
      right={1.5}
      minH="36px"
      h={`${getAppointmentHeight(appointment)}px`}
      zIndex={2}
      overflow="hidden"
      border="1px solid"
      borderColor="yellow.300"
      borderRadius="lg"
      bg="yellow.50"
      p={1.5}
      boxShadow="sm"
      _hover={{ borderColor: 'yellow.400', boxShadow: 'md' }}
    >
      <HStack justify="space-between" align="start" gap={2}>
        <Box minW={0}>
          <HStack gap={1} mb={1}>
            <Text fontSize="xs" fontWeight="900" color="della.text">
              {formatTime(appointment.startAt)}
            </Text>
            {!compact && (
              <Badge size="sm" colorPalette={statusMeta?.color ?? 'gray'}>
                {statusMeta?.label ?? appointment.status}
              </Badge>
            )}
          </HStack>
          <Text fontSize="sm" fontWeight="900" color="della.text" lineClamp={1}>
            {getAppointmentClientName(appointment)}
          </Text>
          <Text fontSize="xs" color="gray.700" lineClamp={1}>
            {getAppointmentProcedureNames(appointment)}
          </Text>
          {!compact && (
            <Text fontSize="xs" color="gray.500" lineClamp={1}>
              {getAppointmentDoctorNames(appointment)}
            </Text>
          )}
        </Box>
        <HStack gap={1}>
          <AppointmentDialog
            appointment={appointment}
            doctors={doctors}
            procedures={procedures}
            clients={clients}
            isLoading={isUpdating}
            onSubmit={(payload) => onUpdate(appointment.id, payload)}
            trigger={
              <IconButton size="2xs" variant="ghost" aria-label="Редагувати">
                <LuPencil />
              </IconButton>
            }
          />
          <IconButton
            size="2xs"
            variant="ghost"
            colorPalette="red"
            aria-label="Видалити"
            loading={isDeleting}
            onClick={() => onDelete(appointment.id)}
          >
            <LuTrash2 />
          </IconButton>
        </HStack>
      </HStack>
    </Box>
  );
};

const ClientsSection = ({
  clients,
  search,
  isFetching,
  creating,
  updatingId,
  deletingId,
  onSearchChange,
  onCreate,
  onUpdate,
  onDelete,
}: {
  clients: CrmClient[];
  search: string;
  isFetching: boolean;
  creating: boolean;
  updatingId?: number;
  deletingId?: number;
  onSearchChange: (value: string) => void;
  onCreate: (payload: CrmClientPayload) => Promise<unknown>;
  onUpdate: (
    id: number,
    payload: Partial<CrmClientPayload>,
  ) => Promise<unknown>;
  onDelete: (id: number) => void;
}) => (
  <Stack gap={4}>
    <Box
      bg="white"
      border="1px solid"
      borderColor="blackAlpha.100"
      borderRadius="2xl"
      p={{ base: 4, md: 5 }}
      boxShadow="sm"
    >
      <Flex
        align={{ base: 'stretch', md: 'center' }}
        justify="space-between"
        direction={{ base: 'column', md: 'row' }}
        gap={4}
      >
        <HStack
          w={{ base: '100%', md: '420px' }}
          border="1px solid"
          borderColor="blackAlpha.200"
          borderRadius="lg"
          px={3}
          h="42px"
        >
          <LuSearch />
          <Input
            value={search}
            border="0"
            px={0}
            placeholder="Пошук за імʼям, телефоном або email"
            onChange={(event) => {
              const { value: nextValue } = event.currentTarget;

              onSearchChange(nextValue);
            }}
          />
        </HStack>
        <ClientDialog
          isLoading={creating}
          onSubmit={onCreate}
          trigger={
            <Button bg="della.primary" color="della.text">
              <LuPlus />
              Додати клієнта
            </Button>
          }
        />
      </Flex>
    </Box>

    {isFetching && (
      <Center py={1}>
        <Spinner size="sm" color="della.primary" />
      </Center>
    )}

    <DataTable>
      <Table.Header>
        <Table.Row bg="gray.50">
          <Table.ColumnHeader>Клієнт</Table.ColumnHeader>
          <Table.ColumnHeader>Контакти</Table.ColumnHeader>
          <Table.ColumnHeader>Записи</Table.ColumnHeader>
          <Table.ColumnHeader>Оновлено</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="right">Дії</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {clients.map((client) => (
          <Table.Row key={client.id} _hover={{ bg: 'gray.50' }}>
            <Table.Cell minW="180px">
              <Text fontWeight="900" color="della.text">
                {getClientName(client)}
              </Text>
              <Text color="gray.500" fontSize="sm">
                #{client.id}
              </Text>
            </Table.Cell>
            <Table.Cell minW="220px">
              <VStack align="start" gap={1}>
                <Text>{client.phone}</Text>
                <Text fontSize="sm" color="gray.500">
                  {client.email || '-'}
                </Text>
              </VStack>
            </Table.Cell>
            <Table.Cell>{client.appointments?.length ?? 0}</Table.Cell>
            <Table.Cell>{formatDate(client.updatedAt)}</Table.Cell>
            <Table.Cell>
              <HStack justify="flex-end" gap={2}>
                <ClientDialog
                  client={client}
                  isLoading={updatingId === client.id}
                  onSubmit={(payload) => onUpdate(client.id, payload)}
                  trigger={
                    <Button size="sm" variant="outline">
                      <LuPencil />
                      Редагувати
                    </Button>
                  }
                />
                <IconButton
                  size="sm"
                  variant="outline"
                  colorPalette="red"
                  aria-label="Видалити клієнта"
                  loading={deletingId === client.id}
                  onClick={() => onDelete(client.id)}
                >
                  <LuTrash2 />
                </IconButton>
              </HStack>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </DataTable>
  </Stack>
);

const CatalogSection = ({
  doctors,
  procedures,
  categories,
  equipmentTypes,
  creatingDoctor,
  updatingDoctorId,
  deletingDoctorId,
  creatingCategory,
  updatingCategoryId,
  deletingCategoryId,
  creatingProcedure,
  updatingProcedureId,
  deletingProcedureId,
  onCreateDoctor,
  onUpdateDoctor,
  onDeleteDoctor,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  onCreateProcedure,
  onUpdateProcedure,
  onDeleteProcedure,
}: {
  doctors: CrmDoctor[];
  procedures: CrmProcedure[];
  categories: CrmProcedureCategory[];
  equipmentTypes: CrmEquipmentType[];
  creatingDoctor: boolean;
  updatingDoctorId?: number;
  deletingDoctorId?: number;
  creatingCategory: boolean;
  updatingCategoryId?: number;
  deletingCategoryId?: number;
  creatingProcedure: boolean;
  updatingProcedureId?: number;
  deletingProcedureId?: number;
  onCreateDoctor: (payload: CrmDoctorPayload) => Promise<unknown>;
  onUpdateDoctor: (
    id: number,
    payload: Partial<CrmDoctorPayload>,
  ) => Promise<unknown>;
  onDeleteDoctor: (id: number) => void;
  onCreateCategory: (payload: CrmProcedureCategoryPayload) => Promise<unknown>;
  onUpdateCategory: (
    id: number,
    payload: Partial<CrmProcedureCategoryPayload>,
  ) => Promise<unknown>;
  onDeleteCategory: (id: number) => void;
  onCreateProcedure: (payload: CrmProcedurePayload) => Promise<unknown>;
  onUpdateProcedure: (
    id: number,
    payload: Partial<CrmProcedurePayload>,
  ) => Promise<unknown>;
  onDeleteProcedure: (id: number) => void;
}) => (
  <Stack gap={5}>
    <SectionCard
      title="Лікарі"
      action={
        <DoctorDialog
          isLoading={creatingDoctor}
          onSubmit={onCreateDoctor}
          trigger={
            <Button bg="della.primary" color="della.text">
              <LuPlus />
              Додати лікаря
            </Button>
          }
        />
      }
    >
      <DataTable>
        <Table.Header>
          <Table.Row bg="gray.50">
            <Table.ColumnHeader>Лікар</Table.ColumnHeader>
            <Table.ColumnHeader>Процедури</Table.ColumnHeader>
            <Table.ColumnHeader>Статус</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Дії</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {doctors.map((doctor) => (
            <Table.Row key={doctor.id} _hover={{ bg: 'gray.50' }}>
              <Table.Cell minW="220px">
                <Text fontWeight="900" color="della.text">
                  {doctor.name}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  #{doctor.id}
                </Text>
              </Table.Cell>
              <Table.Cell>{doctor.procedures?.length ?? 0}</Table.Cell>
              <Table.Cell>
                <Badge colorPalette={doctor.isActive ? 'green' : 'gray'}>
                  {doctor.isActive ? 'Активний' : 'Неактивний'}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <HStack justify="flex-end" gap={2}>
                  <DoctorDialog
                    doctor={doctor}
                    isLoading={updatingDoctorId === doctor.id}
                    onSubmit={(payload) => onUpdateDoctor(doctor.id, payload)}
                    trigger={
                      <Button size="sm" variant="outline">
                        <LuPencil />
                        Редагувати
                      </Button>
                    }
                  />
                  <IconButton
                    size="sm"
                    variant="outline"
                    colorPalette="red"
                    aria-label="Видалити лікаря"
                    loading={deletingDoctorId === doctor.id}
                    onClick={() => onDeleteDoctor(doctor.id)}
                  >
                    <LuTrash2 />
                  </IconButton>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </DataTable>
    </SectionCard>

    <SectionCard
      title="Категорії процедур"
      action={
        <ProcedureCategoryDialog
          isLoading={creatingCategory}
          onSubmit={onCreateCategory}
          trigger={
            <Button variant="outline">
              <LuPlus />
              Додати категорію
            </Button>
          }
        />
      }
    >
      <DataTable>
        <Table.Header>
          <Table.Row bg="gray.50">
            <Table.ColumnHeader>Назва</Table.ColumnHeader>
            <Table.ColumnHeader>Slug</Table.ColumnHeader>
            <Table.ColumnHeader>Порядок</Table.ColumnHeader>
            <Table.ColumnHeader>Статус</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Дії</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {categories.map((category) => (
            <Table.Row key={category.id} _hover={{ bg: 'gray.50' }}>
              <Table.Cell fontWeight="900">{category.title}</Table.Cell>
              <Table.Cell>{category.slug}</Table.Cell>
              <Table.Cell>{category.order}</Table.Cell>
              <Table.Cell>
                <Badge colorPalette={category.isActive ? 'green' : 'gray'}>
                  {category.isActive ? 'Активна' : 'Неактивна'}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <HStack justify="flex-end" gap={2}>
                  <ProcedureCategoryDialog
                    category={category}
                    isLoading={updatingCategoryId === category.id}
                    onSubmit={(payload) =>
                      onUpdateCategory(category.id, payload)
                    }
                    trigger={
                      <Button size="sm" variant="outline">
                        <LuPencil />
                        Редагувати
                      </Button>
                    }
                  />
                  <IconButton
                    size="sm"
                    variant="outline"
                    colorPalette="red"
                    aria-label="Видалити категорію"
                    loading={deletingCategoryId === category.id}
                    onClick={() => onDeleteCategory(category.id)}
                  >
                    <LuTrash2 />
                  </IconButton>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </DataTable>
    </SectionCard>

    <SectionCard
      title="Процедури"
      action={
        <ProcedureDialog
          doctors={doctors}
          categories={categories}
          equipmentTypes={equipmentTypes}
          isLoading={creatingProcedure}
          onSubmit={onCreateProcedure}
          trigger={
            <Button bg="della.primary" color="della.text">
              <LuPlus />
              Додати процедуру
            </Button>
          }
        />
      }
    >
      <DataTable>
        <Table.Header>
          <Table.Row bg="gray.50">
            <Table.ColumnHeader>Процедура</Table.ColumnHeader>
            <Table.ColumnHeader>Категорія</Table.ColumnHeader>
            <Table.ColumnHeader>Ціна</Table.ColumnHeader>
            <Table.ColumnHeader>Час</Table.ColumnHeader>
            <Table.ColumnHeader>Статус</Table.ColumnHeader>
            <Table.ColumnHeader>Лікарі</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Дії</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {procedures.map((procedure) => (
            <Table.Row key={procedure.id} _hover={{ bg: 'gray.50' }}>
              <Table.Cell minW="240px">
                <Text fontWeight="900" color="della.text">
                  {procedure.title}
                </Text>
                <Text color="gray.500" fontSize="sm">
                  {procedure.slug || `#${procedure.id}`}
                </Text>
              </Table.Cell>
              <Table.Cell>{procedure.category?.title ?? '-'}</Table.Cell>
              <Table.Cell>{procedure.price} грн</Table.Cell>
              <Table.Cell>{procedure.time} хв</Table.Cell>
              <Table.Cell>
                <Badge colorPalette={procedure.isActive ? 'green' : 'gray'}>
                  {procedure.isActive ? 'Активна' : 'Неактивна'}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                {procedure.specialists?.length ??
                  procedure.doctors?.length ??
                  0}
              </Table.Cell>
              <Table.Cell>
                <HStack justify="flex-end" gap={2}>
                  <ProcedureDialog
                    procedure={procedure}
                    doctors={doctors}
                    categories={categories}
                    equipmentTypes={equipmentTypes}
                    isLoading={updatingProcedureId === procedure.id}
                    onSubmit={(payload) =>
                      onUpdateProcedure(procedure.id, payload)
                    }
                    trigger={
                      <Button size="sm" variant="outline">
                        <LuPencil />
                        Редагувати
                      </Button>
                    }
                  />
                  <IconButton
                    size="sm"
                    variant="outline"
                    colorPalette="red"
                    aria-label="Видалити процедуру"
                    loading={deletingProcedureId === procedure.id}
                    onClick={() => onDeleteProcedure(procedure.id)}
                  >
                    <LuTrash2 />
                  </IconButton>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </DataTable>
    </SectionCard>
  </Stack>
);

const EquipmentSection = ({
  equipmentTypes,
  equipment,
  creatingType,
  updatingTypeId,
  deletingTypeId,
  creatingEquipment,
  updatingEquipmentId,
  deletingEquipmentId,
  onCreateType,
  onUpdateType,
  onDeleteType,
  onCreateEquipment,
  onUpdateEquipment,
  onDeleteEquipment,
}: {
  equipmentTypes: CrmEquipmentType[];
  equipment: CrmEquipment[];
  creatingType: boolean;
  updatingTypeId?: number;
  deletingTypeId?: number;
  creatingEquipment: boolean;
  updatingEquipmentId?: number;
  deletingEquipmentId?: number;
  onCreateType: (payload: CrmEquipmentTypePayload) => Promise<unknown>;
  onUpdateType: (
    id: number,
    payload: Partial<CrmEquipmentTypePayload>,
  ) => Promise<unknown>;
  onDeleteType: (id: number) => void;
  onCreateEquipment: (payload: CrmEquipmentPayload) => Promise<unknown>;
  onUpdateEquipment: (
    id: number,
    payload: Partial<CrmEquipmentPayload>,
  ) => Promise<unknown>;
  onDeleteEquipment: (id: number) => void;
}) => (
  <Stack gap={5}>
    <SectionCard
      title="Типи обладнання"
      action={
        <EquipmentTypeDialog
          isLoading={creatingType}
          onSubmit={onCreateType}
          trigger={
            <Button variant="outline">
              <LuPlus />
              Додати тип
            </Button>
          }
        />
      }
    >
      <DataTable>
        <Table.Header>
          <Table.Row bg="gray.50">
            <Table.ColumnHeader>Тип</Table.ColumnHeader>
            <Table.ColumnHeader>Одиниць</Table.ColumnHeader>
            <Table.ColumnHeader>Статус</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Дії</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {equipmentTypes.map((type) => (
            <Table.Row key={type.id} _hover={{ bg: 'gray.50' }}>
              <Table.Cell minW="220px">
                <Text fontWeight="900">{type.title}</Text>
                <Text color="gray.500" fontSize="sm">
                  {type.description || '-'}
                </Text>
              </Table.Cell>
              <Table.Cell>{type.equipment?.length ?? 0}</Table.Cell>
              <Table.Cell>
                <Badge colorPalette={type.isActive ? 'green' : 'gray'}>
                  {type.isActive ? 'Активний' : 'Неактивний'}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <HStack justify="flex-end" gap={2}>
                  <EquipmentTypeDialog
                    equipmentType={type}
                    isLoading={updatingTypeId === type.id}
                    onSubmit={(payload) => onUpdateType(type.id, payload)}
                    trigger={
                      <Button size="sm" variant="outline">
                        <LuPencil />
                        Редагувати
                      </Button>
                    }
                  />
                  <IconButton
                    size="sm"
                    variant="outline"
                    colorPalette="red"
                    aria-label="Видалити тип обладнання"
                    loading={deletingTypeId === type.id}
                    onClick={() => onDeleteType(type.id)}
                  >
                    <LuTrash2 />
                  </IconButton>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </DataTable>
    </SectionCard>

    <SectionCard
      title="Обладнання"
      action={
        <EquipmentDialog
          equipmentTypes={equipmentTypes}
          isLoading={creatingEquipment}
          onSubmit={onCreateEquipment}
          trigger={
            <Button bg="della.primary" color="della.text">
              <LuPlus />
              Додати обладнання
            </Button>
          }
        />
      }
    >
      <DataTable>
        <Table.Header>
          <Table.Row bg="gray.50">
            <Table.ColumnHeader>Назва</Table.ColumnHeader>
            <Table.ColumnHeader>Тип</Table.ColumnHeader>
            <Table.ColumnHeader>Номери</Table.ColumnHeader>
            <Table.ColumnHeader>Статус</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Дії</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {equipment.map((item) => (
            <Table.Row key={item.id} _hover={{ bg: 'gray.50' }}>
              <Table.Cell minW="220px">
                <Text fontWeight="900">{item.name}</Text>
                <Text color="gray.500" fontSize="sm">
                  #{item.id}
                </Text>
              </Table.Cell>
              <Table.Cell>
                {item.equipmentType?.title ?? item.equipmentTypeId}
              </Table.Cell>
              <Table.Cell>
                <VStack align="start" gap={1}>
                  <Text>{item.serialNumber || '-'}</Text>
                  <Text color="gray.500" fontSize="sm">
                    {item.inventoryNumber || '-'}
                  </Text>
                </VStack>
              </Table.Cell>
              <Table.Cell>
                <Badge colorPalette={item.isActive ? 'green' : 'gray'}>
                  {item.isActive ? 'Активне' : 'Неактивне'}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <HStack justify="flex-end" gap={2}>
                  <EquipmentDialog
                    equipment={item}
                    equipmentTypes={equipmentTypes}
                    isLoading={updatingEquipmentId === item.id}
                    onSubmit={(payload) => onUpdateEquipment(item.id, payload)}
                    trigger={
                      <Button size="sm" variant="outline">
                        <LuPencil />
                        Редагувати
                      </Button>
                    }
                  />
                  <IconButton
                    size="sm"
                    variant="outline"
                    colorPalette="red"
                    aria-label="Видалити обладнання"
                    loading={deletingEquipmentId === item.id}
                    onClick={() => onDeleteEquipment(item.id)}
                  >
                    <LuTrash2 />
                  </IconButton>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </DataTable>
    </SectionCard>
  </Stack>
);

const ScheduleSection = ({
  doctors,
  schedules,
  exceptions,
  creatingSchedule,
  updatingScheduleId,
  deletingScheduleId,
  creatingException,
  updatingExceptionId,
  deletingExceptionId,
  onCreateSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  onCreateException,
  onUpdateException,
  onDeleteException,
}: {
  doctors: CrmDoctor[];
  schedules: CrmSpecialistSchedule[];
  exceptions: CrmScheduleException[];
  creatingSchedule: boolean;
  updatingScheduleId?: number;
  deletingScheduleId?: number;
  creatingException: boolean;
  updatingExceptionId?: number;
  deletingExceptionId?: number;
  onCreateSchedule: (payload: CrmSpecialistSchedulePayload) => Promise<unknown>;
  onUpdateSchedule: (
    id: number,
    payload: Partial<CrmSpecialistSchedulePayload>,
  ) => Promise<unknown>;
  onDeleteSchedule: (id: number) => void;
  onCreateException: (payload: CrmScheduleExceptionPayload) => Promise<unknown>;
  onUpdateException: (
    id: number,
    payload: Partial<CrmScheduleExceptionPayload>,
  ) => Promise<unknown>;
  onDeleteException: (id: number) => void;
}) => (
  <Stack gap={5}>
    <SectionCard
      title="Регулярні графіки"
      action={
        <ScheduleDialog
          doctors={doctors}
          isLoading={creatingSchedule}
          onSubmit={onCreateSchedule}
          trigger={
            <Button bg="della.primary" color="della.text">
              <LuPlus />
              Додати графік
            </Button>
          }
        />
      }
    >
      <DataTable>
        <Table.Header>
          <Table.Row bg="gray.50">
            <Table.ColumnHeader>Лікар</Table.ColumnHeader>
            <Table.ColumnHeader>День</Table.ColumnHeader>
            <Table.ColumnHeader>Час</Table.ColumnHeader>
            <Table.ColumnHeader>Статус</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Дії</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {schedules.map((schedule) => (
            <Table.Row key={schedule.id} _hover={{ bg: 'gray.50' }}>
              <Table.Cell fontWeight="900">
                {schedule.doctor?.name ?? `Лікар #${schedule.doctorId}`}
              </Table.Cell>
              <Table.Cell>{weekDays[schedule.dayOfWeek]}</Table.Cell>
              <Table.Cell>
                {schedule.startTime} - {schedule.endTime}
              </Table.Cell>
              <Table.Cell>
                <Badge colorPalette={schedule.isActive ? 'green' : 'gray'}>
                  {schedule.isActive ? 'Активний' : 'Неактивний'}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <HStack justify="flex-end" gap={2}>
                  <ScheduleDialog
                    schedule={schedule}
                    doctors={doctors}
                    isLoading={updatingScheduleId === schedule.id}
                    onSubmit={(payload) =>
                      onUpdateSchedule(schedule.id, payload)
                    }
                    trigger={
                      <Button size="sm" variant="outline">
                        <LuPencil />
                        Редагувати
                      </Button>
                    }
                  />
                  <IconButton
                    size="sm"
                    variant="outline"
                    colorPalette="red"
                    aria-label="Видалити графік"
                    loading={deletingScheduleId === schedule.id}
                    onClick={() => onDeleteSchedule(schedule.id)}
                  >
                    <LuTrash2 />
                  </IconButton>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </DataTable>
    </SectionCard>

    <SectionCard
      title="Перерви та події календаря"
      action={
        <ScheduleExceptionDialog
          doctors={doctors}
          isLoading={creatingException}
          onSubmit={onCreateException}
          trigger={
            <Button variant="outline">
              <LuCalendarDays />
              Додати подію
            </Button>
          }
        />
      }
    >
      <DataTable>
        <Table.Header>
          <Table.Row bg="gray.50">
            <Table.ColumnHeader>Лікар</Table.ColumnHeader>
            <Table.ColumnHeader>Дата</Table.ColumnHeader>
            <Table.ColumnHeader>Тип</Table.ColumnHeader>
            <Table.ColumnHeader>Час</Table.ColumnHeader>
            <Table.ColumnHeader>Причина</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Дії</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {exceptions.map((exception) => {
            const meta = getExceptionTypeMeta(exception.type);

            return (
              <Table.Row key={exception.id} _hover={{ bg: 'gray.50' }}>
                <Table.Cell fontWeight="900">
                  {exception.doctor?.name ?? `Лікар #${exception.doctorId}`}
                </Table.Cell>
                <Table.Cell>{formatDate(exception.date)}</Table.Cell>
                <Table.Cell>{meta?.label ?? exception.type}</Table.Cell>
                <Table.Cell>
                  {exception.startTime && exception.endTime
                    ? `${exception.startTime} - ${exception.endTime}`
                    : '-'}
                </Table.Cell>
                <Table.Cell>{exception.reason || '-'}</Table.Cell>
                <Table.Cell>
                  <HStack justify="flex-end" gap={2}>
                    <ScheduleExceptionDialog
                      exception={exception}
                      doctors={doctors}
                      isLoading={updatingExceptionId === exception.id}
                      onSubmit={(payload) =>
                        onUpdateException(exception.id, payload)
                      }
                      trigger={
                        <Button size="sm" variant="outline">
                          <LuPencil />
                          Редагувати
                        </Button>
                      }
                    />
                    <IconButton
                      size="sm"
                      variant="outline"
                      colorPalette="red"
                      aria-label="Видалити подію"
                      loading={deletingExceptionId === exception.id}
                      onClick={() => onDeleteException(exception.id)}
                    >
                      <LuTrash2 />
                    </IconButton>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </DataTable>
    </SectionCard>
  </Stack>
);

const SectionCard = ({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) => (
  <Box
    bg="white"
    border="1px solid"
    borderColor="blackAlpha.100"
    borderRadius="2xl"
    boxShadow="sm"
    overflow="hidden"
  >
    <Flex
      align={{ base: 'stretch', md: 'center' }}
      justify="space-between"
      direction={{ base: 'column', md: 'row' }}
      gap={3}
      p={{ base: 4, md: 5 }}
      borderBottom="1px solid"
      borderColor="blackAlpha.100"
    >
      <Text fontSize="lg" fontWeight="900" color="della.text">
        {title}
      </Text>
      {action}
    </Flex>
    {children}
  </Box>
);

const DataTable = ({ children }: { children: ReactNode }) => (
  <Box w="100%" overflowX="auto">
    <Table.Root size="sm" variant="outline">
      {children}
    </Table.Root>
  </Box>
);
