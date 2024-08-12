"use client";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Modal,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ChainContext } from "@/components/ChainContext";
import { ethers } from "ethers";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Mint() {
  const {
    currentAccount,
    registerAddressToBank,
    mint,
    signer,
    getRequestId,
    getMinted,
    getRequest,
  } = useContext(ChainContext);
  const [value, setValue] = useState(0);

  const [inputBranchNoChange, setInputBranchNoChange] = useState("");
  const [inputAccountTypeCodeChange, setInputAccountTypeCodeChange] =
    useState("");
  const [inputAccountNoChange, setInputAccountNoChange] = useState("");
  const [minted, setMinted] = useState(true);

  const [accountRegisterCompleteOpen, setAccountRegisterCompleteOpen] =
    useState(false);
  const handleAccountRegisterCompleteOpen = () =>
    setAccountRegisterCompleteOpen(true);
  const handleAccountRegisterCompleteClose = () =>
    setAccountRegisterCompleteOpen(false);

  const [mintCompleteOpen, setMintCompleteOpen] = useState(false);
  const handleMintCompleteOpen = () => setMintCompleteOpen(true);
  const handleMintCompleteClose = () => setMintCompleteOpen(false);
  useEffect(() => {
    const isMint = async () => {
      try {
        const isMinted = await getMinted(signer, currentAccount);
        const res = await fetch(`/api/bank?address=${currentAccount}`);
        const data = await res.json();
        const hashedAccount = data.res[0].hashedAccount;
        const requestId = await getRequestId(signer, hashedAccount);
        console.log("is mint request id", Number(requestId));
        const request = await getRequest(signer, Number(requestId));
        console.log("is mint request", request);
        if (request.accountStatus === 1 && !isMinted) {
          setMinted(false);
        }
      } catch (e) {
        console.log(e);
      }
    };
    setInterval(isMint, 30000);
  }, []);

  const handleInputBranchNoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputBranchNoChange(event.target.value);
  };

  const handleInputAccountTypeCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputAccountTypeCodeChange(event.target.value);
  };

  const handleInputAccountNoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputAccountNoChange(event.target.value);
  };

  const handleRegister = async () => {
    const bankAccountToByte = ethers.utils.toUtf8Bytes(
      `${inputBranchNoChange}${inputAccountTypeCodeChange}${inputAccountNoChange}`
    );
    const hashedAccount = ethers.utils.keccak256(bankAccountToByte);

    try {
      await registerAddressToBank(signer, hashedAccount);
      const url = "/api/bank";
      // リクエストパラメータ
      const params = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // リクエストボディ
        body: JSON.stringify({
          address: currentAccount,
          hashedAccount: hashedAccount,
          branchNo: inputBranchNoChange,
          accountTypeCode: inputAccountTypeCodeChange,
          accountNo: inputAccountNoChange,
        }),
      };
      await fetch(url, params);
      setInputBranchNoChange("");
      setInputAccountTypeCodeChange("");
      setInputAccountNoChange("");
      handleAccountRegisterCompleteOpen();
    } catch (e) {
      alert(e);
    }
  };

  const mintJpyn = async () => {
    try {
      const res = await fetch(`/api/bank?address=${currentAccount}`);
      const data = await res.json();
      console.log(data.res[0].hashedAccount);
      await mint(signer, data.res[0].hashedAccount);
      setMinted(true);
      handleMintCompleteOpen();
    } catch (e) {
      alert(e);
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="h2" align="center" sx={{ mt: "20px", mb: "20px" }}>
        Mint
      </Typography>
      <Box sx={{ width: "50%", borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="REGISTER BANK ACCOUNT" {...a11yProps(0)} />
          <Tab label="MINT" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ mt: "20px", mb: "20px", width: "400px" }}
        >
          <Typography>
            Register bank account. Please ensure to register your bank account
            before Minting. You can Mint up to the balance of your registered
            bank account.
          </Typography>
          <TextField
            label="Branch No"
            variant="outlined"
            value={inputBranchNoChange}
            onChange={handleInputBranchNoChange}
            sx={{ width: "100%", mt: "20px" }}
          />
          <TextField
            label="Account Type Code"
            variant="outlined"
            value={inputAccountTypeCodeChange}
            onChange={handleInputAccountTypeCodeChange}
            sx={{ width: "100%", mt: "20px" }}
          />
          <TextField
            label="Account No"
            variant="outlined"
            value={inputAccountNoChange}
            onChange={handleInputAccountNoChange}
            sx={{ width: "100%", mt: "20px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleRegister}
            sx={{ mt: "20px" }}
          >
            REGISTER
          </Button>
        </Box>
        <Modal
          open={accountRegisterCompleteOpen}
          onClose={handleAccountRegisterCompleteClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Bank account registration completed
            </Typography>
          </Box>
        </Modal>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ mt: "20px", mb: "20px", width: "400px" }}
        >
          <Typography>
            Mint. Please ensure to register your bank account before Minting.
            You can Mint up to the balance of your registered bank account.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={mintJpyn}
            sx={{ mt: "20px" }}
            disabled={minted}
          >
            MINT
          </Button>
        </Box>
        <Modal
          open={mintCompleteOpen}
          onClose={handleMintCompleteClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Mint completed
            </Typography>
          </Box>
        </Modal>
      </CustomTabPanel>
    </Box>
  );
}
