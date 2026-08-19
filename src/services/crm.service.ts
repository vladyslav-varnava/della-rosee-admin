import { apiClient } from '@/lib/api';
import {
  CrmAppointment,
  CrmAppointmentFilters,
  CrmAppointmentPayload,
  CrmAvailability,
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
} from '@/types/crm';

export const crmService = {
  getAppointments: async (params: CrmAppointmentFilters) => {
    return apiClient.get<CrmAppointment[]>('/crm/appointments', { params });
  },

  createAppointment: async (payload: CrmAppointmentPayload) => {
    return apiClient.post<CrmAppointment, CrmAppointmentPayload>(
      '/crm/appointments',
      payload,
    );
  },

  updateAppointment: async (
    id: number,
    payload: Partial<CrmAppointmentPayload>,
  ) => {
    return apiClient.put<CrmAppointment, Partial<CrmAppointmentPayload>>(
      `/crm/appointments/${id}`,
      payload,
    );
  },

  deleteAppointment: async (id: number) => {
    return apiClient.delete<void>(`/crm/appointments/${id}`);
  },

  getAvailability: async (params: {
    procedureId: number;
    doctorId: number;
    date: string;
    stepMinutes?: number;
  }) => {
    return apiClient.get<CrmAvailability>('/crm/availability', { params });
  },

  getClients: async (search?: string) => {
    return apiClient.get<CrmClient[]>('/crm/clients', {
      params: search ? { search } : undefined,
    });
  },

  createClient: async (payload: CrmClientPayload) => {
    return apiClient.post<CrmClient, CrmClientPayload>('/crm/clients', payload);
  },

  updateClient: async (id: number, payload: Partial<CrmClientPayload>) => {
    return apiClient.put<CrmClient, Partial<CrmClientPayload>>(
      `/crm/clients/${id}`,
      payload,
    );
  },

  deleteClient: async (id: number) => {
    return apiClient.delete<void>(`/crm/clients/${id}`);
  },

  getDoctors: async () => {
    return apiClient.get<CrmDoctor[]>('/doctors');
  },

  createDoctor: async (payload: CrmDoctorPayload) => {
    return apiClient.post<CrmDoctor, CrmDoctorPayload>('/doctors', payload);
  },

  updateDoctor: async (id: number, payload: Partial<CrmDoctorPayload>) => {
    return apiClient.put<CrmDoctor, Partial<CrmDoctorPayload>>(
      `/doctors/${id}`,
      payload,
    );
  },

  deleteDoctor: async (id: number) => {
    return apiClient.delete<void>(`/doctors/${id}`);
  },

  getProcedures: async () => {
    return apiClient.get<CrmProcedure[]>('/procedures');
  },

  createProcedure: async (payload: CrmProcedurePayload) => {
    return apiClient.post<CrmProcedure, CrmProcedurePayload>(
      '/procedures',
      payload,
    );
  },

  updateProcedure: async (
    id: number,
    payload: Partial<CrmProcedurePayload>,
  ) => {
    return apiClient.put<CrmProcedure, Partial<CrmProcedurePayload>>(
      `/procedures/${id}`,
      payload,
    );
  },

  deleteProcedure: async (id: number) => {
    return apiClient.delete<void>(`/procedures/${id}`);
  },

  getProcedureCategories: async () => {
    return apiClient.get<CrmProcedureCategory[]>('/crm/procedure-categories');
  },

  createProcedureCategory: async (payload: CrmProcedureCategoryPayload) => {
    return apiClient.post<CrmProcedureCategory, CrmProcedureCategoryPayload>(
      '/crm/procedure-categories',
      payload,
    );
  },

  updateProcedureCategory: async (
    id: number,
    payload: Partial<CrmProcedureCategoryPayload>,
  ) => {
    return apiClient.put<
      CrmProcedureCategory,
      Partial<CrmProcedureCategoryPayload>
    >(`/crm/procedure-categories/${id}`, payload);
  },

  deleteProcedureCategory: async (id: number) => {
    return apiClient.delete<void>(`/crm/procedure-categories/${id}`);
  },

  getEquipmentTypes: async () => {
    return apiClient.get<CrmEquipmentType[]>('/crm/equipment-types');
  },

  createEquipmentType: async (payload: CrmEquipmentTypePayload) => {
    return apiClient.post<CrmEquipmentType, CrmEquipmentTypePayload>(
      '/crm/equipment-types',
      payload,
    );
  },

  updateEquipmentType: async (
    id: number,
    payload: Partial<CrmEquipmentTypePayload>,
  ) => {
    return apiClient.put<CrmEquipmentType, Partial<CrmEquipmentTypePayload>>(
      `/crm/equipment-types/${id}`,
      payload,
    );
  },

  deleteEquipmentType: async (id: number) => {
    return apiClient.delete<void>(`/crm/equipment-types/${id}`);
  },

  getEquipment: async (equipmentTypeId?: number) => {
    return apiClient.get<CrmEquipment[]>('/crm/equipment', {
      params: equipmentTypeId ? { equipmentTypeId } : undefined,
    });
  },

  createEquipment: async (payload: CrmEquipmentPayload) => {
    return apiClient.post<CrmEquipment, CrmEquipmentPayload>(
      '/crm/equipment',
      payload,
    );
  },

  updateEquipment: async (
    id: number,
    payload: Partial<CrmEquipmentPayload>,
  ) => {
    return apiClient.put<CrmEquipment, Partial<CrmEquipmentPayload>>(
      `/crm/equipment/${id}`,
      payload,
    );
  },

  deleteEquipment: async (id: number) => {
    return apiClient.delete<void>(`/crm/equipment/${id}`);
  },

  getSchedules: async (doctorId?: number) => {
    return apiClient.get<CrmSpecialistSchedule[]>('/crm/specialist-schedules', {
      params: doctorId ? { doctorId } : undefined,
    });
  },

  createSchedule: async (payload: CrmSpecialistSchedulePayload) => {
    return apiClient.post<CrmSpecialistSchedule, CrmSpecialistSchedulePayload>(
      '/crm/specialist-schedules',
      payload,
    );
  },

  updateSchedule: async (
    id: number,
    payload: Partial<CrmSpecialistSchedulePayload>,
  ) => {
    return apiClient.put<
      CrmSpecialistSchedule,
      Partial<CrmSpecialistSchedulePayload>
    >(`/crm/specialist-schedules/${id}`, payload);
  },

  deleteSchedule: async (id: number) => {
    return apiClient.delete<void>(`/crm/specialist-schedules/${id}`);
  },

  getScheduleExceptions: async (doctorId?: number) => {
    return apiClient.get<CrmScheduleException[]>(
      '/crm/specialist-schedules/exceptions',
      {
        params: doctorId ? { doctorId } : undefined,
      },
    );
  },

  createScheduleException: async (payload: CrmScheduleExceptionPayload) => {
    return apiClient.post<CrmScheduleException, CrmScheduleExceptionPayload>(
      '/crm/specialist-schedules/exceptions',
      payload,
    );
  },

  updateScheduleException: async (
    id: number,
    payload: Partial<CrmScheduleExceptionPayload>,
  ) => {
    return apiClient.put<
      CrmScheduleException,
      Partial<CrmScheduleExceptionPayload>
    >(`/crm/specialist-schedules/exceptions/${id}`, payload);
  },

  deleteScheduleException: async (id: number) => {
    return apiClient.delete<void>(`/crm/specialist-schedules/exceptions/${id}`);
  },
};
