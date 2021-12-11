import {
  Box,
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { entityEntriesPath } from "../../Routes";
import { createEntry } from "../../utils/AironeAPIClient";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

// FIXME handle attribute types
export function EntryForm({ entityId, initName = "", initAttributes = {} }) {
  const classes = useStyles();
  const history = useHistory();

  const [name, setName] = useState(initName);
  const [attributes, setAttributes] = useState(
    Object.keys(initAttributes).map((attrname) => {
      return {
        name: attrname,
        value: initAttributes[attrname].value,
        type: initAttributes[attrname].type,
      };
    })
  );

  const handleChangeAttribute = (event) => {
    attributes[event.target.name] = event.target.value;
    const updated = attributes.map((attribute) => {
      if (attribute.name === event.target.name) {
        attribute.value = event.target.value;
      }
      return attribute;
    });
    setAttributes(updated);
  };

  const handleSubmit = (event) => {
    const attrs = attributes.map((attribute) => {
      return {
        id: "4",
        type: "2",
        value: [{ data: attribute.name }],
      };
    });
    createEntry(entityId, name, attrs)
      .then((resp) => resp.json())
      .then((_) => history.push(entityEntriesPath(entityId)));

    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box className="row">
        <Box className="col">
          <Box className="float-right">
            <Button
              className={classes.button}
              type="submit"
              variant="contained"
              color="secondary"
            >
              保存
            </Button>
          </Box>
          <Table className="table table-bordered">
            <TableBody>
              <TableRow>
                <TableCell>エントリ名</TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Box>
      <Table className="table table-bordered">
        <TableHead>
          <TableRow>
            <TableCell>属性</TableCell>
            <TableCell>属性値</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attributes.map((attribute, index) => (
            <TableRow key={index}>
              <TableCell>{attribute.name}</TableCell>
              <TableCell>
                <Input
                  type="text"
                  name={attribute.name}
                  value={attribute.value}
                  onChange={handleChangeAttribute}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <strong>(*)</strong> は必須項目
    </form>
  );
}

EntryForm.propTypes = {
  entityId: PropTypes.number.isRequired,
  initName: PropTypes.string,
  initAttributes: PropTypes.object,
};
