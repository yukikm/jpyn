"use client";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ChainContext } from "@/components/ChainContext";

export default function Home() {
  const { signer, getTotalSupply, transferFee, isJpynSafe } =
    useContext(ChainContext);
  const [totalSupply, setTotalSupply] = useState(0);
  useEffect(() => {
    const fetchTotalSupply = async () => {
      const totalSupply = await getTotalSupply();
      setTotalSupply(Number(totalSupply));
    };
    fetchTotalSupply();
  }, []);

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
            {isJpynSafe.status === 1 ? (
              <>
                {isJpynSafe.isSafe ? (
                  <>
                    <Typography
                      variant="h2"
                      align="center"
                      sx={{ color: "green" }}
                    >
                      SAFE
                    </Typography>
                    <Typography variant="body1" align="center">
                      Evaluation Date: {String(isJpynSafe.timestamp)}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography
                      variant="h2"
                      align="center"
                      sx={{ color: "red" }}
                    >
                      UNSAFE
                    </Typography>
                    <Typography variant="body1" align="center">
                      Evaluation Date: {String(isJpynSafe.timestamp)}
                    </Typography>
                  </>
                )}
              </>
            ) : (
              <Typography variant="h2" align="center" sx={{ color: "green" }}>
                -
              </Typography>
            )}

            <Typography variant="h3" align="center" sx={{ mt: "50px" }}>
              Total Supply
            </Typography>
            <Typography variant="h2" align="center">
              {totalSupply} JPYN
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
