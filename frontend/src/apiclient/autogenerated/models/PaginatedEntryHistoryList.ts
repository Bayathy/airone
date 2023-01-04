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

import { exists, mapValues } from "../runtime";
import {
  EntryHistory,
  EntryHistoryFromJSON,
  EntryHistoryFromJSONTyped,
  EntryHistoryToJSON,
} from "./EntryHistory";

/**
 *
 * @export
 * @interface PaginatedEntryHistoryList
 */
export interface PaginatedEntryHistoryList {
  /**
   *
   * @type {number}
   * @memberof PaginatedEntryHistoryList
   */
  count?: number;
  /**
   *
   * @type {string}
   * @memberof PaginatedEntryHistoryList
   */
  next?: string | null;
  /**
   *
   * @type {string}
   * @memberof PaginatedEntryHistoryList
   */
  previous?: string | null;
  /**
   *
   * @type {Array<EntryHistory>}
   * @memberof PaginatedEntryHistoryList
   */
  results?: Array<EntryHistory>;
}

export function PaginatedEntryHistoryListFromJSON(
  json: any
): PaginatedEntryHistoryList {
  return PaginatedEntryHistoryListFromJSONTyped(json, false);
}

export function PaginatedEntryHistoryListFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): PaginatedEntryHistoryList {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    count: !exists(json, "count") ? undefined : json["count"],
    next: !exists(json, "next") ? undefined : json["next"],
    previous: !exists(json, "previous") ? undefined : json["previous"],
    results: !exists(json, "results")
      ? undefined
      : (json["results"] as Array<any>).map(EntryHistoryFromJSON),
  };
}

export function PaginatedEntryHistoryListToJSON(
  value?: PaginatedEntryHistoryList | null
): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    count: value.count,
    next: value.next,
    previous: value.previous,
    results:
      value.results === undefined
        ? undefined
        : (value.results as Array<any>).map(EntryHistoryToJSON),
  };
}