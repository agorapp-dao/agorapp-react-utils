import React from 'react';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import { AgorAppMessageLog } from "agorapp-react-utils";

type TWindowPostMessageLogProps = {
  list: AgorAppMessageLog[];
};

export const WindowPostMessageLog = ({ list }: TWindowPostMessageLogProps) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Window PostMessage Log
      </Typography>
      <Typography color="text.secondary" gutterBottom>
        From parent point of view
      </Typography>
      <List
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          position: 'relative',
          overflow: 'auto',
          maxHeight: 700,
          '& ul': { padding: 0 },
        }}
      >
        {list.map((log, index) => (
          <React.Fragment key={log.key}>
            {index !== 0 && <Divider variant="inset" component="li" />}
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {log.direction === 'out' && <SendIcon />}
                {log.direction === 'in' && <EmailIcon />}
              </ListItemAvatar>
              <ListItemText>
                {new Date(log.time).toLocaleTimeString()}
                {' - '}
                {log.direction === 'out' && 'Send'}
                {log.direction === 'in' && 'Receive'}
                <br />
                <Typography variant="subtitle2" gutterBottom>
                  {log.message.type}
                </Typography>
                <Typography variant="caption" gutterBottom sx={{ wordWrap: 'break-word' }}>
                  {log.message.signature}
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  gutterBottom
                  sx={{ wordWrap: 'break-word' }}
                >
                  {JSON.stringify(log.message.payload)}
                </Typography>
              </ListItemText>
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};
