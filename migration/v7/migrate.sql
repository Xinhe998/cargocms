CREATE TABLE `SearchPeckers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `keywords` varchar(255) NOT NULL,
  `crawlerAgent` varchar(255) NOT NULL,
  `reportHtml` text NOT NULL,
  `reportImage` varchar(255) NOT NULL,
  `pageNo` int(32) NOT NULL,
  `pageNoPrev` int(32) NOT NULL,
  `pageNoWarn` int(32) NOT NULL,
  `targetUrl` varchar(255) NOT NULL,
  `searchEngine` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO `SearchPeckers` (`id`, `keywords`, `crawlerAgent`, `reportHtml`, `reportImage`, `pageNo`, `pageNoPrev`, `pageNoWarn`, `targetUrl`, `searchEngine`, `createdAt`, `updatedAt`)
VALUES
	(1, '客製化香水 調香 香水 實驗室', 'CargoSearchBot-v.10', 'crawlerAgent/google/reault/html/report.html', '/assets/labfnp/img/searchscreentshot_google.png', 1, 1, 5, 'labfnp.com', 'www.google.com.tw', '2017-02-17 16:54:41', '2017-02-17 16:54:41'),
	(2, '客製化香水 調香 香水 實驗室', 'CargoSearchBot-v.10', 'crawlerAgent/bing/reault/html/report.html', '/assets/labfnp/img/searchscreentshot_bing.png', 1, 1, 5, 'labfnp.com', 'www.bing.com', '2017-02-17 16:54:41', '2017-02-17 16:54:41'),
	(3, '客製化香水 調香 香水 實驗室', 'CargoSearchBot-v.10', 'crawlerAgent/yahoo/reault/html/report.html', '/assets/labfnp/img/searchscreentshot_yahoo.png', 1, 1, 5, 'labfnp.com', 'tw.yahoo.com', '2017-02-17 16:54:41', '2017-02-17 16:54:41'),
	(4, '客製化香水 調香 香水 實驗室', 'CargoSearchBot-v.10', 'crawlerAgent/baidu/reault/html/report.html', '/assets/labfnp/img/searchscreentshot_baidu.png', 1, 1, 5, 'labfnp.com', 'www.baidu.com', '2017-02-17 16:54:41', '2017-02-17 16:54:41');
