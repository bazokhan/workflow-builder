import { useCallback, useEffect, useState, useMemo } from "react";
import { List, arrayMove } from "react-movable";
import { WorkflowTemplateStep } from "./types";
import { v4 as uuid } from "uuid";
import {
  ListItem,
  List as UIList,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from "@mui/material";

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
      Description: "",
      BuiltinOption: 0,
      ParentId: null,
      StepOrder: items.length,
      Optional: true,
      WorkflowStepUsers: [],
    };
    setItems([...items, newItem]);
    setActiveStepId(newItem.Id);
  }, [items]);

  const [showDebug, setShowDebug] = useState(false);

  const toggleDebug = useCallback(() => {
    setShowDebug(!showDebug);
  }, [showDebug]);

  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    setNameInput(activeStep?.Name || "");
  }, [activeStep]);

  return (
    <div className="w-screen h-screen overflow-hidden border border-red-700 grid grid-cols-aside">
      <div>
        <button className="border border-pink-700" onClick={addItem}>
          Add item
        </button>
        <button className="border border-pink-700" onClick={toggleDebug}>
          {showDebug ? "Close Debug" : "Open Debug"}
        </button>
        <List
          values={items}
          onChange={({ oldIndex, newIndex }) =>
            setItems(arrayMove(items, oldIndex, newIndex))
          }
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
        {showDebug ? (
          <p className="border border-orange-700">
            {JSON.stringify(items, null, 2)}
          </p>
        ) : null}
      </div>
      <div className="border border-orange-700">
        {activeStep ? (
          <>
            <p>{activeStep.Name}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setItems(
                  items.map((step) =>
                    step.Id === activeStep.Id
                      ? { ...step, Name: nameInput }
                      : step
                  )
                );
              }}
            >
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
              <button type="submit">Confirm</button>
              <button
                onClick={() => {
                  setNameInput(activeStep.Name);
                }}
              >
                Cancel
              </button>
            </form>
            <Checkbox checked={!activeStep?.Optional} />
            <button
              onClick={() => {
                setItems(items.filter((step) => step.Id !== activeStep.Id));
                setActiveStepId(null);
              }}
            >
              Delete step
            </button>
            {activeStep.WorkflowStepUsers.length ? (
              activeStep.WorkflowStepUsers.map((user) => (
                <p key={user.Id}>{JSON.stringify(user)}</p>
              ))
            ) : (
              <p>No users for this step</p>
            )}
          </>
        ) : (
          <p>Please select a step to view details</p>
        )}
      </div>
    </div>
  );
};

export default App;
