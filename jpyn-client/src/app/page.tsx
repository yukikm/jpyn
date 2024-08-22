"use client";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ChainContext } from "@/components/ChainContext";
import { useTheme } from "@mui/material/styles";

export default function Home() {
  const { signer, gTotalSupply, getTotalSupply, transferFee, isJpynSafe } =
    useContext(ChainContext);
  const [totalSupply, setTotalSupply] = useState(gTotalSupply);
  const theme = useTheme();
  useEffect(() => {
    const fetchTotalSupply = async () => {
      const totalSupply = await getTotalSupply(signer);
      setTotalSupply(Number(totalSupply));
    };
    fetchTotalSupply();
  }, []);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  };

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
            <Paper
              elevation={0}
              sx={{
                width: "500px",
                backgroundColor: theme.palette.primary.main,
                padding: "20px",
                margin: "20px auto",
              }}
            >
              <Typography variant="h4" align="center" sx={{ color: "white" }}>
                Is JPYN safe ?
              </Typography>
              {isJpynSafe.status === 1 ? (
                <>
                  {isJpynSafe.isSafe ? (
                    <Typography
                      variant="h2"
                      align="center"
                      sx={{ color: "#c5e1a5", fontWeight: "bold" }}
                    >
                      SAFE
                    </Typography>
                  ) : (
                    <Typography
                      variant="h2"
                      align="center"
                      sx={{ color: "#ef9a9a", fontWeight: "bold" }}
                    >
                      UNSAFE
                    </Typography>
                  )}
                  <Typography
                    align="center"
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                    Last Evaluation Date: {formatDate(isJpynSafe.timestamp)}
                  </Typography>
                </>
              ) : (
                <Typography
                  variant="h2"
                  align="center"
                  sx={{ color: "#c5e1a5", fontWeight: "bold" }}
                >
                  -
                </Typography>
              )}
              <Typography align="center" sx={{ color: "white" }}>
                Every 12 hours, the JPYN token total supply amount is compared
                to the bank account balance to check for a safe amount of
                balance using smart contracts and oracle nodes.
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                width: "500px",
                backgroundColor: theme.palette.primary.main,
                padding: "20px",
                margin: "20px auto",
              }}
            >
              <Typography variant="h4" align="center" sx={{ color: "white" }}>
                Total Supply
              </Typography>
              <Typography
                variant="h2"
                align="center"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                {totalSupply.toLocaleString()} JPYN
              </Typography>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                width: "500px",
                backgroundColor: theme.palette.primary.main,
                padding: "20px",
                margin: "20px auto",
              }}
            >
              <Typography variant="h4" align="center" sx={{ color: "white" }}>
                Current Transfer fee
              </Typography>
              <Typography
                variant="h2"
                align="center"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                {Number(transferFee).toLocaleString()} JPYN
              </Typography>
              <Typography align="center" sx={{ color: "white" }}>
                Transferring JPYN tokens will incur a transfer fee. The
                remittance fee is paid to the Oracle node operating wallet and
                jpyn proposer/voter to maintain the JPYN system.
              </Typography>
            </Paper>
          </Box>
        ) : (
          <Paper
            elevation={0}
            sx={{
              width: "900px",
              backgroundColor: theme.palette.primary.main,
              padding: "20px",
              margin: "20px auto",
            }}
          >
            <Typography variant="h3" align="center" sx={{ color: "white" }}>
              JPYN token is a cash-backed stablecoin with KYC.
            </Typography>
            <Typography variant="h3" align="center" sx={{ color: "white" }}>
              It can be linked to a Bank of Mitsubishi UFJ corporate account and
              tokens can be disbursed for the account balance.
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
}
