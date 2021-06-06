import React from 'react';
import { ListItem, ListItemText} from '@material-ui/core';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import DashboardIcon from '@material-ui/icons/Dashboard';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import BuildIcon from '@material-ui/icons/Build';

export const mainListItems = (setPage) => {
  return (
    <div>
      <ListItem button onClick={() => {setPage("Dashboard")}}>
        <ListItemIcon>
          <DashboardIcon style={{color: 'white'}}/>
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>

      <ListItem button onClick={() => {setPage("Account")}}>
        <ListItemIcon>
          <AccountCircleIcon style={{color: 'white'}}/>
        </ListItemIcon>
        <ListItemText primary="Account" />
      </ListItem>

      <ListItem button onClick={() => {setPage("Upload")}}>
        <ListItemIcon>
          <CloudUploadIcon style={{color: 'white'}}/>
        </ListItemIcon>
        <ListItemText primary="Upload" />
      </ListItem>
    </div>
  )
};

export const secondaryListItems = (setPage) => {
  return (
    <div>
      <ListItem button onClick={() => {setPage("Testing")}}>
        <ListItemIcon>
          <BuildIcon style={{color: 'white'}}/>
        </ListItemIcon>
        <ListItemText primary='Testing' />
      </ListItem>
    </div>
)
};