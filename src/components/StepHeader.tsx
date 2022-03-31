import { useState, useCallback, useEffect } from 'react';
import { Checkbox, Button, Input } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { WorkflowTemplateStep, WorkflowTemplateStepUpdateDTO } from '../types';
import { useSteps } from '../context/StepsProvider';

const updateStep = (
  originalSteps: WorkflowTemplateStep[],
  stepId: string,
  data: WorkflowTemplateStepUpdateDTO
) => {
  return originalSteps.map((step) => (step.Id === stepId ? { ...step, ...data } : step));
};

const StepHeader = () => {
  const { activeStep, steps, setSteps, setActiveStepId } = useSteps();

  const [nameInput, setNameInput] = useState(activeStep?.Name || '');

  useEffect(() => {
    setNameInput(activeStep?.Name || '');
  }, [activeStep?.Name]);

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

  return (
    <div className="grid grid-cols-2 py-4 gap-x-8">
      <div className="flex px-4 items-center gap-x-4 border rounded-lg py-2 mx-4">
        <p className="font-bold text-sm text-black">Step name</p>
        <Input
          sx={{
            border: 'none',
            padding: '4px 16px',
            borderRadius: '8px',
            fontSize: '12px',
            backgroundColor: '#e6e6e6',
            color: 'black'
          }}
          onChange={(e) => setNameInput(e.target.value)}
          value={nameInput}
        />
        {nameInput !== activeStep?.Name ? (
          <>
            <Button
              size="small"
              sx={{ backgroundColor: '#6740bf' }}
              variant="contained"
              onClick={onEditName}
            >
              Confirm
            </Button>
            <Button
              variant="text"
              sx={{ color: '#6740bf' }}
              onClick={() => {
                setNameInput(activeStep?.Name || '');
              }}
            >
              Cancel
            </Button>
          </>
        ) : null}
      </div>
      <div className="flex flex-col items-start">
        <div className="flex gap-x-1 items-center text-[12px]">
          <Checkbox disabled checked={!activeStep?.Optional} />
          <p>This step is mandarory</p>
        </div>
        <Button
          variant="text"
          sx={{ color: 'red', fontSize: '12px' }}
          startIcon={<DeleteIcon />}
          onClick={onDelete}
        >
          Delete step
        </Button>
      </div>
    </div>
  );
};

export default StepHeader;
