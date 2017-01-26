# v1
## 20170103 1220ERD2.mwb 修正 ERD table 關聯
- Order, OrderStatus (1 : n) 修正為 (1 : 1)
- Order, OrderOption (1 : n) 修正為 (1 : 1)
- OrderProduct , SupplierShipOrderDescription (1 : n) 修正為 (1 : 1)
- Supplier, Product (1 : 1) 修正為 (1 : n)
- ProductOption , ProductOptionValue (1 : n) 修正為 (1 : 1)
- Option , ProductOptionValue (1 : n) 修正為 (1 : 1)
- OptionValue , ProductOptionValue (1 : n) 修正為 (1 : 1)

# v2
## 20170104 ERD.v2.mwb
- 移除 SupplierShipOrderDescription 資料表，取消與 OrderProduct , SupplierShipOrder 關聯
- 新增 SupplierShipOrderProduct 資料表，與 SupplierShipOrder , Product 關聯  
  SupplierShipOrder 與 SupplierShipOrderProduct ( 1 : n )
  Product 與 SupplierShipOrderProduct ( 1 : n )
- 修改 SupplierShipOrder 欄位 status 為 ENUM
- 修改 Order 與 OrderStatus 關聯， OrderStatus 與 Order ( 1 : n )

# v3
## ERD-20170126_OverView.v3.mwb
### Supplier
增加欄位
- taxId varchar(32) NOT NULL
### SupplierShipOrder
增加欄位
- shipOrderNumber varchar(48) NOT NULL
- token varchar(32) Default NUll

### Order
增加欄位
- orderNumber varchar(48) NOT NULL
- token varchar(32) Default NUll

## ERD-20170126_detail.v3.mwb
### Product
欄位修改預設值
- sku Default '0'
- upc Default '0'
- ean Default '0'
- jan Default '0'
- isbn Default '0'
- mpn Default '0'
- location Default 'tw'

### Supplier
增加欄位
- taxId varchar(32) NOT NULL

### SupplierShipOrder
增加欄位
- shipOrderNumber varchar(48) NOT NULL
- token varchar(32) Default NUll

### Order
增加欄位
- orderNumber varchar(48) NOT NULL
- token varchar(32) Default NUll

### SupplierShipOrderProduct
增加欄位
- status enum('NEW','PAID','PROCESSING','SHIPPED','DELIVERED','CANCELLED','COMPLETED','SUBMITTED','DENIED','CANCELED REVERSAL','FAILED','REFUNDED','REVERSED','CHARGEBACK','PENDING','VOIDED','PROCESSED','EXPIRED')
  Default 'NEW'
