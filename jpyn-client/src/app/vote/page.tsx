"use client";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Modal,
  Card,
  CardContent,
  CardActions,
  Container,
  useTheme,
  Paper,
} from "@mui/material";
import { use, useContext, useEffect, useState } from "react";
import { ChainContext } from "@/components/ChainContext";
import { redirect } from "next/navigation";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "#3f51b5",
  boxShadow: 24,
  color: "white",
  p: 6,
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

type TransferFee = {
  proposedTransferFee: number;
  proposer: string;
  approvalCount: number;
  rejectCount: number;
  status: number;
};

type AddAdmin = {
  proposedAdmin: string;
  proposer: string;
  approvalCount: number;
  rejectCount: number;
  status: number;
};

type RemoveAdmin = {
  proposedRemovedAdmin: string;
  proposer: string;
  approvalCount: number;
  rejectCount: number;
  status: number;
};

type AddWalletBlacklist = {
  proposedBlackListAddress: string;
  proposer: string;
  approvalCount: number;
  rejectCount: number;
  status: number;
};

type RemoveWalletBlacklist = {
  proposedRemoveBlackListAddress: string;
  proposer: string;
  approvalCount: number;
  rejectCount: number;
  status: number;
};

type AddBankBlackList = {
  branchNo: string;
  accountTypeCode: string;
  accountNo: string;
  proposedBankBlackList: string;
  proposer: string;
  approvalCount: number;
  rejectCount: number;
  status: number;
};

type RemoveBankBlackList = {
  branchNo: string;
  accountTypeCode: string;
  accountNo: string;
  proposedRemoveBankBlackList: string;
  proposer: string;
  approvalCount: number;
  rejectCount: number;
  status: number;
};

export default function Propose() {
  const {
    currentAccount,
    isAdmin,
    getTotalVoters,
    getMinApproval,
    signer,
    getCurrentProposedTransferFeeId,
    getProposedTransferFee,
    voteProposedTransferFee,
    getCurrentProposedAdminId,
    getProposedAdmin,
    voteProposedAdmin,
    getCurrentProposedBlackListAddressId,
    getProposedBlackListAddress,
    voteProposedBlackListAddress,
    getProposedRemoveBlackListAddress,
    getCurrentBankBlackListId,
    getProposedBankBlackList,
    voteProposedBankBlackList,
    getProposedRemoveBankBlackList,
    getProposedRemovedAdmin,
  } = useContext(ChainContext);
  const [value, setValue] = useState(0);
  const theme = useTheme();
  useEffect(() => {
    if (!currentAccount) {
      redirect("/");
    }
    getProposedTransferFees();
    getProposedAddAdmin();
    getProposedRemoveAdmin();
    getProposedAddWalletBlackList();
    getProposedRemoveWalletBlackList();
    getProposedAddBankBlackList();
    getProposedRemoveBankBlackLists();
    isVoter();
    reqTotalVoters();
    reqMinApproval();
  }, []);

  const [proposedTransferFees, setProposedTransferFees] = useState<
    TransferFee[]
  >([]);
  const [transferFeeVotedOpen, setTransferFeeVotedOpen] = useState(false);
  const handleTransferFeeVotedOpen = () => setTransferFeeVotedOpen(true);
  const handleTransferFeeVotedClose = () => setTransferFeeVotedOpen(false);
  // ------------------------------------------------
  const [proposedAddAdmin, setProposedAddAdmin] = useState<AddAdmin[]>([]);
  const [addAdminVotedOpen, setAddAdminVotedOpen] = useState(false);
  const handleAddAdminVotedOpen = () => setAddAdminVotedOpen(true);
  const handleAddAdminVotedClose = () => setAddAdminVotedOpen(false);
  // ------------------------------------------------
  const [proposedRemoveAdmin, setProposedRemoveAdmin] = useState<RemoveAdmin[]>(
    []
  );
  const [removeAdminVotedOpen, setRemoveAdminVotedOpen] = useState(false);
  const handleRemoveAdminVotedOpen = () => setRemoveAdminVotedOpen(true);
  const handleRemoveAdminVotedClose = () => setRemoveAdminVotedOpen(false);
  // ------------------------------------------------
  const [proposedAddWalletBlackList, setProposedAddWalletBlackList] = useState<
    AddWalletBlacklist[]
  >([]);
  const [addWalletBlackListVotedOpen, setAddWalletBlackListVotedOpen] =
    useState(false);
  const handleAddWalletBlackListVotedOpen = () =>
    setAddWalletBlackListVotedOpen(true);
  const handleAddWalletBlackListVotedClose = () =>
    setAddWalletBlackListVotedOpen(false);
  // ------------------------------------------------
  const [proposedRemoveWalletBlackList, setProposedRemoveWalletBlackList] =
    useState<RemoveWalletBlacklist[]>([]);
  const [removeWalletBlackListVotedOpen, setRemoveWalletBlackListVotedOpen] =
    useState(false);
  const handleRemoveWalletBlackListVotedOpen = () =>
    setRemoveWalletBlackListVotedOpen(true);
  const handleRemoveWalletBlackListVotedClose = () =>
    setRemoveWalletBlackListVotedOpen(false);
  // ------------------------------------------------
  const [proposedAddBankBlackList, setProposedAddBankBlackList] = useState<
    AddBankBlackList[]
  >([]);
  const [addBankBlackListVotedOpen, setAddBankBlackListVotedOpen] =
    useState(false);
  const handleAddBankBlackListVotedOpen = () =>
    setAddBankBlackListVotedOpen(true);
  const handleAddBankBlackListVotedClose = () =>
    setAddBankBlackListVotedOpen(false);
  // ------------------------------------------------
  const [proposedRemoveBankBlackList, setProposedRemoveBankBlackList] =
    useState<RemoveBankBlackList[]>([]);
  const [removeBankBlackListVotedOpen, setRemoveBankBlackListVotedOpen] =
    useState(false);
  const handleRemoveBankBlackListVotedOpen = () =>
    setRemoveBankBlackListVotedOpen(true);
  const handleRemoveBankBlackListVotedClose = () =>
    setRemoveBankBlackListVotedOpen(false);

  // ------------------------------------------------
  const [voter, setVoter] = useState(false);
  const [totalVoters, setTotalVoters] = useState(0);
  const [minApproval, setMinApproval] = useState(0);

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

  const getProposedTransferFees = async () => {
    const currentTransferFeeId = await getCurrentProposedTransferFeeId(signer);
    let proposedTransferFees = [];
    for (let i = 0; i < currentTransferFeeId; i++) {
      const transferFee = await getProposedTransferFee(signer, i);
      proposedTransferFees.push(transferFee);
    }
    setProposedTransferFees(proposedTransferFees);
    return proposedTransferFees;
  };

  const vProposedTransferFee = async (id: number, vote: boolean) => {
    try {
      await voteProposedTransferFee(signer, id, vote);
      handleTransferFeeVotedOpen();
    } catch (e) {
      alert(e);
    }
  };
  // ------------------------------------------------
  const getProposedAddAdmin = async () => {
    const currentAddAdminId = await getCurrentProposedAdminId(signer, 0);
    let proposedAddAdmin = [];
    for (let i = 0; i < currentAddAdminId; i++) {
      const addAdmin = await getProposedAdmin(signer, i);
      proposedAddAdmin.push(addAdmin);
    }
    setProposedAddAdmin(proposedAddAdmin);
    return proposedAddAdmin;
  };

  const vProposedAddAdmin = async (id: number, vote: boolean) => {
    try {
      await voteProposedAdmin(signer, id, vote, 0);
      handleAddAdminVotedOpen();
    } catch (e) {
      alert(e);
    }
  };

  // ------------------------------------------------
  const getProposedRemoveAdmin = async () => {
    const currentRemoveAdminId = await getCurrentProposedAdminId(signer, 1);
    let proposedRemoveAdmin = [];
    for (let i = 0; i < currentRemoveAdminId; i++) {
      const removeAdmin = await getProposedRemovedAdmin(signer, i);
      proposedRemoveAdmin.push(removeAdmin);
    }
    setProposedRemoveAdmin(proposedRemoveAdmin);
    return proposedRemoveAdmin;
  };

  const vProposedRemoveAdmin = async (id: number, vote: boolean) => {
    try {
      await voteProposedAdmin(signer, id, vote, 1);
      handleRemoveAdminVotedOpen();
    } catch (e) {
      alert(e);
    }
  };

  // ------------------------------------------------
  const getProposedAddWalletBlackList = async () => {
    const currentBlackListAddressId =
      await getCurrentProposedBlackListAddressId(signer, 0);
    let proposedBlackListAddresses = [];
    for (let i = 0; i < currentBlackListAddressId; i++) {
      const address = await getProposedBlackListAddress(signer, i);
      proposedBlackListAddresses.push(address);
    }
    setProposedAddWalletBlackList(proposedBlackListAddresses);
    return proposedBlackListAddresses;
  };

  const vProposedAddWalletBlackList = async (id: number, vote: boolean) => {
    try {
      await voteProposedBlackListAddress(signer, id, vote, 0);
      handleAddWalletBlackListVotedOpen();
    } catch (e) {
      alert(e);
    }
  };
  const getProposedRemoveWalletBlackList = async () => {
    const currentBlackListAddressId =
      await getCurrentProposedBlackListAddressId(signer, 1);
    let proposedBlackListAddresses = [];
    for (let i = 0; i < currentBlackListAddressId; i++) {
      const address = await getProposedRemoveBlackListAddress(signer, i);
      proposedBlackListAddresses.push(address);
    }
    setProposedRemoveWalletBlackList(proposedBlackListAddresses);
    return proposedBlackListAddresses;
  };

  const vProposedRemoveWalletBlackList = async (id: number, vote: boolean) => {
    try {
      await voteProposedBlackListAddress(signer, id, vote, 1);
      handleRemoveWalletBlackListVotedOpen();
    } catch (e) {
      alert(e);
    }
  };
  // ------------------------------------------------
  const getProposedAddBankBlackList = async () => {
    const currentBlackListId = await getCurrentBankBlackListId(signer, 0);
    let proposedBlackLists = [];

    for (let i = 0; i < currentBlackListId; i++) {
      const account = await getProposedBankBlackList(signer, i);
      if (account[0] === "") {
        continue;
      }
      const res = await fetch(`/api/blackListBank?hashedAccount=${account[0]}`);
      const data = await res.json();

      proposedBlackLists.push({
        proposer: account.proposer,
        approvalCount: account.approvalCount,
        rejectCount: account.rejectCount,
        status: account.status,
        proposedBankBlackList: account.proposedBankBlackList,
        branchNo: data.res[0].branchNo,
        accountTypeCode: data.res[0].accountTypeCode,
        accountNo: data.res[0].accountNo,
      });
    }
    setProposedAddBankBlackList(proposedBlackLists);
    return proposedBlackLists;
  };

  const vProposedAddBankBlackList = async (id: number, vote: boolean) => {
    try {
      await voteProposedBankBlackList(signer, id, vote, 0);
      handleAddBankBlackListVotedOpen();
    } catch (e) {
      alert(e);
    }
  };
  // ------------------------------------------------
  const getProposedRemoveBankBlackLists = async () => {
    const currentBlackListId = await getCurrentBankBlackListId(signer, 1);
    let proposedBlackLists = [];
    for (let i = 0; i < currentBlackListId; i++) {
      const account = await getProposedRemoveBankBlackList(signer, i);
      if (account[0] === "") {
        continue;
      }
      const res = await fetch(`/api/blackListBank?hashedAccount=${account[0]}`);
      const data = await res.json();
      proposedBlackLists.push({
        proposer: account.proposer,
        approvalCount: account.approvalCount,
        rejectCount: account.rejectCount,
        status: account.status,
        proposedRemoveBankBlackList: account.proposedRemoveBankBlackList,
        branchNo: data.res[0].branchNo,
        accountTypeCode: data.res[0].accountTypeCode,
        accountNo: data.res[0].accountNo,
      });
    }
    setProposedRemoveBankBlackList(proposedBlackLists);
    return proposedBlackLists;
  };

  const vProposedRemoveBankBlackList = async (id: number, vote: boolean) => {
    try {
      await voteProposedBankBlackList(signer, id, vote, 1);
      handleRemoveBankBlackListVotedOpen();
    } catch (e) {
      alert(e);
    }
  };

  // ---------------------------------
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Paper
        elevation={0}
        sx={{
          width: "500px",
          backgroundColor: theme.palette.primary.main,
          padding: "20px",
          margin: "20px auto",
        }}
      >
        <Typography
          variant="h2"
          align="center"
          sx={{ mb: "20px", color: "white" }}
        >
          Vote
        </Typography>
        <Typography align="center" sx={{ color: "white", fontWeight: "bold" }}>
          Total Voters: {totalVoters} / Minimum Approval: {minApproval}
        </Typography>
        <Typography align="center" sx={{ color: "white" }}>
          If the proposal is approved by more than Minimum Approval, the
          proposal will be approved and automatically reflected in the JPYN
          contract. Conversely, if there is more than Minimum Approval, the
          proposal will be rejected.
        </Typography>
      </Paper>

      <Box sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="TRANSFER FEE" {...a11yProps(0)} />
          <Tab label="ADD JPYN PROPOSER/VOTER" {...a11yProps(1)} />
          <Tab label="REMOVE JPYN PROPOSER/VOTER" {...a11yProps(2)} />
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
        >
          <Paper
            elevation={0}
            sx={{
              width: "500px",
              backgroundColor: theme.palette.primary.main,
              padding: "20px",
              margin: "auto",
            }}
          >
            <Typography
              align="center"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              TRANSFER FEE
            </Typography>
            <Typography align="center" sx={{ color: "white" }}>
              Propose new transfer fee for JPYN token. The remittance fee is
              paid by the sender to the proposer/voter of the JPYN contract each
              time the JPYN tokens are remitted.
            </Typography>
          </Paper>
          {proposedTransferFees!.map((_transferFee, _index) => {
            return (
              <Card
                sx={{
                  width: 300,
                  mt: "10px",
                  boxShadow: "none",
                  padding: "20px",
                  border: "2px solid",
                  borderColor: theme.palette.primary.main,
                  backgroundColor: "transparent",
                }}
                key={_index}
              >
                <CardContent>
                  {Number(_transferFee.status) === 0 ? (
                    <></>
                  ) : (
                    <Typography
                      gutterBottom
                      variant="h4"
                      component="div"
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: theme.palette.primary.main,
                      }}
                    >
                      Ended
                    </Typography>
                  )}
                  <Typography
                    gutterBottom
                    variant="h4"
                    component="div"
                    sx={{
                      textAlign: "center",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                    }}
                  >
                    {Number(_transferFee.proposedTransferFee)} JPYN
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography color="green" sx={{ mr: "5px" }}>
                      AGREE {Number(_transferFee.approvalCount)}
                    </Typography>

                    <Typography color="error" sx={{ ml: "5px" }}>
                      DISAGREE {Number(_transferFee.rejectCount)}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions style={{ justifyContent: "center" }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() => vProposedTransferFee(_index, true)}
                    disabled={Number(_transferFee.status) !== 0}
                    sx={{ mr: "5px", width: "90px" }}
                  >
                    Agree
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => vProposedTransferFee(_index, false)}
                    disabled={Number(_transferFee.status) !== 0}
                    sx={{ ml: "5px", width: "90px" }}
                  >
                    Disagree
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </Box>
        <Modal
          open={transferFeeVotedOpen}
          onClose={handleTransferFeeVotedClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Voted successfully!
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
        >
          <Paper
            elevation={0}
            sx={{
              width: "500px",
              backgroundColor: theme.palette.primary.main,
              padding: "20px",
              margin: "auto",
            }}
          >
            <Typography
              align="center"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              ADD JPYN PROPOSER AND VOTER
            </Typography>
            <Typography align="center" sx={{ color: "white" }}>
              Propose to add the wallet address as proposer and voter of JPYN
              contract.
            </Typography>
          </Paper>
          {proposedAddAdmin!.map((_admin, _index) => {
            return (
              <Card
                sx={{
                  maxWidth: 500,
                  mt: "10px",
                  boxShadow: "none",
                  padding: "20px",
                  border: "2px solid",
                  borderColor: theme.palette.primary.main,
                  backgroundColor: "transparent",
                }}
                key={_index}
              >
                <CardContent>
                  {Number(_admin.status) === 0 ? (
                    <></>
                  ) : (
                    <Typography
                      gutterBottom
                      variant="h4"
                      component="div"
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: theme.palette.primary.main,
                      }}
                    >
                      Ended
                    </Typography>
                  )}
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                      textAlign: "center",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                    }}
                  >
                    {String(_admin.proposedAdmin)}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography color="green" sx={{ mr: "5px" }}>
                      AGREE {Number(_admin.approvalCount)}
                    </Typography>

                    <Typography color="error" sx={{ ml: "5px" }}>
                      DISAGREE {Number(_admin.rejectCount)}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions style={{ justifyContent: "center" }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() => vProposedAddAdmin(_index, true)}
                    disabled={Number(_admin.status) !== 0}
                    sx={{ mr: "5px", width: "90px" }}
                  >
                    Agree
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => vProposedAddAdmin(_index, false)}
                    disabled={Number(_admin.status) !== 0}
                    sx={{ ml: "5px", width: "90px" }}
                  >
                    Disagree
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </Box>
        <Modal
          open={addAdminVotedOpen}
          onClose={handleAddAdminVotedClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Voted successfully!
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
        >
          <Paper
            elevation={0}
            sx={{
              width: "500px",
              backgroundColor: theme.palette.primary.main,
              padding: "20px",
              margin: "auto",
            }}
          >
            <Typography
              align="center"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              REMOVE JPYN PROPOSER AND VOTER
            </Typography>
            <Typography align="center" sx={{ color: "white" }}>
              Propose to remove the wallet address from proposer and voter of
              JPYN contract.
            </Typography>
          </Paper>
          {proposedRemoveAdmin!.map((_admin, _index) => {
            return (
              <Card
                sx={{
                  maxWidth: 500,
                  mt: "10px",
                  boxShadow: "none",
                  padding: "20px",
                  border: "2px solid",
                  borderColor: theme.palette.primary.main,
                  backgroundColor: "transparent",
                }}
                key={_index}
              >
                <CardContent>
                  {Number(_admin.status) === 0 ? (
                    <></>
                  ) : (
                    <Typography
                      gutterBottom
                      variant="h4"
                      component="div"
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: theme.palette.primary.main,
                      }}
                    >
                      Ended
                    </Typography>
                  )}
                  <Typography
                    gutterBottom
                    variant="h6"
                    sx={{
                      textAlign: "center",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                    }}
                  >
                    {String(_admin.proposedRemovedAdmin)}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography color="green" sx={{ mr: "5px" }}>
                      AGREE {Number(_admin.approvalCount)}
                    </Typography>

                    <Typography color="error" sx={{ ml: "5px" }}>
                      DISAGREE {Number(_admin.rejectCount)}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions style={{ justifyContent: "center" }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() => vProposedRemoveAdmin(_index, true)}
                    disabled={Number(_admin.status) !== 0}
                    sx={{ mr: "5px", width: "90px" }}
                  >
                    Agree
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => vProposedRemoveAdmin(_index, false)}
                    disabled={Number(_admin.status) !== 0}
                    sx={{ ml: "5px", width: "90px" }}
                  >
                    Disagree
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </Box>
        <Modal
          open={removeAdminVotedOpen}
          onClose={handleRemoveAdminVotedClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Voted successfully!
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
        >
          <Paper
            elevation={0}
            sx={{
              width: "500px",
              backgroundColor: theme.palette.primary.main,
              padding: "20px",
              margin: "auto",
            }}
          >
            <Typography
              align="center"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              ADD WALLET BLACKLIST
            </Typography>
            <Typography align="center" sx={{ color: "white" }}>
              Propose to add the wallet address to the wallet blacklist.
              Blacklisted wallet addresses cannot transfer JPYN tokens or
              propose/vote on JPYN contracts.
            </Typography>
          </Paper>
          {proposedAddWalletBlackList!.map((_blacklist, _index) => {
            return (
              <Card
                sx={{
                  maxWidth: 500,
                  mt: "10px",
                  boxShadow: "none",
                  padding: "20px",
                  border: "2px solid",
                  borderColor: theme.palette.primary.main,
                  backgroundColor: "transparent",
                }}
                key={_index}
              >
                <CardContent>
                  {Number(_blacklist.status) === 0 ? (
                    <></>
                  ) : (
                    <Typography
                      gutterBottom
                      variant="h4"
                      component="div"
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: theme.palette.primary.main,
                      }}
                    >
                      Ended
                    </Typography>
                  )}
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                      textAlign: "center",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                    }}
                  >
                    {String(_blacklist.proposedBlackListAddress)}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography color="green" sx={{ mr: "5px" }}>
                      AGREE {Number(_blacklist.approvalCount)}
                    </Typography>
                    /
                    <Typography color="error" sx={{ ml: "5px" }}>
                      DISAGREE {Number(_blacklist.rejectCount)}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions style={{ justifyContent: "center" }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() => vProposedAddWalletBlackList(_index, true)}
                    disabled={Number(_blacklist.status) !== 0}
                    sx={{ mr: "5px", width: "90px" }}
                  >
                    Agree
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => vProposedAddWalletBlackList(_index, false)}
                    disabled={Number(_blacklist.status) !== 0}
                    sx={{ ml: "5px", width: "90px" }}
                  >
                    Disagree
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </Box>
        <Modal
          open={addWalletBlackListVotedOpen}
          onClose={handleAddWalletBlackListVotedClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Voted successfully!
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
        >
          <Paper
            elevation={0}
            sx={{
              width: "500px",
              backgroundColor: theme.palette.primary.main,
              padding: "20px",
              margin: "auto",
            }}
          >
            <Typography
              align="center"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              REMOVE WALLET BLACKLIST
            </Typography>
            <Typography align="center" sx={{ color: "white" }}>
              Propose remove the wallet address from the wallet blacklist. Once
              the wallet address is removed from the blacklist, the restricted
              JPYN contract features will be available.
            </Typography>
          </Paper>
          {proposedRemoveWalletBlackList!.map((_blacklist, _index) => {
            return (
              <Card
                sx={{
                  maxWidth: 500,
                  mt: "10px",
                  boxShadow: "none",
                  padding: "20px",
                  border: "2px solid",
                  borderColor: theme.palette.primary.main,
                  backgroundColor: "transparent",
                }}
                key={_index}
              >
                <CardContent>
                  {Number(_blacklist.status) === 0 ? (
                    <></>
                  ) : (
                    <Typography
                      gutterBottom
                      variant="h4"
                      component="div"
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: theme.palette.primary.main,
                      }}
                    >
                      Ended
                    </Typography>
                  )}
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                      textAlign: "center",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                    }}
                  >
                    {String(_blacklist.proposedRemoveBlackListAddress)}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography color="green" sx={{ mr: "5px" }}>
                      AGREE {Number(_blacklist.approvalCount)}
                    </Typography>

                    <Typography color="error" sx={{ ml: "5px" }}>
                      DISAGREE {Number(_blacklist.rejectCount)}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions style={{ justifyContent: "center" }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() => vProposedRemoveWalletBlackList(_index, true)}
                    disabled={Number(_blacklist.status) !== 0}
                    sx={{ mr: "5px", width: "90px" }}
                  >
                    Agree
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() =>
                      vProposedRemoveWalletBlackList(_index, false)
                    }
                    disabled={Number(_blacklist.status) !== 0}
                    sx={{ ml: "5px", width: "90px" }}
                  >
                    Disagree
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </Box>
        <Modal
          open={removeWalletBlackListVotedOpen}
          onClose={handleRemoveWalletBlackListVotedClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Voted successfully!
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
        >
          <Paper
            elevation={0}
            sx={{
              width: "500px",
              backgroundColor: theme.palette.primary.main,
              padding: "20px",
              margin: "auto",
            }}
          >
            <Typography
              align="center"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              ADD BANK BLACKLIST
            </Typography>
            <Typography align="center" sx={{ color: "white" }}>
              Propose to add the bank account to the bank blacklist. Blacklisted
              bank accounts will not be able to register or make JPYN token
              mints for the relevant account balances.
            </Typography>
          </Paper>
          {proposedAddBankBlackList!.map((_blacklist, _index) => {
            return (
              <Card
                sx={{
                  maxWidth: 500,
                  mt: "10px",
                  boxShadow: "none",
                  padding: "20px",
                  border: "2px solid",
                  borderColor: theme.palette.primary.main,
                  backgroundColor: "transparent",
                }}
                key={_index}
              >
                <CardContent>
                  {Number(_blacklist.status) === 0 ? (
                    <></>
                  ) : (
                    <Typography
                      gutterBottom
                      variant="h4"
                      component="div"
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: theme.palette.primary.main,
                      }}
                    >
                      Ended
                    </Typography>
                  )}
                  <Typography
                    gutterBottom
                    variant="body2"
                    component="div"
                    sx={{
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                    }}
                  >
                    Hashed Account: {String(_blacklist.proposedBankBlackList)}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="body2"
                    component="div"
                    sx={{
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                    }}
                  >
                    Branch No: {String(_blacklist.branchNo)}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="body2"
                    component="div"
                    sx={{
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                    }}
                  >
                    Account Type Code: {String(_blacklist.accountTypeCode)}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="body2"
                    component="div"
                    sx={{
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                    }}
                  >
                    Account No: {String(_blacklist.accountNo)}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography color="green" sx={{ mr: "5px" }}>
                      AGREE {Number(_blacklist.approvalCount)}
                    </Typography>

                    <Typography color="error" sx={{ ml: "5px" }}>
                      DISAGREE {Number(_blacklist.rejectCount)}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions style={{ justifyContent: "center" }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() => vProposedAddBankBlackList(_index, true)}
                    disabled={Number(_blacklist.status) !== 0}
                    sx={{ mr: "5px", width: "90px" }}
                  >
                    Agree
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => vProposedAddBankBlackList(_index, false)}
                    disabled={Number(_blacklist.status) !== 0}
                    sx={{ ml: "5px", width: "90px" }}
                  >
                    Disagree
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </Box>
        <Modal
          open={addBankBlackListVotedOpen}
          onClose={handleAddBankBlackListVotedClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Voted successfully!
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
        >
          <Paper
            elevation={0}
            sx={{
              width: "500px",
              backgroundColor: theme.palette.primary.main,
              padding: "20px",
              margin: "auto",
            }}
          >
            <Typography
              align="center"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              REMOVE BANK BLACKLIST
            </Typography>
            <Typography align="center" sx={{ color: "white" }}>
              Propose to remove the hashed bank account from the bank blacklist.
              Bank accounts removed from the blacklist will have their
              registration and JPYN Token Mint restrictions lifted for the
              relevant account balances.
            </Typography>
          </Paper>
          {proposedRemoveBankBlackList!.map((_blacklist, _index) => {
            return (
              <Card
                sx={{
                  maxWidth: 500,
                  mt: "10px",
                  boxShadow: "none",
                  padding: "20px",
                  border: "2px solid",
                  borderColor: theme.palette.primary.main,
                  backgroundColor: "transparent",
                }}
                key={_index}
              >
                <CardContent>
                  {Number(_blacklist.status) === 0 ? (
                    <></>
                  ) : (
                    <Typography
                      gutterBottom
                      variant="h4"
                      component="div"
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: theme.palette.primary.main,
                      }}
                    >
                      Ended
                    </Typography>
                  )}
                  <Typography
                    gutterBottom
                    variant="body2"
                    component="div"
                    sx={{
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                    }}
                  >
                    Hashed Account:{" "}
                    {String(_blacklist.proposedRemoveBankBlackList)}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="body2"
                    component="div"
                    sx={{
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                    }}
                  >
                    Branch No: {String(_blacklist.branchNo)}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="body2"
                    component="div"
                    sx={{
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                    }}
                  >
                    Account Type Code: {String(_blacklist.accountTypeCode)}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="body2"
                    component="div"
                    sx={{
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                    }}
                  >
                    Account No: {String(_blacklist.accountNo)}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography color="green" sx={{ mr: "5px" }}>
                      AGREE {Number(_blacklist.approvalCount)}
                    </Typography>
                    /
                    <Typography color="error" sx={{ ml: "5px" }}>
                      DISAGREE {Number(_blacklist.rejectCount)}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions style={{ justifyContent: "center" }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() => vProposedRemoveBankBlackList(_index, true)}
                    disabled={Number(_blacklist.status) !== 0}
                    sx={{ mr: "5px", width: "90px" }}
                  >
                    Agree
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => vProposedRemoveBankBlackList(_index, false)}
                    disabled={Number(_blacklist.status) !== 0}
                    sx={{ ml: "5px", width: "90px" }}
                  >
                    Disagree
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </Box>
        <Modal
          open={removeBankBlackListVotedOpen}
          onClose={handleRemoveBankBlackListVotedClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Voted successfully!
            </Typography>
          </Box>
        </Modal>
      </CustomTabPanel>
    </Box>
  );
}
