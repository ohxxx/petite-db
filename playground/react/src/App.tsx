import PetiteDB from 'petite-db'
import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const dbRef = useRef<any>()
  const [db, setDB] = useState([])
  const [keys, setKeys] = useState([])
  const [len, setLen] = useState(0)

  useEffect(() => {
    dbRef.current = new PetiteDB({
      dbName: 'petite-db-example',
      storeName: 'petite-db-store',
    })
  }, [])

  const getData = async(key: string) => {
    return await dbRef.current.getItem(key)
  }

  const getDBResult = async(keys: string[]) => {
    return Promise
      .allSettled(keys?.map(key => getData(key)))
      .then((results) => {
        return results.map((item) => {
          if (item.status === 'fulfilled' && item.value)
            return item.value
          return null
        })
      })
  }

  const getAllKeysValues = async() => {
    const keys = await dbRef.current.keys() as []
    const res = await getDBResult(keys) as []
    setDB(res)
  }

  const getAllKeys = () => {
    dbRef.current.keys().then((keys: []) => {
      setKeys(keys)
    })
  }

  const getLength = () => {
    dbRef.current.length((err: any, res: any) => {
      if (!err)
        setLen(res)
    })
  }

  const watchData = () => {
    getAllKeysValues()
    getAllKeys()
    getLength()
  }

  const addData = (target: string) => {
    if (target === 'test1') {
      dbRef.current.setItem('test1', '我是第一个测试的值')
    }
    else if (target === 'test2') {
      dbRef.current.setItem('test2', {
        name: 'xxx',
        age: '12',
        address: 'shanghai',
      })
    }
    else {
      dbRef.current.setItem('test3', [1, 2, 3, 4, 5, 6])
      dbRef.current.setItem('test4', new ArrayBuffer(10))
    }
    watchData()
  }

  const updateData = (target: string) => {
    if (target === 'test1') {
      dbRef.current.setItem('test1', '我现在已经被更新了哦')
    }
    else if (target === 'test2') {
      dbRef.current.setItem('test2', {
        name: 'xxx',
        age: '18',
        address: 'undefined',
      })
    }
    else {
      dbRef.current.setItem('test3', { a: '我更新了' })
    }
    watchData()
  }

  const removeData = () => {
    dbRef.current.removeItem('test4')
    watchData()
  }

  const clearData = () => {
    dbRef.current.clear()
    watchData()
  }

  return (
    <div className="content">
      <div className="left">
        <p>获取所有数据</p>
        <button onClick={() => getAllKeysValues()}>获取数据</button>
        <p>添加数据</p>
        <button onClick={() => addData('test1')}>添加数据 test1</button>
        <button onClick={() => addData('test2')}>添加数据 test2</button>
        <button onClick={() => addData('other')}>添加数据 test3、test4</button>
        <p>更新数据</p>
        <button onClick={() => updateData('test1')}>更新数据 test1</button>
        <button onClick={() => updateData('test2')}>更新数据 test2</button>
        <button onClick={() => updateData('test3')}>更新数据 test3</button>
        <p>删除数据</p>
        <button onClick={removeData}>删除数据 test 4</button>
        <p>清空数据</p>
        <button onClick={clearData}>清空数据</button>
        <p>获取所有 key</p>
        <button onClick={getAllKeys}>获取 keys</button>
        <p>获取所有 key</p>
        <button onClick={getLength}>获取 length</button>
      </div>
      <div className="right">
        <p>当前 db 中数据</p>
        <pre>
          <code>{JSON.stringify(db, null, 2)}</code>
        </pre>
        <p>当前 db 中所有 keys</p>
        <pre>
          <code>{JSON.stringify(keys, null, 2)}</code>
        </pre>
        <p>当前 db 中 keys 长度</p>
        <pre>
          <code>{JSON.stringify(len, null, 2)}</code>
        </pre>
      </div>
    </div>
  )
}

export default App
