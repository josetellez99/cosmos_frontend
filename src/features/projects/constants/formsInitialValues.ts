import type { ProjectFormSchema } from "@/features/projects/schemas/project-form-schema";
import { type StageFormSchema, type TaskFormSchema } from "@/features/projects/schemas/project-form-schema";

export const projectFormInitialValues: ProjectFormSchema = {
  name: "",
  description: "",
  code: "",
  startingDate: "",
  deadline: "",
  stages: []
};

export const stageFormInitialValues: StageFormSchema = {
  name: "",
  description: null,
  startingDate: "",
  deadline: null,
  status: null,
  weight: 1,
  tasks: [],
};

export const taskFormInitialValues: TaskFormSchema = {
  name: "",
  description: null,
  startingDate: "",
  deadline: null,
  status: null,
  weight: 1,
};
