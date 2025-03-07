import { WebhookCreateUpdate } from "@dmm-com/airone-apiclient-typescript-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import React, { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Prompt } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useAsync } from "react-use";

import { entitiesPath, entityEntriesPath } from "Routes";
import { Loading } from "components/common/Loading";
import { PageHeader } from "components/common/PageHeader";
import { SubmitButton } from "components/common/SubmitButton";
import { EntityBreadcrumbs } from "components/entity/EntityBreadcrumbs";
import { EntityForm } from "components/entity/EntityForm";
import { schema, Schema } from "components/entity/entityForm/EntityFormSchema";
import { useAsyncWithThrow } from "hooks/useAsyncWithThrow";
import { useFormNotification } from "hooks/useFormNotification";
import { useTypedParams } from "hooks/useTypedParams";
import { aironeApiClientV2 } from "repository/AironeApiClientV2";
import {
  extractAPIException,
  isResponseError,
} from "services/AironeAPIErrorUtil";
import { findDuplicateIndexes } from "services/entity/Edit";

export const EditEntityPage: FC = () => {
  const { entityId } = useTypedParams<{ entityId: number }>();

  const willCreate = entityId === undefined;

  const history = useHistory();
  const { enqueueSubmitResult } = useFormNotification(
    "エンティティ",
    willCreate
  );

  const {
    formState: { isValid, isDirty, isSubmitting, isSubmitSuccessful },
    handleSubmit,
    reset,
    setError,
    setValue,
    control,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const entity = useAsyncWithThrow(async () => {
    if (entityId !== undefined) {
      return await aironeApiClientV2.getEntity(entityId);
    } else {
      return undefined;
    }
  }, []);

  const referralEntities = useAsync(async () => {
    const entities = await aironeApiClientV2.getEntities();
    return entities.results;
  });

  const handleCancel = () => {
    if (entityId !== undefined) {
      history.replace(entityEntriesPath(entityId));
    } else {
      history.replace(entitiesPath());
    }
  };

  const handleSubmitOnValid = async (entityForm: Schema) => {
    // Adjusted attributes for the API
    const attrs = entityForm.attrs
      .filter((attr) => attr.isWritable)
      .map((attr, index) => ({
        id: attr.id,
        name: attr.name,
        type: attr.type,
        index: index,
        isMandatory: attr.isMandatory,
        isDeleteInChain: attr.isDeleteInChain,
        isSummarized: attr.isSummarized,
        referral: attr.referral.map((r) => r.id),
        isDeleted: false,
      }));

    const deletedAttrs =
      entity.value?.attrs
        .filter(
          (attr) =>
            !entityForm.attrs.some((attrForm) => attrForm.id === attr.id)
        )
        .map((attr) => ({
          id: attr.id,
          isDeleted: true,
        })) ?? [];

    const webhooks =
      entityForm.webhooks.map(
        (webhook): WebhookCreateUpdate => ({
          id: webhook.id,
          url: webhook.url,
          label: webhook.label,
          isEnabled: webhook.isEnabled,
          isVerified: false,
          headers: webhook.headers,
          isDeleted: false,
        })
      ) ?? [];

    const deletedWebhooks =
      entity.value?.webhooks
        .filter(
          (webhook) =>
            !entityForm.webhooks.some(
              (webhookForm) => webhookForm.id === webhook.id
            )
        )
        .map((webhook) => ({
          id: webhook.id,
          isVerified: false,
          isDeleted: true,
        })) ?? [];

    try {
      if (willCreate) {
        await aironeApiClientV2.createEntity(
          entityForm.name,
          entityForm.note,
          entityForm.isToplevel,
          attrs,
          webhooks
        );
      } else {
        await aironeApiClientV2.updateEntity(
          entityId,
          entityForm.name,
          entityForm.note,
          entityForm.isToplevel,
          [...attrs, ...deletedAttrs],
          [...webhooks, ...deletedWebhooks]
        );
      }
      enqueueSubmitResult(true);
    } catch (e) {
      if (e instanceof Error && isResponseError(e)) {
        await extractAPIException<Schema>(
          e,
          (message) => enqueueSubmitResult(false, `詳細: "${message}"`),
          (name, message) => {
            switch (name) {
              case "attrs":
                findDuplicateIndexes(entityForm.attrs).forEach((index) => {
                  setError(`attrs.${index}.name`, {
                    type: "custom",
                    message: message,
                  });
                });
                break;
              default:
                setError(name, { type: "custom", message: message });
            }
          }
        );
      } else {
        enqueueSubmitResult(false);
      }
    }
  };

  useEffect(() => {
    !entity.loading && entity.value != null && reset(entity.value);
  }, [entity.loading]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      if (entityId === undefined) {
        history.replace(entitiesPath());
      } else {
        history.replace(entityEntriesPath(entityId));
      }
    }
  }, [isSubmitSuccessful]);

  if (entity.loading || referralEntities.loading) {
    return <Loading />;
  }

  return (
    <Box>
      {entityId ? (
        <EntityBreadcrumbs entity={entity.value} title="編集" />
      ) : (
        <EntityBreadcrumbs title="作成" />
      )}

      <PageHeader
        title={
          entity?.value != null ? entity.value.name : "新規エンティティの作成"
        }
        description={entity?.value && "エンティテイティ詳細 / 編集"}
      >
        <SubmitButton
          name="保存"
          disabled={!isValid || isSubmitting || isSubmitSuccessful}
          handleSubmit={handleSubmit(handleSubmitOnValid)}
          handleCancel={handleCancel}
        />
      </PageHeader>

      <EntityForm
        referralEntities={referralEntities.value}
        control={control}
        setValue={setValue}
      />

      <Prompt
        when={isDirty && !isSubmitSuccessful}
        message="編集した内容は失われてしまいますが、このページを離れてもよろしいですか？"
      />
    </Box>
  );
};
