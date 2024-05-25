# tickets-go-server

## Install
- ```
  npm install
  ```
- 建立 `.env` (格式請參考 [`.env.example`](.env.example))
  ```
  # copy local settings
  cp .env.example .env
  ```
  
## How to use
### 開發
```
npm run start
```

## 環境
- Ｎode 18
- Express.js
- Typescript

## 開發原則
- 變數名稱：小駝峰
- DB schema(欄位名稱): 小駝峰

## ESLint 規則
- 關閉匿名默認導出的檢查：`import/no-anonymous-default-export: "off"`
- 禁止未使用的變量：`@typescript-eslint/no-unused-vars: "error"`
- 關閉禁止 TypeScript 註釋的檢查：`@typescript-eslint/ban-ts-comment: "off"`
- 關閉禁止使用 `any` 類型的檢查：`@typescript-eslint/no-explicit-any: "off"`
- 關閉禁止非空斷言的檢查：`@typescript-eslint/no-non-null-assertion: "off"`
- 在注釋上方添加新行：`lines-around-comment: ["error", { "beforeLineComment": true, "beforeBlockComment": true, "allowBlockStart": true, "allowClassStart": true, "allowObjectStart": true, "allowArrayStart": true }]`
- 在 return 之前添加新行：`newline-before-return: "error"`
- 在 import 之後添加新行：`import/newline-after-import: ["error", { "count": 1 }]`
- 禁止某些類型，不禁止空對象類型 (`{}`)：`@typescript-eslint/ban-types: ["error", { "extendDefaults": true, "types": { "{}": false } }]`

## Github Branch
1. 「主分支」命名:`main`
2. 「開發分支」基於「主分支」:`dev`
3. 「其餘分支」基於「開發分支」
    - 功能分支：`feat/xxx`
    - 修復bug分支：`fix/xxx`
    - 更新分支：`update/xxx` or `enhance/xxx`
    - 重構代碼分支：`refactor/xxx`
    - 維護性更新或配置變更分支：`chore/xxx`

## Commit
1.  新增功能：feat: add xxx feature
2.  修復錯誤：fix: fix xxx issue
3.  重構代碼：refactor: refactor xxx code
4.  更新代碼：update: update xxx code
5.  更新文檔：docs: update xxx doc
6.  增加測試：test: add xxx test
7.  增加依賴庫：deps: add xxx dependency
8.  格式化代碼：style: format xxx code
9.  配置變更：chore: add xxx comment
10. 回滾代碼：revert: revert xxx commit

---

# 技術
## 後端框架
### [Express](https://expressjs.com/)
- 為熱門的 Node.js 網頁框架

## 資料庫
### [MongoDB (Atlas)](https://www.mongodb.com/cloud/atlas/register)

## 雲端主機部署
### [Render](https://render.com/)
- [專案部屬位置](https://tickets-go-server-dev.onrender.com)
