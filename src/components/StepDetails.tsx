import { useState, useMemo, useCallback } from 'react';
import { Checkbox } from '@mui/material';
import { WorkflowTemplateStep, WorkflowTemplateStepUpdateDTO } from '../types';
import { useSteps } from '../context/StepsProvider';

const updateStep = (
  originalSteps: WorkflowTemplateStep[],
  stepId: string,
  data: WorkflowTemplateStepUpdateDTO
) => {
  return originalSteps.map((step) => (step.Id === stepId ? { ...step, ...data } : step));
};

const StepDetails: React.FC = () => {
  const { activeStep, steps, setSteps, setActiveStepId } = useSteps();
  const [nameInput, setNameInput] = useState(activeStep?.Name || '');

  const stepUsers = useMemo(
    () => activeStep?.WorkflowStepUsers || [],
    [activeStep?.WorkflowStepUsers]
  );
  const mandatoryUsers = stepUsers.filter((user) => !user.Optional);
  const otherUsers = stepUsers.filter((user) => user.Optional);

  const onDelete = useCallback(() => {
    setSteps(steps.filter((s) => s.Id !== activeStep?.Id));
    setActiveStepId(null);
  }, [activeStep?.Id, setActiveStepId, setSteps, steps]);

  const onEditName = useCallback(() => {
    if (!activeStep) return;
    if (nameInput === activeStep?.Name) return;
    const updatedSteps = updateStep(steps, activeStep.Id, {
      Name: nameInput
    });
    setSteps(updatedSteps);
  }, [activeStep, nameInput, setSteps, steps]);

  return activeStep ? (
    <>
      <p>{activeStep.Name}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onEditName();
        }}
      >
        <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
        <button type="submit">Confirm</button>
        <button
          onClick={() => {
            setNameInput(activeStep.Name);
          }}
          type="button"
        >
          Cancel
        </button>
      </form>
      <Checkbox checked={!activeStep?.Optional} />
      <button onClick={onDelete} type="button">
        Delete step
      </button>
      <p>Mandatory Users</p>
      {mandatoryUsers.length ? (
        mandatoryUsers.map((user) => <p key={user.Id}>{JSON.stringify(user)}</p>)
      ) : (
        <p>No users for this step</p>
      )}
      <p>Other Users</p>
      {otherUsers.length ? (
        otherUsers.map((user) => <p key={user.Id}>{JSON.stringify(user)}</p>)
      ) : (
        <p>No users for this step</p>
      )}
    </>
  ) : (
    <p>Please select a step to view details</p>
  );
};

export default StepDetails;
