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
/**
 *
 * @export
 * @interface ACLRole
 */
export interface ACLRole {
  /**
   *
   * @type {number}
   * @memberof ACLRole
   */
  id: number;
  /**
   *
   * @type {string}
   * @memberof ACLRole
   */
  name: string;
  /**
   *
   * @type {string}
   * @memberof ACLRole
   */
  description: string;
  /**
   *
   * @type {number}
   * @memberof ACLRole
   */
  currentPermission: number;
}

export function ACLRoleFromJSON(json: any): ACLRole {
  return ACLRoleFromJSONTyped(json, false);
}

export function ACLRoleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ACLRole {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    id: json["id"],
    name: json["name"],
    description: json["description"],
    currentPermission: json["current_permission"],
  };
}

export function ACLRoleToJSON(value?: ACLRole | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    id: value.id,
    name: value.name,
    description: value.description,
    current_permission: value.currentPermission,
  };
}
