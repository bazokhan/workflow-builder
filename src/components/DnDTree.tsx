import { useCallback, useState } from 'react';
import { List, arrayMove } from 'react-movable';
import {
  ListItem,
  List as UIList,
  ListItemIcon,
  ListItemText,
  Radio,
  Box,
  Avatar,
  Typography
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useSteps } from '../context/StepsProvider';

const DnDTree: React.FC = () => {
  const { steps, activeStep, setActiveStepId, setSteps } = useSteps();
  const [draggedStep, setDraggedStep] = useState<string>('');
  const [dragStarted, setDragStarted] = useState(false);

  const onDragEnd = useCallback(
    ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
      setDraggedStep('');
      setDragStarted(false);
      const movindUp = newIndex < oldIndex;
      const actualOldIndex = Math.floor(oldIndex / 2);
      const actualNewIndex = movindUp ? Math.ceil(newIndex / 2) : Math.floor(newIndex / 2);
      if (oldIndex === newIndex) return;
      const droppedAsChild = movindUp ? newIndex % 2 !== 0 : newIndex % 2 === 0;
      const parent = droppedAsChild ? steps[movindUp ? actualNewIndex - 1 : actualNewIndex] : null;
      if (parent) {
        const parentId = parent.ParentId || parent.Id;
        const newArray = steps.map((step, index) =>
          index === actualOldIndex ? { ...step, ParentId: parentId } : step
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
    },
    [setSteps, steps]
  );

  return (
    <List
      values={steps
        .map((item) => [
          { ...item, disabled: steps.find((i) => i.ParentId === item.Id) },
          { ...item, Id: `${item.Id}-children`, disabled: true }
        ])
        .flat()}
      lockVertically
      onChange={onDragEnd}
      beforeDrag={() => {
        setDragStarted(true);
      }}
      renderList={({ children, props }) => (
        <UIList className="pr-2 py-4 bg-[#f5f5f5] h-full overflow-y-auto" {...props}>
          {children}
        </UIList>
      )}
      renderItem={({ value, props, index, isDragged }) => {
        if (isDragged && draggedStep !== value.Id) {
          setDraggedStep(value.Id);
        }
        const isPlaceholder = (index || 0) % 2 !== 0;
        const isDragging = dragStarted && !!draggedStep && value.Id?.includes(draggedStep);
        const isActive = !!activeStep?.Id && value.Id?.includes(activeStep?.Id);
        const baseStyle = `mx-4 border ${value.ParentId ? 'ml-8' : ''}`;
        return isPlaceholder ? (
          <div
            key={value.Id}
            className={`${baseStyle} ${
              isDragging
                ? 'bg-transparent border-none'
                : `${isActive ? 'border-[#5c02bb] bg-white' : 'border-[#ececec] bg-white'}`
            } mb-2 h-4 rounded-b-lg border-t-transparent`}
          />
        ) : (
          <div
            key={value.Id}
            className={`${baseStyle} ${
              isDragging
                ? 'bg-[#eeeeee] shadow-lg rounded-lg pb-4'
                : 'bg-white border-b-transparent rounded-t-lg'
            } ${isActive ? 'border-[#5c02bb]' : 'border-[#ececec]'} mt-2`}
            {...props}
          >
            <ListItem>
              {value.disabled ? null : (
                <ListItemIcon data-movable-handle>
                  <DragIndicatorIcon />
                </ListItemIcon>
              )}
              <ListItemText id={value.Id} primary={`${value.Name}-${(index || 0) / 2}`} />
              <Radio
                sx={{
                  color: '#aeaeae',
                  '&.Mui-checked': {
                    color: '#5c02bb'
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: 18
                  }
                }}
                size="small"
                checked={isActive}
                onClick={() => setActiveStepId(value.Id)}
              />
            </ListItem>
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
                {value.WorkflowStepUsers?.[0].Firstname?.[0]}
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
                {value.WorkflowStepUsers?.[0].Firstname}
              </Typography>
            </Box>
          </div>
        );
      }}
    />
  );
};

export default DnDTree;
