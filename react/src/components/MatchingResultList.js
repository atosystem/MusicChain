import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
} from "@material-ui/core";

import Skeleton from "@material-ui/lab/Skeleton";

import { DeleteIcon, FilterListIcon } from "@material-ui/icons/FilterList";

const useStyles = makeStyles({
  table: {
    //   minWidth: 650,
  },
});

const MatchingResultList = (props) => {
  const classes = useStyles();
  const rows = props.rows;
  return (
    <TableContainer component={Paper}>
      {rows.length ? (
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="right">Artist</TableCell>
              <TableCell align="right">ipfs hash</TableCell>
              <TableCell align="right">uploader</TableCell>
              <TableCell align="right">distance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.ipfs_hash}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.artist}</TableCell>
                <TableCell align="right">{row.ipfs_hash}</TableCell>
                <TableCell align="right">{row.uploader}</TableCell>
                <TableCell align="right">{row.dist}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="right">Artist</TableCell>
              <TableCell align="right">ipfs hash</TableCell>
              <TableCell align="right">uploader</TableCell>
              <TableCell align="right">distance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                <Skeleton animation="wave" />
              </TableCell>
              <TableCell align="right">
                <Skeleton animation="wave" />
              </TableCell>
              <TableCell align="right">
                <Skeleton animation="wave" />
              </TableCell>
              <TableCell align="right">
                <Skeleton animation="wave" />
              </TableCell>
              <TableCell align="right">
                <Skeleton animation="wave" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <Skeleton animation="wave" />
              </TableCell>
              <TableCell align="right">
                <Skeleton animation="wave" />
              </TableCell>
              <TableCell align="right">
                <Skeleton animation="wave" />
              </TableCell>
              <TableCell align="right">
                <Skeleton animation="wave" />
              </TableCell>
              <TableCell align="right">
                <Skeleton animation="wave" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default MatchingResultList;
