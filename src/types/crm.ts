export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type AppointmentSource =
  'ADMIN' | 'WEBSITE' | 'PHONE' | 'INSTAGRAM' | 'WALK_IN';

export type ScheduleExceptionType =
  'DAY_OFF' | 'VACATION' | 'SICK_LEAVE' | 'CUSTOM_HOURS' | 'BREAK' | 'OTHER';

export type CrmDoctor = {
  id: number;
  name: string;
  image?: string | null;
  description?: string | null;
  isActive: boolean;
  position?: string;
  phone?: string | null;
  email?: string | null;
  isOnlineBookingAvailable?: boolean;
  procedures?: CrmProcedure[];
};

export type CrmProcedureCategory = {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CrmProcedureSpecialist = {
  id: number;
  procedureId: number;
  doctorId: number;
  customDurationMinutes?: number | null;
  customPrice?: number | null;
  isActive: boolean;
  doctor?: CrmDoctor;
};

export type CrmProcedureEquipmentRequirement = {
  id: number;
  procedureId: number;
  equipmentTypeId: number;
  quantity: number;
  equipmentType?: CrmEquipmentType;
};

export type CrmProcedure = {
  id: number;
  title: string;
  price: number;
  basePrice: number;
  description?: string | null;
  typeId: string;
  isActive: boolean;
  image?: string | null;
  time: number;
  slug?: string | null;
  shortDescription?: string | null;
  preparationMinutes: number;
  cleanupMinutes: number;
  isOnlineBookingAvailable: boolean;
  categoryId?: number | null;
  category?: CrmProcedureCategory | null;
  doctors?: CrmDoctor[];
  specialists?: CrmProcedureSpecialist[];
  equipmentRequirements?: CrmProcedureEquipmentRequirement[];
};

export type CrmClient = {
  id: number;
  userId?: number | null;
  firstName: string;
  lastName?: string | null;
  phone: string;
  email?: string | null;
  birthDate?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  appointments?: CrmAppointment[];
};

export type CrmEquipmentType = {
  id: number;
  title: string;
  description?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  equipment?: CrmEquipment[];
};

export type CrmEquipment = {
  id: number;
  name: string;
  equipmentTypeId: number;
  serialNumber?: string | null;
  inventoryNumber?: string | null;
  notes?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  equipmentType?: CrmEquipmentType;
  unavailable?: CrmEquipmentUnavailablePeriod[];
};

export type CrmEquipmentUnavailablePeriod = {
  id: number;
  equipmentId: number;
  startAt: string;
  endAt: string;
  reason: string;
  notes?: string | null;
  equipment?: CrmEquipment;
};

export type CrmSpecialistSchedule = {
  id: number;
  doctorId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  doctor?: CrmDoctor;
};

export type CrmScheduleException = {
  id: number;
  doctorId: number;
  date: string;
  startTime?: string | null;
  endTime?: string | null;
  type: ScheduleExceptionType;
  reason?: string | null;
  doctor?: CrmDoctor;
};

export type CrmAppointmentEquipment = {
  id: number;
  appointmentId: number;
  equipmentId: number;
  startAt: string;
  endAt: string;
  equipment: CrmEquipment;
};

export type CrmAppointmentProcedure = {
  id: number;
  appointmentId: number;
  procedureId: number;
  order: number;
  durationMinutes?: number | null;
  price?: number | null;
  procedure: CrmProcedure;
};

export type CrmAppointmentDoctor = {
  id: number;
  appointmentId: number;
  doctorId: number;
  doctor: CrmDoctor;
};

export type CrmAppointment = {
  id: number;
  procedureId: number;
  doctorId: number;
  clientId?: number | null;
  createdById?: number | null;
  startAt: string;
  endAt: string;
  durationMinutes: number;
  price: number;
  status: AppointmentStatus;
  source: AppointmentSource;
  clientFirstName: string;
  clientLastName?: string | null;
  clientPhone: string;
  clientEmail?: string | null;
  notes?: string | null;
  internalNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  procedure?: CrmProcedure;
  doctor?: CrmDoctor;
  procedures?: CrmAppointmentProcedure[];
  doctors?: CrmAppointmentDoctor[];
  client?: CrmClient | null;
  equipment?: CrmAppointmentEquipment[];
};

export type CrmAvailabilitySlot = {
  startAt: string;
  endAt: string;
};

export type CrmAvailability = {
  date: string;
  procedureId: number;
  doctorId: number;
  durationMinutes: number;
  slots: CrmAvailabilitySlot[];
};

export type CrmClientPayload = {
  userId?: number;
  firstName: string;
  lastName?: string;
  phone: string;
  email?: string;
  birthDate?: string;
  notes?: string;
};

export type CrmDoctorPayload = {
  name: string;
  image?: string;
  description?: string;
  isActive?: boolean;
};

export type CrmProcedureCategoryPayload = {
  title: string;
  slug: string;
  description?: string;
  order?: number;
  isActive?: boolean;
};

export type CrmProcedurePayload = {
  title: string;
  price: number;
  basePrice: number;
  time: number;
  slug?: string;
  shortDescription?: string;
  preparationMinutes?: number;
  cleanupMinutes?: number;
  isOnlineBookingAvailable?: boolean;
  isActive?: boolean;
  categoryId?: number;
  description?: string;
  image?: string;
  typeId: string;
  doctorId?: number[];
  equipmentRequirements?: Array<{
    equipmentTypeId: number;
    quantity?: number;
  }>;
};

export type CrmEquipmentTypePayload = {
  title: string;
  description?: string;
  isActive?: boolean;
};

export type CrmEquipmentPayload = {
  name: string;
  equipmentTypeId: number;
  serialNumber?: string;
  inventoryNumber?: string;
  notes?: string;
  isActive?: boolean;
};

export type CrmSpecialistSchedulePayload = {
  doctorId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive?: boolean;
};

export type CrmScheduleExceptionPayload = {
  doctorId: number;
  date: string;
  startTime?: string;
  endTime?: string;
  type: ScheduleExceptionType;
  reason?: string;
};

export type CrmAppointmentPayload = {
  procedureId: number;
  doctorId: number;
  procedureIds?: number[];
  doctorIds?: number[];
  customDurationMinutes?: number;
  clientId?: number;
  createdById?: number;
  startAt: string;
  clientFirstName: string;
  clientLastName?: string;
  clientPhone: string;
  clientEmail?: string;
  notes?: string;
  internalNotes?: string;
  status?: AppointmentStatus;
  source?: AppointmentSource;
};

export type CrmAppointmentFilters = {
  doctorId?: number;
  procedureId?: number;
  status?: AppointmentStatus;
  from?: string;
  to?: string;
};
