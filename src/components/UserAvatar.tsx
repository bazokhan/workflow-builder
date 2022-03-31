import { Box, Avatar, Typography } from '@mui/material';
import { WorkflowStepUser } from '../types';

type Props = {
  user: WorkflowStepUser;
};

const UserAvatar: React.FC<Props> = ({ user }) => (
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
);

export default UserAvatar;
