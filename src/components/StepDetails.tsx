import { useMemo } from 'react';
import { useSteps } from '../context/StepsProvider';
import StepUsersSection from './StepUsersSection';
import StepHeader from './StepHeader';

const StepDetails: React.FC = () => {
  const { activeStep } = useSteps();

  const stepUsers = useMemo(
    () => activeStep?.WorkflowStepUsers || [],
    [activeStep?.WorkflowStepUsers]
  );
  const mandatoryUsers = stepUsers.filter((user) => !user.Optional);
  const otherUsers = stepUsers.filter((user) => user.Optional);

  return activeStep ? (
    <>
      <StepHeader />
      <StepUsersSection users={mandatoryUsers} type="mandatory" />
      <StepUsersSection users={otherUsers} type="other" />
    </>
  ) : (
    <p className="text-center p-4 w-full">Please select a step to view details</p>
  );
};

export default StepDetails;
