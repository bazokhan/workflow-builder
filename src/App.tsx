/* eslint-disable no-nested-ternary */
import { useCallback, useState, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { LiveProvider, LiveEditor } from 'react-live';
import dracula from 'prism-react-renderer/themes/dracula';
import { WorkflowTemplateStep, WorkflowTemplateStepUpdateDTO } from './types';
import StepDetails from './components/StepDetails';
import DnDTree from './components/DnDTree';

const currentUser = {
  Id: '6ec15df4-b98f-414c-97e6-6556301bf86f',
  WorkflowStepId: '24ec985a-70c8-44e4-a88d-f06abfd65592',
  Email: '@Author',
  Firstname: 'Auteur',
  Lastname: '',
  Rights: 0,
  Optional: false,
  DisplayName: null,
  FieldId: 'b662fac3-15d5-4064-9bf1-6d8ebc44b33c',
  Conditions: [],
  ConditionNode: null
};

const updateStep = (
  originalSteps: WorkflowTemplateStep[],
  stepId: string,
  data: WorkflowTemplateStepUpdateDTO
) => {
  return originalSteps.map((step) => (step.Id === stepId ? { ...step, ...data } : step));
};

const App: React.FC = () => {
  const [steps, setSteps] = useState<WorkflowTemplateStep[]>([]);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);

  const activeStep = useMemo(
    () => steps.find((step) => step.Id === activeStepId),
    [steps, activeStepId]
  );

  const addItem = useCallback(() => {
    const newItem: WorkflowTemplateStep = {
      Id: uuid() as string,
      WorkflowTemplateId: uuid() as string,
      ConditionRootId: uuid() as string,
      Name: `Step #${steps.length + 1}`,
      Description: '',
      BuiltinOption: 0,
      ParentId: null,
      StepOrder: steps.length,
      Optional: true,
      WorkflowStepUsers: [currentUser]
    };
    setSteps([...steps, newItem]);
    setActiveStepId(newItem.Id);
  }, [steps]);

  const [showDebug, setShowDebug] = useState(false);

  const toggleDebug = useCallback(() => {
    setShowDebug(!showDebug);
  }, [showDebug]);

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

  return (
    <div className="w-screen h-screen overflow-hidden border border-red-700 grid grid-cols-aside">
      <div className="overflow-y-auto">
        <button className="border border-pink-700" type="button" onClick={addItem}>
          Add item
        </button>
        <button className="border border-pink-700" type="button" onClick={toggleDebug}>
          {showDebug ? 'Close Debug' : 'Open Debug'}
        </button>
        <DnDTree
          steps={steps}
          activeStep={activeStep}
          setSteps={setSteps}
          setActiveStepId={setActiveStepId}
        />
      </div>
      {showDebug ? (
        <div className="bg-[#282a36] overflow-y-auto max-w-full">
          <LiveProvider key={code} code={code} theme={dracula} language="json" disabled>
            <LiveEditor />
          </LiveProvider>
        </div>
      ) : (
        <div className="bg-[#282a36] overflow-y-auto max-w-full">
          {activeStep ? (
            <StepDetails
              key={activeStepId}
              step={activeStep}
              onDelete={() => {
                setSteps(steps.filter((step) => step.Id !== activeStep.Id));
                setActiveStepId(null);
              }}
              onEditName={(nameInput: string) => {
                const updatedSteps = updateStep(steps, activeStep.Id, {
                  Name: nameInput
                });
                setSteps(updatedSteps);
              }}
            />
          ) : (
            <p>Please select a step to view details</p>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
