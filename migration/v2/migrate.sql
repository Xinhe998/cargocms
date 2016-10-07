UPDATE Allpays SET TradeNo=NULL WHERE TradeNo=MerchantTradeNo;
ALTER TABLE Feeds add createdTime DATETIME DEFAULT NULL;
ALTER TABLE Feeds add publish TINYINT DEFAULT 1;

ALTER TABLE Messages MODIFY COLUMN type enum('greeting','orderConfirm','paymentConfirm','deliveryConfirm','orderSync', 'forgotPassword');
ALTER TABLE Users add resetPasswordToken varchar(32) DEFAULT NULL;
ALTER TABLE Users add birthday datetime DEFAULT NULL;
ALTER TABLE Users add phone1 varchar(32) DEFAULT NULL;
ALTER TABLE Users add phone2 varchar(32) DEFAULT NULL;
ALTER TABLE Users add address varchar(32) DEFAULT NULL;
ALTER TABLE Users add address2 varchar(32) DEFAULT NULL;
ALTER TABLE Users add lastLoginIP varchar(32) DEFAULT NULL;
ALTER TABLE Users add lastLoginLat double DEFAULT NULL;
ALTER TABLE Users add lastLoginLng double DEFAULT NULL;


CREATE TABLE `Contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `content` text,
  `success` tinyint(1) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
