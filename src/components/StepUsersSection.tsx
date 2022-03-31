import { Button, Select, OutlinedInput, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { WorkflowStepUser } from '../types';
import UserAvatar from './UserAvatar';

type Props = {
  users: WorkflowStepUser[];
  type: 'mandatory' | 'other';
};

const StepUsersSection: React.FC<Props> = ({ users, type }) => (
  <div className="flex flex-col">
    <div className="flex justify-between items-center px-4 py-2">
      <Button
        className="!text-[#6740bf] !border-[#6740bf] !rounded-full !font-semibold"
        variant="outlined"
        disabled
      >
        Add {type === 'mandatory' ? 'mandatory' : 'another'} contributor
      </Button>
      <p className="font-bold text-sm text-black">
        {type === 'mandatory' ? 'Mandatory' : 'Other'} contributors
      </p>
    </div>
    {users.length ? (
      users.map((user, index) => (
        <div className="grid grid-cols-3 gap-x-2 border rounded-lg py-2 mx-4">
          <div className="flex px-4 items-center gap-x-4 border-r">
            <p className="font-bold text-sm text-black">contriburor {index + 1}</p>
            <UserAvatar user={user} />
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
);

export default StepUsersSection;
