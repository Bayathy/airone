import { z } from "zod";

import { ACL } from "../../apiclient/autogenerated";
import { schemaForType } from "../../services/ZodSchemaUtil";

/*
  "name":"20220202"
  "is_public":false,
  "default_permission":8,
  "objtype":4,
  "acl":,
  "parent":null}
*/

interface ACLForm
  extends Pick<ACL, "id" | "name" | "isPublic" | "defaultPermission" | "objtype" | "acl"> {
}

export const schema = schemaForType<ACLForm>()(
  z
    .object({
      id: z.number().default(0),
      name: z.string(),
      isPublic: z.boolean().optional().default(true),
      defaultPermission: z.number().optional(),
      objtype: z.number().optional(),
      acl: z.array(z.object({
        member_id: z.number(),
        value: z.number(),
      })),
    })
);

export type Schema = z.infer<typeof schema>;
