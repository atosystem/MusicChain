import React from "react";
import { ListItem, ListItemText } from "@material-ui/core";

import ListItemIcon from "@material-ui/core/ListItemIcon";
import DashboardIcon from "@material-ui/icons/Dashboard";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import BuildIcon from "@material-ui/icons/Build";
import SearchIcon from "@material-ui/icons/Search";

import { Link } from "react-router-dom";

export const mainListItems = (setPage) => {
  return (
    <div>
      <ListItem button component={Link} to="/">
        <ListItemIcon>
          <DashboardIcon style={{ color: "white" }} />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>

      <ListItem button component={Link} to="/search">
        <ListItemIcon>
          <SearchIcon style={{ color: "white" }} />
        </ListItemIcon>
        <ListItemText primary="Search" />
      </ListItem>

      <ListItem button component={Link} to="/account">
        <ListItemIcon>
          <AccountCircleIcon style={{ color: "white" }} />
        </ListItemIcon>
        <ListItemText primary="Account" />
      </ListItem>

      <ListItem button component={Link} to="/upload">
        <ListItemIcon>
          <CloudUploadIcon style={{ color: "white" }} />
        </ListItemIcon>
        <ListItemText primary="Upload" />
      </ListItem>
    </div>
  );
};

export const secondaryListItems = (setPage) => {
  return (
    <div>
      <ListItem button component={Link} to="/test">
        <ListItemIcon>
          <BuildIcon style={{ color: "white" }} />
        </ListItemIcon>
        <ListItemText primary="Testing" />
      </ListItem>
    </div>
  );
};
