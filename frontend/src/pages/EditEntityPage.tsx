import { Box, Divider, Typography } from "@mui/material";
import React, { FC } from "react";
import { Link, useParams } from "react-router-dom";
import { useAsync } from "react-use";

import { aironeApiClientV2 } from "../apiclient/AironeApiClientV2";
import { Loading } from "../components/common/Loading";
import { getWebhooks } from "../utils/AironeAPIClient";

import { entitiesPath, entityEntriesPath, topPath } from "Routes";
import { AironeBreadcrumbs } from "components/common/AironeBreadcrumbs";
import { EntityForm } from "components/entity/EntityForm";

export const EditEntityPage: FC = () => {
  const { entityId } = useParams<{ entityId: number }>();

  const entity = useAsync(async () => {
    return entityId !== undefined
      ? await aironeApiClientV2.getEntity(entityId)
      : undefined;
  });

  const referralEntities = useAsync(async () => {
    return await aironeApiClientV2.getEntities();
  });

  const webhooks = useAsync(async () => {
    if (entityId != null) {
      const resp = await getWebhooks(entityId);
      return await resp.json();
    } else {
      return [];
    }
  });

  if (entity.loading || referralEntities.loading || webhooks.loading) {
    return <Loading />;
  }

  return (
    <Box>
      {/* TODO z-index, position: fixed, margin-top, background-color */}
      <Box>
        <AironeBreadcrumbs>
          <Typography component={Link} to={topPath()}>
            Top
          </Typography>
          <Typography component={Link} to={entitiesPath()}>
            エンティティ一覧
          </Typography>
          {entityId && (
            <Typography component={Link} to={entityEntriesPath(entityId)}>
              {entity?.value?.name ?? ""}
            </Typography>
          )}
          <Typography color="textPrimary">
            {entityId ? "エンティティ編集" : "新規エンティティの作成"}
          </Typography>
        </AironeBreadcrumbs>

        <Box my="64px">
          <Typography variant="h2" align="center">
            {entity?.value != null
              ? `${entity.value.name}の編集`
              : "新規エンティティの作成"}
          </Typography>
          <Divider sx={{ marginTop: "32px", borderColor: "black" }} />
        </Box>
      </Box>

      <Box sx={{ marginTop: "111px", paddingLeft: "10%", paddingRight: "10%" }}>
        {/*
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="編集" />
          <Tab label="設定" />
        </Tabs>

        <Box hidden={tabValue !== 0}>
          <EntityForm
            entity={entity.value}
            referralEntities={referralEntities.value}
          />
        </Box>
        <Box hidden={tabValue !== 1}>
          {entityId !== undefined ? (
            <WebhookForm entityId={entityId} webhooks={webhooks.value} />
          ) : (
            <Typography>
              未作成のエンティティはWebhookを設定できません。まずエンティティを作成してください。
            </Typography>
          )}
        </Box>
        */}
        <EntityForm
          entity={entity.value}
          referralEntities={referralEntities.value}
        />
      </Box>
    </Box>
  );
};
