import type { Base, IEvent, IGetResult, IInitParams, IInitResult, IKeysResult, IMode, TValueType } from './types'

class PetiteDB implements Base {
  #db: IDBDatabase | null
  #storeName: string

  constructor({
    dbName = 'petiteDB',
    storeName = 'petiteStore',
  }: Partial<IInitParams>) {
    this.#db = null
    this.#storeName = storeName
    this.#init({ dbName, storeName })
  }

  #init({ dbName, storeName }: IInitParams) {
    return new Promise((resolve, reject) => {
      if (this.#db) {
        resolve(this)
      }
      else {
        const req = window.indexedDB.open(dbName, 1) as IDBOpenDBRequest
        req.onupgradeneeded = (e: IDBVersionChangeEvent) => {
          const { result } = e.target as IInitResult
          const db = result
          if (!db.objectStoreNames.contains(storeName))
            db.createObjectStore(storeName, { keyPath: 'key' })
        }
        req.onsuccess = (e: Event) => {
          const { result } = e.target as IInitResult
          this.#db = result
          resolve(this)
        }
        req.onerror = (e: unknown) => reject(e)
      }
    })
  }

  #read(mode: IMode, request: Function, callback?: Function) {
    return new Promise((resolve, reject) => {
      const isFunction = (value: unknown) => value && typeof value === 'function'
      const txn = this.#db!.transaction([this.#storeName], mode).objectStore(this.#storeName)
      const success = (result: unknown) => {
        if (isFunction(callback))
          callback?.(null, result)
        resolve(result)
      }
      const error = (ev: Event) => {
        if (isFunction(callback))
          callback?.(ev)
        reject(ev)
      }
      return request(txn, success, error)
    })
  }

  setItem(keyName: string, keyValue: TValueType, callback?: Function) {
    return this.#read('readwrite', (transaction: IDBObjectStore, success: Function, error: IEvent) => {
      const request = transaction.put({ key: keyName, value: keyValue })
      request.onsuccess = (e: Event) => success(e)
      request.onerror = (e: Event) => error(e)
    }, callback)
  }

  getItem(keyName: string, callback?: Function) {
    return this.#read('readonly', (transaction: IDBObjectStore, success: Function, error: IEvent) => {
      const request = transaction.get(keyName)
      request.onsuccess = (e: Event) => {
        const { result } = e.target as IGetResult
        success(result)
      }
      request.onerror = error
    }, callback)
  }

  removeItem(keyName: string, callback?: Function) {
    return this.#read('readwrite', (transaction: IDBObjectStore, success: IEvent, error: IEvent) => {
      const request = transaction.delete(keyName)
      request.onsuccess = success
      request.onerror = error
    }, callback)
  }

  clear(callback?: Function) {
    return this.#read('readwrite', (transaction: IDBObjectStore, success: IEvent, error: IEvent) => {
      const request = transaction.clear()
      request.onsuccess = success
      request.onerror = error
    }, callback)
  }

  keys(callback?: Function) {
    return this.#read('readonly', (transaction: IDBObjectStore, success: Function, error: IEvent) => {
      const request = transaction.getAllKeys()
      request.onsuccess = (e: Event) => {
        const { result } = e.target as IKeysResult
        success(result)
      }
      request.onerror = error
    }, callback)
  }
}

export default PetiteDB
