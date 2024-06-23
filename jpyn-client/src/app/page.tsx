"use client";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useContext } from "react";
import { ChainContext } from "@/components/ChainContext";

export default function Home() {
  const { signer, gTotalSupply, transferFee } = useContext(ChainContext);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="85vh"
    >
      <Container>
        {signer ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h3" align="center" sx={{ mt: "50px" }}>
              Is JPYN safe ?
            </Typography>
            <Typography variant="h2" align="center">
              safe
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="contained">Contained</Button>
              <Button variant="contained">Contained</Button>
            </Stack>
            <Typography variant="h3" align="center" sx={{ mt: "50px" }}>
              Total Supply
            </Typography>
            <Typography variant="h2" align="center">
              {Number(gTotalSupply)} JPYN
            </Typography>
            <Typography variant="h3" align="center" sx={{ mt: "50px" }}>
              Current Transfer fee
            </Typography>
            <Typography variant="h2" align="center">
              {Number(transferFee)} JPYN
            </Typography>
          </Box>
        ) : (
          <Typography variant="h1" align="center">
            Please wallet connect
          </Typography>
        )}
      </Container>
    </Box>
  );
}
