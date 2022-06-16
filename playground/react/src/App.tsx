import PetiteDB from 'petite-db'
import { useEffect, useRef } from 'react'

function App() {
  const dbRef = useRef<any>()

  useEffect(() => {
    dbRef.current = new PetiteDB('petite-db-example', 'petite-db-store')
  }, [])
  const addData = () => {
    dbRef.current.setItem('test1', 'xxx')
    dbRef.current.setItem('test2', {
      name: 'xxx',
      age: '12',
      address: 'shanghai',
    })
    dbRef.current.setItem('test3', [1, 2, 3, 4, 5, 6])
    dbRef.current.setItem('test4', new ArrayBuffer(10))
  }

  const getData = async() => {
    const test1 = await dbRef.current.getItem('test1')
    console.log('xxx#getData 【test1】', test1)
    const test2 = await dbRef.current.getItem('test2')
    console.log('xxx#getData 【test2】', test2)
    const test3 = await dbRef.current.getItem('test3')
    console.log('xxx#getData 【test3】', test3)
    dbRef.current.getItem('test4').then((res: any) => {
      console.log('xxx#test4', res)
    })
    const test5 = await dbRef.current.getItem('test5')
    console.log('xxx#getData 【test5】', test5)
  }

  const removeData = () => {
    dbRef.current.removeItem('test1')
  }

  const clearData = () => {
    dbRef.current.clear()
  }

  const getAllKeys = () => {
    dbRef.current.keys().then((res: any) => {
      console.log('xxx#getAllKeys', res)
    })
  }
  return (
    <div className="App">
      <button onClick={addData}>添加数据</button>
      <button onClick={getData}>获取数据</button>
      <button onClick={removeData}>删除数据</button>
      <button onClick={clearData}>清空数据</button>
      <button onClick={getAllKeys}>获取所有key</button>
    </div>
  )
}

export default App
