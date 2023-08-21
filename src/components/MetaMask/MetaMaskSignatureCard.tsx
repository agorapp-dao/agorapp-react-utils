import React from 'react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';

type TMetaMaskSignatureCard = {
  message: string;
  signature: string;
  address: string;
};

export const MetaMaskSignatureCard = ({ message, signature, address }: TMetaMaskSignatureCard) => {
  return (
    <Card sx={{ background: theme => theme.palette.grey.A100, width: '100%' }}>
      <CardHeader title="Signature" />
      <CardContent>
        <Typography color="text.secondary" gutterBottom>
          Message is:
        </Typography>
        <Typography color="text" gutterBottom>
          {message}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Signature is:
        </Typography>
        <Typography color="text" gutterBottom sx={{ wordBreak: 'break-word' }}>
          {signature}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Address is:
        </Typography>
        <Typography color="text" gutterBottom sx={{ wordBreak: 'break-word' }}>
          {address}
        </Typography>
      </CardContent>
    </Card>
  );
};
