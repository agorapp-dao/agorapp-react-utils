import React, { useEffect, useRef, useState } from 'react';
import { Button, Grid, TextField, Typography } from "@mui/material";
import { AgorAppMessage, EmbeddedEditor, useEmbeddedEditorMessage } from "agorapp-react-utils";
import {ethers} from "ethers";
import { WindowPostMessageLog } from "./MetaMask/WindowPostMessageLog";
import { MetaMaskSignatureCard } from "./MetaMask/MetaMaskSignatureCard";
import { MetaMaskVerificationCard } from "./MetaMask/MetaMaskVerificationCard";

declare const window: any;

export const ExampleMetaMask = () => {
  const [message, setMessage] = useState('');
  const [address, setAddress] = useState('');
  const [account, setAccount] = useState<string>('');
  const [publicKey, setPublicKey] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  const [verifyAddress, setVerifyAddress] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<boolean | undefined>();
  const ref = useRef<HTMLIFrameElement | null>(null);

  const handleLogout = () => {
    setAccount('');
    setPublicKey('');
  };

  const handleSign = async (message: any) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const signature = await signer.signMessage(message);
      setSignature(signature);
      setAddress(address);
      return signature;
    } catch (error) {
      console.error(error);
      return '';
    }
  };

  const verifyMessage = () => {
    const actualAddress = ethers.verifyMessage(message, signature);
    setVerifyAddress(actualAddress);
    if (actualAddress !== address) {
      setVerificationStatus(false);
    } else {
      setVerificationStatus(true);
    }
  };

  const { setIdentity, signResponse, loggerList } = useEmbeddedEditorMessage(
    async (message: AgorAppMessage) => {
      switch (message.type) {
        case "ready":
          console.log(`AgorApp IDE is ready`);
          setIdentity('metamask', publicKey);
          break;
        case "sign-request":
          console.log(`AgorApp IDE requires sign-request: `, message);
          setMessage(message.payload);
          signResponse(message.payload, await handleSign(message.payload));
          break;
      }
    },
    { ref }
  );


  const connectToMetamask = async (): Promise<string> => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.debug('MetaMask detected');
      const accounts = await window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .catch((err: any) => {
          console.log('Could not detect Account', err);
        });
      console.debug('Accounts:', JSON.stringify(accounts));
      return ethers.getAddress(accounts[0]);
    } else {
      console.log('Need to install MetaMask');
      return '';
    }
  };

  const handleLogin = async () => {
    const accountAddress = await connectToMetamask();
    setAccount(accountAddress);
    setPublicKey(accountAddress);
    setIdentity('metamask', accountAddress);
  };

  useEffect(() => {
    let isMounted = true;
    const connect = async () => {
      const accountAddress = await connectToMetamask();
      if (isMounted) {
        setAccount(accountAddress);
        setPublicKey(accountAddress);
      }
    };
    connect();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Grid container sx={{ paddingBottom: 5 }}>
        <Grid item xs>
          <Typography variant="subtitle2">With MetaMask sign message</Typography>
          {account && (
            <Typography variant="subtitle2">
              Logged in as: <strong>{account}</strong>
            </Typography>
          )}
        </Grid>
        <Grid item container xs justifyContent="flex-end" alignContent="center">
          {account ? (
            <Button onClick={handleLogout}>
              Disconnect from MetaMask
            </Button>
          ) : (
            <Button onClick={handleLogin}>
              Connect to MetaMask
            </Button>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <WindowPostMessageLog list={loggerList} />
        </Grid>
        <Grid item xs={8}>
          <EmbeddedEditor
            ref={ref}
            aspectRatio={"4:3"}
            courseSlug="solidity"
            lessonSlug={"optimized-array-sum"}
            style={{ border: "1px solid #000", borderRadius: "15px" }}
          />
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>

      <br />
      <br />
      <br />

      {account && (
        <Grid container spacing={2}>
          <Grid item container direction="column" sm={12} md={4} spacing={2}>
            <Grid item></Grid>
            <Grid item>
              <TextField
                required
                id="outlined-required"
                label="Public key"
                value={publicKey}
                onChange={e => setPublicKey(e.target.value)}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item>
              <Button onClick={() => setIdentity('metamask', publicKey)}>
                Send identity
              </Button>
            </Grid>
            <Grid item>
              <TextField
                label="Mesasge"
                value={message}
                multiline
                maxRows={8}
                onChange={e => setMessage(e.target.value)}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item>
              <Button onClick={() => handleSign(message)}>
                Sign message
              </Button>
            </Grid>
          </Grid>
          <Grid item xs container sm={12} md={4}>
            <MetaMaskSignatureCard message={message} signature={signature} address={address} />
          </Grid>
          <Grid item xs container sm={12} md={4}>
            <MetaMaskVerificationCard
              verificationStatus={verificationStatus}
              verifyAddress={verifyAddress}
              handleVerifyMessage={verifyMessage}
            />
          </Grid>
        </Grid>
      )}
    </>);
};
