export type Condition = {
  Title: string;
};

export type WorkflowStepUser = {
  Id: string;
  WorkflowStepId: string;
  Email: string;
  Firstname: string;
  Lastname?: string | null;
  Rights: number;
  Optional: boolean;
  DisplayName?: string | null;
  FieldId: string;
  Conditions: Condition[];
  ConditionNode?: string | null;
};

export type WorkflowTemplateStep = {
  Id: string;
  WorkflowTemplateId: string;
  ConditionRootId?: string | null;
  Name: string;
  Description?: string | null;
  BuiltinOption: number;
  ParentId?: string | null;
  StepOrder: number;
  Optional: boolean;
  WorkflowStepUsers: WorkflowStepUser[];
};

export type WorkflowTemplate = {
  Id: string;
  Name: string;
  IdTemplate: string;
  WorkflowTemplateSteps: WorkflowTemplateStep[];
};
