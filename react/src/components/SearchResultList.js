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
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  table: {
    //   minWidth: 650,
  },
});

const SearchResultList = (props) => {
  const classes = useStyles();
  const rows = props.rows;
  const minColumns = props.minColumns;
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
              {!minColumns ? (
                <TableCell align="right">ipfs hash</TableCell>
              ) : null}
              {!minColumns ? (
                <TableCell align="right">uploader</TableCell>
              ) : null}

              {/* <TableCell align="right">Bought</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.ipfs_hash}>
                <TableCell component="th" scope="row">
                  {minColumns ? (
                    <Link to={`/detail/${row.ipfsHash}`}>{row.name}</Link>
                  ) : (
                    row.name
                  )}
                </TableCell>
                <TableCell align="right">{row.artist}</TableCell>
                {!minColumns ? (
                  <TableCell align="right">
                    <Link to={`/detail/${row.ipfsHash}`}>{row.ipfsHash}</Link>{" "}
                  </TableCell>
                ) : null}
                {!minColumns ? (
                  <TableCell align="right">{row.uploader}</TableCell>
                ) : null}
                {/* <TableCell align="right">{}</TableCell> */}
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
              {!minColumns ? (
                <TableCell align="right">ipfs hash</TableCell>
              ) : null}
              {!minColumns ? (
                <TableCell align="right">uploader</TableCell>
              ) : null}
              {/* <TableCell align="right">Bought</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={1}>
              <TableCell component="th" scope="row">
                <Skeleton animation="wave" />
              </TableCell>
              <TableCell align="right">
                <Skeleton animation="wave" />
              </TableCell>
              {!minColumns ? (
                <TableCell align="right">
                  <Skeleton animation="wave" />
                </TableCell>
              ) : null}
              {!minColumns ? (
                <TableCell align="right">
                  <Skeleton animation="wave" />
                </TableCell>
              ) : null}
              {/* <TableCell align="right"><Skeleton animation="wave" /></TableCell> */}
            </TableRow>
            <TableRow key={2}>
              <TableCell component="th" scope="row">
                <Skeleton animation="wave" />
              </TableCell>
              <TableCell align="right">
                <Skeleton animation="wave" />
              </TableCell>
              {!minColumns ? (
                <TableCell align="right">
                  <Skeleton animation="wave" />
                </TableCell>
              ) : null}
              {!minColumns ? (
                <TableCell align="right">
                  <Skeleton animation="wave" />
                </TableCell>
              ) : null}
              {/* <TableCell align="right"><Skeleton animation="wave" /></TableCell> */}
            </TableRow>
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default SearchResultList;
