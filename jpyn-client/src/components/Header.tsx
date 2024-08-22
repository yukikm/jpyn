"use client";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useContext } from "react";
import { ChainContext } from "@/components/ChainContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, MenuItem } from "@mui/material";

export default function Header() {
  const { currentAccount, connectWallet, admin, signer } =
    useContext(ChainContext);
  const router = useRouter();
  const displayAddress = currentAccount
    ? `${currentAccount.slice(0, 7)}...${currentAccount.slice(38)}`
    : "";
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            JPYN
          </Typography>

          <Box sx={{ flexGrow: 1, display: { md: "flex" } }}>
            {currentAccount ? (
              <>
                <Button
                  key="home"
                  onClick={() => router.push("/")}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  home
                </Button>
                <Button
                  key="oracle"
                  onClick={() => router.push("/oracle")}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  oracle
                </Button>
                {admin ? (
                  <>
                    <Button
                      key="vote"
                      onClick={() => router.push("/vote")}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      vote
                    </Button>
                    <Button
                      key="propose"
                      onClick={() => router.push("/propose")}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      propose
                    </Button>
                  </>
                ) : (
                  <></>
                )}
                <Button
                  key="mint"
                  onClick={() => router.push("/mint")}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  mint
                </Button>
                <Button
                  key="burn"
                  onClick={() => router.push("/burn")}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  burn
                </Button>
              </>
            ) : (
              <></>
            )}
          </Box>
          {currentAccount ? (
            <Typography>{displayAddress}</Typography>
          ) : (
            <Button color="inherit" onClick={() => connectWallet()}>
              Connect
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
