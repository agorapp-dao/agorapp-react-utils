import React from 'react';
import { Box, Button, Card, CardContent, CardHeader, Typography } from "@mui/material";

type TMetaMaskVerificationCard = {
  verificationStatus: boolean | undefined;
  verifyAddress: string;
  handleVerifyMessage: () => void;
};

export const MetaMaskVerificationCard = ({
  verificationStatus,
  verifyAddress,
  handleVerifyMessage,
}: TMetaMaskVerificationCard) => {
  return (
    <Card sx={{ background: theme => theme.palette.grey.A100, width: '100%' }}>
      <CardHeader title="Verification" />
      <CardContent>
        <Box sx={{ paddingBottom: 2 }}>
          <Button onClick={handleVerifyMessage}>
            Verify message
          </Button>
        </Box>
        <Typography color="text.secondary" gutterBottom>
          Verification result is:
        </Typography>
        <Typography color="text" gutterBottom>
          {verificationStatus !== null && (verificationStatus ? 'Success' : 'Failed')}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Verification address is:
        </Typography>
        <Typography color="text" gutterBottom sx={{ wordBreak: 'break-word' }}>
          {verifyAddress}
        </Typography>
      </CardContent>
    </Card>
  );
};
