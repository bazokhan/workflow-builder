import { useCallback, useEffect, useState, useMemo, FormEvent } from 'react';
import { List, arrayMove } from 'react-movable';
import { WorkflowTemplateStep, WorkflowTemplateStepUpdateDTO } from './types';
import { v4 as uuid } from 'uuid';
import {
  ListItem,
  List as UIList,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox
} from '@mui/material';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import dracula from 'prism-react-renderer/themes/dracula';
import StepDetails from './components/StepDetails';

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
  const [items, setItems] = useState<WorkflowTemplateStep[]>([]);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);

  const activeStep = useMemo(
    () => items.find((step) => step.Id === activeStepId),
    [items, activeStepId]
  );

  const addItem = useCallback(() => {
    const newItem: WorkflowTemplateStep = {
      Id: uuid() as string,
      WorkflowTemplateId: uuid() as string,
      ConditionRootId: uuid() as string,
      Name: `Step #${items.length + 1}`,
      Description: '',
      BuiltinOption: 0,
      ParentId: null,
      StepOrder: items.length,
      Optional: true,
      WorkflowStepUsers: [currentUser]
    };
    setItems([...items, newItem]);
    setActiveStepId(newItem.Id);
  }, [items]);

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
          WorkflowTemplateSteps: items
        },
        null,
        2
      ),
    [items]
  );

  return (
    <div className="w-screen h-screen overflow-hidden border border-red-700 grid grid-cols-aside">
      <div>
        <button className="border border-pink-700" onClick={addItem}>
          Add item
        </button>
        <button className="border border-pink-700" onClick={toggleDebug}>
          {showDebug ? 'Close Debug' : 'Open Debug'}
        </button>
        <List
          values={items}
          onChange={({ oldIndex, newIndex }) => setItems(arrayMove(items, oldIndex, newIndex))}
          renderList={({ children, props }) => (
            <UIList className="border border-green-600" {...props}>
              {children}
            </UIList>
          )}
          renderItem={({ value, props }) => (
            <ListItem className="border border-blue-800" {...props}>
              <ListItemIcon>
                <Checkbox
                  checked={activeStep?.Id === value.Id}
                  onClick={() => setActiveStepId(value.Id)}
                />
              </ListItemIcon>
              <ListItemText id={value.Id} primary={value.Name} />
            </ListItem>
          )}
        />
      </div>
      {showDebug ? (
        <div className="bg-[#282a36] overflow-y-auto">
          <LiveProvider key={code} code={code} theme={dracula} language="json" disabled>
            <LiveEditor />
          </LiveProvider>
        </div>
      ) : (
        <div className="border border-orange-700">
          {activeStep ? (
            <StepDetails
              key={activeStepId}
              step={activeStep}
              onDelete={() => {
                setItems(items.filter((step) => step.Id !== activeStep.Id));
                setActiveStepId(null);
              }}
              onEditName={(nameInput: string) => {
                const updatedSteps = updateStep(items, activeStep.Id, {
                  Name: nameInput
                });
                setItems(updatedSteps);
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
