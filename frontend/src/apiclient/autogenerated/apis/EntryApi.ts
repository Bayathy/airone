/* tslint:disable */
/* eslint-disable */
/**
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import * as runtime from "../runtime";
import {
  EntryBase,
  EntryBaseFromJSON,
  EntryBaseToJSON,
  EntryRetrieve,
  EntryRetrieveFromJSON,
  EntryRetrieveToJSON,
  EntryUpdate,
  EntryUpdateFromJSON,
  EntryUpdateToJSON,
  GetEntrySimple,
  GetEntrySimpleFromJSON,
  GetEntrySimpleToJSON,
  PaginatedGetEntrySimpleList,
  PaginatedGetEntrySimpleListFromJSON,
  PaginatedGetEntrySimpleListToJSON,
} from "../models";

export interface EntryApiV2DestroyRequest {
  id: number;
}

export interface EntryApiV2ReferralListRequest {
  id: number;
  keyword?: string;
  limit?: number;
  offset?: number;
}

export interface EntryApiV2RestoreCreateRequest {
  id: number;
  entryBase?: EntryBase;
}

export interface EntryApiV2RetrieveRequest {
  id: number;
}

export interface EntryApiV2UpdateRequest {
  id: number;
  entryUpdate?: EntryUpdate;
}

/**
 *
 */
export class EntryApi extends runtime.BaseAPI {
  /**
   */
  async entryApiV2DestroyRaw(
    requestParameters: EntryApiV2DestroyRequest,
    initOverrides?: RequestInit
  ): Promise<runtime.ApiResponse<void>> {
    if (requestParameters.id === null || requestParameters.id === undefined) {
      throw new runtime.RequiredError(
        "id",
        "Required parameter requestParameters.id was null or undefined when calling entryApiV2Destroy."
      );
    }

    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    if (
      this.configuration &&
      (this.configuration.username !== undefined ||
        this.configuration.password !== undefined)
    ) {
      headerParameters["Authorization"] =
        "Basic " +
        btoa(this.configuration.username + ":" + this.configuration.password);
    }
    if (this.configuration && this.configuration.apiKey) {
      headerParameters["Authorization"] =
        this.configuration.apiKey("Authorization"); // tokenAuth authentication
    }

    const response = await this.request(
      {
        path: `/entry/api/v2/{id}/`.replace(
          `{${"id"}}`,
          encodeURIComponent(String(requestParameters.id))
        ),
        method: "DELETE",
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides
    );

    return new runtime.VoidApiResponse(response);
  }

  /**
   */
  async entryApiV2Destroy(
    requestParameters: EntryApiV2DestroyRequest,
    initOverrides?: RequestInit
  ): Promise<void> {
    await this.entryApiV2DestroyRaw(requestParameters, initOverrides);
  }

  /**
   */
  async entryApiV2ReferralListRaw(
    requestParameters: EntryApiV2ReferralListRequest,
    initOverrides?: RequestInit
  ): Promise<runtime.ApiResponse<PaginatedGetEntrySimpleList>> {
    if (requestParameters.id === null || requestParameters.id === undefined) {
      throw new runtime.RequiredError(
        "id",
        "Required parameter requestParameters.id was null or undefined when calling entryApiV2ReferralList."
      );
    }

    const queryParameters: any = {};

    if (requestParameters.keyword !== undefined) {
      queryParameters["keyword"] = requestParameters.keyword;
    }

    if (requestParameters.limit !== undefined) {
      queryParameters["limit"] = requestParameters.limit;
    }

    if (requestParameters.offset !== undefined) {
      queryParameters["offset"] = requestParameters.offset;
    }

    const headerParameters: runtime.HTTPHeaders = {};

    if (
      this.configuration &&
      (this.configuration.username !== undefined ||
        this.configuration.password !== undefined)
    ) {
      headerParameters["Authorization"] =
        "Basic " +
        btoa(this.configuration.username + ":" + this.configuration.password);
    }
    if (this.configuration && this.configuration.apiKey) {
      headerParameters["Authorization"] =
        this.configuration.apiKey("Authorization"); // tokenAuth authentication
    }

    const response = await this.request(
      {
        path: `/entry/api/v2/{id}/referral/`.replace(
          `{${"id"}}`,
          encodeURIComponent(String(requestParameters.id))
        ),
        method: "GET",
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides
    );

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      PaginatedGetEntrySimpleListFromJSON(jsonValue)
    );
  }

  /**
   */
  async entryApiV2ReferralList(
    requestParameters: EntryApiV2ReferralListRequest,
    initOverrides?: RequestInit
  ): Promise<PaginatedGetEntrySimpleList> {
    const response = await this.entryApiV2ReferralListRaw(
      requestParameters,
      initOverrides
    );
    return await response.value();
  }

  /**
   */
  async entryApiV2RestoreCreateRaw(
    requestParameters: EntryApiV2RestoreCreateRequest,
    initOverrides?: RequestInit
  ): Promise<runtime.ApiResponse<EntryBase>> {
    if (requestParameters.id === null || requestParameters.id === undefined) {
      throw new runtime.RequiredError(
        "id",
        "Required parameter requestParameters.id was null or undefined when calling entryApiV2RestoreCreate."
      );
    }

    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    headerParameters["Content-Type"] = "application/json";

    if (
      this.configuration &&
      (this.configuration.username !== undefined ||
        this.configuration.password !== undefined)
    ) {
      headerParameters["Authorization"] =
        "Basic " +
        btoa(this.configuration.username + ":" + this.configuration.password);
    }
    if (this.configuration && this.configuration.apiKey) {
      headerParameters["Authorization"] =
        this.configuration.apiKey("Authorization"); // tokenAuth authentication
    }

    const response = await this.request(
      {
        path: `/entry/api/v2/{id}/restore/`.replace(
          `{${"id"}}`,
          encodeURIComponent(String(requestParameters.id))
        ),
        method: "POST",
        headers: headerParameters,
        query: queryParameters,
        body: EntryBaseToJSON(requestParameters.entryBase),
      },
      initOverrides
    );

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      EntryBaseFromJSON(jsonValue)
    );
  }

  /**
   */
  async entryApiV2RestoreCreate(
    requestParameters: EntryApiV2RestoreCreateRequest,
    initOverrides?: RequestInit
  ): Promise<EntryBase> {
    const response = await this.entryApiV2RestoreCreateRaw(
      requestParameters,
      initOverrides
    );
    return await response.value();
  }

  /**
   */
  async entryApiV2RetrieveRaw(
    requestParameters: EntryApiV2RetrieveRequest,
    initOverrides?: RequestInit
  ): Promise<runtime.ApiResponse<EntryRetrieve>> {
    if (requestParameters.id === null || requestParameters.id === undefined) {
      throw new runtime.RequiredError(
        "id",
        "Required parameter requestParameters.id was null or undefined when calling entryApiV2Retrieve."
      );
    }

    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    if (
      this.configuration &&
      (this.configuration.username !== undefined ||
        this.configuration.password !== undefined)
    ) {
      headerParameters["Authorization"] =
        "Basic " +
        btoa(this.configuration.username + ":" + this.configuration.password);
    }
    if (this.configuration && this.configuration.apiKey) {
      headerParameters["Authorization"] =
        this.configuration.apiKey("Authorization"); // tokenAuth authentication
    }

    const response = await this.request(
      {
        path: `/entry/api/v2/{id}/`.replace(
          `{${"id"}}`,
          encodeURIComponent(String(requestParameters.id))
        ),
        method: "GET",
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides
    );

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      EntryRetrieveFromJSON(jsonValue)
    );
  }

  /**
   */
  async entryApiV2Retrieve(
    requestParameters: EntryApiV2RetrieveRequest,
    initOverrides?: RequestInit
  ): Promise<EntryRetrieve> {
    const response = await this.entryApiV2RetrieveRaw(
      requestParameters,
      initOverrides
    );
    return await response.value();
  }

  /**
   */
  async entryApiV2SearchListRaw(
    initOverrides?: RequestInit
  ): Promise<runtime.ApiResponse<Array<GetEntrySimple>>> {
    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    if (
      this.configuration &&
      (this.configuration.username !== undefined ||
        this.configuration.password !== undefined)
    ) {
      headerParameters["Authorization"] =
        "Basic " +
        btoa(this.configuration.username + ":" + this.configuration.password);
    }
    if (this.configuration && this.configuration.apiKey) {
      headerParameters["Authorization"] =
        this.configuration.apiKey("Authorization"); // tokenAuth authentication
    }

    const response = await this.request(
      {
        path: `/entry/api/v2/search/`,
        method: "GET",
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides
    );

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      jsonValue.map(GetEntrySimpleFromJSON)
    );
  }

  /**
   */
  async entryApiV2SearchList(
    initOverrides?: RequestInit
  ): Promise<Array<GetEntrySimple>> {
    const response = await this.entryApiV2SearchListRaw(initOverrides);
    return await response.value();
  }

  /**
   */
  async entryApiV2UpdateRaw(
    requestParameters: EntryApiV2UpdateRequest,
    initOverrides?: RequestInit
  ): Promise<runtime.ApiResponse<EntryUpdate>> {
    if (requestParameters.id === null || requestParameters.id === undefined) {
      throw new runtime.RequiredError(
        "id",
        "Required parameter requestParameters.id was null or undefined when calling entryApiV2Update."
      );
    }

    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    headerParameters["Content-Type"] = "application/json";

    if (
      this.configuration &&
      (this.configuration.username !== undefined ||
        this.configuration.password !== undefined)
    ) {
      headerParameters["Authorization"] =
        "Basic " +
        btoa(this.configuration.username + ":" + this.configuration.password);
    }
    if (this.configuration && this.configuration.apiKey) {
      headerParameters["Authorization"] =
        this.configuration.apiKey("Authorization"); // tokenAuth authentication
    }

    const response = await this.request(
      {
        path: `/entry/api/v2/{id}/`.replace(
          `{${"id"}}`,
          encodeURIComponent(String(requestParameters.id))
        ),
        method: "PUT",
        headers: headerParameters,
        query: queryParameters,
        body: EntryUpdateToJSON(requestParameters.entryUpdate),
      },
      initOverrides
    );

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      EntryUpdateFromJSON(jsonValue)
    );
  }

  /**
   */
  async entryApiV2Update(
    requestParameters: EntryApiV2UpdateRequest,
    initOverrides?: RequestInit
  ): Promise<EntryUpdate> {
    const response = await this.entryApiV2UpdateRaw(
      requestParameters,
      initOverrides
    );
    return await response.value();
  }
}
