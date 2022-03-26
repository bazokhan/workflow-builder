import { useCallback, useState } from "react";
import { List, arrayMove } from "react-movable";
import { WorkflowTemplateStep } from "./types";
import { v4 as uuid } from "uuid";

const App: React.FC = () => {
  const [items, setItems] = useState<WorkflowTemplateStep[]>([]);

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
  }, [items]);

  const [showDebug, setShowDebug] = useState(false);

  const toggleDebug = useCallback(() => {
    setShowDebug(!showDebug);
  }, [showDebug]);

  return (
    <div className="w-screen h-screen overflow-hidden border border-red-700">
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
          <ul className="border border-green-600" {...props}>
            {children}
          </ul>
        )}
        renderItem={({ value, props }) => (
          <li className="border border-blue-800" {...props}>
            {value.Name}
          </li>
        )}
      />
      {showDebug ? (
        <p className="border border-orange-700">
          {JSON.stringify(items, null, 2)}
        </p>
      ) : null}
    </div>
  );
};

export default App;
