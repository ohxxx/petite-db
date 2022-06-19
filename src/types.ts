export interface Base {
  /**
   * Accepting a key and value as parameters will add the key to the given database,
   * or update its corresponding value if the key already exists.
   *
   * @param keyName The name of the key to be used in the database
   * @param keyValue The value of the key to be used in the database
   * @param callback The callback function to be executed after the key is added to the database
   */
  setItem(keyName: string, keyValue: TValueType, callback?: Function): void
  /**
   * Accepts a key name as a parameter and returns the value of the corresponding key name
   *
   * @param keyName The name of the key to be used in the database
   * @param callback The callback function to be executed after the key is retrieved from the database
   */
  getItem(keyName: string, callback?: Function): TValueType
  /**
   * Accepting a key name as an argument will delete that key name (if it exists) from the given database.
   * If there is no item matching the given key name, this method will do nothing.
   *
   * @param keyName The name of the key to be used in the database
   * @param callback The callback function to be executed after the key is deleted from the database
   */
  removeItem(keyName: string, callback?: Function): void
  /**
   * Call it to clear all key values stored in the database.
   *
   * @param callback The callback function to be executed after the database is cleared
   */
  clear(callback?: Function): void
  /**
   * Call it to return all the keys stored in the database
   *
   * @param callback The callback function to be executed after the keys are retrieved
   */
  keys(callback?: Function): string[] | unknown
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

export type IResult<T> = EventTarget & { result: T }

export type IInitResult = IResult<IDBDatabase>

export type IGetResult = IResult<TValueType>

export type IKeysResult = IResult<string[]>

export type IMode = 'readwrite' | 'readonly'

export type ISuccess<T> = (e: IResult<T>) => void

export type IEvent = (e: Event) => void
