
INSERT INTO `MenuItems` (`id`, `icon`, `href`, `title`, `sequence`, `createdAt`, `updatedAt`, `ParentMenuItemId`)
VALUES
	(1, 'home', '/admin/dashboard', '控制台', 0, '2017-02-22 11:21:00', '2017-02-22 11:21:00', NULL),
	(2, 'wrench', '#', '資料維護', 1, '2017-02-22 11:21:00', '2017-02-22 11:21:00', NULL),
	(3, 'product-hunt', '#', '產品管理', 2, '2017-02-22 11:21:00', '2017-02-22 11:21:00', NULL),
	(4, 'file-text', '#', '訂單管理', 3, '2017-02-22 11:21:00', '2017-02-22 11:21:00', NULL),
	(5, 'truck', '#', '供應商', 4, '2017-02-22 11:21:00', '2017-02-22 11:21:00', NULL),
	(6, NULL, '/admin/user', '會員資料', 20, '2017-02-22 11:21:00', '2017-02-22 11:21:00', 2),
	(7, NULL, '/admin/message', '訊息', 140, '2017-02-22 11:21:00', '2017-02-22 11:21:00', 2),
	(8, NULL, '/admin/contact', '聯繫訊息', 150, '2017-02-22 11:21:00', '2017-02-22 11:21:00', 2),
	(9, NULL, '/admin/product', '產品', 20, '2017-02-22 11:21:00', '2017-02-22 11:21:00', 3),
	(10, NULL, '/admin/productdescription', '產品描述', 30, '2017-02-22 11:21:00', '2017-02-22 11:21:00', 3),
	(11, NULL, '/admin/category', '產品分類', 40, '2017-02-22 11:21:00', '2017-02-22 11:21:00', 3),
	(12, NULL, '/admin/order', '訂單', 20, '2017-02-22 11:21:00', '2017-02-22 11:21:00', 4),
	(13, NULL, '/admin/orderproduct', '產品訂單', 30, '2017-02-22 11:21:00', '2017-02-22 11:21:00', 4),
	(14, NULL, '/admin/orderhistory', '訂單歷程', 40, '2017-02-22 11:21:00', '2017-02-22 11:21:00', 4),
	(15, NULL, '/admin/supplier', '供應商清單', 20, '2017-02-22 11:21:00', '2017-02-22 11:21:00', 5),
	(16, NULL, '/admin/suppliershiporderhistory', '供應商出貨單歷程', 50, '2017-02-22 11:21:00', '2017-02-22 11:21:00', 5);

ALTER TABLE Users add `deletedAt` datetime DEFAULT NULL;
ALTER TABLE Orders add `deletedAt` datetime DEFAULT NULL;
ALTER TABLE OrderProducts add `deletedAt` datetime DEFAULT NULL;
ALTER TABLE SupplierShipOrders add `deletedAt` datetime DEFAULT NULL;
ALTER TABLE SupplierShipOrderProducts add `deletedAt` datetime DEFAULT NULL;

