<sub><em>Petite DB</em></sub>
<h1 align="center">
  <img src="./assets/logo.png" height="100">
</h1>

## 简介

> 一个使用起来巨简单，心智负担最轻的 indexedDB 库。像使用 localStorage、sessionStorage api 一样简单。

## 特色

>1、api 与 localStorage、sessionStorage 基本一直
>
>2、支持 async/await、 then-catch、callback

## 安装

```sh
npm install petite-db
// or
pnpm/yarn add petite-db
```

## API

|    方法    |               说明               |                             参数                             |
| :--------: | :------------------------------: | :----------------------------------------------------------: |
|  setItem   | 将指定 key 和 value 存储至 db 中 | `key` - 存储的键、 `value` -存储的值、`callback` - 回调函数（可选） |
|  getItem   |     获取 db 中指定 key 的值      |      `key` - 需要获取键、`callback` - 回调函数（可选）       |
| removeItem |    移除 db 中指定 key 的数据     |     `key` - 需要移除的键、`callback` - 回调函数（可选）      |
|   clear    |        清除 db 中所有数据        |                `callback` - 回调函数（可选）                 |
|    keys    |    返回 db 中所有 key 的集合     |                `callback` - 回调函数（可选）                 |
|   length   |    返回 db 中所有 key 的长度     |                `callback` - 回调函数（可选）                 |

## 案例

```js
const db = new PetiteDB({ dbName: 'xxx', sotreName: 'xxxStore' })

db.setItem('test1', '我是第一个测试值')

db.getItem('test2', '我是第一个测试值').then((res) => {
	console.log('当前test2的值：', res)
}).catch((err) => {
	console.log('获取错误：', err)
})

async function getTest3Value() {
  const res = await db.getItem('test3')
	console.log('当前test3的值：', res)
}

db.getItem('test2', '我是第二个测试值', (err, val) => {
	if (err) {
    console.log('获取错误：', err)
	} else {
		console.log('当前值：', val)
	}
})
```