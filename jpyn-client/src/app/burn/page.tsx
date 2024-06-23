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
import { useContext, useState } from "react";
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

export default function Burn() {
  const { oracle, signer, burn } = useContext(ChainContext);
  const [value, setValue] = useState(0);

  const [inputBurnValue, setInputBurnValue] = useState("");

  const [burnCompleteOpen, setBurnCompleteOpen] = useState(false);
  const handleBurnCompleteOpen = () => setBurnCompleteOpen(true);
  const handleBurnCompleteClose = () => setBurnCompleteOpen(false);

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
      <Typography variant="h2" align="center" sx={{ mt: "20px", mb: "20px" }}>
        Burn
      </Typography>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ mt: "20px", mb: "20px", width: "400px" }}
      >
        <Typography>
          Please enter the amount of JPYN you want to burn.
        </Typography>
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
