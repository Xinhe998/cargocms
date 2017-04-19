CREATE TABLE `ProductSupplier` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `ProductId` int(11) NOT NULL,
  `SupplierId` int(11) NOT NULL,
  PRIMARY KEY (`ProductId`,`SupplierId`),
  KEY `SupplierId` (`SupplierId`),
  CONSTRAINT `productsupplier_ibfk_1` FOREIGN KEY (`ProductId`) REFERENCES `Products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productsupplier_ibfk_2` FOREIGN KEY (`SupplierId`) REFERENCES `Suppliers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `Products` DROP FOREIGN KEY `products_ibfk_2`; #先移除 FOREIGN KEY 再移除 SupplierId
ALTER TABLE `Products` DROP `SupplierId`;

ALTER TABLE `OrderProducts` ADD `option` text;