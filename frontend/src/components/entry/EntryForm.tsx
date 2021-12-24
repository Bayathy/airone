import {
  Box,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { FC, useState } from "react";
import { useHistory } from "react-router-dom";

import { entityEntriesPath } from "../../Routes";
import {
  createEntry,
  getAttrReferrals,
  getGroups,
  updateEntry,
} from "../../utils/AironeAPIClient";
import { DjangoContext } from "../../utils/DjangoContext";

import { EditAttributeValue } from "./EditAttributeValue";

const useStyles = makeStyles<Theme>((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

interface Props {
  entityId: number;
  entryId?: number;
  initName?: string;
  initAttributes?: any;
}

export const EntryForm: FC<Props> = ({
  entityId,
  entryId,
  initName = "",
  initAttributes = {},
}) => {
  const djangoContext = DjangoContext.getInstance();
  const classes = useStyles();
  const history = useHistory();

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
              id: attrValue.id,
              type: attrValue.type,
              schema_id: attrValue.schema_id,
              value: [
                {
                  ...attrValue.value,
                  checked: true,
                },
              ],
            },
          };

        case djangoContext.attrTypeValue.named_object:
          const name = Object.keys(attrValue.value)[0];
          const value = attrValue.value[name];

          return {
            name: attrName,
            value: {
              id: attrValue.id,
              type: attrValue.type,
              schema_id: attrValue.schema_id,
              value: {
                [name]: [
                  {
                    id: value.id,
                    name: value.name,
                    checked: true,
                  },
                ],
              },
            },
          };

        case djangoContext.attrTypeValue.array_group:
        case djangoContext.attrTypeValue.array_object:
          return {
            name: attrName,
            value: {
              id: attrValue.id,
              type: attrValue.type,
              schema_id: attrValue.schema_id,
              value: attrValue.value.map((val) => {
                return [
                  {
                    ...val,
                    checked: true,
                  },
                ];
              }),
            },
          };

        case djangoContext.attrTypeValue.array_named_object:
          return {
            name: attrName,
            value: {
              id: attrValue.id,
              type: attrValue.type,
              schema_id: attrValue.schema_id,
              value: attrValue.value.map((val) => {
                const name = Object.keys(val)[0];
                const value = val[name];
                return {
                  [name]: [
                    {
                      ...value,
                      checked: true,
                    },
                  ],
                };
              }),
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

  const [name, setName] = useState(initName);
  const [attributes, setAttributes] = useState(changedInitAttr);

  const handleChangeAttribute = (event, name: string, valueInfo) => {
    switch (valueInfo.type) {
      case djangoContext.attrTypeValue.string:
        attributes[name].value = valueInfo.value;
        setAttributes({ ...attributes });
        break;

      case djangoContext.attrTypeValue.object:
      case djangoContext.attrTypeValue.group:
        attributes[name].value = attributes[name].value.map((x) => {
          return {
            ...x,
            checked: x.id == valueInfo.id && valueInfo.checked,
          };
        });
        setAttributes({ ...attributes });
        break;

      case djangoContext.attrTypeValue.array_string:
        attributes[name].value[valueInfo.index] = valueInfo.value;
        setAttributes({ ...attributes });
        break;

      case djangoContext.attrTypeValue.array_object:
      case djangoContext.attrTypeValue.array_group:
        // In this case, new blank co-Attribute value will be added
        if (valueInfo.index >= attributes[name].value.length) {
          attributes[name].value.push(valueInfo.value);
        } else {
          attributes[name].value[valueInfo.index] = attributes[name].value[
            valueInfo.index
          ].map((x) => {
            return {
              ...x,
              checked: x.id == valueInfo.id && valueInfo.checked,
            };
          });
        }

        setAttributes({ ...attributes });
        break;

      case djangoContext.attrTypeValue.named_object:
        if (event.target.type === "text") {
          attributes[name].value = {
            [valueInfo.key]: Object.values(attributes[name].value)[0],
          };
        }
        if (event.target.type === "radio") {
          const key = Object.keys(attributes[name].value)[0];
          attributes[name].value[key] = attributes[name].value[key].map((x) => {
            return {
              ...x,
              checked: x.id == valueInfo.id && valueInfo.checked,
            };
          });
        }
        setAttributes({ ...attributes });
        break;

      case djangoContext.attrTypeValue.array_named_object:
        // In this case, new blank co-Attribute value will be added
        if (valueInfo.index >= attributes[name].value.length) {
          attributes[name].value.push(valueInfo.value);
        } else {
          if (event.target.type === "text") {
            attributes[name].value[valueInfo.index] = {
              [valueInfo.key]: Object.values(
                attributes[name].value[valueInfo.index]
              )[0],
            };
          }
          if (event.target.type === "radio") {
            const key = Object.keys(attributes[name].value[valueInfo.index])[0];
            attributes[name].value[valueInfo.index][key] = attributes[
              name
            ].value[valueInfo.index][key].map((x) => {
              return {
                ...x,
                checked: x.id == valueInfo.id && valueInfo.checked,
              };
            });
          }
        }

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
    }
  };

  const handleClickDeleteListItem = (attrName: string, index?: number) => {
    if (index !== undefined) {
      attributes[attrName].value.splice(index, 1);
      setAttributes({ ...attributes });
    }
  };

  const handleNarrowDownGroups = async (
    e,
    attrName: string,
    attrType: string
  ) => {
    const resp = await getGroups();
    const refs = await resp.json();
    const userInputValue = e.target.value;

    function _getUpdatedValues(currentValue) {
      return refs
        .filter((r) => {
          return (
            r.name.includes(userInputValue) ||
            currentValue.find((x) => x.id === r.id && x.checked)
          );
        })
        .map((r) => {
          return {
            id: r.id,
            name: r.name,
            checked: currentValue.find((x) => x.id == r.id)?.checked === true,
          };
        });
    }

    switch (attrType) {
      case djangoContext.attrTypeValue.group:
        attributes[attrName].value = _getUpdatedValues(
          attributes[attrName].value
        );

        setAttributes({ ...attributes });
        break;

      case djangoContext.attrTypeValue.array_group:
        attributes[attrName].value = attributes[attrName].value.map((curr) => {
          return _getUpdatedValues(curr);
        });

        setAttributes({ ...attributes });
        break;
    }
  };

  const handleNarrowDownEntries = async (
    e,
    attrId: number,
    attrName: string,
    attrType: string
  ) => {
    const resp = await getAttrReferrals(attrId);
    const refs = await resp.json();
    const userInputValue = e.target.value;

    function _getUpdatedValues(currentValue) {
      return refs.results
        .filter((r) => {
          return (
            r.name.includes(userInputValue) ||
            currentValue.find((x) => x.id === r.id && x.checked)
          );
        })
        .map((r) => {
          return {
            id: r.id,
            name: r.name,
            checked: currentValue.find((x) => x.id == r.id)?.checked === true,
          };
        });
    }

    switch (attrType) {
      case djangoContext.attrTypeValue.object:
        attributes[attrName].value = _getUpdatedValues(
          attributes[attrName].value
        );

        setAttributes({ ...attributes });
        break;

      case djangoContext.attrTypeValue.array_object:
        attributes[attrName].value = attributes[attrName].value.map((curr) => {
          return _getUpdatedValues(curr);
        });

        setAttributes({ ...attributes });
        break;

      case djangoContext.attrTypeValue.named_object:
        const attrKey = Object.keys(attributes[attrName].value)[0];
        attributes[attrName].value[attrKey] = _getUpdatedValues(
          attributes[attrName].value[attrKey]
        );

        setAttributes({ ...attributes });
        break;

      case djangoContext.attrTypeValue.array_named_object:
        attributes[attrName].value = attributes[attrName].value.map((curr) => {
          const attrKey = Object.keys(curr)[0];
          return { [attrKey]: _getUpdatedValues(curr[attrKey]) };
        });

        setAttributes({ ...attributes });
        break;
    }
  };

  const handleSubmit = async (event) => {
    const updatedAttr = Object.entries(attributes).map(
      ([attrName, attrValue]: any) => {
        switch (attrValue.type) {
          case djangoContext.attrTypeValue.string:
          case djangoContext.attrTypeValue.text:
          case djangoContext.attrTypeValue.boolean:
          case djangoContext.attrTypeValue.date:
            return {
              entity_attr_id: String(attrValue.schema_id),
              id: String(attrValue.id),
              type: attrValue.type,
              value: [
                {
                  data: attrValue.value,
                },
              ],
              referral_key: [],
            };

          case djangoContext.attrTypeValue.array_string:
            return {
              entity_attr_id: String(attrValue.schema_id),
              id: String(attrValue.id),
              type: attrValue.type,
              value: attrValue.value.map((x, index) => {
                return {
                  data: x,
                  index: index,
                };
              }),
              referral_key: [],
            };

          case djangoContext.attrTypeValue.object:
          case djangoContext.attrTypeValue.group:
            return {
              entity_attr_id: String(attrValue.schema_id),
              id: String(attrValue.id),
              type: attrValue.type,
              value: [
                {
                  data: attrValue.value.filter((x) => x.checked)[0].id ?? "",
                  index: String(0),
                },
              ],
              referral_key: [],
            };

          case djangoContext.attrTypeValue.named_object:
            return {
              entity_attr_id: String(attrValue.schema_id),
              id: String(attrValue.id),
              type: attrValue.type,
              value: [
                {
                  data:
                    (Object.values(attrValue.value) as any[])[0].filter(
                      (x) => x.checked
                    )[0].id ?? "",
                  index: String(0),
                },
              ],
              referral_key: [
                {
                  data: Object.keys(attrValue.value)[0],
                  index: String(0),
                },
              ],
            };

          case djangoContext.attrTypeValue.array_named_object:
            return {
              entity_attr_id: String(attrValue.schema_id),
              id: String(attrValue.id),
              type: attrValue.type,
              value: attrValue.value.map((x, index) => {
                return {
                  data:
                    (Object.values(x) as any[])[0].filter((y) => y.checked)[0]
                      ?.id ?? "",
                  index: index,
                };
              }),
              referral_key: attrValue.value.map((x, index) => {
                return {
                  data: Object.keys(x)[0],
                  index: index,
                };
              }),
            };

          case djangoContext.attrTypeValue.array_object:
          case djangoContext.attrTypeValue.array_group:
            return {
              entity_attr_id: String(attrValue.schema_id),
              id: String(attrValue.id),
              type: attrValue.type,
              value: attrValue.value.map((x, index) => {
                return {
                  data: x.filter((y) => y.checked)[0]?.id ?? "",
                  index: index,
                };
              }),
              referral_key: [],
            };
        }
      }
    );

    if (entryId == undefined) {
      await createEntry(entityId, name, updatedAttr);
      history.push(entityEntriesPath(entityId));
    } else {
      await updateEntry(entryId, name, updatedAttr);
      history.go(0);
    }
  };

  return (
    <div>
      {/* ^ FIXME form??? */}
      <button onClick={handleSubmit}>submit</button>
      <Box className="row">
        <Box className="col">
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
          {Object.keys(attributes).map((attributeName, index) => (
            <TableRow key={index}>
              <TableCell>{attributeName}</TableCell>
              <TableCell>
                <EditAttributeValue
                  attrName={attributeName}
                  attrInfo={attributes[attributeName]}
                  handleChangeAttribute={handleChangeAttribute}
                  handleNarrowDownEntries={handleNarrowDownEntries}
                  handleNarrowDownGroups={handleNarrowDownGroups}
                  handleClickDeleteListItem={handleClickDeleteListItem}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <strong>(*)</strong> は必須項目
    </div>
  );
};
