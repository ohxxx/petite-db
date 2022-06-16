class PetiteDB {
  #db: any
  #storeName = 'petiteStore'

  constructor(dbName: string, storeName: string) {
    this.#init(dbName, storeName)
  }

  #init(dbName = 'petiteDB', storeName = 'petiteStore') {
    return new Promise((resolve, reject) => {
      if (window.indexedDB) {
        this.#db = window.indexedDB.open(dbName, 1)
        this.#storeName = storeName
        this.#db.onupgradeneeded = (e: any) => {
          this.#db = e.target.result
          if (!this.#db.objectStoreNames.contains(storeName)) {
            this.#db.createObjectStore(storeName, {
              keyPath: 'key',
            })
          }
        }
        this.#db.onsuccess = (e: any) => {
          this.#db = e.target.result
          resolve(this)
        }
        this.#db.onerror = (e: unknown) => reject(e)
      }
    })
  }

  setItem(key: string, value: any) {
    return new Promise((resolve, reject) => {
      const transaction = this.#db.transaction([this.#storeName], 'readwrite')
      const store = transaction.objectStore(this.#storeName)
      const request = store.put({ key, value })
      request.onsuccess = (e: unknown) => resolve(e)
      request.onerror = (e: unknown) => reject(e)
    })
  }

  getItem(key: string) {
    return new Promise((resolve, reject) => {
      const transaction = this.#db.transaction([this.#storeName], 'readonly')
      const store = transaction.objectStore(this.#storeName)
      const request = store.get(key)
      request.onsuccess = (e: any) => resolve(e.target.result)
      request.onerror = (e: unknown) => reject(e)
    })
  }

  removeItem(key: string) {
    return new Promise((resolve, reject) => {
      const transaction = this.#db.transaction([this.#storeName], 'readwrite')
      const store = transaction.objectStore(this.#storeName)
      const request = store.delete(key)
      request.onsuccess = (e: unknown) => resolve(e)
      request.onerror = (e: unknown) => reject(e)
    })
  }

  clear() {
    return new Promise((resolve, reject) => {
      const transaction = this.#db.transaction([this.#storeName], 'readwrite')
      const store = transaction.objectStore(this.#storeName)
      const request = store.clear()
      request.onsuccess = (e: unknown) => resolve(e)
      request.onerror = (e: unknown) => reject(e)
    })
  }

  keys() {
    return new Promise((resolve, reject) => {
      const transaction = this.#db.transaction([this.#storeName], 'readonly')
      const store = transaction.objectStore(this.#storeName)
      const request = store.getAllKeys()
      request.onsuccess = (e: any) => resolve(e.target.result)
      request.onerror = (e: unknown) => reject(e)
    })
  }
}

export default PetiteDB
