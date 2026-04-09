import type { ProjectFormValues, StageFormValues, TaskFormValues } from "@/features/projects/types/form/project-form";

export const projectFormInitialValues: ProjectFormValues = {
  name: "",
  description: "",
  code: "",
  startingDate: "",
  deadline: "",
  stages: [],
  goalLinks: [],
};

export const stageFormInitialValues: StageFormValues = {
  name: "",
  description: null,
  startingDate: "",
  deadline: null,
  status: null,
  weight: 1,
  tasks: [],
};

export const taskFormInitialValues: TaskFormValues = {
  name: "",
  description: null,
  startingDate: "",
  deadline: null,
  status: null,
  weight: 1,
};
