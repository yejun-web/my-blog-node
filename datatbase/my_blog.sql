/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50553
Source Host           : localhost:3306
Source Database       : my_blog

Target Server Type    : MYSQL
Target Server Version : 50553
File Encoding         : 65001

Date: 2021-11-19 17:52:29
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for `article`
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` char(50) NOT NULL,
  `desc` varchar(200) DEFAULT NULL,
  `content` text,
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  `imgUrl` char(50) DEFAULT NULL,
  `tags` char(50) DEFAULT NULL,
  `categoryId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `FK_Article_Category` FOREIGN KEY (`categoryId`) REFERENCES `category` (`categoryId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of article
-- ----------------------------
INSERT INTO article VALUES ('1', 'three.js中简单粗暴实现渐变色背景', '', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '', '', '1');
INSERT INTO article VALUES ('4', 'three.js中简单粗暴实现渐变色背景', '', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '', '', '1');
INSERT INTO article VALUES ('5', '2three.js中简单粗暴实现渐变色背景', '首先需要实现渲染器的背景透明显示', '首先需要实现渲染器的背景透明显示', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '', '', '1');

-- ----------------------------
-- Table structure for `category`
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `categoryId` int(11) NOT NULL AUTO_INCREMENT,
  `categoryName` char(50) NOT NULL,
  PRIMARY KEY (`categoryId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO category VALUES ('1', 'Vue');
INSERT INTO category VALUES ('2', 'webpack');

-- ----------------------------
-- Table structure for `role`
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `roleId` int(11) NOT NULL,
  `roleName` char(255) NOT NULL,
  PRIMARY KEY (`roleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO role VALUES ('1', '管理员');
INSERT INTO role VALUES ('2', '普通用户');

-- ----------------------------
-- Table structure for `tag`
-- ----------------------------
DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
  `tagId` int(11) NOT NULL AUTO_INCREMENT,
  `tagName` char(50) NOT NULL,
  PRIMARY KEY (`tagId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tag
-- ----------------------------
INSERT INTO tag VALUES ('1', 'vue');
INSERT INTO tag VALUES ('2', 'javascript');
INSERT INTO tag VALUES ('3', 'webpack');

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` char(255) NOT NULL,
  `password` char(255) NOT NULL,
  `role` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `FK_User_Role` (`role`),
  CONSTRAINT `FK_User_Role` FOREIGN KEY (`role`) REFERENCES `role` (`roleId`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO user VALUES ('1', 'admin', 'e10adc3949ba59abbe56e057f20f883e', '1');
INSERT INTO user VALUES ('15', '小明', 'e10adc3949ba59abbe56e057f20f883e', '2');
INSERT INTO user VALUES ('16', '小华', '0ba7bc92fcd57e337ebb9e74308c811f', '2');
