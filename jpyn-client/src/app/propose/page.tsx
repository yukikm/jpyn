"use client";
import {
  Box,
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
import { redirect } from "next/navigation";

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

export default function Propose() {
  const {
    signer,
    proposeTransferFee,
    proposeAdmin,
    proposeBlackListAddress,
    proposeBankBlackList,
    isAdmin,
    currentAccount,
    getTotalVoters,
    getMinApproval,
  } = useContext(ChainContext);
  useEffect(() => {
    if (!currentAccount) {
      redirect("/");
    }
    isVoter();
    reqTotalVoters();
    reqMinApproval();
  }, []);
  const [value, setValue] = useState(0);

  const [inputTransferFeeValue, setInputTransferFeeValue] = useState("");
  const [transferFeeCompleteOpen, setTransferFeeCompleteOpen] = useState(false);
  const handleTransferFeeCompleteOpen = () => setTransferFeeCompleteOpen(true);
  const handleTransferFeeCompleteClose = () =>
    setTransferFeeCompleteOpen(false);

  const [inputAddJpynAdminValue, setInputAddJpynAdminValue] = useState("");
  const [addJpynAdminCompleteOpen, setAddJpynAdminCompleteOpen] =
    useState(false);
  const handleAddJpynAdminCompleteOpen = () =>
    setAddJpynAdminCompleteOpen(true);
  const handleAddJpynAdminCompleteClose = () =>
    setAddJpynAdminCompleteOpen(false);

  const [inputRemoveJpynAdminValue, setInputRemoveJpynAdminValue] =
    useState("");
  const [removeJpynAdminCompleteOpen, setRemoveJpynAdminCompleteOpen] =
    useState(false);
  const handleRemoveJpynAdminCompleteOpen = () =>
    setRemoveJpynAdminCompleteOpen(true);
  const handleRemoveJpynAdminCompleteClose = () =>
    setRemoveJpynAdminCompleteOpen(false);

  const [inputAddWalletBlacklistValue, setInputAddWalletBlacklistValue] =
    useState("");
  const [addWalletBlacklistCompleteOpen, setAddWalletBlacklistCompleteOpen] =
    useState(false);
  const handleAddWalletBlacklistCompleteOpen = () =>
    setAddWalletBlacklistCompleteOpen(true);
  const handleAddWalletBlacklistCompleteClose = () =>
    setAddWalletBlacklistCompleteOpen(false);

  const [inputRemoveWalletBlacklistValue, setInputRemoveWalletBlacklistValue] =
    useState("");
  const [
    removeWalletBlacklistCompleteOpen,
    setRemoveWalletBlacklistCompleteOpen,
  ] = useState(false);
  const handleRemoveWalletBlacklistCompleteOpen = () =>
    setRemoveWalletBlacklistCompleteOpen(true);
  const handleRemoveWalletBlacklistCompleteClose = () =>
    setRemoveWalletBlacklistCompleteOpen(false);

  const [inputAddBankBlacklistValue, setInputAddBankBlacklistValue] =
    useState("");
  const [addBankBlacklistCompleteOpen, setAddBankBlacklistCompleteOpen] =
    useState(false);
  const handleAddBankBlacklistCompleteOpen = () =>
    setAddBankBlacklistCompleteOpen(true);
  const handleAddBankBlacklistCompleteClose = () =>
    setAddBankBlacklistCompleteOpen(false);
  const [inputAddBankBranchNoValue, setInputAddBankBranchNoValue] =
    useState("");
  const [
    inputAddBankAccountTypeCodeValue,
    setInputAddBankAccountTypeCodeValue,
  ] = useState("");
  const [inputAddBankAccountNoCodeValue, setInputAddBankAccountNoCodeValue] =
    useState("");

  const [inputRemoveBankBranchNoValue, setInputRemoveBankBranchNoValue] =
    useState("");
  const [
    inputRemoveBankAccountTypeCodeValue,
    setInputRemoveBankAccountTypeCodeValue,
  ] = useState("");
  const [
    inputRemoveBankAccountNoCodeValue,
    setInputRemoveBankAccountNoCodeValue,
  ] = useState("");
  const [removeBankBlacklistCompleteOpen, setRemoveBankBlacklistCompleteOpen] =
    useState(false);
  const handleRemoveBankBlacklistCompleteOpen = () =>
    setRemoveBankBlacklistCompleteOpen(true);
  const handleRemoveBankBlacklistCompleteClose = () =>
    setRemoveBankBlacklistCompleteOpen(false);
  const [voter, setVoter] = useState(false);
  const [totalVoters, setTotalVoters] = useState(0);
  const [minApproval, setMinApproval] = useState(0);

  // ------------------------------------------------
  const isVoter = async () => {
    const voter = await isAdmin(signer, currentAccount);
    setVoter(voter);
  };

  const reqTotalVoters = async () => {
    const totalVoters = await getTotalVoters(signer);
    setTotalVoters(totalVoters);
  };

  const reqMinApproval = async () => {
    const minApproval = await getMinApproval(signer);
    setMinApproval(minApproval);
  };

  const handleInputTransferFeeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputTransferFeeValue(event.target.value);
  };

  const handleProposeTransferFee = async () => {
    try {
      await proposeTransferFee(signer, inputTransferFeeValue);
      setInputTransferFeeValue("");
      handleTransferFeeCompleteOpen();
    } catch (e) {
      alert(e);
    }
  };
  // ------------------------------------------------
  const handleAddJpynAdminChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputAddJpynAdminValue(event.target.value);
  };

  const handleProposeAddJpynAdmin = async () => {
    try {
      await proposeAdmin(signer, inputAddJpynAdminValue, 0);
      setInputAddJpynAdminValue("");
      handleAddJpynAdminCompleteOpen();
    } catch (e) {
      alert(e);
    }
  };

  // ------------------------------------------------
  const handleRemoveJpynAdminChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputRemoveJpynAdminValue(event.target.value);
  };

  const handleProposeRemoveJpynAdmin = async () => {
    try {
      await proposeAdmin(signer, inputRemoveJpynAdminValue, 1);
      setInputRemoveJpynAdminValue("");
      handleRemoveJpynAdminCompleteOpen();
    } catch (e) {
      alert(e);
    }
  };
  // ------------------------------------------------
  const handleAddWalletBlacklistChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputAddWalletBlacklistValue(event.target.value);
  };

  const handleProposeAddWalletBlacklist = async () => {
    try {
      await proposeBlackListAddress(signer, inputAddWalletBlacklistValue, 0);
      setInputAddWalletBlacklistValue("");
      handleAddWalletBlacklistCompleteOpen();
    } catch (e) {
      alert(e);
    }
  };

  // ------------------------------------------------
  const handleRemoveWalletBlacklistChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputRemoveWalletBlacklistValue(event.target.value);
  };

  const handleProposeRemoveWalletBlacklist = async () => {
    try {
      await proposeBlackListAddress(signer, inputRemoveWalletBlacklistValue, 1);
      setInputRemoveWalletBlacklistValue("");
      handleRemoveWalletBlacklistCompleteOpen();
    } catch (e) {
      alert(e);
    }
  };

  // ------------------------------------------------
  const handleAddBankBranchNoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputAddBankBranchNoValue(event.target.value);
  };

  const handleAddBankAccountTypeCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputAddBankAccountTypeCodeValue(event.target.value);
  };

  const handleAddBankAccountNoCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputAddBankAccountNoCodeValue(event.target.value);
  };

  const handleProposeAddBankBlacklist = async () => {
    try {
      const bankAccountToByte = ethers.utils.toUtf8Bytes(
        `${inputAddBankBranchNoValue}${inputAddBankAccountTypeCodeValue}${inputAddBankAccountNoCodeValue}`
      );
      const hashedAccount = ethers.utils.keccak256(bankAccountToByte);

      const url = "/api/blackListBank";
      // リクエストパラメータ
      const params = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // リクエストボディ
        body: JSON.stringify({
          hashedAccount: hashedAccount,
          branchNo: inputAddBankBranchNoValue,
          accountTypeCode: inputAddBankAccountTypeCodeValue,
          accountNo: inputAddBankAccountNoCodeValue,
        }),
      };
      await fetch(url, params);
      console.log("hashedAccount", hashedAccount);

      await proposeBankBlackList(signer, hashedAccount, 0);
      setInputAddBankBranchNoValue("");
      setInputAddBankAccountTypeCodeValue("");
      setInputAddBankAccountNoCodeValue("");
      handleAddBankBlacklistCompleteOpen();
    } catch (e) {
      alert(e);
    }
  };

  // ------------------------------------------------
  const handleRemoveBankBranchNoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputRemoveBankBranchNoValue(event.target.value);
  };

  const handleRemoveBankAccountTypeCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputRemoveBankAccountTypeCodeValue(event.target.value);
  };

  const handleRemoveBankAccountNoCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputRemoveBankAccountNoCodeValue(event.target.value);
  };

  const handleProposeRemoveBankBlacklist = async () => {
    try {
      const bankAccountToByte = ethers.utils.toUtf8Bytes(
        `${inputRemoveBankBranchNoValue}${inputRemoveBankAccountTypeCodeValue}${inputRemoveBankAccountNoCodeValue}`
      );
      const hashedAccount = ethers.utils.keccak256(bankAccountToByte);

      const url = "/api/blackListBank";
      // リクエストパラメータ
      const params = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // リクエストボディ
        body: JSON.stringify({
          hashedAccount: hashedAccount,
          branchNo: inputRemoveBankBranchNoValue,
          accountTypeCode: inputRemoveBankAccountTypeCodeValue,
          accountNo: inputRemoveBankAccountNoCodeValue,
        }),
      };
      await fetch(url, params);

      await proposeBankBlackList(signer, hashedAccount, 1);
      setInputRemoveBankBranchNoValue("");
      setInputRemoveBankAccountTypeCodeValue("");
      setInputRemoveBankAccountNoCodeValue("");
      handleRemoveBankBlacklistCompleteOpen();
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
        Propose
      </Typography>
      <Typography>
        Total Voters: {totalVoters} / Minimum Approval: {minApproval}
      </Typography>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        {voter ? "You are a proposer" : "You are not a proposer"}
      </Typography>
      <Box sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="TRANSFER FEE" {...a11yProps(0)} />
          <Tab label="ADD JPYN PROPOSER AND VOTER" {...a11yProps(1)} />
          <Tab label="REMOVE JPYN PROPOSER AND VOTER" {...a11yProps(2)} />
          <Tab label="ADD WALLET BLACKLIST" {...a11yProps(3)} />
          <Tab label="REMOVE WALLET BLACKLIST" {...a11yProps(4)} />
          <Tab label="ADD BANK BLACKLIST" {...a11yProps(5)} />
          <Tab label="REMOVE BANK BLACKLIST" {...a11yProps(6)} />
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
          <Typography>Propose new transfer fee for JPYN token.</Typography>
          <TextField
            label="TRANSFER FEE(ex. 10 JPYN)"
            variant="outlined"
            value={inputTransferFeeValue}
            onChange={handleInputTransferFeeChange}
            sx={{ width: "100%", mt: "20px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleProposeTransferFee}
            sx={{ mt: "20px" }}
          >
            PROPOSE
          </Button>
        </Box>
        <Modal
          open={transferFeeCompleteOpen}
          onClose={handleTransferFeeCompleteClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Proposed new transfer fee.
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
            Propose to add the wallet address as proposer and voter of JPYN
            token.
          </Typography>
          <TextField
            label="NEW WALLET ADDRESS (ex. 0x1234567890)"
            variant="outlined"
            value={inputAddJpynAdminValue}
            onChange={handleAddJpynAdminChange}
            sx={{ width: "100%", mt: "20px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleProposeAddJpynAdmin}
            sx={{ mt: "20px" }}
          >
            PROPOSE
          </Button>
        </Box>
        <Modal
          open={addJpynAdminCompleteOpen}
          onClose={handleAddJpynAdminCompleteClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Proposed new wallet address as proposer and voter of JPYN token
            </Typography>
          </Box>
        </Modal>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ mt: "20px", mb: "20px", width: "400px" }}
        >
          <Typography>
            Propose to remove the wallet address from proposer and voter of JPYN
            token.
          </Typography>
          <TextField
            label="REMOVED WALLET ADDRESS (ex. 0x1234567890)"
            variant="outlined"
            value={inputRemoveJpynAdminValue}
            onChange={handleRemoveJpynAdminChange}
            sx={{ width: "100%", mt: "20px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleProposeRemoveJpynAdmin}
            sx={{ mt: "20px" }}
          >
            PROPOSE
          </Button>
        </Box>
        <Modal
          open={removeJpynAdminCompleteOpen}
          onClose={handleRemoveJpynAdminCompleteClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Proposed remove wallet address from proposer and voter of JPYN
              token
            </Typography>
          </Box>
        </Modal>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ mt: "20px", mb: "20px", width: "400px" }}
        >
          <Typography>
            Propose to add the wallet address to the wallet blacklist.
          </Typography>
          <TextField
            label="ADD WALLET BLACKLIST (ex. 0x1234567890)"
            variant="outlined"
            value={inputAddWalletBlacklistValue}
            onChange={handleAddWalletBlacklistChange}
            sx={{ width: "100%", mt: "20px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleProposeAddWalletBlacklist}
            sx={{ mt: "20px" }}
          >
            PROPOSE
          </Button>
        </Box>
        <Modal
          open={addWalletBlacklistCompleteOpen}
          onClose={handleAddWalletBlacklistCompleteClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Proposed add wallet address to the wallet blacklist
            </Typography>
          </Box>
        </Modal>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ mt: "20px", mb: "20px", width: "400px" }}
        >
          <Typography>
            Propose remove the wallet address from the wallet blacklist.
          </Typography>
          <TextField
            label="REMOVE WALLET BLACKLIST (ex. 0x1234567890)"
            variant="outlined"
            value={inputRemoveWalletBlacklistValue}
            onChange={handleRemoveWalletBlacklistChange}
            sx={{ width: "100%", mt: "20px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleProposeRemoveWalletBlacklist}
            sx={{ mt: "20px" }}
          >
            PROPOSE
          </Button>
        </Box>
        <Modal
          open={removeWalletBlacklistCompleteOpen}
          onClose={handleRemoveWalletBlacklistCompleteClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Proposed remove wallet address from the wallet blacklist
            </Typography>
          </Box>
        </Modal>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ mt: "20px", mb: "20px", width: "400px" }}
        >
          <Typography>
            Propose to add the hashed bank account to the bank blacklist.
          </Typography>
          <TextField
            label="Branch No"
            variant="outlined"
            value={inputAddBankBranchNoValue}
            onChange={handleAddBankBranchNoChange}
            sx={{ width: "100%", mt: "20px" }}
          />
          <TextField
            label="Account Type Code"
            variant="outlined"
            value={inputAddBankAccountTypeCodeValue}
            onChange={handleAddBankAccountTypeCodeChange}
            sx={{ width: "100%", mt: "20px" }}
          />
          <TextField
            label="Account No"
            variant="outlined"
            value={inputAddBankAccountNoCodeValue}
            onChange={handleAddBankAccountNoCodeChange}
            sx={{ width: "100%", mt: "20px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleProposeAddBankBlacklist}
            sx={{ mt: "20px" }}
          >
            PROPOSE
          </Button>
        </Box>
        <Modal
          open={addBankBlacklistCompleteOpen}
          onClose={handleAddBankBlacklistCompleteClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Proposed add hashed bank account to the bank blacklist
            </Typography>
          </Box>
        </Modal>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={6}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ mt: "20px", mb: "20px", width: "400px" }}
        >
          <Typography>
            Propose to remove the hashed bank account from the bank blacklist.
          </Typography>
          <TextField
            label="Branch No"
            variant="outlined"
            value={inputRemoveBankBranchNoValue}
            onChange={handleRemoveBankBranchNoChange}
            sx={{ width: "100%", mt: "20px" }}
          />
          <TextField
            label="Account Type Code"
            variant="outlined"
            value={inputRemoveBankAccountTypeCodeValue}
            onChange={handleRemoveBankAccountTypeCodeChange}
            sx={{ width: "100%", mt: "20px" }}
          />
          <TextField
            label="Account No"
            variant="outlined"
            value={inputRemoveBankAccountNoCodeValue}
            onChange={handleRemoveBankAccountNoCodeChange}
            sx={{ width: "100%", mt: "20px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleProposeRemoveBankBlacklist}
            sx={{ mt: "20px" }}
          >
            PROPOSE
          </Button>
        </Box>
        <Modal
          open={removeBankBlacklistCompleteOpen}
          onClose={handleRemoveBankBlacklistCompleteClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Proposed remove hashed bank account from the bank blacklist
            </Typography>
          </Box>
        </Modal>
      </CustomTabPanel>
    </Box>
  );
}
