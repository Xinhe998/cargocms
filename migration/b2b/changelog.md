# change log

## v1

### Order 欄位變動
* Order 新增 token 欄位，避免訂單重複。

### SupplierSHipOrder 欄位變動
* SupplierSHipOrder 新增 token 欄位。

## v2

### User 欄位新增
* User 新增 postCode , city, district

### Message 欄位變動
* type 欄位減少 orderSync

### Order 欄位新增
* 新增 shippingEmail, shippingTelephone, tax , totalIncludeTax

### SupplierShipOrder 欄位新增
* 新增 shippingEmail, shippingTelephone, tax , totalIncludeTax


## v3

### 更改 MenuItem 項目
隱藏 orderpayment, orderpaymenthistory, orderpaymentstatus

### Order, OrderProducts, SupplierShipOrder, SupplierShipOrderProduct 增加欄位
* 增加 deletedAt，搭配 model paranoid 選項

