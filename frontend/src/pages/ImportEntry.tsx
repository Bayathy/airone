import { Box, Typography } from "@mui/material";
import React, { FC } from "react";
import { Link, useParams } from "react-router-dom";

import { entitiesPath, entityEntriesPath, topPath } from "Routes";
import { AironeBreadcrumbs } from "components/common/AironeBreadcrumbs";
import { ImportForm } from "components/common/ImportForm";
import { importEntries } from "utils/AironeAPIClient";

export const ImportEntry: FC = () => {
  const { entityId } = useParams<{ entityId: number }>();

  return (
    <Box>
      <AironeBreadcrumbs>
        <Typography component={Link} to={topPath()}>
          Top
        </Typography>
        <Typography component={Link} to={entitiesPath()}>
          エンティティ一覧
        </Typography>
        <Typography component={Link} to={entityEntriesPath(entityId)}>
          {entityId}
        </Typography>
        <Typography>インポート</Typography>
      </AironeBreadcrumbs>

      <ImportForm
        importFunc={importEntries.bind(null, entityId)}
        redirectPath={entityEntriesPath(entityId)}
      />
    </Box>
  );
};
