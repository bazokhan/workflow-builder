import { Dispatch, SetStateAction, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { useSteps } from '../context/StepsProvider';
import { WorkflowTemplateStep } from '../types';

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

type Props = {
  showDebug: boolean;
  setShowDebug: Dispatch<SetStateAction<boolean>>;
};

const SidebarHeader: React.FC<Props> = ({ showDebug, setShowDebug }) => {
  const { steps, setSteps, setActiveStepId } = useSteps();

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
  }, [setActiveStepId, setSteps, steps]);

  const toggleDebug = useCallback(() => {
    setShowDebug(!showDebug);
  }, [setShowDebug, showDebug]);

  return (
    <div>
      <button className="border border-pink-700" type="button" onClick={addItem}>
        Add item
      </button>
      <button className="border border-pink-700" type="button" onClick={toggleDebug}>
        {showDebug ? 'Close Debug' : 'Open Debug'}
      </button>
    </div>
  );
};

export default SidebarHeader;
