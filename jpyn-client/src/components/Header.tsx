"use client";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useContext } from "react";
import { ChainContext } from "@/components/ChainContext";
import Link from "next/link";
import { Menu, MenuItem } from "@mui/material";

export default function Header() {
  const { currentAccount, connectWallet } = useContext(ChainContext);
  const displayAddress = currentAccount
    ? `${currentAccount.slice(0, 7)}...${currentAccount.slice(38)}`
    : "";
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            JPYN
          </Typography>

          <Typography component="div" sx={{ flexGrow: 6 }}>
            <Link href="/oracle">oracle</Link>
          </Typography>

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
