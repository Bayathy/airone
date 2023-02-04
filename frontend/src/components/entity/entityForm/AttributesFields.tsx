import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { Fragment, FC, useState } from "react";

import { AttributeRow } from "./AttributeRow";

import { Entity, EntityUpdate } from "apiclient/autogenerated";

interface Props {
  entityInfo: EntityUpdate;
  setEntityInfo: (entityInfo: EntityUpdate) => void;
  referralEntities: Entity[];
}

export const AttributesFields: FC<Props> = ({
  entityInfo,
  setEntityInfo,
  referralEntities,
}) => {
  const [latestChangedIndex, setLatestChangedIndex] = useState<number | null>(
    null
  );

  return (
    <Box mb="80px">
      <Box my="16px">
        <Typography variant="h4" align="center">
          属性情報
        </Typography>
      </Box>

      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#455A64" }}>
            <TableCell sx={{ color: "#FFFFFF" }}>属性名</TableCell>
            <TableCell sx={{ color: "#FFFFFF" }}>型</TableCell>
            <TableCell sx={{ color: "#FFFFFF" }}>必須</TableCell>
            <TableCell sx={{ color: "#FFFFFF" }}>関連削除</TableCell>
            <TableCell sx={{ color: "#FFFFFF" }}>並び替え</TableCell>
            <TableCell sx={{ color: "#FFFFFF" }}>削除</TableCell>
            <TableCell sx={{ color: "#FFFFFF" }}>追加</TableCell>
            <TableCell sx={{ color: "#FFFFFF" }}>ACL設定</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <>
            {entityInfo.attrs?.map((attr, index) => (
              <Fragment key={index}>
                {attr.isDeleted !== true && (
                  <AttributeRow
                    index={index}
                    currentAttr={attr}
                    allAttrs={entityInfo.attrs ?? []}
                    referralEntities={referralEntities}
                    entityInfo={entityInfo}
                    setEntityInfo={setEntityInfo}
                    latestChangedIndex={latestChangedIndex}
                    setLatestChangedIndex={setLatestChangedIndex}
                  />
                )}
              </Fragment>
            ))}
            {entityInfo.attrs?.filter((attr) => !attr.isDeleted).length ===
              0 && (
              <AttributeRow
                allAttrs={entityInfo.attrs}
                referralEntities={referralEntities}
                entityInfo={entityInfo}
                setEntityInfo={setEntityInfo}
                latestChangedIndex={latestChangedIndex}
                setLatestChangedIndex={setLatestChangedIndex}
              />
            )}
          </>
        </TableBody>
      </Table>
    </Box>
  );
};
