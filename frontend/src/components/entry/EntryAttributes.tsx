import { Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import * as React from "react";
import { FC } from "react";

import { AttributeValue } from "./AttributeValue";

interface Props {
  attributes: any;
}

export const EntryAttributes: FC<Props> = ({ attributes }) => {
  return (
    <Table>
      <TableBody>
        {Object.keys(attributes).map((attrname) => (
          <TableRow key={attrname}>
            <TableCell>{attrname}</TableCell>
            <TableCell>
              <AttributeValue
                attrName={attrname}
                attrInfo={attributes[attrname]}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
