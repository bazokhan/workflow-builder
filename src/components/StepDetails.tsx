import { FormEvent, useState, useMemo } from "react";
import { Checkbox } from "@mui/material";
import { WorkflowTemplateStep } from "../types";

type Props = {
  step: WorkflowTemplateStep;
  onEditName: (newName: string) => void;
  onDelete: () => void;
};

const StepDetails: React.FC<Props> = ({ step, onEditName, onDelete }) => {
  const [nameInput, setNameInput] = useState(step.Name);
  const stepUsers = useMemo(
    () => step.WorkflowStepUsers,
    [step.WorkflowStepUsers]
  );
  const mandatoryUsers = stepUsers.filter((user) => !user.Optional);
  const otherUsers = stepUsers.filter((user) => user.Optional);
  return (
    <>
      <p>{step.Name}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onEditName(nameInput);
        }}
      >
        <input
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <button type="submit">Confirm</button>
        <button
          onClick={() => {
            setNameInput(step.Name);
          }}
        >
          Cancel
        </button>
      </form>
      <Checkbox checked={!step?.Optional} />
      <button onClick={onDelete}>Delete step</button>
      <p>Mandatory Users</p>
      {mandatoryUsers.length ? (
        mandatoryUsers.map((user) => (
          <p key={user.Id}>{JSON.stringify(user)}</p>
        ))
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
  );
};

export default StepDetails;
