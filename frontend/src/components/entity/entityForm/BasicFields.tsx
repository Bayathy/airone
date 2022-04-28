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
import React, { FC } from "react";

interface Props {
  entityInfo: {
    name: string;
    note: string;
    isTopLevel: boolean;
    attributes: { [key: string]: any }[];
  };
  setEntityInfo: (entityInfo: {
    name: string;
    note: string;
    isTopLevel: boolean;
    attributes: { [key: string]: any }[];
  }) => void;
}

export const BasicFields: FC<Props> = ({ entityInfo, setEntityInfo }) => {
  return (
    <Box>
      <Box my="32px">
        <Typography variant="h4" align="center">
          基本情報
        </Typography>
      </Box>

      <Table className="table table-bordered">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#455A64" }}>
            <TableCell sx={{ color: "#FFFFFF" }}>項目</TableCell>
            <TableCell sx={{ color: "#FFFFFF" }}>内容</TableCell>
          </TableRow>
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
                checked={entityInfo.isTopLevel}
                onChange={(e) =>
                  setEntityInfo({ ...entityInfo, isTopLevel: e.target.checked })
                }
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};
