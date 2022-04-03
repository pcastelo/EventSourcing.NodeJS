/**
 * !!! This file is autogenerated do not edit by hand !!!
 *
 * Generated by: @databases/pg-schema-print-types
 * Checksum: mvr5LM1sWe/moDBCkVf9yIA5oRVpoFynR61yYthzr8gpysl3Q1Wemk9fgb6cFGEWwbDmjScHBGd5y+J4az/CRQ==
 */

/* eslint-disable */
// tslint:disable

import Cart, { Cart_InsertParameters } from './cart';
import CartItem, { CartItem_InsertParameters } from './cart_item';
import SubscriptionCheckpoint, {
  SubscriptionCheckpoint_InsertParameters,
} from './subscription_checkpoint';

interface DatabaseSchema {
  cart: { record: Cart; insert: Cart_InsertParameters };
  cart_item: { record: CartItem; insert: CartItem_InsertParameters };
  subscription_checkpoint: {
    record: SubscriptionCheckpoint;
    insert: SubscriptionCheckpoint_InsertParameters;
  };
}
export default DatabaseSchema;

function serializeValue(
  _tableName: string,
  _columnName: string,
  value: unknown
): unknown {
  return value;
}
export { serializeValue };

export type {
  Cart,
  Cart_InsertParameters,
  CartItem,
  CartItem_InsertParameters,
  SubscriptionCheckpoint,
  SubscriptionCheckpoint_InsertParameters,
};
