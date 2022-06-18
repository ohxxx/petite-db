export interface Base {
  /**
   * Accepting a key and value as parameters will add the key to the given database,
   * or update its corresponding value if the key already exists.
   *
   * @param keyName The name of the key to be used in the database
   * @param keyValue The value of the key to be used in the database
   */
  setItem(keyName: string, keyValue: TValueType): void
  /**
   * Accepts a key name as a parameter and returns the value of the corresponding key name
   *
   * @param keyName The name of the key to be used in the database
   */
  getItem(keyName: string): TValueType
  /**
   * Accepting a key name as an argument will delete that key name (if it exists) from the given database.
   * If there is no item matching the given key name, this method will do nothing.
   *
   * @param keyName The name of the key to be used in the database
   */
  removeItem(keyName: string): TValueType
  /**
   * Call it to clear all key values stored in the database.
   *
   * @returns Returns a Promise that resolves when the database is cleared.
   */
  clear(): void
  /**
   * Call it to return all the keys stored in the database
   *
   * @returns Returns a Promise that resolves when the keys are retrieved.
   */
  keys(): string[] | unknown
}
/**
 * All value types
 */
export type TValueType =
  | string
  | number
  | boolean
  | Date
  | Array<unknown>
  | object
  | ArrayBuffer
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | undefined

/**
 * Initialization parameters
 */
export interface IInitParams {
  dbName: string
  storeName: string
}

export type IInitResult = EventTarget & { result: IDBDatabase }

export type IGetResult = EventTarget & { result: TValueType }

export type IKeysResult = EventTarget & { result: string[] }
