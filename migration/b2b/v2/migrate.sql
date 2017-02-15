ALTER TABLE Users add `postCode` varchar(10) DEFAULT NULL;
ALTER TABLE Users add `city` varchar(128) DEFAULT NULL;
ALTER TABLE Users add `district` varchar(128) DEFAULT NULL;

ALTER TABLE Messages MODIFY COLUMN type enum('greeting','orderConfirm','paymentConfirm','deliveryConfirm', 'forgotPassword');
