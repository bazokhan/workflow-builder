import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Checkbox,
  Button,
  Box,
  Avatar,
  Typography,
  Select,
  OutlinedInput,
  MenuItem,
  Input
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
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

const StepDetails: React.FC = () => {
  const { activeStep, steps, setSteps, setActiveStepId } = useSteps();
  const [nameInput, setNameInput] = useState(activeStep?.Name || '');

  useEffect(() => {
    setNameInput(activeStep?.Name || '');
  }, [activeStep?.Name]);

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
                  setNameInput(activeStep.Name);
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
      {/* <form
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
      </form> */}

      <div className="flex flex-col">
        <div className="flex justify-between items-center px-4 py-2">
          <Button
            className="!text-[#6740bf] !border-[#6740bf] !rounded-full !font-semibold"
            variant="outlined"
            disabled
          >
            Add mandatory contributor
          </Button>
          <p className="font-bold text-sm text-black">Mandatory contributors</p>
        </div>
        {mandatoryUsers.length ? (
          mandatoryUsers.map((user, index) => (
            <div className="grid grid-cols-3 gap-x-2 border rounded-lg py-2 mx-4">
              <div className="flex px-4 items-center gap-x-4 border-r">
                <p className="font-bold text-sm text-black">contriburor {index + 1}</p>
                <Box
                  sx={{
                    display: 'flex',
                    backgroundColor: '#f1f1f1',
                    borderRadius: '10px',
                    padding: '4px 8px',
                    margin: '0 8px',
                    width: 'fit-content'
                  }}
                >
                  <Avatar
                    sx={{
                      width: '30px',
                      height: '30px',
                      color: '#5e11bc',
                      fontSize: '12px',
                      backgroundColor: '#dfd6e9'
                    }}
                  >
                    {user.Firstname?.[0]}
                  </Avatar>
                  <Typography
                    component="p"
                    sx={{
                      marginLeft: '5px',
                      color: '#61585b',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {user.Firstname}
                  </Typography>
                </Box>
              </div>
              <div className="flex px-4 items-center gap-x-4 border-r">
                <p className="text-sm text-black">Rights </p>
                <Select
                  multiple
                  value={['Completion of the form']}
                  input={<OutlinedInput label="Rights" />}
                  disabled
                  sx={{
                    backgroundColor: '#e6e6e6'
                  }}
                  inputProps={{
                    sx: {
                      padding: '8px 12px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }
                  }}
                >
                  {['Completion of the form', 'Right 2'].map((right) => (
                    <MenuItem key={right} value={right}>
                      {right}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <div className="flex px-4 items-center gap-x-4 border-r">
                <Button
                  className="!text-black"
                  sx={{ fontSize: '12px' }}
                  variant="text"
                  startIcon={<AddIcon sx={{ fontSize: '12px' }} />}
                  disabled
                >
                  Add Condition
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center p-4 w-full">No users for this step</p>
        )}
      </div>
      <div className="flex justify-between items-center px-4 py-2">
        <Button
          className="!text-[#6740bf] !border-[#6740bf] !rounded-full !font-semibold"
          variant="outlined"
          disabled
        >
          Add another contributor
        </Button>
        <p className="font-bold text-sm text-black">Other contributors</p>
      </div>
      {otherUsers.length ? (
        otherUsers.map((user, index) => (
          <div className="grid grid-cols-3 gap-x-2 border rounded-lg py-2 mx-4">
            <div className="flex px-4 items-center gap-x-4 border-r">
              <p className="font-bold text-sm text-black">contriburor {index + 1}</p>
              <Box
                sx={{
                  display: 'flex',
                  backgroundColor: '#f1f1f1',
                  borderRadius: '10px',
                  padding: '4px 8px',
                  margin: '0 8px',
                  width: 'fit-content'
                }}
              >
                <Avatar
                  sx={{
                    width: '30px',
                    height: '30px',
                    color: '#5e11bc',
                    fontSize: '12px',
                    backgroundColor: '#dfd6e9'
                  }}
                >
                  {user.Firstname?.[0]}
                </Avatar>
                <Typography
                  component="p"
                  sx={{
                    marginLeft: '5px',
                    color: '#61585b',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {user.Firstname}
                </Typography>
              </Box>
            </div>
            <div className="flex px-4 items-center gap-x-4 border-r">
              <p className="text-sm text-black">Rights </p>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={['Completion of the form']}
                input={<OutlinedInput label="Name" />}
                disabled
                sx={{
                  backgroundColor: '#e6e6e6'
                }}
                inputProps={{
                  sx: {
                    padding: '8px 12px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }
                }}
              >
                {['Completion of the form', 'Right 2'].map((right) => (
                  <MenuItem key={right} value={right}>
                    {right}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="flex px-4 items-center gap-x-4 border-r">
              <Button
                className="!text-black"
                sx={{ fontSize: '12px' }}
                variant="text"
                startIcon={<AddIcon sx={{ fontSize: '12px' }} />}
                disabled
              >
                Add Condition
              </Button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center p-4 w-full">No users for this step</p>
      )}
    </>
  ) : (
    <p className="text-center p-4 w-full">Please select a step to view details</p>
  );
};

export default StepDetails;
