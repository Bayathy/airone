import Cookies from "js-cookie";

import {
  EntityList as ConstEntityList,
  EntryReferralList,
} from "../utils/Constants";

import {
  ACL,
  AclApi,
  Attribute,
  Configuration,
  EntityWithAttr,
  EntityApi,
  EntryApi,
  EntryCreate,
  EntryRetrieve,
  EntryUpdate,
  EntryBase,
  Group,
  GroupApi,
  PaginatedEntryBaseList,
  PaginatedEntityWithAttrList,
  EntityApiV2EntitiesListRequest,
  UserApi,
  UserRetrieve,
  UserList,
  PaginatedGetEntrySimpleList,
} from "apiclient/autogenerated";

// Get CSRF Token from Cookie set by Django
// see https://docs.djangoproject.com/en/3.2/ref/csrf/
function getCsrfToken(): string {
  return Cookies.get("csrftoken");
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

  constructor() {
    const config = new Configuration({ basePath: "" });
    this.acl = new AclApi(config);
    this.entity = new EntityApi(config);
    this.entry = new EntryApi(config);
    // "GroupApi" is associated with "GroupAPI" (~/airone/group/api_v2/views.py)
    this.group = new GroupApi(config);
    this.user = new UserApi(config);
  }

  async getAcl(id: number): Promise<ACL> {
    return this.acl.aclApiV2AclsRetrieve({ id });
  }

  async updateAcl(
    id: number,
    name: string,
    objectType: number,
    isPublic: boolean,
    defaultPermission: number,
    acl: any[]
  ): Promise<void> {
    await this.acl.aclApiV2AclsUpdate(
      {
        id,
        aCL: {
          id: id,
          name: name,
          isPublic: isPublic,
          defaultPermission: defaultPermission,
          objtype: objectType,
          acl: acl,
          // readonly
          parent: undefined,
          acltypes: undefined,
          members: undefined,
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

  async getEntities(
    page?: number,
    query?: string,
    isTopLevel?: boolean
  ): Promise<PaginatedEntityWithAttrList> {
    const params: EntityApiV2EntitiesListRequest = page
      ? {
          offset: (page - 1) * ConstEntityList.MAX_ROW_COUNT,
          limit: ConstEntityList.MAX_ROW_COUNT,
          query,
          isTopLevel,
        }
      : {
          // Any better way to get all the entities?
          limit: Number.MAX_SAFE_INTEGER,
          query,
          isTopLevel,
        };

    return await this.entity.entityApiV2EntitiesList(params);
  }

  async getEntity(id: number): Promise<EntityWithAttr> {
    return await this.entity.entityApiV2EntitiesRetrieve({ id });
  }

  async getEntry(id: number): Promise<EntryRetrieve> {
    return await this.entry.entryApiV2Retrieve({ id });
  }

  async getEntryReferral(
    id: number,
    page: number,
    keyword?: string
  ): Promise<PaginatedGetEntrySimpleList> {
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
    attrs: Attribute[]
  ): Promise<EntryCreate> {
    return await this.entity.entityApiV2EntriesCreate(
      { entityId, entryCreate: { id: undefined, name, attrs } },
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
    attrs: Attribute[]
  ): Promise<EntryUpdate> {
    return await this.entry.entryApiV2Update(
      { id, entryUpdate: { id: undefined, name, attrs } },
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

  async getGroups(): Promise<Group[]> {
    return await this.group.groupApiV2GroupsList();
  }

  async getGroup(id: number): Promise<Group> {
    // groupApiV2GroupsRetrieve: associated with
    return await this.group.groupApiV2GroupsRetrieve({ id });
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

  async getUser(userId: number): Promise<UserRetrieve> {
    return await this.user.userApiV2UsersRetrieve({
      id: userId,
    });
  }

  async getUsers(): Promise<UserList[]> {
    return await this.user.userApiV2UsersList();
  }
}

export const aironeApiClientV2 = new AironeApiClientV2();
