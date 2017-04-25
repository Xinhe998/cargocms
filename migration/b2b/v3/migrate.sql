ALTER TABLE Users add `deletedAt` datetime DEFAULT NULL;
ALTER TABLE Orders add `deletedAt` datetime DEFAULT NULL;
ALTER TABLE OrderProducts add `deletedAt` datetime DEFAULT NULL;
ALTER TABLE SupplierShipOrders add `deletedAt` datetime DEFAULT NULL;
ALTER TABLE SupplierShipOrderProducts add `deletedAt` datetime DEFAULT NULL;
