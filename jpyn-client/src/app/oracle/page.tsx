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

export default function Oracle() {
  const {
    isOracle,
    oracle,
    signer,
    currentAccount,
    addJpynOracle,
    removeJpynOracle,
    getminOracleQuorum,
    getTotalOracleCount,
  } = useContext(ChainContext);
  const [value, setValue] = useState(0);

  const [inputOracleValue, setInputOracleValue] = useState("");
  const [inputRemoveOracleValue, setInputRemoveOracleValue] = useState("");
  const [isOracleState, setIsOracleState] = useState(false);

  const [oracleCompleteOpen, setOracleCompleteOpen] = useState(false);
  const handleOracleCompleteOpen = () => setOracleCompleteOpen(true);
  const handleOracleCompleteClose = () => setOracleCompleteOpen(false);

  const [oracleRemoveCompleteOpen, setOracleRemoveCompleteOpen] =
    useState(false);
  const handleOracleRemoveCompleteOpen = () =>
    setOracleRemoveCompleteOpen(true);
  const handleOracleRemoveCompleteClose = () =>
    setOracleRemoveCompleteOpen(false);

  const [minOracleQuorum, setMinOracleQuorum] = useState(0);
  const [totalOracleCount, setTotalOracleCount] = useState(0);

  useEffect(() => {
    reqMinOracleQuorum();
    reqTotalOracleCount();
    async function handleIsOracle() {
      const res = await isOracle(signer, currentAccount);
      setIsOracleState(res);
    }
    handleIsOracle();
  }, []);

  const reqMinOracleQuorum = async () => {
    const minOracleQuorum = await getminOracleQuorum(signer);
    setMinOracleQuorum(minOracleQuorum);
  };

  const reqTotalOracleCount = async () => {
    const totalOracleCount = await getTotalOracleCount(signer);
    setTotalOracleCount(totalOracleCount);
  };

  const handleInputOracleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputOracleValue(event.target.value);
  };

  const handleAddOracle = async () => {
    try {
      await addJpynOracle(signer, inputOracleValue);
      setInputOracleValue("");
      handleOracleCompleteOpen();
    } catch (e) {
      alert(e);
    }
  };

  const handleInputRemoveOracleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputRemoveOracleValue(event.target.value);
  };

  const handleRemoveOracle = async () => {
    try {
      await removeJpynOracle(signer, inputRemoveOracleValue);
      setInputRemoveOracleValue("");
      handleOracleRemoveCompleteOpen();
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
        Oracle
      </Typography>
      <Typography>
        Min Oracle Quorum: {minOracleQuorum} / Total Oracle Count:{" "}
        {totalOracleCount}
      </Typography>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        {oracle || isOracle ? "You are oracle." : "You are not oracle."}
      </Typography>
      <Box sx={{ width: "50%", borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="ADD ORACLE" {...a11yProps(0)} />
          <Tab label="REMOVE ORACLE" {...a11yProps(1)} />
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
            Register the oracle wallet address to the oracle.
          </Typography>
          <TextField
            label="ORACLE WALLET ADDRESS"
            variant="outlined"
            value={inputOracleValue}
            onChange={handleInputOracleChange}
            sx={{ width: "100%", mt: "20px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddOracle}
            sx={{ mt: "20px" }}
          >
            Register
          </Button>
        </Box>
        <Modal
          open={oracleCompleteOpen}
          onClose={handleOracleCompleteClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Oracle registration completed
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
            Remove the oracle wallet address from the oracle.
          </Typography>
          <TextField
            label="ORACLE WALLET ADDRESS"
            variant="outlined"
            value={inputRemoveOracleValue}
            onChange={handleInputRemoveOracleChange}
            sx={{ width: "100%", mt: "20px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleRemoveOracle}
            sx={{ mt: "20px" }}
          >
            Remove
          </Button>
        </Box>
        <Modal
          open={oracleRemoveCompleteOpen}
          onClose={handleOracleRemoveCompleteClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Oracle remove completed
            </Typography>
          </Box>
        </Modal>
      </CustomTabPanel>
    </Box>
  );
}
