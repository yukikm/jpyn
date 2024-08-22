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
  useTheme,
  Paper,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
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

export default function Burn() {
  const { currentAccount, oracle, signer, burn } = useContext(ChainContext);
  const [value, setValue] = useState(0);

  const [inputBurnValue, setInputBurnValue] = useState("");

  const [burnCompleteOpen, setBurnCompleteOpen] = useState(false);
  const handleBurnCompleteOpen = () => setBurnCompleteOpen(true);
  const handleBurnCompleteClose = () => setBurnCompleteOpen(false);
  const theme = useTheme();
  useEffect(() => {
    if (!currentAccount) {
      redirect("/");
    }
  }, []);
  const handleInputBurnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputBurnValue(event.target.value);
  };

  const handleBurn = async () => {
    try {
      await burn(signer, Number(inputBurnValue));
      setInputBurnValue("");
      handleBurnCompleteOpen();
    } catch (e) {
      alert(e);
    }
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
        <Typography variant="h2" align="center" sx={{ color: "white" }}>
          Burn
        </Typography>
      </Paper>

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
          <Typography align="center" sx={{ color: "white" }}>
            Please enter the amount of JPYN you want to burn.
          </Typography>
        </Paper>
        <TextField
          label="Burn amount (ex. 100)"
          variant="outlined"
          value={inputBurnValue}
          onChange={handleInputBurnChange}
          sx={{ width: "100%", mt: "20px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleBurn}
          sx={{ mt: "20px" }}
        >
          BURN
        </Button>
      </Box>
      <Modal
        open={burnCompleteOpen}
        onClose={handleBurnCompleteClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Burn completed
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
}
