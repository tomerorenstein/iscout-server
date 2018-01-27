CREATE DATABASE  IF NOT EXISTS `iscout` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `iscout`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: iscout
-- ------------------------------------------------------
-- Server version	5.7.21-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `players_basic_info`
--

DROP TABLE IF EXISTS `players_basic_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `players_basic_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(1000) NOT NULL,
  `age` double NOT NULL,
  `favourite_leg` varchar(45) NOT NULL,
  `position` int(11) NOT NULL,
  `country` varchar(500) NOT NULL,
  `team` varchar(500) DEFAULT NULL,
  `own_description` varchar(4000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_player_position_idx` (`position`),
  CONSTRAINT `FK_player_position` FOREIGN KEY (`position`) REFERENCES `players_positions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `players_basic_info`
--

LOCK TABLES `players_basic_info` WRITE;
/*!40000 ALTER TABLE `players_basic_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `players_basic_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `players_positions`
--

DROP TABLE IF EXISTS `players_positions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `players_positions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `position` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `players_positions`
--

LOCK TABLES `players_positions` WRITE;
/*!40000 ALTER TABLE `players_positions` DISABLE KEYS */;
INSERT INTO `players_positions` VALUES (1,'Goalkeeper'),(2,'Defender'),(3,'Midfielder'),(4,'Striker');
/*!40000 ALTER TABLE `players_positions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `players_yearly_statistics`
--

DROP TABLE IF EXISTS `players_yearly_statistics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `players_yearly_statistics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `player_id` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `goals` int(11) NOT NULL,
  `assists` int(11) NOT NULL,
  `games_in_starting_linup` int(11) NOT NULL,
  `games_entered_from_bench` int(11) NOT NULL,
  `yellow_cards` int(11) NOT NULL,
  `red_cards` int(11) NOT NULL,
  `average_km_per_game` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_player_id_idx` (`player_id`),
  CONSTRAINT `FK_player_id` FOREIGN KEY (`player_id`) REFERENCES `players_basic_info` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `players_yearly_statistics`
--

LOCK TABLES `players_yearly_statistics` WRITE;
/*!40000 ALTER TABLE `players_yearly_statistics` DISABLE KEYS */;
/*!40000 ALTER TABLE `players_yearly_statistics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scouters_info`
--

DROP TABLE IF EXISTS `scouters_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `scouters_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(1000) NOT NULL,
  `club` varchar(1000) NOT NULL,
  `country` varchar(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scouters_info`
--

LOCK TABLES `scouters_info` WRITE;
/*!40000 ALTER TABLE `scouters_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `scouters_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(1000) NOT NULL,
  `password` varchar(1000) NOT NULL,
  `type` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_users_types_idx` (`type`),
  CONSTRAINT `FK_users_types` FOREIGN KEY (`type`) REFERENCES `users_types` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_to_players_rel`
--

DROP TABLE IF EXISTS `users_to_players_rel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_to_players_rel` (
  `user_id` int(11) NOT NULL,
  `player_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`player_id`),
  KEY `FK_player_id_idx` (`player_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_to_players_rel`
--

LOCK TABLES `users_to_players_rel` WRITE;
/*!40000 ALTER TABLE `users_to_players_rel` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_to_players_rel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_to_scouters_rel`
--

DROP TABLE IF EXISTS `users_to_scouters_rel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_to_scouters_rel` (
  `user_id` int(11) NOT NULL,
  `scouter_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`scouter_id`),
  KEY `FK_scouter_id_idx` (`scouter_id`),
  CONSTRAINT `FK_scouter_id` FOREIGN KEY (`scouter_id`) REFERENCES `scouters_info` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_to_scouters_rel`
--

LOCK TABLES `users_to_scouters_rel` WRITE;
/*!40000 ALTER TABLE `users_to_scouters_rel` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_to_scouters_rel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_types`
--

DROP TABLE IF EXISTS `users_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_types` (
  `id` int(11) NOT NULL,
  `type` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_types`
--

LOCK TABLES `users_types` WRITE;
/*!40000 ALTER TABLE `users_types` DISABLE KEYS */;
INSERT INTO `users_types` VALUES (1,'player'),(2,'scouter');
/*!40000 ALTER TABLE `users_types` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-01-27 18:40:07
