import {
  ACL,
  AclApi,
  Configuration,
  EntityDetail,
  EntityApi,
  EntryApi,
  EntryCreate,
  EntryRetrieve,
  EntryUpdate,
  EntryBase,
  EntryCopy,
  Group,
  GroupApi,
  PaginatedEntryBaseList,
  PaginatedEntityListList,
  EntityAttrCreate,
  EntityCreate,
  EntityUpdate,
  EntityApiV2ListRequest,
  Role,
  RoleApi,
  UserApi,
  UserRetrieve,
  EntityAttrUpdate,
  GetEntryAttrReferral,
  PaginatedJobSerializersList,
  JobApi,
  JobSerializers,
  PaginatedUserListList,
  UserCreate,
  UserUpdate,
  UserToken,
  RoleCreateUpdate,
  GroupTree as _GroupTree,
  GroupCreateUpdate,
  PaginatedEntityHistoryList,
  AdvancedSearchResultAttrInfo,
  PaginatedEntryHistoryAttributeValueList,
  AttributeData,
  WebhookCreateUpdate,
  AdvancedSearchResult,
  ACLHistory,
  ACLObjtypeEnum,
  ACLSetting,
} from "@dmm-com/airone-apiclient-typescript-fetch";
import Cookies from "js-cookie";
import fileDownload from "js-file-download";

import {
  EntityHistoryList,
  EntityList as ConstEntityList,
  EntryHistoryList,
  EntryReferralList,
  JobList,
} from "services/Constants";

export type GroupTree = Pick<_GroupTree, "id" | "name"> & {
  children: Array<GroupTree>;
};

// Get CSRF Token from Cookie set by Django
// see https://docs.djangoproject.com/en/3.2/ref/csrf/
function getCsrfToken(): string {
  return Cookies.get("csrftoken") ?? "";
}

/**
 * A rich API client with using auto-generated client with openapi-generator.
 */
class AironeApiClientV2 {
  private acl: AclApi;
  private entity: EntityApi;
  private entry: EntryApi;
  private group: GroupApi;
  private user: UserApi;
  private role: RoleApi;
  private job: JobApi;

  constructor() {
    const config = new Configuration({ basePath: "" });
    this.acl = new AclApi(config);
    this.entity = new EntityApi(config);
    this.entry = new EntryApi(config);
    // "GroupApi" is associated with "GroupAPI" (~/airone/group/api_v2/views.py)
    this.group = new GroupApi(config);
    this.user = new UserApi(config);
    this.role = new RoleApi(config);
    this.job = new JobApi(config);
  }

  async getAcl(id: number): Promise<ACL> {
    return this.acl.aclApiV2AclsRetrieve({ id });
  }

  async createUser(
    username: string,
    password: string,
    email?: string,
    isSuperuser?: boolean
  ): Promise<UserCreate> {
    return await this.user.userApiV2Create(
      {
        userCreate: {
          username: username,
          email: email,
          password: password,
          isSuperuser: isSuperuser,
        },
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async getUserToken(): Promise<UserToken> {
    return await this.user.userApiV2TokenRetrieve({
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "X-CSRFToken": getCsrfToken(),
      },
    });
  }

  async updateUserToken(): Promise<UserToken> {
    return await this.user.userApiV2TokenCreate(
      {},
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async updateUser(
    userId: number,
    username: string,
    email?: string,
    isSuperuser?: boolean
  ): Promise<UserUpdate> {
    return await this.user.userApiV2Update(
      {
        id: userId,
        userUpdate: {
          username,
          email,
          isSuperuser,
        },
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async updateAcl(
    id: number,
    isPublic: boolean,
    aclSettings: Array<ACLSetting>,
    objectType: ACLObjtypeEnum,
    defaultPermission?: number
  ): Promise<void> {
    await this.acl.aclApiV2AclsUpdate(
      {
        id,
        aCL: {
          id: id,
          isPublic: isPublic,
          defaultPermission: defaultPermission,
          objtype: objectType,
          aclSettings: aclSettings,
          // readonly
          name: "",
          parent: null,
          roles: [],
        },
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async getAclHistory(id: number): Promise<Array<ACLHistory>> {
    return await this.acl.aclApiV2AclsHistoryList({
      id,
    });
  }

  async getEntities(
    page?: number,
    search?: string,
    isToplevel?: boolean
  ): Promise<PaginatedEntityListList> {
    const params: EntityApiV2ListRequest = page
      ? {
          offset: (page - 1) * ConstEntityList.MAX_ROW_COUNT,
          limit: ConstEntityList.MAX_ROW_COUNT,
          search: search,
          isToplevel: isToplevel,
        }
      : {
          // Any better way to get all the entities?
          limit: Number.MAX_SAFE_INTEGER,
          search: search,
          isToplevel: isToplevel,
        };

    return await this.entity.entityApiV2List(params);
  }

  async getEntity(id: number): Promise<EntityDetail> {
    return await this.entity.entityApiV2Retrieve({ id });
  }

  async createEntity(
    name: string,
    note: string,
    isToplevel: boolean,
    attrs: Array<EntityAttrCreate>,
    webhooks: Array<WebhookCreateUpdate>
  ): Promise<EntityCreate> {
    return await this.entity.entityApiV2Create(
      {
        entityCreate: {
          id: -1,
          name: name,
          note: note,
          isToplevel: isToplevel,
          attrs: attrs,
          webhooks: webhooks,
        },
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async updateEntity(
    id: number,
    name: string,
    note: string,
    isToplevel: boolean,
    attrs: Array<EntityAttrUpdate>,
    webhooks: Array<WebhookCreateUpdate>
  ): Promise<EntityUpdate> {
    return await this.entity.entityApiV2Update(
      {
        id: id,
        entityUpdate: {
          id: id,
          name: name,
          note: note,
          isToplevel: isToplevel,
          attrs: attrs,
          webhooks: webhooks,
        },
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async deleteEntity(id: number): Promise<void> {
    return await this.entity.entityApiV2Destroy(
      { id },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async getEntityHistories(
    id: number,
    page: number
  ): Promise<PaginatedEntityHistoryList> {
    return await this.entity.entityApiV2HistoriesList({
      entityId: id,
      offset: (page - 1) * EntityHistoryList.MAX_ROW_COUNT,
      limit: EntityHistoryList.MAX_ROW_COUNT,
    });
  }

  async importEntities(data: string | ArrayBuffer): Promise<void> {
    return await this.entity.entityApiV2ImportCreate({
      headers: {
        "Content-Type": "application/yaml",
        "X-CSRFToken": getCsrfToken(),
      },
      body: new Blob([data]),
    });
  }

  async exportEntities(filename: string): Promise<void> {
    const resp = await this.entity.entityApiV2ExportRetrieveRaw();
    const data = await resp.raw.text();
    fileDownload(data, filename);
  }

  async getEntityAttrs(
    entityIds: number[],
    searchAllEntities = false
  ): Promise<Array<string>> {
    return await this.entity.entityApiV2AttrsList({
      entityIds: searchAllEntities
        ? ""
        : entityIds.map((id) => id.toString()).join(","),
    });
  }

  async getEntry(id: number): Promise<EntryRetrieve> {
    return await this.entry.entryApiV2Retrieve({ id });
  }

  async getEntryReferral(
    id: number,
    page: number,
    keyword?: string
  ): Promise<PaginatedEntryBaseList> {
    return await this.entry.entryApiV2ReferralList({
      id: id,
      keyword: keyword,
      offset: (page - 1) * EntryReferralList.MAX_ROW_COUNT,
      limit: EntryReferralList.MAX_ROW_COUNT,
    });
  }

  async createEntry(
    entityId: number,
    name: string,
    attrs: AttributeData[]
  ): Promise<EntryCreate> {
    return await this.entity.entityApiV2EntriesCreate(
      { entityId, entryCreate: { id: -1, name, attrs } },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async updateEntry(
    id: number,
    name: string,
    attrs: AttributeData[]
  ): Promise<EntryUpdate> {
    return await this.entry.entryApiV2Update(
      { id, entryUpdate: { id: id, name, attrs } },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async destroyEntry(id: number): Promise<void> {
    return await this.entry.entryApiV2Destroy(
      { id },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async destroyEntries(ids: Array<number>): Promise<void> {
    return await this.entry.entryApiV2BulkDeleteDestroy(
      { ids },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async restoreEntry(id: number): Promise<EntryBase> {
    return await this.entry.entryApiV2RestoreCreate(
      { id },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async copyEntry(
    id: number,
    copyEntryNames: Array<string>
  ): Promise<EntryCopy> {
    return await this.entry.entryApiV2CopyCreate(
      {
        id,
        entryCopy: {
          copyEntryNames: copyEntryNames,
        },
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async getEntryHistories(
    id: number,
    page: number
  ): Promise<PaginatedEntryHistoryAttributeValueList> {
    return await this.entry.entryApiV2HistoriesList({
      id: id,
      offset: (page - 1) * EntryHistoryList.MAX_ROW_COUNT,
      limit: EntryHistoryList.MAX_ROW_COUNT,
    });
  }

  async restoreEntryHistory(attrValueId: number): Promise<void> {
    return await this.entry.entryApiV2AttrvRestorePartialUpdate(
      {
        id: attrValueId,
      },
      {
        headers: {
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async getGroups(): Promise<Group[]> {
    return await this.group.groupApiV2GroupsList();
  }

  async getGroup(id: number): Promise<Group> {
    // groupApiV2GroupsRetrieve: associated with
    return await this.group.groupApiV2GroupsRetrieve({ id });
  }

  async createGroup(group: GroupCreateUpdate): Promise<void> {
    await this.group.groupApiV2GroupsCreate(
      { groupCreateUpdate: group },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async updateGroup(id: number, group: GroupCreateUpdate): Promise<void> {
    await this.group.groupApiV2GroupsUpdate(
      { id: id, groupCreateUpdate: group },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async deleteGroup(groupId: number): Promise<void> {
    await this.group.groupApiV2GroupsDestroy(
      {
        id: groupId,
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async getGroupTrees(): Promise<GroupTree[]> {
    const groupTrees = await this.group.groupApiV2GroupsTreeList();

    // typing children here because API side type definition will break API client generation.
    const toTyped = (groupTree: { [key: string]: any }): GroupTree => ({
      id: groupTree["id"],
      name: groupTree["name"],
      children: groupTree["children"].map((child: { [key: string]: any }) =>
        toTyped(child)
      ),
    });

    return groupTrees.map((groupTree) => ({
      id: groupTree.id,
      name: groupTree.name,
      children: groupTree.children.map((child: { [key: string]: any }) =>
        toTyped(child)
      ),
    }));
  }

  async importGroups(data: string | ArrayBuffer): Promise<void> {
    return await this.group.groupApiV2GroupsImportCreate({
      headers: {
        "Content-Type": "application/yaml",
        "X-CSRFToken": getCsrfToken(),
      },
      body: new Blob([data]),
    });
  }

  async exportGroups(filename: string): Promise<void> {
    const resp = await this.group.groupApiV2GroupsExportListRaw();
    const data = await resp.raw.text();
    fileDownload(data, filename);
  }

  async getRoles(): Promise<Role[]> {
    return await this.role.roleApiV2List();
  }

  async getRole(roleId: number): Promise<Role> {
    return await this.role.roleApiV2Retrieve({ id: roleId });
  }

  async createRole(role: RoleCreateUpdate): Promise<void> {
    await this.role.roleApiV2Create(
      {
        roleCreateUpdate: role,
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async updateRole(roleId: number, role: RoleCreateUpdate): Promise<void> {
    await this.role.roleApiV2Update(
      {
        id: roleId,
        roleCreateUpdate: role,
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async deleteRole(roleId: number): Promise<void> {
    return await this.role.roleApiV2Destroy(
      {
        id: roleId,
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async importRoles(data: string | ArrayBuffer): Promise<void> {
    await this.role.roleApiV2ImportCreate({
      headers: {
        "Content-Type": "application/yaml",
        "X-CSRFToken": getCsrfToken(),
      },
      body: new Blob([data]),
    });
  }

  async exportRoles(filename: string): Promise<void> {
    const resp = await this.role.roleApiV2ExportListRaw();
    const data = await resp.raw.text();
    fileDownload(data, filename);
  }

  async getEntries(
    entityId: number,
    isActive = true,
    pageNumber = 1,
    keyword: string
  ): Promise<PaginatedEntryBaseList> {
    //return await this.entry.entryApiV2EntriesList(entityId, isActive, pageNumber);
    // ToDo: This method must pass "isActive" parameter by manupirating DRF API's declaration.
    return await this.entity.entityApiV2EntriesList({
      entityId,
      page: pageNumber,
      isActive: isActive,
      search: keyword,
      ordering: "name",
    });
  }

  async getSearchEntries(query: string): Promise<Array<EntryBase>> {
    return await this.entry.entryApiV2SearchList({
      query: query,
    });
  }

  async exportEntries(entityId: number, format: string): Promise<void> {
    await this.entry.entryApiV2ExportCreate(
      {
        entityId,
        entryExport: {
          format,
        },
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async getEntryAttrReferrals(
    attrId: number,
    keyword?: string
  ): Promise<Array<GetEntryAttrReferral>> {
    return await this.entry.entryApiV2AttrReferralsList({
      attrId: attrId,
      keyword: keyword,
    });
  }

  async advancedSearch(
    entityIds: number[] = [],
    entryName = "",
    attrInfo: AdvancedSearchResultAttrInfo[] = [],
    hasReferral = false,
    referralName = "",
    searchAllEntities = false,
    page: number
  ): Promise<AdvancedSearchResult> {
    const limit = 100;
    const offset = (page - 1) * limit;
    return await this.entry.entryApiV2AdvancedSearchCreate(
      {
        advancedSearch: {
          entities: entityIds,
          attrinfo: attrInfo,
          entryName: entryName,
          hasReferral: hasReferral,
          isOutputAll: false,
          isAllEntities: searchAllEntities,
          referralName: referralName,
          entryLimit: limit,
          entryOffset: offset,
        },
      },
      {
        headers: {
          "X-CSRFToken": getCsrfToken(),
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );
  }

  async exportAdvancedSearchResults(
    entityIds: number[],
    attrinfo: Array<AdvancedSearchResultAttrInfo>,
    entryName: string,
    hasReferral: boolean,
    isAllEntities: boolean,
    format: "yaml" | "csv"
  ): Promise<void> {
    await this.entry.entryApiV2AdvancedSearchResultExportCreate(
      {
        advancedSearchResultExport: {
          entities: entityIds,
          attrinfo: attrinfo,
          entryName: entryName,
          hasReferral: hasReferral,
          isAllEntities: isAllEntities,
          exportStyle: format,
        },
      },
      {
        headers: {
          "X-CSRFToken": getCsrfToken(),
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );
  }

  async getUser(userId: number): Promise<UserRetrieve> {
    return await this.user.userApiV2Retrieve({
      id: userId,
    });
  }

  async destroyUser(id: number): Promise<void> {
    return await this.user.userApiV2Destroy(
      {
        id: id,
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async getUsers(page = 1, keyword?: string): Promise<PaginatedUserListList> {
    return await this.user.userApiV2List({
      page: page,
      search: keyword,
      ordering: "username",
    });
  }

  async importUsers(data: string | ArrayBuffer): Promise<void> {
    return await this.user.userApiV2ImportCreate({
      headers: {
        "Content-Type": "application/yaml",
        "X-CSRFToken": getCsrfToken(),
      },
      body: new Blob([data]),
    });
  }

  async exportUsers(filename: string): Promise<void> {
    const resp = await this.user.userApiV2ExportListRaw();
    const data = await resp.raw.text();
    fileDownload(data, filename);
  }

  async updateUserPassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
    checkPassword: string
  ): Promise<void> {
    await this.user.userApiV2EditPasswdPartialUpdate(
      {
        id: userId,
        patchedUserPassword: {
          oldPasswd: oldPassword,
          newPasswd: newPassword,
          chkPasswd: checkPassword,
        },
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async updateUserPasswordAsSuperuser(
    userId: number,
    newPassword: string,
    checkPassword: string
  ): Promise<void> {
    await this.user.userApiV2SuEditPasswdPartialUpdate(
      {
        id: userId,
        patchedUserPasswordBySuperuser: {
          newPasswd: newPassword,
          chkPasswd: checkPassword,
        },
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async getJobs(page = 1): Promise<PaginatedJobSerializersList> {
    return await this.job.jobApiV2JobsList({
      offset: (page - 1) * JobList.MAX_ROW_COUNT,
      limit: JobList.MAX_ROW_COUNT,
    });
  }

  async getRecentJobs(): Promise<Array<JobSerializers>> {
    // 'recent' means now - 1 hour
    const createdAfter = new Date();
    createdAfter.setHours(createdAfter.getHours() - 1);

    const resp = await this.job.jobApiV2JobsList({
      offset: 0,
      limit: JobList.MAX_ROW_COUNT,
      createdAfter: createdAfter,
    });
    return resp.results ?? [];
  }

  async rerunJob(id: number): Promise<void> {
    await this.job.jobApiV2RerunPartialUpdate(
      { id: id },
      {
        headers: {
          "Content-Type": "application/yaml",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async cancelJob(id: number): Promise<void> {
    await this.job.jobApiV2Destroy(
      { id: id },
      {
        headers: {
          "Content-Type": "application/yaml",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async importEntries(data: string | ArrayBuffer): Promise<void> {
    return await this.entry.entryApiV2ImportCreate({
      headers: {
        "Content-Type": "application/yaml",
        "X-CSRFToken": getCsrfToken(),
      },
      body: new Blob([data]),
    });
  }

  async resetPassword(username: string): Promise<void> {
    await this.user.userApiV2PasswordResetCreate(
      {
        passwordReset: {
          username: username,
        },
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }

  async confirmResetPassword(
    uidb64: string,
    token: string,
    password1: string,
    password2: string
  ): Promise<void> {
    await this.user.userApiV2PasswordResetConfirmCreate(
      {
        passwordResetConfirm: {
          uidb64,
          token,
          password1,
          password2,
        },
      },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );
  }
}

export const aironeApiClientV2 = new AironeApiClientV2();
