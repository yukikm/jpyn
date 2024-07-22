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
    oracle,
    signer,
    addOracleAdmin,
    removeOracleAdmin,
    addOracle,
    removeOracle,
    getminOracleQuorum,
    getTotalOracleCount,
  } = useContext(ChainContext);
  const [value, setValue] = useState(0);

  const [inputAdminValue, setInputAdminValue] = useState("");
  const [inputOracleValue, setInputOracleValue] = useState("");
  const [inputRemoveAdminValue, setInputRemoveAdminValue] = useState("");
  const [inputRemoveOracleValue, setInputRemoveOracleValue] = useState("");

  const [adminCompleteOpen, setAdminCompleteOpen] = useState(false);
  const handleAdminCompleteOpen = () => setAdminCompleteOpen(true);
  const handleAdminCompleteClose = () => setAdminCompleteOpen(false);

  const [oracleCompleteOpen, setOracleCompleteOpen] = useState(false);
  const handleOracleCompleteOpen = () => setOracleCompleteOpen(true);
  const handleOracleCompleteClose = () => setOracleCompleteOpen(false);

  const [adminRemoveCompleteOpen, setAdminRemoveCompleteOpen] = useState(false);
  const handleRemoveAdminCompleteOpen = () => setAdminRemoveCompleteOpen(true);
  const handleRemoveAdminCompleteClose = () =>
    setAdminRemoveCompleteOpen(false);

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
  }, []);

  const reqMinOracleQuorum = async () => {
    const minOracleQuorum = await getminOracleQuorum(signer);
    setMinOracleQuorum(minOracleQuorum);
  };

  const reqTotalOracleCount = async () => {
    const totalOracleCount = await getTotalOracleCount(signer);
    setTotalOracleCount(totalOracleCount);
  };

  const handleInputAdminChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputAdminValue(event.target.value);
  };

  const handleAddAdmin = async () => {
    try {
      await addOracleAdmin(signer, inputAdminValue);
      setInputAdminValue("");
      handleAdminCompleteOpen();
    } catch (e) {
      alert(e);
    }
  };

  const handleInputRemoveAdminChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputRemoveAdminValue(event.target.value);
  };

  const handleRemoveAdmin = async () => {
    try {
      await removeOracleAdmin(signer, inputRemoveAdminValue);
      setInputRemoveAdminValue("");
      handleRemoveAdminCompleteOpen();
    } catch (e) {
      alert(e);
    }
  };

  const handleInputOracleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputOracleValue(event.target.value);
  };

  const handleAddOracle = async () => {
    try {
      await addOracle(signer, inputOracleValue);
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
      await removeOracle(signer, inputRemoveOracleValue);
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
        {oracle ? "You are oracle." : "You are not oracle."}
      </Typography>
      <Box sx={{ width: "50%", borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="ADD ADMIN" {...a11yProps(0)} />
          <Tab label="REMOVE ADMIN" {...a11yProps(1)} />
          <Tab label="ADD ORACLE" {...a11yProps(2)} />
          <Tab label="REMOVE ORACLE" {...a11yProps(3)} />
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
            Register the admin wallet address to the oracle.
          </Typography>
          <TextField
            label="ADMIN WALLET ADDRESS"
            variant="outlined"
            value={inputAdminValue}
            onChange={handleInputAdminChange}
            sx={{ width: "100%", mt: "20px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddAdmin}
            sx={{ mt: "20px" }}
          >
            REGISTER
          </Button>
        </Box>
        <Modal
          open={adminCompleteOpen}
          onClose={handleAdminCompleteClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Admin registration completed
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
            Remove the admin wallet address from the oracle.
          </Typography>
          <TextField
            label="REMOVE WALLET ADDRESS"
            variant="outlined"
            value={inputRemoveAdminValue}
            onChange={handleInputRemoveAdminChange}
            sx={{ width: "100%", mt: "20px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleRemoveAdmin}
            sx={{ mt: "20px" }}
          >
            REMOVE
          </Button>
        </Box>
        <Modal
          open={adminRemoveCompleteOpen}
          onClose={handleRemoveAdminCompleteClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Admin reomove completed
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
      <CustomTabPanel value={value} index={3}>
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
