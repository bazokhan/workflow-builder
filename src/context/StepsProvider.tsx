import { createContext, useContext, useState, useMemo, Dispatch, SetStateAction } from 'react';
import { WorkflowTemplateStep } from '../types';

type StepsContextValue = {
  activeStep?: WorkflowTemplateStep;
  steps: WorkflowTemplateStep[];
  setActiveStepId: Dispatch<SetStateAction<string | null>>;
  setSteps: Dispatch<SetStateAction<WorkflowTemplateStep[]>>;
  code: string;
};
const StepsContext = createContext<StepsContextValue>({
  steps: [],
  setSteps: () => {},
  activeStep: undefined,
  setActiveStepId: () => {},
  code: JSON.stringify(
    {
      Id: '9162dbc5-c541-4e1b-b6c0-f81079e3eac5',
      Name: 'Avenant - workflow',
      IdTemplate: 'e9b6f68b-b195-41bf-b141-2b0a2eb7d9c1',
      WorkflowTemplateSteps: []
    },
    null,
    2
  )
});

export const useSteps = () => useContext(StepsContext);

const StepsProvider: React.FC = ({ children }) => {
  const [steps, setSteps] = useState<WorkflowTemplateStep[]>([]);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);

  const activeStep = useMemo(
    () => steps.find((step) => step.Id === activeStepId),
    [steps, activeStepId]
  );

  const code = useMemo(
    () =>
      JSON.stringify(
        {
          Id: '9162dbc5-c541-4e1b-b6c0-f81079e3eac5',
          Name: 'Avenant - workflow',
          IdTemplate: 'e9b6f68b-b195-41bf-b141-2b0a2eb7d9c1',
          WorkflowTemplateSteps: steps
        },
        null,
        2
      ),
    [steps]
  );

  const value = useMemo(
    () => ({ steps, setSteps, activeStep, setActiveStepId, code }),
    [activeStep, code, steps]
  );

  return <StepsContext.Provider value={value}>{children}</StepsContext.Provider>;
};

export default StepsProvider;
