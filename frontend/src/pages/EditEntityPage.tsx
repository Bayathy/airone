import { Box, Typography } from "@mui/material";
import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useAsync } from "react-use";

import { aironeApiClientV2 } from "../apiclient/AironeApiClientV2";
import { Loading } from "../components/common/Loading";
import { useTypedParams } from "../hooks/useTypedParams";
import { getWebhooks } from "../utils/AironeAPIClient";

import { entitiesPath, entityEntriesPath, topPath } from "Routes";
import { AironeBreadcrumbs } from "components/common/AironeBreadcrumbs";
import { PageHeader } from "components/common/PageHeader";
import { EntityForm } from "components/entity/EntityForm";
import { createEntity, updateEntity } from "utils/AironeAPIClient";

export const EditEntityPage: FC = () => {
  const { entityId } = useTypedParams<{ entityId: number }>();
  const history = useHistory();

  const [entityInfo, setEntityInfo] = useState<{
    name: string;
    note: string;
    isTopLevel: boolean;
    webhooks: any[];
    attributes: { [key: string]: any }[];
  }>({
    name: "",
    note: "",
    isTopLevel: false,
    webhooks: [],
    attributes: [],
  });

  const entity = useAsync(async () => {
    if (entityId !== undefined) {
      const resp = await aironeApiClientV2.getEntity(entityId);
      setEntityInfo({
        name: resp.name,
        note: resp.note,
        isTopLevel: resp.isToplevel,
        webhooks: resp.webhooks,
        attributes:
          resp.attrs.map((attr) => {
            return { ...attr, refIds: attr.referrals.map((r) => r.id) };
          }) ?? [],
      });
      return resp;
    }
    return undefined;
  });

  const referralEntities = useAsync(async () => {
    const entities = await aironeApiClientV2.getEntities();
    return entities.results;
  });

  const webhooks = useAsync(async () => {
    if (entityId !== undefined) {
      const resp = await getWebhooks(entityId);
      return await resp.json();
    } else {
      return [];
    }
  });
  const [submittable, setSubmittable] = useState<boolean>(false);

  const handleCancel = () => {
    history.replace(entitiesPath());
  };
  const handleSubmit = async () => {
    const createMode = entityId === undefined;
    // Adjusted attributes for the API
    const attrs = entityInfo.attributes
      .filter((attr) => attr.id != null || !attr.deleted)
      .map((attr, index) => {
        return {
          id: attr.id,
          name: attr.name,
          type: String(attr.type),
          row_index: String(index),
          is_mandatory: attr.is_mandatory,
          is_delete_in_chain: attr.is_delete_in_chain,
          ref_ids: attr.refIds,
          deleted: attr.deleted,
        };
      });

    if (createMode) {
      await createEntity(
        entityInfo.name,
        entityInfo.note,
        entityInfo.isTopLevel,
        attrs
      );
      history.replace(entitiesPath());
    } else {
      await updateEntity(
        entityId,
        entityInfo.name,
        entityInfo.note,
        entityInfo.isTopLevel,
        attrs
      );
      history.replace(entityEntriesPath(entityId));
    }
  };

  if (entity.loading || referralEntities.loading || webhooks.loading) {
    return <Loading />;
  }

  return (
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

      {/* TODO z-index, position: fixed, margin-top, background-color */}
      <PageHeader
        isSubmittable={submittable}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      >
        {entity?.value != null
          ? entity.value.name + "の編集"
          : "新規エンティティの作成"}
      </PageHeader>

      <Box sx={{ marginTop: "111px", paddingLeft: "10%", paddingRight: "10%" }}>
        <EntityForm
          entity={entity.value}
          entityInfo={entityInfo}
          setEntityInfo={setEntityInfo}
          referralEntities={referralEntities.value}
          setSubmittable={setSubmittable}
        />
      </Box>
    </Box>
  );
};
