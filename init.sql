-- MySQL dump 10.13  Distrib 9.2.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: caresync
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `zip_code` varchar(5) DEFAULT NULL,
  `phone_number` varchar(10) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_a28028ba709cd7e5053a86857b` (`user_id`),
  CONSTRAINT `FK_a28028ba709cd7e5053a86857b4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES ('Admin','User','123 Main Street','New York','10001','5551234567',2,1);
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `advice`
--

DROP TABLE IF EXISTS `advice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `advice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `summary` text NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `content_url` varchar(500) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `publication_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `advice`
--

LOCK TABLES `advice` WRITE;
/*!40000 ALTER TABLE `advice` DISABLE KEYS */;
INSERT INTO `advice` VALUES (1,'🧠 Prendre soin de sa santé mentale au quotidien','\nLa santé mentale est un pilier essentiel de notre bien-être général, mais elle est souvent négligée. Prendre soin de son esprit est aussi important que prendre soin de son corps. Voici comment intégrer des habitudes simples et efficaces dans votre quotidien.\n\n---\n\n## 💡 Pourquoi est-ce important ?\n\n> \"Il n’y a pas de santé sans santé mentale.\" – OMS\n\nUne bonne santé mentale permet de :\n- Gérer le stress quotidien\n- Maintenir des relations saines\n- Être plus productif et créatif\n- Renforcer l’estime de soi\n\n---\n\n## 🛠️ 5 habitudes faciles à adopter\n\n| Habitude | Description | Fréquence conseillée |\n|---------|-------------|----------------------|\n| 📝 Journal de gratitude | Écrire 3 choses positives par jour | Quotidien |\n| 🧘 Respiration consciente | 5 minutes de respiration profonde | 2x/jour |\n| 🚶 Marches sans téléphone | Marcher sans distraction pour se recentrer | 3x/semaine |\n| 📵 Pause digitale | Éviter les écrans au moins 1h avant le coucher | Quotidien |\n| ☎️ Parler à quelqu’un | Partager ses émotions avec un proche ou un pro | Selon besoin |\n\n---\n\n## 🎯 Conseils pratiques\n\n### ✔️ Écoutez-vous\nNe minimisez pas vos émotions. Elles sont des signaux utiles à comprendre.\n\n### ✔️ Créez une routine bien-être\nLe cerveau aime la régularité. Une routine calme réduit l’anxiété.\n\n### ✔️ Apprenez à dire non\nPréservez votre énergie mentale en posant vos limites.\n\n---\n\n## 📚 Ressources utiles\n\n- [Psycom.org](https://www.psycom.org) : Informations claires sur la santé mentale\n- [Petit Bambou](https://www.petitbambou.com) : Application de méditation\n- Numéro d’écoute : 3114 (France – Prévention suicide)\n\n---\n\n## ✅ Conclusion\n\nLa santé mentale n’est pas un luxe, c’est une priorité. En prenant soin de vous un petit peu chaque jour, vous bâtissez une base solide pour affronter les défis de la vie.\n\n> Commencez petit, mais commencez aujourd’hui. 🌱\n',NULL,NULL,1,'2025-05-13 02:34:24.542499','2025-05-19 19:30:42.443921'),(2,'💤 Améliorer la qualité de son sommeil','Le sommeil est une fonction vitale : il recharge l’esprit et répare le corps. Pourtant, beaucoup négligent sa qualité.\n\n---\n\n## 😴 Pourquoi bien dormir ?\n\n> \"Le sommeil est la meilleure des méditations.\" – Dalaï Lama\n\n- Restaure le système nerveux\n- Renforce l’immunité\n- Améliore la mémoire et la concentration\n- Régule l’humeur\n\n---\n\n## 🛌 Astuces pour mieux dormir\n\n| Astuce | Description | Fréquence |\n|--------|-------------|-----------|\n| 🕖 Heures régulières | Se coucher et se lever à la même heure | Tous les jours |\n| 📵 Déconnexion digitale | Éviter les écrans 1h avant le coucher | Tous les soirs |\n| 🕯️ Ambiance relaxante | Lumière tamisée, lecture ou musique douce | Soir |\n| 🧼 Chambre fraîche et propre | Entre 17°C et 19°C pour un bon sommeil | Quotidien |\n| ☕ Éviter stimulants | Réduire café, thé et sucre le soir | Après 17h |\n\n---\n\n## ⚠️ Ce qu’il faut éviter\n\n- Travailler sur son lit\n- Faire du sport intense avant de dormir\n- Dîner trop lourd\n- Dormir trop en journée\n\n---\n\n## 📚 Ressources utiles\n\n- [Institut National du Sommeil](https://institut-sommeil-vigilance.org)\n- Application : Sleep Cycle (analyse du sommeil)\n- Livre : *Pourquoi nous dormons* – Matthew Walker\n\n---\n\n## ✅ Conclusion\n\nUn bon sommeil, c’est la base d’une vie équilibrée. Écoutez votre corps et créez une routine propice au repos.\n\n> Dormir mieux, c’est vivre mieux. 🌙\n',NULL,NULL,1,'2025-05-13 02:52:54.773178','2025-05-19 19:30:42.447023'),(3,'🥗 L’alimentation au service du bien-être mental','Ce que vous mangez influence directement votre humeur, votre énergie et votre concentration. On parle même de **\"cerveau intestinal\"** !\n\n---\n\n## 🍎 Aliments à privilégier\n\n| Catégorie | Aliments conseillés | Bienfaits |\n|-----------|---------------------|-----------|\n| 🍓 Fruits rouges | Myrtilles, fraises | Antioxydants pour le cerveau |\n| 🥬 Légumes verts | Épinards, brocolis | Riches en vitamines B |\n| 🐟 Oméga-3 | Saumon, sardines, noix | Anti-inflammatoires naturels |\n| 🍫 Chocolat noir (70%+) | Avec modération | Stimule la dopamine |\n| 🍚 Aliments complets | Riz brun, avoine | Énergie stable et durable |\n\n---\n\n## ❌ À limiter\n\n- Sucres raffinés\n- Alcool\n- Aliments ultra-transformés\n- Café en excès\n\n---\n\n## 💡 Conseil bonus\n\n> Préparez vos repas à l’avance pour éviter les choix impulsifs liés au stress.\n\n---\n\n## 📚 Ressources utiles\n\n- [Manger Bouger](https://www.mangerbouger.fr)\n- Podcast : *Change ma vie – Alimentation consciente*\n- Livre : *Le charme discret de l’intestin* – Giulia Enders\n\n---\n\n## ✅ Conclusion\n\nNourrir son esprit passe aussi par l’assiette. Une alimentation équilibrée favorise l’équilibre émotionnel et la clarté mentale.\n\n> Votre cerveau est ce que vous mangez. 🧠\n',NULL,NULL,1,'2025-05-13 14:20:44.979166','2025-05-19 19:30:42.439677'),(5,'🧘Apprendre à gérer son stress efficacement','\nLe stress est naturel, mais s’il devient chronique, il nuit à la santé. Voici des stratégies simples pour le gérer.\n\n---\n\n## 🔎 Reconnaître les signes\n\n- Fatigue constante\n- Irritabilité\n- Troubles du sommeil\n- Tensions musculaires\n\n---\n\n## 💬 Stratégies anti-stress\n\n| Technique | Description | Temps |\n|-----------|-------------|-------|\n| 🌬️ Cohérence cardiaque | 6 respirations/min pendant 5 min | 2-3 fois/jour |\n| 🧘 Méditation pleine conscience | Observer ses pensées sans jugement | 10 min/jour |\n| 📓 Écriture expressive | Écrire ce qu’on ressent | Soir |\n| 🚿 Douches froides | Réveil énergétique + détente musculaire | Matin |\n| 🎨 Activité créative | Peinture, dessin, musique | Hebdomadaire |\n\n---\n\n## 🛠️ Tips\n\n- Organisez vos journées\n- Faites des pauses régulières\n- Apprenez à déléguer\n\n---\n\n## 📚 Ressources utiles\n\n- [Mindful.org](https://www.mindful.org)\n- Application : Respirelax\n- Podcast : *Métamorphose – Se libérer du stress*\n\n---\n\n## ✅ Conclusion\n\nLe stress ne se combat pas, il se transforme. En le comprenant, on peut le canaliser vers quelque chose de constructif.\n\n> Transformez la pression en puissance. 💥\n',NULL,NULL,1,'2025-05-19 19:31:33.953372','2025-05-19 19:31:55.917682'),(6,'🏃 Bouger pour se sentir mieux – même sans sport intensif','\nPas besoin d’être athlète pour profiter des bienfaits du mouvement !\n\n---\n\n## 🚶 Pourquoi le mouvement est vital ?\n\n- Libère des endorphines (hormones du bonheur)\n- Améliore la circulation sanguine\n- Favorise un sommeil de qualité\n- Réduit l’anxiété\n\n---\n\n## 🧩 Activités douces recommandées\n\n| Activité | Bénéfices | Durée idéale |\n|----------|-----------|--------------|\n| 🚶 Marche rapide | Boost humeur + cardio doux | 30 min/jour |\n| 🧘 Yoga | Souplesse, respiration, calme | 2-3 fois/sem |\n| 🕺 Danse libre chez soi | Lâcher-prise et fun ! | 15-20 min |\n| 🧹 Ménage dynamique | Bouger en étant utile | Variable |\n| 🚲 Vélo léger | Endurance douce | Week-end |\n\n---\n\n## 🤸 Conseils pratiques\n\n- Mettez une alarme \"pause active\" toutes les heures\n- Marchez pendant vos appels téléphoniques\n- Utilisez les escaliers\n\n---\n\n## 📚 Ressources utiles\n\n- [Sport Santé](https://www.sportsante.fr)\n- Application : 7 Minute Workout\n- Vidéos YouTube : Gym douce, stretching maison\n\n---\n\n## ✅ Conclusion\n\nLe mouvement est une médecine gratuite. Bougez à votre rythme, avec plaisir.\n\n> Chaque pas compte. 👣\n',NULL,NULL,1,'2025-05-19 19:32:13.973426','2025-05-19 19:32:13.973426'),(7,'🧠 Renforcer sa concentration à l’ère des distractions','\nEntre notifications, multitâche et fatigue mentale, il est devenu difficile de rester concentré. Voici comment entraîner son cerveau à se recentrer.\n\n---\n\n## 🎯 Pourquoi améliorer sa concentration ?\n\n- Gagner du temps\n- Améliorer la qualité du travail\n- Réduire la fatigue mentale\n- Retrouver du plaisir à apprendre\n\n---\n\n## ⚙️ Techniques efficaces\n\n| Technique | Description | Outils utiles |\n|----------|-------------|---------------|\n| 🍅 Méthode Pomodoro | 25 min de focus + 5 min pause | Tomato Timer, Focus To-Do |\n| 📝 Planification visuelle | Diviser la journée en blocs | Google Agenda |\n| 🎧 Sons binauraux | Sons qui aident à la concentration | YouTube, Brain.fm |\n| 🔕 Mode avion | Bloquer les distractions | Tous supports |\n| 📵 Digital Detox | Périodes sans téléphone | 1h/jour minimum |\n\n---\n\n## 🧠 Aliments pro-concentration\n\n- Noix et graines\n- Myrtilles\n- Thé vert\n- Chocolat noir (modérément)\n\n---\n\n## 📚 Ressources utiles\n\n- Application : Forest (planter un arbre en se concentrant 🌱)\n- Livre : *Deep Work* – Cal Newport\n- Podcast : *Le Gratin – Productivité et focus*\n\n---\n\n## ✅ Conclusion\n\nConcentrez-vous sur moins pour accomplir plus. Le cerveau se muscle comme un muscle : avec de la régularité.\n\n> Moins de bruit. Plus de clarté. 🔇\n',NULL,NULL,1,'2025-05-19 19:34:12.888993','2025-05-19 19:34:12.888993'),(8,'🧡 Cultiver la bienveillance envers soi-même','\nSe critiquer est facile. S’encourager, c’est un vrai entraînement. La bienveillance envers soi est un outil de guérison et de croissance.\n\n---\n\n## 🪞 Pourquoi est-ce essentiel ?\n\n- Diminue l’anxiété\n- Renforce l’estime de soi\n- Favorise l’acceptation de ses erreurs\n- Améliore les relations avec les autres\n\n---\n\n## 💬 Exemples de discours intérieur à transformer\n\n| Pensée négative | Version bienveillante |\n|------------------|------------------------|\n| \"Je suis nul(le)\" | \"Je suis en train d’apprendre\" |\n| \"J’ai échoué\" | \"J’ai essayé, et je peux recommencer autrement\" |\n| \"Je suis trop lent(e)\" | \"Je vais à mon rythme, et c’est ok\" |\n\n---\n\n## 🛠️ Exercice quotidien\n\n> 🪞 Devant le miroir, dites chaque jour 3 phrases positives sur vous-même.\n\n---\n\n## 📚 Ressources utiles\n\n- Livre : *S’aimer enfin* – Christophe André\n- Application : I Am (affirmations)\n- Vidéo TED : *The Power of Self-Compassion* – Kristin Neff\n\n---\n\n## ✅ Conclusion\n\nLa personne avec qui vous passez le plus de temps, c’est vous. Soyez votre meilleur allié.\n\n> La bienveillance commence par soi. 💖\n',NULL,NULL,1,'2025-05-19 19:34:36.056129','2025-05-19 19:34:36.056129'),(9,'🧍‍♂️ L’importance de la posture dans le bien-être','\nNotre corps influence notre mental, et vice versa. Une bonne posture n’est pas juste esthétique : elle est thérapeutique.\n\n---\n\n## 💡 Bienfaits d’une bonne posture\n\n- Moins de douleurs dorsales\n- Meilleure respiration\n- Amélioration de l’humeur\n- Meilleure digestion\n\n---\n\n## 📏 Erreurs fréquentes à éviter\n\n- Dos arrondi devant l’écran\n- Épaules tendues vers les oreilles\n- Assise trop basse ou trop haute\n\n---\n\n## ✅ Conseils posturaux simples\n\n| Situation | Bonne posture |\n|----------|---------------|\n| 💻 Devant un écran | Dos droit, écran à hauteur des yeux, pieds à plat |\n| 📱 Sur le téléphone | Garder l’écran à hauteur des yeux |\n| 🪑 Sur une chaise | Appui lombaire, genoux à 90° |\n| 💤 En dormant | Oreiller ni trop haut, ni trop bas |\n\n---\n\n## 🧘 Bonus\n\nAjoutez du yoga postural, du gainage ou de la natation à votre routine hebdomadaire.\n\n---\n\n## 📚 Ressources utiles\n\n- Chaîne YouTube : Posture Pro / Gym douce\n- Application : Posture Reminder\n- Livre : *S\'asseoir et se tenir droit* – E. Snel\n\n---\n\n## ✅ Conclusion\n\nPrenez soin de votre dos, il vous porte toute la vie.\n\n> Le corps parle quand l’esprit se tait. 🪑\n',NULL,NULL,1,'2025-05-19 19:34:56.424488','2025-05-19 19:34:56.424488');
/*!40000 ALTER TABLE `advice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `anonymous_report`
--

DROP TABLE IF EXISTS `anonymous_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anonymous_report` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `reported_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `category` varchar(100) DEFAULT NULL,
  `status` enum('new','acknowledged','investigating','resolved','closed') NOT NULL DEFAULT 'new',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anonymous_report`
--

LOCK TABLES `anonymous_report` WRITE;
/*!40000 ALTER TABLE `anonymous_report` DISABLE KEYS */;
/*!40000 ALTER TABLE `anonymous_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `association`
--

DROP TABLE IF EXISTS `association`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `association` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `website` varchar(500) DEFAULT NULL,
  `logo_url` varchar(500) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `association`
--

LOCK TABLES `association` WRITE;
/*!40000 ALTER TABLE `association` DISABLE KEYS */;
/*!40000 ALTER TABLE `association` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `availability_slot`
--

DROP TABLE IF EXISTS `availability_slot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `availability_slot` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provider_id` int NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `status` enum('available','booked','unavailable') NOT NULL DEFAULT 'available',
  `booking_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_9c7bdbd1a60f0406a5cf22862f` (`booking_id`),
  KEY `FK_78afb2f101334f7623d6b587bcd` (`provider_id`),
  CONSTRAINT `FK_78afb2f101334f7623d6b587bcd` FOREIGN KEY (`provider_id`) REFERENCES `provider` (`id`),
  CONSTRAINT `FK_9c7bdbd1a60f0406a5cf22862f3` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `availability_slot`
--

LOCK TABLES `availability_slot` WRITE;
/*!40000 ALTER TABLE `availability_slot` DISABLE KEYS */;
/*!40000 ALTER TABLE `availability_slot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `booking_date` datetime NOT NULL,
  `status` enum('pending','confirmed','cancelled_employee','cancelled_provider','completed','no_show') NOT NULL DEFAULT 'pending',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `notes` text,
  `service_id` int DEFAULT NULL,
  `event_id` int DEFAULT NULL,
  `provider_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_227cfeeee338c1e04fab754e56b` (`service_id`),
  KEY `FK_020993a41994bae310ecd6c17a5` (`event_id`),
  KEY `FK_517b145b41f0b2696ee69a39f6e` (`provider_id`),
  KEY `FK_ddeea2dd0dfa9414959dec60f80` (`employee_id`),
  CONSTRAINT `FK_020993a41994bae310ecd6c17a5` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_227cfeeee338c1e04fab754e56b` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_517b145b41f0b2696ee69a39f6e` FOREIGN KEY (`provider_id`) REFERENCES `provider` (`id`),
  CONSTRAINT `FK_ddeea2dd0dfa9414959dec60f80` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking`
--

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` VALUES (9,205,'2025-02-09 12:00:00','completed','2025-05-09 00:28:34.939835',NULL,5,NULL,3),(10,205,'2025-05-13 17:30:00','confirmed','2025-05-10 18:59:25.000000',NULL,4,NULL,3),(11,205,'2025-04-15 17:00:06','completed','2025-05-10 19:00:46.355392',NULL,3,NULL,3),(12,205,'2025-03-12 09:00:54','completed','2025-05-10 15:01:17.000000',NULL,3,NULL,3),(14,206,'2025-04-15 20:44:57','completed','2025-05-11 20:45:08.000000',NULL,4,NULL,1),(15,207,'2025-04-15 20:47:02','completed','2025-05-11 20:47:25.215815',NULL,5,NULL,2),(16,208,'2025-04-10 20:48:06','completed','2025-05-11 20:47:46.000000',NULL,3,NULL,2),(17,209,'2025-04-09 20:48:17','completed','2025-05-11 20:48:24.000000',NULL,5,NULL,1),(18,210,'2025-04-05 20:48:51','completed','2025-05-11 20:48:58.000000',NULL,2,NULL,1),(19,199,'2025-05-16 08:00:00','confirmed','2025-05-13 01:41:40.002305',NULL,1,NULL,1),(20,199,'2025-05-16 11:00:00','confirmed','2025-05-13 01:42:12.805782',NULL,1,NULL,1),(21,199,'2025-05-15 15:00:00','confirmed','2025-05-13 01:43:22.175973',NULL,1,NULL,1),(22,199,'2025-05-16 08:00:00','confirmed','2025-05-13 01:44:44.222687',NULL,5,NULL,3),(23,199,'2025-05-16 11:00:00','confirmed','2025-05-13 01:50:28.189552',NULL,5,NULL,3),(28,199,'2025-05-22 08:00:00','confirmed','2025-05-19 20:29:49.832411',NULL,1,NULL,1);
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certification`
--

DROP TABLE IF EXISTS `certification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certification` (
  `title` varchar(255) NOT NULL,
  `industry` varchar(255) DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `issuing_authority` varchar(255) NOT NULL,
  `issue_date` date NOT NULL,
  `expiry_date` date DEFAULT NULL,
  `document_url` varchar(500) DEFAULT NULL,
  `is_verified` tinyint NOT NULL DEFAULT '0',
  `provider_id` int NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `FK_74026a1c2d4de67895d9ccf888d` (`provider_id`),
  CONSTRAINT `FK_74026a1c2d4de67895d9ccf888d` FOREIGN KEY (`provider_id`) REFERENCES `provider` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certification`
--

LOCK TABLES `certification` WRITE;
/*!40000 ALTER TABLE `certification` DISABLE KEYS */;
INSERT INTO `certification` VALUES ('Linux certif','Programmation informatique',1,'Unknown','2025-05-08',NULL,'uploads/provider-documents/1746697604412-720828620.pdf',0,1,'Linux'),('Linux certif ','Developpement web ',2,'Unknown','2025-05-08',NULL,'uploads/provider-documents/1746698756664-393620201.pdf',0,1,'Sahur'),('Linux','Developpement web ',3,'Unknown','2025-05-08',NULL,'uploads/provider-documents/1746698756666-303474613.pdf',0,1,'Brr Brrr patapim / balernia capuccina '),('Certif','Dev',4,'Unknown','2025-05-08',NULL,'uploads/provider-documents/1746699042704-679200353.pdf',0,3,'somthing bad ');
/*!40000 ALTER TABLE `certification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `postId` int DEFAULT NULL,
  `authorId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_94a85bb16d24033a2afdd5df060` (`postId`),
  KEY `FK_276779da446413a0d79598d4fbd` (`authorId`),
  CONSTRAINT `FK_276779da446413a0d79598d4fbd` FOREIGN KEY (`authorId`) REFERENCES `employee` (`id`),
  CONSTRAINT `FK_94a85bb16d24033a2afdd5df060` FOREIGN KEY (`postId`) REFERENCES `post` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (14,' Vos astuces pour décrocher vraiment pendant le week-end ? J’en cherche ! 👀 ','2025-05-14 00:27:48.402165','2025-05-19 19:56:18.087626',6,199),(15,'Tellement vrai… On a tendance à sacrifier notre bien-être pour la performance, mais à quel prix ? 😞','2025-05-14 00:28:00.996999','2025-05-19 19:57:10.374231',6,201),(16,'Pour vous, c’est quoi “réussir” sans s’oublier ? Vos retours m’intéressent ! 💬','2025-05-14 00:28:13.393494','2025-05-19 19:57:10.376313',6,203),(17,'Merci pour ce post plein de bon sens ! ','2025-05-14 00:28:27.847337','2025-05-19 19:57:10.370179',10,204),(18,'Ne rien faire”, c’est devenu un luxe aujourd’hui. On culpabilise même de s’allonger 10 minutes 😅 ','2025-05-14 00:28:41.463976','2025-05-19 19:57:51.422119',8,210),(19,'Merci pour ce post !','2025-05-14 00:28:50.148628','2025-05-19 19:57:51.418828',7,280),(20,'J’ai commencé à poser mes limites… Résultat : plus de respect et moins de stress 👏','2025-05-14 00:52:28.623258','2025-05-19 19:56:18.081526',7,199),(21,'Le succès n’est rien sans la santé','2025-05-17 17:59:49.064745','2025-05-19 19:56:18.083526',6,285),(22,'Et si on intégrait les pauses et l\'écoute de soi dans notre définition du succès ?','2025-05-19 19:49:56.967959','2025-05-19 19:58:15.659687',6,288);
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company` (
  `name` varchar(255) NOT NULL,
  `address` varchar(160) DEFAULT NULL,
  `city` varchar(160) DEFAULT NULL,
  `founder` varchar(160) DEFAULT NULL,
  `industry` varchar(160) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
  `id` int NOT NULL AUTO_INCREMENT,
  `registry_number` varchar(255) NOT NULL,
  `creation_date` date DEFAULT NULL,
  `subscription_tier` enum('starter','basic','premium','custom') DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `description` text,
  `phoneNumber` varchar(25) DEFAULT NULL,
  `size` varchar(60) DEFAULT NULL,
  `subscriptionCompleted` tinyint NOT NULL DEFAULT '0',
  `profileCompleted` tinyint NOT NULL DEFAULT '0',
  `employeesCompleted` tinyint NOT NULL DEFAULT '0',
  `contractCompleted` tinyint NOT NULL DEFAULT '0',
  `tutorialCompleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_a76c5cd486f7779bd9c319afd2` (`name`),
  UNIQUE KEY `IDX_2f807e3060e9ad054abc67564c` (`registry_number`),
  UNIQUE KEY `REL_879141ebc259b4c0544b3f1ea4` (`user_id`),
  CONSTRAINT `FK_879141ebc259b4c0544b3f1ea4c` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=149 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT INTO `company` VALUES ('Google','1600 Amphitheatre Parkway','Mountain View','Larry Page and Sergey Brin','Technology','ACTIVE',81,'US123456789','1998-09-04','custom',3,'Search engine and technology company',NULL,NULL,0,0,0,1,0),('Amazon','410 Terry Ave N','Seattle','Jeff Bezos','E-commerce','ACTIVE',84,'US987654321','1994-07-05','custom',2,'Online marketplace and cloud services provider',NULL,NULL,0,0,0,0,0),('Microsoft','One Microsoft Way','Redmond','Bill Gates and Paul Allen','Technology','ACTIVE',122,'US456123789','1975-04-04','custom',4,'Software and hardware company','+1 (425) 882-8080','micro',0,0,0,0,0),('Apple','One Apple Park Way','Cupertino','Steve Jobs, Steve Wozniak, Ronald Wayne','Technology','ACTIVE',123,'US789456123','1976-04-01','custom',5,'Consumer electronics and software company','+1 (408) 996-1010','large',0,0,0,0,0),('Facebook','1 Hacker Way','Menlo Park','Mark Zuckerberg','Social Media','ACTIVE',124,'US159753456','2004-02-04','custom',6,'Social networking service company','+1 (650) 543-4800','large',0,0,0,0,0),('Netflix','100 Winchester Circle','Los Gatos','Reed Hastings and Marc Randolph','Entertainment','ACTIVE',125,'US357159753','1997-08-29','basic',7,'Streaming service and production company','+1 (408) 540-3700','medium',0,0,0,0,0),('Tesla','3500 Deer Creek Road','Palo Alto','Elon Musk','Automotive','ACTIVE',126,'US951753456','2003-07-01','custom',8,'Electric vehicle and clean energy company','+1 (650) 681-5000','small',0,0,0,0,0),('Uber','1455 Market St','San Francisco','Travis Kalanick and Garrett Camp','Transportation','ACTIVE',127,'US753159852','2009-03-01','basic',9,'Ride-hailing and delivery service company','+1 (800) 353-8237','large',0,0,0,0,0),('Twitter','1355 Market St','San Francisco','Jack Dorsey, Noah Glass, Biz Stone, Evan Williams','Social Media','ACTIVE',128,'US258963147','2006-03-21','basic',10,'Microblogging and social network service','+1 (415) 222-9670',NULL,0,0,0,0,0),('Spotify','4 World Trade Center','New York','Daniel Ek and Martin Lorentzon','Music','ACTIVE',130,'US147258369','2006-04-23','starter',12,'Audio streaming and media services provider','+1 (212) 675-1560',NULL,0,0,0,0,0),('LinkedIn','1000 W Maude Ave','Sunnyvale','Reid Hoffman','Professional Networking','ACTIVE',131,'US741852963','2002-12-28','basic',13,'Business and employment-oriented online service','+1 (650) 687-3600',NULL,0,0,0,0,0),('Adobe','345 Park Avenue','San Jose','John Warnock and Charles Geschke','Software','ACTIVE',132,'US963852741','1982-12-01','custom',14,'Software company specializing in creative tools','+1 (408) 536-6000',NULL,0,0,0,0,0),('Salesforce','Salesforce Tower','San Francisco','Marc Benioff','CRM Software','ACTIVE',133,'US852741963','1999-03-08','custom',15,'Cloud-based software company','+1 (800) 664-9073',NULL,0,0,0,0,0),('Intel','2200 Mission College Blvd','Santa Clara','Gordon Moore and Robert Noyce','Semiconductor','ACTIVE',134,'US321654987','1968-07-18','basic',16,'Semiconductor chip manufacturer','+1 (408) 765-8080',NULL,0,0,0,0,0),('IBM','One New Orchard Road','Armonk','Charles Ranlett Flint','Technology','ACTIVE',135,'US456789123','1911-06-16','custom',17,'Computing, software, and hardware company','+1 (914) 499-1900',NULL,0,0,0,0,0),('Oracle','500 Oracle Parkway','Redwood City','Larry Ellison, Bob Miner, Ed Oates','Enterprise Software','ACTIVE',136,'US789123456','1977-06-16','custom',18,'Database management systems provider','+1 (650) 506-7000',NULL,0,0,0,0,0),('Cisco','170 West Tasman Dr','San Jose','Leonard Bosack and Sandy Lerner','Networking','ACTIVE',137,'US654789321','1984-12-10','basic',19,'Networking hardware and telecommunications company','+1 (408) 526-4000',NULL,0,0,0,0,0),('Samsung','129 Samsung-ro','Seoul','Lee Byung-chul','Electronics','ACTIVE',138,'KR123456789','1938-03-01','custom',20,'Electronics and semiconductors manufacturer','+82 2 2255 0114',NULL,0,0,0,0,0),('Toyota','1 Toyota-Cho','Toyota City','Kiichiro Toyoda','Automotive','ACTIVE',139,'JP987654321','1937-08-28','basic',21,'Automobile manufacturer','+81 565 28 2121',NULL,0,0,0,0,0),('ESGI','06 RUE CHRISTOPH COLOMB','MASSY','HENOU','Tech','ACTIVE',140,'12345678902344','1980-03-21',NULL,22,NULL,'0753346760','large',0,0,0,0,0),('ESIEA','12 rue de paris',NULL,'Jean Dupont','Informatique','ACTIVE',141,'12345678901234',NULL,'starter',23,NULL,'+33781924121','small',1,1,1,1,0),('EPITA','12 rue de paris',NULL,'Jean Dupont',NULL,'ACTIVE',143,'12345678901235',NULL,NULL,27,NULL,'33753346760','small',0,0,0,0,0),('CARMEX','12 rue de paris',NULL,'NAFA3',NULL,'ACTIVE',144,'12345678901236',NULL,'basic',28,NULL,'0744943011','small',1,0,0,0,0),('essey','Rue  19 Juin -2- 112','Guelma','essey','Social Media','ACTIVE',145,'12345678910116','2025-05-13','premium',263,NULL,'0783971714','large',1,1,1,1,0),('CHARIKA','sowhere on my mind',NULL,'WAHMIYA','Social Media','ACTIVE',147,'12345678901510',NULL,'basic',265,NULL,'+33744941510','small',1,1,0,1,0),('trying ','sowhere on my mind',NULL,'again',NULL,'ACTIVE',148,'12345678901369',NULL,NULL,266,NULL,'07 44 94 5487','medium',0,0,0,0,0);
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_onboarding_status`
--

DROP TABLE IF EXISTS `company_onboarding_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_onboarding_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subscription` tinyint NOT NULL DEFAULT '0',
  `profile` tinyint NOT NULL DEFAULT '0',
  `employees` tinyint NOT NULL DEFAULT '0',
  `contract` tinyint NOT NULL DEFAULT '0',
  `tutorial` tinyint NOT NULL DEFAULT '0',
  `completedAt` timestamp NULL DEFAULT NULL,
  `company_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_dfb394ed203c62fbf2ebbc0180` (`company_id`),
  CONSTRAINT `FK_dfb394ed203c62fbf2ebbc01806` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_onboarding_status`
--

LOCK TABLES `company_onboarding_status` WRITE;
/*!40000 ALTER TABLE `company_onboarding_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `company_onboarding_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contract`
--

DROP TABLE IF EXISTS `contract`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contract` (
  `startDate` date NOT NULL,
  `endDate` date DEFAULT NULL,
  `status` enum('pending','verified','rejected','active','inactive') NOT NULL DEFAULT 'pending',
  `renewable` tinyint NOT NULL DEFAULT '1',
  `conditions` text,
  `id` int NOT NULL AUTO_INCREMENT,
  `file_url` varchar(500) DEFAULT NULL,
  `company_id` int NOT NULL,
  `originating_quote_id` int DEFAULT NULL,
  `subscriptionTier` enum('starter','basic','premium','custom') NOT NULL,
  `price` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_252bd20e19d8d731512da5a50c` (`originating_quote_id`),
  KEY `FK_1dbf9a5c77120410dfac83b817c` (`company_id`),
  CONSTRAINT `FK_1dbf9a5c77120410dfac83b817c` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_252bd20e19d8d731512da5a50c7` FOREIGN KEY (`originating_quote_id`) REFERENCES `quote` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contract`
--

LOCK TABLES `contract` WRITE;
/*!40000 ALTER TABLE `contract` DISABLE KEYS */;
INSERT INTO `contract` VALUES ('2025-04-30','2026-04-30','active',1,'',3,'/storage/contracts/contract-1746039545354.pdf',144,NULL,'starter',5760.00),('2025-04-30','2026-04-30','active',1,'',4,'/storage/contracts/contract-1746039702172.pdf',141,NULL,'starter',5400.00),('2023-04-06','2024-04-26','inactive',1,NULL,5,'/storage/contracts/contract-1746039702172.pdf',141,NULL,'basic',9200.00),('2020-04-09','2021-04-30','inactive',1,NULL,6,'/storage/contracts/contract-1746039702172.pdf',141,NULL,'starter',8329.00),('2025-05-01','2025-05-07','inactive',1,'',7,'/storage/contrats/contract-1746112758362.pdf',141,NULL,'starter',6048.00),('2025-05-17','2026-05-17','active',1,'',8,'/storage/contracts/contract-1747493892423.pdf',147,NULL,'starter',9900.00),('2025-05-17','2026-05-03','active',1,'',9,'/storage/contracts/contract-1747494247435.pdf',145,NULL,'starter',8400.00);
/*!40000 ALTER TABLE `contract` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `devis`
--

DROP TABLE IF EXISTS `devis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `devis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `max_employees` int NOT NULL,
  `included_activities` int NOT NULL,
  `included_appointments` int NOT NULL,
  `additional_appointment_price` decimal(10,2) NOT NULL,
  `chatbot_access` enum('limited','unlimited') NOT NULL,
  `chatbot_questions` int DEFAULT NULL,
  `weekly_advice` tinyint NOT NULL DEFAULT '0',
  `personalized_advice` tinyint NOT NULL DEFAULT '0',
  `active` tinyint NOT NULL DEFAULT '1',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devis`
--

LOCK TABLES `devis` WRITE;
/*!40000 ALTER TABLE `devis` DISABLE KEYS */;
INSERT INTO `devis` VALUES (1,'starter',NULL,75.00,50,5,12,75.00,'limited',6,12,1,1,'2025-05-17 20:49:33.287309','2025-05-17 20:49:33.287309'),(2,'basic',NULL,20.00,10,10,25,100.00,'limited',1200,22,0,1,'2025-05-17 20:50:24.340538','2025-05-17 22:42:56.000000'),(5,'premium','',360.00,1000,12,12,22.00,'unlimited',0,1,1,1,'2025-05-17 21:49:23.648313','2025-05-17 21:58:18.000000');
/*!40000 ALTER TABLE `devis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donation`
--

DROP TABLE IF EXISTS `donation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('financial','material') NOT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `description` text,
  `donation_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `employee_id` int NOT NULL,
  `association_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_9c18c48a16228aa4ee995216829` (`employee_id`),
  KEY `FK_f7bdcc97978b268888918e7ab8c` (`association_id`),
  CONSTRAINT `FK_9c18c48a16228aa4ee995216829` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_f7bdcc97978b268888918e7ab8c` FOREIGN KEY (`association_id`) REFERENCES `association` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donation`
--

LOCK TABLES `donation` WRITE;
/*!40000 ALTER TABLE `donation` DISABLE KEYS */;
/*!40000 ALTER TABLE `donation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `address` varchar(160) DEFAULT NULL,
  `occupied_job` varchar(100) NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `starting_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `company_id` int NOT NULL,
  `contract_type` varchar(255) NOT NULL DEFAULT 'CDI',
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_f61258e58ed35475ce1dba0379` (`user_id`),
  KEY `FK_3f25598a5f106392263f58a2eb2` (`company_id`),
  CONSTRAINT `FK_3f25598a5f106392263f58a2eb2` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_f61258e58ed35475ce1dba03797` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=289 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES ('\"12 Rue de la Paix- Paris\"','Développeur Senior',196,'Jean','Dupont','2023-01-15',NULL,237,141,'CDI'),('\"45 Avenue des Champs - Lyon\"','Chef de Projet',197,'Marie','Martin','2023-02-01','2024-02-01',238,141,'CDD'),('\"8 Boulevard Voltaire - Marseille\"','Responsable RH',198,'Pierre','Dubois','2022-06-10',NULL,239,141,'CDI'),('\"3 Rue du Commerce - Lille\"','Designer UX/UI',199,'Sophie','Leroy','2023-03-15',NULL,240,141,'CDI'),('\"15 Avenue Foch - Toulouse\"','Marketing Manager',201,'Amélie','Petit','2022-11-01',NULL,242,141,'CDI'),('\"9 Rue de Strasbourg - Nice\"','Product Owner',203,'Laura','Simon','2023-01-05','2023-12-31',244,141,'Indépendant'),('\"18 Rue de la Liberté - Strasbourg\"','DevOps Engineer',204,'Julien','Lefebvre','2022-09-15',NULL,245,141,'CDI'),('\"5 Place Bellecour - Lyon\"','Responsable Communication',205,'Céline','Roux','2023-02-20',NULL,246,141,'CDI'),('35 rue du moulin - palaiseau','Designer UX/UI',206,'Mazene','ZERGUINE','2025-05-11',NULL,258,81,'CDI'),('139 rue d\'estienne d\'ovres veriers','Data Analyst',207,'Akouz','ZER','2025-05-11',NULL,259,81,'CDI'),('CDI','Développeur Senior',208,'Tung','Sahur','2025-05-06',NULL,260,126,'CDI'),('6 rue de massy - Massy ','Responsable RH',209,'Nouha','ZERGUINE','2025-05-06',NULL,261,133,'CDI'),('Guelma ','Product Owner',210,'Nada','ZER','2025-05-02',NULL,262,133,'CDD'),('\"25 Oak Street - Chicago\"','Software Engineer',279,'Emma','Johnson','2023-03-10',NULL,345,145,'CDI'),('\"78 Maple Avenue - Boston\"','Project Manager',280,'Liam','Williams','2023-01-05','2024-01-05',346,145,'CDD'),('\"34 Pine Road - Seattle\"','HR Director',281,'Olivia','Brown','2022-07-15',NULL,347,145,'CDI'),('\"12 Elm Boulevard - Austin\"','UX Designer',282,'Noah','Jones','2023-04-22',NULL,348,145,'CDI'),('\"56 Cedar Lane - Denver\"','Data Scientist',283,'Ava','Garcia','2023-06-15','2023-12-15',349,145,'Stage'),('\"89 Birch Street - San Francisco\"','Marketing Director',284,'William','Miller','2022-10-01',NULL,350,145,'CDI'),('\"23 Redwood Drive - Los Angeles\"','Fullstack Developer',285,'Sophia','Davis','2023-05-12',NULL,351,145,'CDI'),('\"45 Sequoia Court - Miami\"','Product Manager',286,'Benjamin','Rodriguez','2023-02-18','2023-12-31',352,145,'Freelance'),('\"67 Willow Way - Atlanta\"','Cloud Architect',287,'Mia','Martinez','2022-08-20',NULL,353,145,'CDI'),('\"90 Spruce Circle - Dallas\"','Communications Lead',288,'James','Wilson','2023-03-05',NULL,354,145,'CDI');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evaluation`
--

DROP TABLE IF EXISTS `evaluation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evaluation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provider_id` int NOT NULL,
  `rating` tinyint DEFAULT NULL,
  `comment` text,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `rated_by_employee_id` int DEFAULT NULL,
  `booking_id` int DEFAULT NULL,
  `is_like` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_da9f0fbf4a35bebe7bb38983f97` (`provider_id`),
  KEY `FK_7f536e7903faed4e1fe9ea96123` (`rated_by_employee_id`),
  KEY `FK_776efce2860a7d80ccee7109da7` (`booking_id`),
  CONSTRAINT `FK_776efce2860a7d80ccee7109da7` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_7f536e7903faed4e1fe9ea96123` FOREIGN KEY (`rated_by_employee_id`) REFERENCES `employee` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_da9f0fbf4a35bebe7bb38983f97` FOREIGN KEY (`provider_id`) REFERENCES `provider` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluation`
--

LOCK TABLES `evaluation` WRITE;
/*!40000 ALTER TABLE `evaluation` DISABLE KEYS */;
INSERT INTO `evaluation` VALUES (16,1,NULL,NULL,'2025-05-17 22:37:39.845728',279,NULL,1),(17,1,NULL,NULL,'2025-05-17 22:41:47.147080',199,NULL,0);
/*!40000 ALTER TABLE `evaluation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `start_date` datetime NOT NULL,
  `end_date` datetime DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  `is_active` tinyint NOT NULL DEFAULT '1',
  `image_url` varchar(500) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `company_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_a9407464e6c9a222bf6027525a8` (`company_id`),
  CONSTRAINT `FK_a9407464e6c9a222bf6027525a8` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
INSERT INTO `event` VALUES (1,'Journée Bien-Être \"Esprit & Corps','Une journée immersive dédiée à l’harmonie entre le corps et l’esprit. Animée par Claire Durand, cette session inclut une série de pratiques douces : yoga vinyasa, respiration guidée, relaxation profonde et méditation sonore. L’objectif est d’aider les participants à relâcher les tensions physiques, libérer le mental et repartir avec des outils concrets pour mieux gérer le stress au quotidien.\nPublic visé : Adultes débutants ou initiés','2025-05-20 09:00:00','2025-05-20 18:00:00','Studio Zen, Paris',40,0,NULL,'2025-05-13 19:39:14.537577','2025-05-19 20:44:19.487919',NULL),(5,'Retraite urbaine : Calme & Clarté','Une mini-retraite de 2 jours conçue pour se recentrer sans quitter la ville. Julie Lefèvre guidera des sessions de méditation pleine conscience, d’exploration émotionnelle et de développement personnel. L’événement inclura des cercles de parole, des moments de silence, des lectures inspirantes et des pratiques pour renforcer la présence à soi. Une bulle de calme pour se reconnecter avec l’essentiel.\nPublic visé : Toute personne en quête de recentrage\nLieu : Centre Harmonie, Paris','2025-05-30 13:40:00','2025-05-30 13:00:00','Centre Harmonie, Paris',30,1,NULL,'2025-05-17 13:40:40.671191','2025-05-19 20:38:09.104443',NULL),(7,'Conférence \"Santé mentale : briser les tabous','Une conférence grand public qui vise à sensibiliser et à éduquer sur les enjeux de la santé mentale. Animée par Karim Bencheikh, elle abordera les stigmas liés aux troubles psychiques, les ressources disponibles pour se faire aider, et des témoignages de patients. Une partie interactive permettra aux participants de poser des questions anonymement et d’échanger avec des professionnels.\nPublic visé : Grand public, familles, jeunes adultes','2025-06-01 09:00:00','2025-06-01 12:00:00','Salle municipale, Paris 75000',50,1,NULL,'2025-05-19 20:42:44.154963','2025-05-19 20:42:44.154963',NULL),(8,'Bootcamp Bien-Être & Vitalité','Un événement dynamique en plein air combinant activité physique, respiration et relaxation. Claire Durand animera une série d’ateliers : échauffement doux, yoga énergétique, marche consciente, exercices de respiration, étirements et méditation au coucher du soleil. Une journée pour libérer l’énergie, renforcer le corps et revitaliser l’esprit.\nPublic visé : Adultes actifs (niveau intermédiaire)','2025-06-02 10:00:00','2025-06-02 12:00:00','Parc des Buttes-Chaumont, Paris',20,1,NULL,'2025-05-19 20:43:31.324387','2025-05-19 20:43:31.324387',NULL),(9,'Mieux vivre avec l’anxiété','Cet atelier, animé par le psychologue Karim Bencheikh, propose des techniques issues des thérapies cognitivo-comportementales (TCC) pour comprendre, apprivoiser et gérer les troubles anxieux. À travers des exercices pratiques, des échanges de groupe et des mises en situation, les participants apprendront à identifier leurs schémas de pensée, à les modifier et à gagner en apaisement dans leur vie quotidienne.\nPublic visé : Adultes souffrant de stress ou d’anxiété chronique','2025-06-03 11:00:00','2025-06-03 16:30:10','Studio Zen, Paris',25,1,NULL,'2025-05-19 20:45:37.319984','2025-05-19 20:46:37.785560',NULL);
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_employees`
--

DROP TABLE IF EXISTS `event_employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_employees` (
  `event_id` int NOT NULL,
  `employee_id` int NOT NULL,
  PRIMARY KEY (`event_id`,`employee_id`),
  KEY `IDX_91a136a4d9d67d890a9cd4b001` (`event_id`),
  KEY `IDX_9c6fd4a235f49843048d977c93` (`employee_id`),
  CONSTRAINT `FK_91a136a4d9d67d890a9cd4b001c` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_9c6fd4a235f49843048d977c93b` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_employees`
--

LOCK TABLES `event_employees` WRITE;
/*!40000 ALTER TABLE `event_employees` DISABLE KEYS */;
INSERT INTO `event_employees` VALUES (1,196),(1,199),(5,279),(5,285);
/*!40000 ALTER TABLE `event_employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_entity`
--

DROP TABLE IF EXISTS `event_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_entity` (
  `id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_entity`
--

LOCK TABLES `event_entity` WRITE;
/*!40000 ALTER TABLE `event_entity` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice`
--

DROP TABLE IF EXISTS `invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice` (
  `status` enum('payed','pending') NOT NULL DEFAULT 'pending',
  `description` text,
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(50) NOT NULL,
  `invoice_date` date NOT NULL,
  `due_date` date DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `payment_reference` varchar(100) DEFAULT NULL,
  `document_url` varchar(500) DEFAULT NULL,
  `provider_id` int DEFAULT NULL,
  `company_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_c7ec75a1a4068196ea74b920df` (`invoice_number`),
  KEY `FK_88304112e8ef2361ee961b01287` (`provider_id`),
  KEY `FK_7718b2d8c649496f6ffd8e0399d` (`company_id`),
  CONSTRAINT `FK_7718b2d8c649496f6ffd8e0399d` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_88304112e8ef2361ee961b01287` FOREIGN KEY (`provider_id`) REFERENCES `provider` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice`
--

LOCK TABLES `invoice` WRITE;
/*!40000 ALTER TABLE `invoice` DISABLE KEYS */;
INSERT INTO `invoice` VALUES ('payed',NULL,1,'INV-465272459','2025-05-30','2025-05-30',5760.00,'SUBSCRIPTION_basic','/storage/invoices/invoice-1746039545367.pdf',NULL,144),('payed',NULL,2,'INV-773959954','2025-05-30','2025-05-30',5400.00,'SUBSCRIPTION_starter','/storage/invoices/invoice-1746039702185.pdf',NULL,141),('payed',NULL,3,'INV-685949478','2025-05-31','2025-05-31',6048.00,'SUBSCRIPTION_starter','/storage/factures/invoice-1746112758376.pdf',NULL,141),('pending','Services summary for May',11,'BC-PROV-202505-3-570a','2025-05-11','2025-06-10',720.00,NULL,'/storage/invoices/invoice-1746996050060.pdf',3,141),('payed',NULL,12,'INV-680104657','2025-06-16','2025-06-16',9900.00,'SUBSCRIPTION_basic','/storage/invoices/invoice-1747493892435.pdf',NULL,147),('payed',NULL,13,'INV-844890662','2025-06-16','2025-06-16',8400.00,'SUBSCRIPTION_premium','/storage/invoices/invoice-1747494247449.pdf',NULL,145),('pending','Services summary for May',36,'BC-PROV-202505-1-4954','2025-05-17','2025-06-16',2000.00,NULL,'/storage/invoices/invoice-1747499080012.pdf',1,81),('pending','Services summary for May',37,'BC-PROV-202505-1-243a','2025-05-17','2025-06-16',40000.00,NULL,'/storage/invoices/invoice-1747499080023.pdf',1,133);
/*!40000 ALTER TABLE `invoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `sender_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_c0ab99d9dfc61172871277b52f6` (`sender_id`),
  CONSTRAINT `FK_c0ab99d9dfc61172871277b52f6` FOREIGN KEY (`sender_id`) REFERENCES `employee` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` VALUES (1,'hello ','2025-05-14 04:37:10.958095','2025-05-19 18:04:29.438486',203),(2,'Heeeeey','2025-05-14 04:38:09.525681','2025-05-19 18:04:38.381119',201),(3,'What\'s up !!','2025-05-14 04:39:42.691923','2025-05-19 18:05:15.297870',208),(4,'HEllo les amis ...','2025-05-14 04:40:55.600281','2025-05-19 18:02:47.483977',204),(5,'Bonjour !','2025-05-14 04:46:18.099577','2025-05-19 18:05:05.315933',205),(6,'Salut','2025-05-17 12:15:45.907862','2025-05-19 18:02:47.496988',199),(7,'bonjour','2025-05-17 15:59:57.765129','2025-05-19 18:02:47.492113',285),(8,'G.M','2025-05-17 16:04:46.316299','2025-05-19 18:02:47.495545',279),(9,'hello hello','2025-05-19 18:05:42.486111','2025-05-19 18:05:56.065549',280);
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `isRead` tinyint NOT NULL DEFAULT '0',
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_928b7aa1754e08e1ed7052cb9d8` (`user_id`),
  CONSTRAINT `FK_928b7aa1754e08e1ed7052cb9d8` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `isRead` tinyint NOT NULL DEFAULT '0',
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_9a8a82462cab47c73d25f49261f` (`user_id`),
  CONSTRAINT `FK_9a8a82462cab47c73d25f49261f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `onboarding_status`
--

DROP TABLE IF EXISTS `onboarding_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `onboarding_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subscription` tinyint NOT NULL DEFAULT '0',
  `profile` tinyint NOT NULL DEFAULT '0',
  `employees` tinyint NOT NULL DEFAULT '0',
  `contract` tinyint NOT NULL DEFAULT '0',
  `tutorial` tinyint NOT NULL DEFAULT '0',
  `completedAt` timestamp NULL DEFAULT NULL,
  `companyId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_ec068dd28c3c67bbdf2513b0f4` (`companyId`),
  CONSTRAINT `FK_ec068dd28c3c67bbdf2513b0f4c` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onboarding_status`
--

LOCK TABLES `onboarding_status` WRITE;
/*!40000 ALTER TABLE `onboarding_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `onboarding_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `authorId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_c6fb082a3114f35d0cc27c518e0` (`authorId`),
  CONSTRAINT `FK_c6fb082a3114f35d0cc27c518e0` FOREIGN KEY (`authorId`) REFERENCES `employee` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES (6,'🧠 Santé mentale au travail\n\"3 signaux que votre esprit est en surcharge\"\n\n🔄 Format : Carrousel\n\n🔍 Contenu :\n\nDifficulté à se concentrer\n\nIrritabilité inhabituelle\n\nPerte d’intérêt pour les tâches\n\n💬 Call to Action : \"Quels sont vos signaux d’alerte personnels ?\"\n\n\"Burn-out vs. simple fatigue : faire la différence\"\n\n📊 Format : Tableau comparatif\n\n✅ Bonus : proposer une checklist PDF\n\n\"Pourquoi il faut déculpabiliser la pause mentale\"\n\n📷 Image d’une personne en pause + citation (\"Se reposer, c’est aussi travailler à long terme\")\n\n\"5 minutes de respiration guidée au bureau (exercice rapide)\"\n\n🎥 Vidéo courte ou reel\n\n','2025-05-13 22:35:27.551594','2025-05-19 19:41:08.440099',199),(7,'💪 Santé physique au travail\n\"Exercices discrets à faire au bureau pour éviter les douleurs\"\n\n🎨 Format : infographie ou démonstration GIF\n\n🧘‍♀️ Contenu :\n\nÉtirement de nuque\n\nRotation d’épaules\n\nPosture de l’enfant sur chaise\n\n\"Le bon setup ergonomique pour éviter le mal de dos\"\n\n🪑 Carrousel avec visuels : Écran à hauteur, dos droit, souris bien placée\n\n\"Hydratation & productivité : un duo inséparable\"\n\n💧 Format : Post simple avec tips\n\nIdée bonus : \"3 boissons meilleures que le café\"','2025-05-14 00:52:01.208374','2025-05-19 19:41:58.756800',204),(8,'🧘 Santé morale et équilibre\n\"Travailler dur ne doit pas signifier s’oublier\"\n\n❤️ Format : Citation + réflexion\n\nCitation proposée : “Le succès n’est rien sans la santé.”\n\n\"Poser ses limites au travail : comment dire non sans culpabilité ?\"\n\n💬 Format : post en storytelling (exemple d’une situation vécue + conseils)\n\n\"Le pouvoir du \'vrai\' repos : ne rien faire, c’est productif aussi\"\n\n💤 Format : Image + texte court\n\nBonus : conseils pour un week-end réellement reposant','2025-05-17 17:59:32.981453','2025-05-19 19:41:58.760303',285),(10,'🎯 Bonus idées d’interactions\nSondage\n\nQuestion : \"Combien de pauses par jour prenez-vous vraiment ?\"\n\nRéponses :\n\nMoins de 2\n\n3 à 5\n\nPlus de 5\n\nJ’ai oublié ce qu’est une pause 😅\n\nChallenge hebdo #SantéAuTravail\n\nPropose un mini défi chaque lundi :\n\n\"1 pause sans téléphone\"\n\n\"1 compliment à un collègue\"\n\n\"1 minute les yeux fermés avant la réunion\"','2025-05-19 19:42:20.443232','2025-05-19 19:42:20.443232',199);
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `provider`
--

DROP TABLE IF EXISTS `provider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provider` (
  `address` varchar(160) DEFAULT NULL,
  `rating` decimal(3,2) NOT NULL DEFAULT '0.00',
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `is_available` tinyint NOT NULL DEFAULT '1',
  `is_verified` tinyint NOT NULL DEFAULT '0',
  `bank_account_number` varchar(50) DEFAULT NULL,
  `validation_status` enum('pending','verified','rejected','active','inactive') NOT NULL DEFAULT 'pending',
  `user_id` int DEFAULT NULL,
  `full_name` varchar(100) NOT NULL,
  `reference_name` varchar(100) NOT NULL,
  `registryNumber` varchar(100) DEFAULT NULL,
  `years_of_experience` int DEFAULT NULL,
  `activity_description` varchar(255) DEFAULT NULL,
  `main_activity` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_d3d18186b602240b93c9f1621e` (`user_id`),
  CONSTRAINT `FK_d3d18186b602240b93c9f1621ea` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provider`
--

LOCK TABLES `provider` WRITE;
/*!40000 ALTER TABLE `provider` DISABLE KEYS */;
INSERT INTO `provider` VALUES ('Studio Zen, 12 rue de la Paix, Paris 75002',2.50,1,'Durand','Claire','0744943011',1,0,NULL,'pending',255,'Durant Claire','Studio Zen','81234567800017',18,'Professeure de yoga & praticienne en relaxation corporelle','Atelier collectif'),('Cabinet Santé mentale, 45 avenue de la République, Paris 75013',4.00,2,'Bencheikh','Karim','0744367822',1,0,NULL,'pending',256,'Benchikh Karim','Cabinet Santé Mentale Ben','78901234500038',4,'Psychologue clinicien et thérapeute cognitivo-comportemental (TCC)','Séance individuelle'),('Centre Épanouissement, 7 rue des Fleurs, Paris 75003',3.00,3,'Lefèvre','Julie','0781878843',1,0,NULL,'pending',257,'Lefevre Julie','Centre Harmonie','90123456700029',12,'Coach en développement personnel & praticienne en méditation pleine conscience','Atelier collectif');
/*!40000 ALTER TABLE `provider` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quote`
--

DROP TABLE IF EXISTS `quote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quote` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quote_number` varchar(50) NOT NULL,
  `contact_name` varchar(255) DEFAULT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `number_of_employees` int NOT NULL,
  `calculated_tier` enum('starter','basic','premium','custom') NOT NULL,
  `requested_tier` enum('starter','basic','premium','custom') DEFAULT NULL,
  `annual_price_per_employee` decimal(10,2) NOT NULL,
  `estimated_annual_total` decimal(12,2) NOT NULL,
  `details` text,
  `status` enum('pending','sent','accepted','rejected','expired','contracted') NOT NULL DEFAULT 'pending',
  `valid_until` date DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `company_id` int DEFAULT NULL,
  `linked_contract_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_aae706f47db4216aca40d3c675` (`quote_number`),
  UNIQUE KEY `REL_50f9ea15b9ee1341a7d1e31e2b` (`linked_contract_id`),
  KEY `FK_39f823aaee3c62453cf746d29f6` (`company_id`),
  CONSTRAINT `FK_39f823aaee3c62453cf746d29f6` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_50f9ea15b9ee1341a7d1e31e2b4` FOREIGN KEY (`linked_contract_id`) REFERENCES `contract` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quote`
--

LOCK TABLES `quote` WRITE;
/*!40000 ALTER TABLE `quote` DISABLE KEYS */;
/*!40000 ALTER TABLE `quote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service`
--

DROP TABLE IF EXISTS `service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service` (
  `title` varchar(100) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `providerId` int DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `is_available` tinyint NOT NULL DEFAULT '1',
  `realisation_time` varchar(255) NOT NULL,
  `is_medical` tinyint NOT NULL DEFAULT '0',
  `is_negotiable` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_b05f15e928a4b35bd4b3426aa5c` (`providerId`),
  CONSTRAINT `FK_b05f15e928a4b35bd4b3426aa5c` FOREIGN KEY (`providerId`) REFERENCES `provider` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service`
--

LOCK TABLES `service` WRITE;
/*!40000 ALTER TABLE `service` DISABLE KEYS */;
INSERT INTO `service` VALUES (' Séance de Yoga Vinyasa - Équilibre et Souplesse','Découvrez la pratique dynamique du Yoga Vinyasa pour améliorer votre souplesse, votre respiration et votre équilibre mental. Adapté à tous les niveaux, cet atelier vous permettra de vous reconnecter à votre corps, de réduire le stress et de retrouver énergie et sérénité.\n\n\n',20.00,1,1,1,'Custom',0,0),('Consultation Psychologique Individuelle','Accompagnement personnalisé avec un psychologue diplômé pour vous aider à surmonter vos difficultés émotionnelles, gérer l’anxiété, la dépression ou tout autre trouble psychologique. Un espace d’écoute bienveillante et confidentielle.',60.00,2,2,1,'Custom',0,0),(' Coaching Sportif Personnalisé','Programme sportif personnalisé adapté à vos objectifs (perte de poids, renforcement musculaire, préparation physique). Coaching motivant et conseils nutritionnels pour optimiser votre bien-être global.',40.00,1,3,1,'Custom',0,0),('Atelier Méditation Pleine Conscience','Apprenez à vivre l’instant présent grâce à la méditation guidée. Réduisez le stress, améliorez votre concentration et votre sommeil dans un cadre calme et accueillant.\n\n',25.00,3,4,0,'Custom',0,1),('Séance de Sophrologie Relaxation','Techniques de relaxation dynamique et visualisation positive pour gérer le stress',30.00,2,5,1,'Custom',0,0),('Atelier Nutrition & Bien-être','Apprenez à adopter une alimentation saine et équilibrée pour booster votre énergie, améliorer votre humeur et soutenir votre santé mentale et physique au quotidien.',20.00,1,9,1,'Custom',0,0),(' Cours de Pilates Matwork','Renforcement musculaire profond, amélioration de la posture et de la coordination grâce au Pilates. Un excellent complément pour la prévention des douleurs dorsales et l’augmentation de la flexibilité.\n\n',35.00,2,10,1,'Custom',0,0);
/*!40000 ALTER TABLE `service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `role` enum('admin','company','provider','client') NOT NULL,
  `lastLoginDate` datetime DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=357 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('admin@email.fr','$2b$12$nKI1zw239oJJTfmYFi1XHulJcJ1os7SJPZrhYAPce2GJ6qwyv1PN.',1,'admin',NULL,1),('admin@example.com','$2b$12$nKI1zw239oJJTfmYFi1XHulJcJ1os7SJPZrhYAPce2GJ6qwyv1PN.',1,'admin','2025-05-19 23:08:07',2),('google@example.com','$2b$12$eCRn6RdrFH8nOiYP9suiJuUYsM8ZVUJVVejZ4nNVIZBj/cBFuQz/q',1,'company','2025-05-11 22:17:24',3),('microsoft.admin@example.com','$2b$12$nKI1zw239oJJTfmYFi1XHulJcJ1os7SJPZrhYAPce2GJ6qwyv1PN.',1,'company',NULL,4),('apple.admin@example.com','$2b$12$nKI1zw239oJJTfmYFi1XHulJcJ1os7SJPZrhYAPce2GJ6qwyv1PN.',1,'company',NULL,5),('facebook.admin@example.com','$2b$12$nKI1zw239oJJTfmYFi1XHulJcJ1os7SJPZrhYAPce2GJ6qwyv1PN.',1,'company',NULL,6),('netflix.admin@example.com','$2b$12$nKI1zw239oJJTfmYFi1XHulJcJ1os7SJPZrhYAPce2GJ6qwyv1PN.',1,'company',NULL,7),('tesla.admin@example.com','$2b$12$nKI1zw239oJJTfmYFi1XHulJcJ1os7SJPZrhYAPce2GJ6qwyv1PN.',1,'company',NULL,8),('uber.admin@example.com','$2b$12$nKI1zw239oJJTfmYFi1XHulJcJ1os7SJPZrhYAPce2GJ6qwyv1PN.',1,'company',NULL,9),('twitter.admin@example.com','$2b$12$nKI1zw239oJJTfmYFi1XHulJcJ1os7SJPZrhYAPce2GJ6qwyv1PN.',1,'company',NULL,10),('airbnb.admin@example.com','$2b$12$nKI1zw239oJJTfmYFi1XHulJcJ1os7SJPZrhYAPce2GJ6qwyv1PN.',1,'company',NULL,11),('spotify.admin@example.com','$2b$12$nKI1zw239oJJTfmYFi1XHulJcJ1os7SJPZrhYAPce2GJ6qwyv1PN.',1,'company',NULL,12),('linkedin.admin@example.com','$2b$12$nKI1zw239oJJTfmYFi1XHulJcJ1os7SJPZrhYAPce2GJ6qwyv1PN.',1,'company',NULL,13),('adobe.admin@example.com','$2b$12$nKI1zw239oJJTfmYFi1XHulJcJ1os7SJPZrhYAPce2GJ6qwyv1PN.',1,'company',NULL,14),('salesforce.admin@example.com','$2b$12$nKI1zw239oJJTfmYFi1XHulJcJ1os7SJPZrhYAPce2GJ6qwyv1PN.',1,'company',NULL,15),('intel.admin@example.com','$2b$12$nKI1zw239oJJTfmYFi1XHulJcJ1os7SJPZrhYAPce2GJ6qwyv1PN.',1,'company',NULL,16),('ibm.admin@example.com','$2b$12$nKI1zw239oJJTfmYFi1XHulJcJ1os7SJPZrhYAPce2GJ6qwyv1PN.',1,'company',NULL,17),('oracle.admin@example.com','$2b$12$nKI1zw239oJJTfmYFi1XHulJcJ1os7SJPZrhYAPce2GJ6qwyv1PN.',1,'company',NULL,18),('cisco.admin@example.com','$2b$12$nKI1zw239oJJTfmYFi1XHulJcJ1os7SJPZrhYAPce2GJ6qwyv1PN.',1,'company',NULL,19),('samsung.admin@example.com','$2b$12$nKI1zw239oJJTfmYFi1XHulJcJ1os7SJPZrhYAPce2GJ6qwyv1PN.',1,'company',NULL,20),('toyota.admin@example.com','$2b$12$nKI1zw239oJJTfmYFi1XHulJcJ1os7SJPZrhYAPce2GJ6qwyv1PN.',1,'company',NULL,21),('esgi@example.fr','$2b$12$45VGanqn9tTx5o/HY1UP/ehiHt9KbgHpMaQ5cV/jl809VBT8VBZPK',1,'company',NULL,22),('esiea@gmail.com','$2b$12$4qRapvkLS8p4LSPxmuCZIedb1NfEA4vU1xv.iqL1hje9y32mv2z4a',1,'company','2025-05-19 23:08:48',23),('bouraz@email.fr','$2b$12$Lwgo6eC0XmTAF8AgAWtaRO5KYedB79ZalS9ywf3.uYszDk022HnJC',1,'company',NULL,25),('epita@email.fr','$2b$12$0kdTrt0BvuzvEDhjZDg6xulutlwFFXTtDqe7g5ZInsT5C0Hix6zzW',1,'company',NULL,27),('carmex@gmail.fr','$2b$12$JLmZ/GBHjPCkDFkqWdCRgu.1ojtsMTEevWRpS6ZMtGG95y8GKY40G',1,'company','2025-05-17 13:51:37',28),('jean.dupont@example.com','$2b$10$dLXQkYI7HrY5rFAVOFZEUOOVWHiZPew3SYntbJEfGq75RrHbSeZBi',1,'client',NULL,237),('marie.martin@example.com','$2b$10$izOOZmPVjo4rCfqynK/wgO925Jhaq/RCSK2Dw7QILg0EGRJ.8L99C',1,'client',NULL,238),('pierre.dubois@example.com','$2b$10$WEgZif2tE/FSSDqeuBzo4u88oxGp2Z6UqXHtoYnctGpv5gy6NX8MS',1,'client',NULL,239),('sophie.leroy@example.com','$2b$10$P8YT108gS3hpGcCFVv03qOV6ndDgJ6eRUCrQUH2xPsntEVFD20NvW',1,'client','2025-05-19 22:28:50',240),('amelie.petit@example.com','$2b$10$2TJE38vBLV7nlAc1R7Vq0edJSSao0ry5H5UThhF.VB5aokZhZv25.',1,'client',NULL,242),('laura.simon@example.com','$2b$10$A4E2/Va0j0GdtYsXI29b4ujRmCqgDGlWrkN3zYy/HwWhmi8YVJCZy',1,'client',NULL,244),('julien.lefebvre@example.com','$2b$10$Vzk8y6ZMPAXkwoFh7htVQenuomCJGSjn5EV28lq77vDkfM9PdPDsm',1,'client',NULL,245),('celine.roux@example.com','$2b$10$7XoDoxkcdZSCis/dOVHyH.SQGCHQtYg2o12SrrR/f4mYqVKG0xx6e',1,'client',NULL,246),('picha.dev@email.fr','$2b$12$8od2BAhY2rU9Ly6emkIyj.SjQ3ItVtAwyPtpekF7Qcdv0GytMnIjO',1,'provider','2025-05-19 23:07:51',255),('cabinetsantementale@gmail.com','$2b$12$.KCC3y.EiiuUJFZp3xA2SOjyEWG92Dkxyh5Uu.q1v1j7VqjQvYprm',1,'provider',NULL,256),('mmazenezerguine@gmail.com','$2b$12$eCRn6RdrFH8nOiYP9suiJuUYsM8ZVUJVVejZ4nNVIZBj/cBFuQz/q',1,'provider','2025-05-11 23:03:33',257),('mazene-zerguine@gmail.com','$2b$12$eCRn6RdrFH8nOiYP9suiJuUYsM8ZVUJVVejZ4nNVIZBj/cBFuQz/q',1,'client',NULL,258),('akouz@gmail.com','$2b$12$eCRn6RdrFH8nOiYP9suiJuUYsM8ZVUJVVejZ4nNVIZBj/cBFuQz/q',1,'client',NULL,259),('sahur@email.com','$2b$12$eCRn6RdrFH8nOiYP9suiJuUYsM8ZVUJVVejZ4nNVIZBj/cBFuQz/q',1,'client',NULL,260),('nouha@email.com','$2b$12$eCRn6RdrFH8nOiYP9suiJuUYsM8ZVUJVVejZ4nNVIZBj/cBFuQz/q',1,'client',NULL,261),('nada@email.com','$2b$12$eCRn6RdrFH8nOiYP9suiJuUYsM8ZVUJVVejZ4nNVIZBj/cBFuQz/q',1,'client',NULL,262),('zerguinenadine@gmail.com','$2b$12$iAAIqT0hRloEV6cNcPcCNunAt/wROLcHagP9n/bu/OunJeZOPJR8.',1,'company','2025-05-17 18:03:07',263),('esseye@gmail.fr','$2b$12$9NMjVgaq3EFZnt38pzztZOJy2BD4BvYBnbB5VPQb.dd0ChBhd/Gzy',1,'company',NULL,264),('charikawhamiya@njarab.fiha','$2b$12$.skR8goxJUlUfGAB0ifBz./WU34TDPZY/Z2GR8EB4snMaP1.J/O26',1,'company','2025-05-19 22:33:48',265),('raninjarab@gmail.com','$2b$12$6mWbZUMh4UtLHaODmUr12OPzffxgpIUr/hune0Z1DHAjsDWL9k4m2',1,'company','2025-05-17 22:42:20',266),('genuisme@gmail.com','$2b$12$lB0YECpNgvJSg8IW2rUeG.EWCFAO7CjxpwPaYPc/IEGFNtU/E.sCi',1,'provider',NULL,267),('emma.johnson@example.com','$2b$10$qt3MOxjNMBQfPrrk5xwOMuRJdTMDaj6g7i1ScRPebHQimgBo7iZzu',1,'client','2025-05-19 23:08:21',345),('liam.williams@example.com','$2b$10$/xpiW1fkoM0wRQvqCha4n.BzhUNYmKN6alxMn3lk8asBjBtX91Wsu',1,'client',NULL,346),('olivia.brown@example.com','$2b$10$vvQuLT9IYTO15U2P3WQp0OcOW..wpzqX6zUKVIsyTz3cavR3lzDse',1,'client',NULL,347),('noah.jones@example.com','$2b$10$88kRJgIziGRUM5gcC4tOL.ssm6IPwq47uecKOUMjY7hM.FyWwZ3zq',1,'client',NULL,348),('ava.garcia@example.com','$2b$10$MTS5JsV3tebIdxsJwna7s.hmR2cbH83QQbDumxxgzsN002oQ56j.W',1,'client',NULL,349),('william.miller@example.com','$2b$10$Z5ryjrMTpTL/vc8MM2kT5uCgKYD0.HxEiBR.SyFi3sWfqjMxlG77G',1,'client',NULL,350),('sophia.davis@example.com','$2b$10$JYOLBs89iJJ22evmNutyDOkhPyW7rjuL4uJTzOq0FSopHOKCoXgB6',1,'client','2025-05-17 17:58:32',351),('benjamin.rodriguez@example.com','$2b$10$OoH2zPb09KEpfT30kws7eug991sunpMj0EcbmCahubsJUJ8VcB6n.',1,'client',NULL,352),('mia.martinez@example.com','$2b$10$zczX3SfJG5kSOlXNmloyB.rXUXmb2HCFAlsU04mfZayoSg4sF3JYG',1,'client',NULL,353),('james.wilson@example.com','$2b$10$O2QGi7kKCdNuOul0TXUkZ.ODC4p.utmlklNEAbZKQBSf6QYuagxxy',1,'client',NULL,354);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `volunteer_registration`
--

DROP TABLE IF EXISTS `volunteer_registration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `volunteer_registration` (
  `id` int NOT NULL AUTO_INCREMENT,
  `registration_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `employee_id` int NOT NULL,
  `activity_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_a2de87a10aae396f2b2b0e36d4` (`employee_id`,`activity_id`),
  KEY `FK_110d3e4a4ffa2565cfe850e9dde` (`activity_id`),
  CONSTRAINT `FK_110d3e4a4ffa2565cfe850e9dde` FOREIGN KEY (`activity_id`) REFERENCES `volunteering_activity` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_d5c1264ae420c41b67860d67400` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `volunteer_registration`
--

LOCK TABLES `volunteer_registration` WRITE;
/*!40000 ALTER TABLE `volunteer_registration` DISABLE KEYS */;
/*!40000 ALTER TABLE `volunteer_registration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `volunteering_activity`
--

DROP TABLE IF EXISTS `volunteering_activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `volunteering_activity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `date` datetime NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `required_skills` text,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `association_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_4ccede97716ff84d1490ad0540a` (`association_id`),
  CONSTRAINT `FK_4ccede97716ff84d1490ad0540a` FOREIGN KEY (`association_id`) REFERENCES `association` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `volunteering_activity`
--

LOCK TABLES `volunteering_activity` WRITE;
/*!40000 ALTER TABLE `volunteering_activity` DISABLE KEYS */;
/*!40000 ALTER TABLE `volunteering_activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Youtube`
--

DROP TABLE IF EXISTS `Youtube`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Youtube` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question` text NOT NULL,
  `keywords` text,
  `answer` text NOT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `priority` int NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  FULLTEXT KEY `IDX_232d0895433e3bc84c6aad1c8d` (`question`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Youtube`
--

LOCK TABLES `Youtube` WRITE;
/*!40000 ALTER TABLE `Youtube` DISABLE KEYS */;
/*!40000 ALTER TABLE `Youtube` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-19 23:30:42
