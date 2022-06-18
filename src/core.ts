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
      if (window?.indexedDB) {
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
      const transaction = this.#db!.transaction([this.#storeName], 'readwrite')
      const store = transaction.objectStore(this.#storeName)
      const request = store.put({ key: keyName, value: keyValue })
      request.onsuccess = (e: unknown) => resolve(e)
      request.onerror = (e: unknown) => reject(e)
    })
  }

  getItem(keyName: string) {
    return new Promise((resolve, reject) => {
      const transaction = this.#db!.transaction([this.#storeName], 'readonly')
      const store = transaction.objectStore(this.#storeName)
      const request = store.get(keyName)
      request.onsuccess = (e: Event) => {
        const { result } = e.target as IGetResult
        resolve(result)
      }
      request.onerror = (e: unknown) => reject(e)
    })
  }

  removeItem(keyName: string) {
    return new Promise((resolve, reject) => {
      const transaction = this.#db!.transaction([this.#storeName], 'readwrite')
      const store = transaction.objectStore(this.#storeName)
      const request = store.delete(keyName)
      request.onsuccess = (e: unknown) => resolve(e)
      request.onerror = (e: unknown) => reject(e)
    })
  }

  clear() {
    return new Promise((resolve, reject) => {
      const transaction = this.#db!.transaction([this.#storeName], 'readwrite')
      const store = transaction.objectStore(this.#storeName)
      const request = store.clear()
      request.onsuccess = (e: unknown) => resolve(e)
      request.onerror = (e: unknown) => reject(e)
    })
  }

  keys() {
    return new Promise((resolve, reject) => {
      const transaction = this.#db!.transaction([this.#storeName], 'readonly')
      const store = transaction.objectStore(this.#storeName)
      const request = store.getAllKeys()
      request.onsuccess = (e: Event) => {
        const { result } = e.target as IKeysResult
        resolve(result)
      }
      request.onerror = (e: unknown) => reject(e)
    })
  }
}

export default PetiteDB
