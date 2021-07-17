import React, { useReducer } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import { useHistory, useLocation } from "react-router-dom";

export default function SearchResults({
  results,
  defaultEntryFilter = "",
  defaultAttrsFilter = {},
}) {
  const location = useLocation();
  const history = useHistory();

  const [entryFilter, entryFilterDispatcher] = useReducer((_, event) => {
    return event.target.value;
  }, defaultEntryFilter);
  const [attrsFilter, attrsFilterDispatcher] = useReducer(
    (state, { event, name }) => {
      return { ...state, [name]: event.target.value };
    },
    defaultAttrsFilter
  );

  const attrNames = results.length > 0 ? Object.keys(results[0].attrs) : [];

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      const params = new URLSearchParams(location.search);
      params.set("entry_name", entryFilter);
      params.set(
        "attrinfo",
        JSON.stringify(
          Object.keys(attrsFilter).map((key) => {
            return { name: key, keyword: attrsFilter[key] };
          })
        )
      );

      // simply reload with the new params
      history.push({
        pathname: location.pathname,
        search: "?" + params.toString(),
      });
      history.go(0);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography>Name</Typography>
              <input
                text="text"
                placeholder="絞り込む"
                defaultValue={defaultEntryFilter}
                onChange={entryFilterDispatcher}
                onKeyPress={handleKeyPress}
              />
            </TableCell>
            {attrNames.map((attrName) => (
              <TableCell>
                <Typography>{attrName}</Typography>
                <input
                  text="text"
                  placeholder="絞り込む"
                  defaultValue={defaultAttrsFilter[attrName] || ""}
                  onChange={(e) =>
                    attrsFilterDispatcher({ event: e, name: attrName })
                  }
                  onKeyPress={handleKeyPress}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((result) => (
            <TableRow>
              <TableCell>
                <Typography>{result.entry.name}</Typography>
              </TableCell>
              {attrNames.map((attrName) => (
                <TableCell>
                  {result.attrs[attrName] && (
                    <Typography>{result.attrs[attrName].value}</Typography>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

SearchResults.propTypes = {
  results: PropTypes.array.isRequired,
  defaultEntryFilter: PropTypes.string,
  defaultAttrsFilter: PropTypes.object,
};
