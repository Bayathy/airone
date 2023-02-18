import {
  Box,
  Checkbox,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC } from "react";

import { EntityUpdate } from "apiclient/autogenerated";

const HeaderTableRow = styled(TableRow)(({}) => ({
  backgroundColor: "#455A64",
}));

const HeaderTableCell = styled(TableCell)(({}) => ({
  color: "#FFFFFF",
}));

interface Props {
  entityInfo: EntityUpdate;
  setEntityInfo: (entityInfo: EntityUpdate) => void;
}

export const BasicFields: FC<Props> = ({ entityInfo, setEntityInfo }) => {
  return (
    <Box mb="80px">
      <Box my="16px">
        <Typography variant="h4" align="center">
          基本情報
        </Typography>
      </Box>

      <Table className="table table-bordered">
        <TableHead>
          <HeaderTableRow>
            <HeaderTableCell>項目</HeaderTableCell>
            <HeaderTableCell>内容</HeaderTableCell>
          </HeaderTableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>エンティティ名</TableCell>
            <TableCell>
              <Input
                type="text"
                value={entityInfo.name}
                placeholder="エンティティ名"
                sx={{ width: "100%" }}
                onChange={(e) =>
                  setEntityInfo({ ...entityInfo, name: e.target.value })
                }
                error={entityInfo.name === ""}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>備考</TableCell>
            <TableCell>
              <Input
                type="text"
                value={entityInfo.note}
                placeholder="備考"
                sx={{ width: "100%" }}
                onChange={(e) =>
                  setEntityInfo({ ...entityInfo, note: e.target.value })
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>サイドバーに表示</TableCell>
            <TableCell>
              <Checkbox
                checked={entityInfo.isToplevel}
                onChange={(e) =>
                  setEntityInfo({ ...entityInfo, isToplevel: e.target.checked })
                }
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};
