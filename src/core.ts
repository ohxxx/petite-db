import type { Base, IGetResult, IInitParams, IInitResult, IKeysResult, TValueType } from './types'

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

  setItem(keyName: string, keyValue: TValueType) {
    return new Promise((resolve, reject) => {
      const request = this.#db!.transaction([this.#storeName], 'readwrite')
        .objectStore(this.#storeName)
        .put({ key: keyName, value: keyValue })

      request.onsuccess = (e: unknown) => resolve(e)
      request.onerror = (e: unknown) => reject(e)
    })
  }

  getItem(keyName: string) {
    return new Promise((resolve, reject) => {
      const request = this.#db!.transaction([this.#storeName], 'readonly')
        .objectStore(this.#storeName)
        .get(keyName)

      request.onsuccess = (e: Event) => {
        const { result } = e.target as IGetResult
        resolve(result)
      }
      request.onerror = (e: unknown) => reject(e)
    })
  }

  removeItem(keyName: string) {
    return new Promise((resolve, reject) => {
      const request = this.#db!.transaction([this.#storeName], 'readwrite')
        .objectStore(this.#storeName)
        .delete(keyName)

      request.onsuccess = (e: unknown) => resolve(e)
      request.onerror = (e: unknown) => reject(e)
    })
  }

  clear() {
    return new Promise((resolve, reject) => {
      const request = this.#db!.transaction([this.#storeName], 'readwrite')
        .objectStore(this.#storeName)
        .clear()

      request.onsuccess = (e: unknown) => resolve(e)
      request.onerror = (e: unknown) => reject(e)
    })
  }

  keys() {
    return new Promise((resolve, reject) => {
      const request = this.#db!.transaction([this.#storeName], 'readonly')
        .objectStore(this.#storeName)
        .getAllKeys()

      request.onsuccess = (e: Event) => {
        const { result } = e.target as IKeysResult
        resolve(result)
      }
      request.onerror = (e: unknown) => reject(e)
    })
  }
}

export default PetiteDB
