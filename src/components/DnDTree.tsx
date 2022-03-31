import type { Dispatch, SetStateAction } from 'react';
import { List, arrayMove } from 'react-movable';
import { ListItem, List as UIList, ListItemIcon, ListItemText, Checkbox } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { WorkflowTemplateStep } from '../types';

type Props = {
  steps: WorkflowTemplateStep[];
  activeStep?: WorkflowTemplateStep;
  setActiveStepId: Dispatch<SetStateAction<string | null>>;
  setSteps: Dispatch<SetStateAction<WorkflowTemplateStep[]>>;
};

const DnDTree: React.FC<Props> = ({ steps = [], activeStep, setActiveStepId, setSteps }) => {
  return (
    <List
      values={steps
        .map((item) => [
          { ...item, disabled: steps.find((i) => i.ParentId === item.Id) },
          { ...item, Id: `${item.Id}-children`, disabled: true }
        ])
        .flat()}
      lockVertically
      onChange={({ oldIndex, newIndex }) => {
        const actualOldIndex = Math.floor(oldIndex / 2);
        const actualNewIndex =
          newIndex < oldIndex ? Math.ceil(newIndex / 2) : Math.floor(newIndex / 2);
        if (oldIndex === newIndex) return;
        const droppedAsChild = newIndex < oldIndex ? newIndex % 2 !== 0 : newIndex % 2 === 0;
        const parent = droppedAsChild ? steps[actualNewIndex - 1] : null;
        if (parent) {
          const newArray = steps.map((step, index) =>
            index === actualOldIndex ? { ...step, ParentId: parent.Id } : step
          );
          const targetItem = newArray.find((_, index) => index === actualOldIndex);
          const targetItemChildren = newArray.filter((item) => item.ParentId === targetItem?.Id);
          if (targetItemChildren?.length) return;
          // TODO: add multiple levels of nesting
          const indicesToBeMoved = [targetItem, ...targetItemChildren].map((item) => {
            const oldIdx = newArray.findIndex((i) => i.Id === item?.Id);
            const newIdx = oldIdx + (actualNewIndex - actualOldIndex);
            return { oldIdx, newIdx };
          });
          const newStateArray = indicesToBeMoved.reduce((prev, { oldIdx, newIdx }) => {
            return arrayMove(prev, oldIdx, newIdx);
          }, newArray);
          setSteps(newStateArray);
        } else {
          const newArray = steps.map((step, index) =>
            index === actualOldIndex ? { ...step, ParentId: null } : step
          );
          setSteps(arrayMove(newArray, actualOldIndex, actualNewIndex));
        }
      }}
      renderList={({ children, props }) => (
        <UIList className="border border-green-600" {...props}>
          {children}
        </UIList>
      )}
      renderItem={({ value, props, index }) => {
        const isPlaceholder = (index || 0) % 2 !== 0;
        return isPlaceholder ? (
          <div className="h-4 bg-yellow-500" />
        ) : (
          <div className="border border-yellow-500" {...props}>
            <ListItem
              className={`border border-blue-800 ${value.disabled ? 'bg-red-400' : ''} ${
                value.ParentId ? 'ml-4' : ''
              }`}
            >
              <ListItemIcon data-movable-handle>
                <DragIndicatorIcon />
              </ListItemIcon>
              <ListItemIcon>
                <Checkbox
                  checked={activeStep?.Id === value.Id}
                  onClick={() => setActiveStepId(value.Id)}
                />
              </ListItemIcon>
              <ListItemText id={value.Id} primary={value.Name} />
            </ListItem>
          </div>
        );
      }}
    />
  );
};

export default DnDTree;
