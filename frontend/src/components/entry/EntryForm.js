import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { DjangoContext } from "../../utils/DjangoContext";

import { EditAttributeValue } from "./EditAttributeValue";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

// FIXME handle attribute types
export function EntryForm({
  entityId,
  entryId,
  initName = "",
  initAttributes = {},
}) {
  const djangoContext = DjangoContext.getInstance();
  const classes = useStyles();
  const history = useHistory();

  console.log(`[onix/00] initAttributes`);
  console.log(initAttributes);

  /* FIXME attach checked flag to entry-like types
   */
  const changedInitAttr = Object.keys(initAttributes)
    .map((attrName) => {
      const attrValue = initAttributes[attrName];
      switch (attrValue.type) {
        case djangoContext.attrTypeValue.group:
        case djangoContext.attrTypeValue.object:
          return {
            name: attrName,
            value: {
              value: {
                ...attrValue.value,
                checked: true,
              },
              type: attrValue.type,
            },
          };

        case djangoContext.attrTypeValue.named_object:
          const name = Object.keys(attrValue.value)[0];
          const value = attrValue.value[name];

          return {
            name: attrName,
            value: {
              value: {
                [name]: {
                  id: value.id,
                  name: value.name,
                  checked: true,
                },
              },
              type: attrValue.type,
            },
          };

        case djangoContext.attrTypeValue.array_group:
        case djangoContext.attrTypeValue.array_object:
          return {
            name: attrName,
            value: {
              value: attrValue.value.map((val) => {
                return {
                  ...val,
                  checked: true,
                };
              }),
              type: attrValue.type,
            },
          };

        case djangoContext.attrTypeValue.array_named_object:
          return {
            name: attrName,
            value: {
              value: attrValue.value.map((val) => {
                const name = Object.keys(val)[0];
                const value = val[name];
                return {
                  [name]: {
                    ...value,
                    checked: true,
                  },
                };
              }),
              type: attrValue.type,
            },
          };

        default:
          return {
            name: attrName,
            value: attrValue,
          };
      }
    })
    .reduce((acc, elem) => {
      acc[elem.name] = elem.value;
      return acc;
    }, {});
  console.log(changedInitAttr);

  const [name, setName] = useState(initName);
  const [attributes, setAttributes] = useState(changedInitAttr);

  const handleChangeAttribute = (event, name, valueInfo) => {
    // console.log("[onix/handleChangeAttribute] name: " + name);
    // console.log(valueInfo);
    // console.log(attributes);

    switch (valueInfo.type) {
      case djangoContext.attrTypeValue.string:
        attributes[name].value = valueInfo.value;
        setAttributes({ ...attributes });
        break;

      case djangoContext.attrTypeValue.object:
        attributes[name].value = {
          ...attributes[name].value,
          checked: valueInfo.checked,
        };
        setAttributes({ ...attributes });
        break;

      case djangoContext.attrTypeValue.array_string:
        attributes[name].value[valueInfo.index] = valueInfo.value;
        setAttributes({ ...attributes });
        break;

      case djangoContext.attrTypeValue.named_object:
        attributes[name].value = {
          [valueInfo.key]: Object.values(attributes[name].value)[0],
        };
        setAttributes({ ...attributes });
        break;

      case djangoContext.attrTypeValue.array_named_object:
        attributes[name].value[valueInfo.index] = {
          [valueInfo.key]: Object.values(
            attributes[name].value[valueInfo.index]
          )[0],
        };
        setAttributes({ ...attributes });
        break;

      case djangoContext.attrTypeValue.boolean:
        attributes[name].value = valueInfo.checked;
        setAttributes({ ...attributes });
        break;

      case djangoContext.attrTypeValue.date:
        attributes[name].value = valueInfo.value;
        setAttributes({ ...attributes });
        break;

      case djangoContext.attrTypeValue.text:
        attributes[name].value = valueInfo.value;
        setAttributes({ ...attributes });
        break;

      default:
        console.log("[onix/handleChangeAttribute/switch] valueInfo: ");
        console.log(valueInfo);
    }

    console.log("[onix/handleChangeAttribute] name: " + name);
    console.log(attributes);
    /*
    attributes[event.target.name] = event.target.value;
    const updated = attributes.map((attribute) => {
      if (attribute.name === event.target.name) {
        attribute.value = event.target.value;
      }
      return attribute;
    });
    setAttributes(updated);
    */
  };

  const handleSubmit = (event) => {
    const attrs = attributes.map((attribute) => {
      return {
        // entity_attr_id
        id: "4",
        value: [{ data: attribute.name }],
        // type: "2",
        // referral_key
      };
    });

    console.log(attrs);

    if (entryId === undefined) {
      /*
      createEntry(entityId, name, attrs)
        .then((resp) => resp.json())
        .then((_) => history.push(entityEntriesPath(entityId)));
      */
    } else {
      /*
      updateEntry(entryId, name, attrs)
        .then((resp) => resp.json())
        .then((_) => history.push(entityEntriesPath(entityId)));
      */
    }

    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col">
          <div className="float-right">
            <Button
              className={classes.button}
              type="submit"
              variant="contained"
              color="secondary"
            >
              保存
            </Button>
          </div>
          <Table className="table table-bordered">
            <TableBody>
              <TableRow>
                <TableCell>エントリ名</TableCell>
                <TableCell>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      <Table className="table table-bordered">
        <TableHead>
          <TableRow>
            <TableCell>属性</TableCell>
            <TableCell>属性値</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(attributes).map((attributeName, index) => (
            <TableRow key={index}>
              <TableCell>{attributeName}</TableCell>
              <TableCell>
                <EditAttributeValue
                  attrName={attributeName}
                  attrInfo={attributes[attributeName]}
                  handleChangeAttribute={handleChangeAttribute}
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
