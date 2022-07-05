import AppsIcon from "@mui/icons-material/Apps";
import { Box, Button, IconButton, Typography } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useAsync } from "react-use";

import { Loading } from "../components/common/Loading";
import { PageHeader } from "../components/common/PageHeader";
import {
  EditableEntry,
  EditableEntryAttrs,
} from "../components/entry/entryForm/EditableEntry";
import { useTypedParams } from "../hooks/useTypedParams";
import { DjangoContext } from "../utils/DjangoContext";

import {
  entitiesPath,
  entityEntriesPath,
  entryDetailsPath,
  topPath,
} from "Routes";
import { aironeApiClientV2 } from "apiclient/AironeApiClientV2";
import { AironeBreadcrumbs } from "components/common/AironeBreadcrumbs";
import { EntryControlMenu } from "components/entry/EntryControlMenu";
import { EntryForm } from "components/entry/EntryForm";

export const EditEntryPage: FC = () => {
  const { entityId, entryId } =
    useTypedParams<{ entityId: number; entryId: number }>();

  const history = useHistory();

  const [entryAnchorEl, setEntryAnchorEl] =
    useState<HTMLButtonElement | null>();
  const [entryInfo, setEntryInfo] = useState<EditableEntry>();
  const [submittable, setSubmittable] = useState<boolean>(true); // FIXME

  const entity = useAsync(async () => {
    return entityId != undefined
      ? await aironeApiClientV2.getEntity(entityId)
      : undefined;
  });

  const entry = useAsync(async () => {
    return entryId != undefined
      ? await aironeApiClientV2.getEntry(entryId)
      : undefined;
  });

  useEffect(() => {
    if (!entry.loading && entry.value !== undefined) {
      setEntryInfo({
        name: entry.value.name,
        attrs: Object.fromEntries(
          entry.value.attrs.map((attr): [string, EditableEntryAttrs] => [
            attr.schema.name,
            {
              id: attr.id,
              type: attr.type,
              isMandatory: attr.isMandatory,
              schema: attr.schema,
              value: attr.value,
            },
          ])
        ),
      });
    } else if (!entity.loading && entity.value !== undefined) {
      setEntryInfo({
        name: "",
        attrs: Object.fromEntries(
          entity.value.attrs.map((attr): [string, EditableEntryAttrs] => [
            attr.name,
            {
              type: attr.type,
              isMandatory: attr.isMandatory,
              schema: {
                id: attr.id,
                name: attr.name,
              },
              value: {},
            },
          ])
        ),
      });
    }
  }, [entity, entry]);

  const djangoContext = DjangoContext.getInstance();

  const handleSubmit = async () => {
    const updatedAttr = Object.entries(entryInfo.attrs).map(
      ([{}, attrValue]) => {
        console.log("[onix/handleSubmit] ", attrValue);
        switch (attrValue.type) {
          case djangoContext.attrTypeValue.string:
          case djangoContext.attrTypeValue.text:
          case djangoContext.attrTypeValue.date:
            return {
              id: attrValue.schema.id,
              value: attrValue.value.asString,
            };

          case djangoContext.attrTypeValue.boolean:
            return {
              id: attrValue.schema.id,
              value: attrValue.value.asBoolean,
            };

          case djangoContext.attrTypeValue.object:
            console.log("[onix/handleSubmit(object)] ", attrValue);
            return {
              id: attrValue.schema.id,
              value: attrValue.value.asObject?.id ?? "",
            };

          case djangoContext.attrTypeValue.group:
            return {
              id: attrValue.schema.id,
              value: attrValue.value.asGroup?.id,
            };

          case djangoContext.attrTypeValue.named_object:
            return {
              id: attrValue.schema.id,
              value: {
                id: Object.values(attrValue.value.asNamedObject ?? {})[0]?.id,
                name: Object.keys(attrValue.value.asNamedObject ?? {})[0],
              },
            };

          case djangoContext.attrTypeValue.array_string:
            return {
              id: attrValue.schema.id,
              value: attrValue.value.asArrayString,
            };

          case djangoContext.attrTypeValue.array_object:
            console.log("[onix/handleSubmit(array_object)] ", attrValue);
            return {
              id: attrValue.schema.id,
              value: attrValue.value.asArrayObject?.map((x) => x.id),
            };

          case djangoContext.attrTypeValue.array_group:
            console.log("[onix/handleSubmit(array_group)] ", attrValue);
            return {
              id: attrValue.schema.id,
              value: attrValue.value.asArrayGroup?.map((x) => x.id),
            };

          case djangoContext.attrTypeValue.array_named_object:
            return {
              id: attrValue.schema.id,
              value: attrValue.value.asArrayNamedObject?.map((x) => {
                return {
                  id: Object.values(x)[0]?.id,
                  name: Object.keys(x)[0],
                };
              }),
            };
        }
      }
    );

    if (entryId == undefined) {
      await aironeApiClientV2.createEntry(
        entityId,
        entryInfo.name,
        updatedAttr
      );
      history.push(entityEntriesPath(entityId));
    } else {
      await aironeApiClientV2.updateEntry(entryId, entryInfo.name, updatedAttr);
      history.go(0);
    }
  };

  const handleCancel = () => {
    history.replace(entryDetailsPath(entityId, entryId));
  };

  if (entity.loading || entry.loading) {
    return <Loading />;
  }

  if (
    !entity.loading &&
    entity.value == undefined &&
    !entry.loading &&
    entry.value == undefined
  ) {
    throw Error("both entity and entry are invalid");
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
        {entity.value && (
          <Typography component={Link} to={entityEntriesPath(entity.value.id)}>
            {entity.value.name}
          </Typography>
        )}
        {entry.value && (
          <Typography
            component={Link}
            to={entryDetailsPath(entry.value.schema.id, entry.value.id)}
          >
            {entry.value.name}
          </Typography>
        )}
        <Typography color="textPrimary">編集</Typography>
      </AironeBreadcrumbs>

      <PageHeader
        title={entry?.value != null ? entry.value.name : "新規エントリの作成"}
        subTitle={entry?.value != null && "エントリ編集"}
        componentSubmits={
          <Box display="flex" justifyContent="center">
            <Box mx="4px">
              <Button
                variant="contained"
                color="secondary"
                disabled={!submittable}
                onClick={handleSubmit}
              >
                保存
              </Button>
            </Box>
            <Box mx="4px">
              <Button variant="outlined" color="primary" onClick={handleCancel}>
                キャンセル
              </Button>
            </Box>
          </Box>
        }
        componentControl={
          <Box>
            <IconButton
              onClick={(e) => {
                setEntryAnchorEl(e.currentTarget);
              }}
            >
              <AppsIcon />
            </IconButton>
            <EntryControlMenu
              entityId={entityId}
              entryId={entryId}
              anchorElem={entryAnchorEl}
              handleClose={() => setEntryAnchorEl(null)}
            />
          </Box>
        }
      />

      <Box>
        {entryInfo && (
          <EntryForm entryInfo={entryInfo} setEntryInfo={setEntryInfo} />
        )}
      </Box>
    </Box>
  );
};
