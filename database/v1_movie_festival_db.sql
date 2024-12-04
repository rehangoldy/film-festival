-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 04 Des 2024 pada 06.23
-- Versi server: 10.4.28-MariaDB
-- Versi PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `v1_movie_festival_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `Genres`
--

CREATE TABLE `Genres` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `Genres`
--

INSERT INTO `Genres` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Action', '2024-12-01 21:06:37', '2024-12-01 21:06:37'),
(2, 'Adventure', '2024-12-01 21:06:37', '2024-12-01 21:06:37'),
(3, 'Animation', '2024-12-01 21:06:37', '2024-12-01 21:06:37'),
(4, 'Comedy', '2024-12-01 21:06:37', '2024-12-01 21:06:37'),
(5, 'Crime', '2024-12-01 21:06:37', '2024-12-01 21:06:37'),
(6, 'Documentary', '2024-12-01 21:06:37', '2024-12-01 21:06:37'),
(7, 'Drama', '2024-12-01 21:06:37', '2024-12-01 21:06:37'),
(8, 'Family', '2024-12-01 21:06:37', '2024-12-01 21:06:37'),
(9, 'Fantasy', '2024-12-01 21:06:37', '2024-12-01 21:06:37'),
(10, 'Horror', '2024-12-01 21:06:37', '2024-12-01 21:06:37'),
(11, 'Mystery', '2024-12-01 21:06:37', '2024-12-01 21:06:37'),
(12, 'Romance', '2024-12-01 21:06:37', '2024-12-01 21:06:37'),
(13, 'Sci-Fi', '2024-12-01 21:06:37', '2024-12-01 21:06:37'),
(14, 'Thriller', '2024-12-01 21:06:37', '2024-12-01 21:06:37'),
(15, 'War', '2024-12-01 21:06:37', '2024-12-01 21:06:37');

-- --------------------------------------------------------

--
-- Struktur dari tabel `movies`
--

CREATE TABLE `movies` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `duration` int(11) NOT NULL,
  `artists` text DEFAULT NULL,
  `watch_url` varchar(255) NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `thumbnail_path` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `view_count` int(11) DEFAULT 0,
  `vote_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `movies`
--

INSERT INTO `movies` (`id`, `title`, `description`, `duration`, `artists`, `watch_url`, `file_path`, `thumbnail_path`, `status`, `view_count`, `vote_count`, `created_at`, `updated_at`) VALUES
(3, 'Yura Yunita - Tenang', '\r\nSejalan dengan dilepasnya lagu “Tenang”, Yura mempersembahkan sebuah film pendek garapan Yandy Laurens. Dibintangi aktor-aktor ternama Ringgo Agus, Nirina Zubir, Kiki Narendra, dan aktor cilik Gamaliel Eleazar dan Zozo. Film ini berpusar tentang menghadapi kehilangan, hal-hal yang mungkin tidak akan pernah bisa kembali lagi, dan menerima sekecil apapun yang ada.', 8, '[\"Ringgo Agus\",\"Rahman\",\"Nirina Zubir\",\"Kiki Narendra\",\"Gamaliel Eleazar Zozo\"]', '/api/movies/watch/movie-1733215608660-905741266.mp4', 'uploads/movies/movie-1733215608660-905741266.mp4', 'uploads/thumbnails/thumbnail-1733215608656-599440455.png', 'active', 72, 2, '2024-12-03 08:46:48', '2024-12-04 03:47:10'),
(4, 'Telat', 'Orang orang terkadang kurang menghargai waktu. Itu yang terjadi pada Dio, ia menghabiskan waktu dengan sia-sia. Hingga pada waktunya dio pun mulai terhenti oleh kata-kata. Apakah dia sadar atau tidak?', 7, '[\"Kiki\"]', '/api/movies/watch/movie-1733215768885-757829986.mp4', 'uploads/movies/movie-1733215768885-757829986.mp4', 'uploads/thumbnails/thumbnail-1733215768883-541824335.png', 'active', 18, 1, '2024-12-03 08:49:28', '2024-12-04 05:14:37'),
(5, 'Stone | 1 Minute Short Film | Hot Shot', 'Remove strains from others paths and Allah SWT will remove them from yours. Value humans. Value humanity.\r\n', 1, '[\"Hadith\",\"Sahih Bukhari\"]', '/api/movies/watch/movie-1733289083041-6596776.mp4', 'uploads/movies/movie-1733289083041-6596776.mp4', 'uploads/thumbnails/thumbnail-1733239022865-561952960.png', 'active', 6, 0, '2024-12-03 15:17:02', '2024-12-04 05:15:37');

-- --------------------------------------------------------

--
-- Struktur dari tabel `MovieViewerships`
--

CREATE TABLE `MovieViewerships` (
  `id` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `MovieId` int(11) NOT NULL,
  `duration_watched` int(11) NOT NULL DEFAULT 0,
  `last_position` int(11) NOT NULL DEFAULT 0,
  `last_watched_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `MovieViewerships`
--

INSERT INTO `MovieViewerships` (`id`, `UserId`, `MovieId`, `duration_watched`, `last_position`, `last_watched_at`, `created_at`, `updated_at`) VALUES
(1, 3, 3, 0, 0, '2024-12-03 15:33:29', '2024-12-03 12:25:50', '2024-12-03 15:33:29'),
(2, 3, 4, 0, 0, '2024-12-03 15:33:26', '2024-12-03 12:27:23', '2024-12-03 15:33:26'),
(3, 2, 4, 0, 0, '2024-12-04 05:12:24', '2024-12-03 12:29:45', '2024-12-04 05:12:24'),
(4, 2, 5, 0, 0, '2024-12-04 05:10:57', '2024-12-03 15:17:57', '2024-12-04 05:10:57'),
(5, 2, 3, 0, 0, '2024-12-04 03:47:10', '2024-12-03 15:27:52', '2024-12-04 03:47:10'),
(6, 3, 5, 0, 0, '2024-12-03 15:33:28', '2024-12-03 15:33:28', '2024-12-03 15:33:28'),
(7, 4, 4, 0, 0, '2024-12-04 04:42:46', '2024-12-04 04:42:46', '2024-12-04 04:42:46'),
(8, 4, 5, 0, 0, '2024-12-04 04:42:55', '2024-12-04 04:42:55', '2024-12-04 04:42:55');

-- --------------------------------------------------------

--
-- Struktur dari tabel `movie_genres`
--

CREATE TABLE `movie_genres` (
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `movie_id` int(11) NOT NULL,
  `genre_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `movie_genres`
--

INSERT INTO `movie_genres` (`created_at`, `updated_at`, `movie_id`, `genre_id`) VALUES
('2024-12-03 08:46:48', '2024-12-03 08:46:48', 3, 6),
('2024-12-03 08:46:48', '2024-12-03 08:46:48', 3, 8),
('2024-12-03 08:49:28', '2024-12-03 08:49:28', 4, 6),
('2024-12-03 08:49:28', '2024-12-03 08:49:28', 4, 8),
('2024-12-03 08:49:28', '2024-12-03 08:49:28', 4, 12),
('2024-12-03 15:17:02', '2024-12-03 15:17:02', 5, 6),
('2024-12-03 15:17:02', '2024-12-03 15:17:02', 5, 8);

-- --------------------------------------------------------

--
-- Struktur dari tabel `movie_viewership`
--

CREATE TABLE `movie_viewership` (
  `user_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  ` duration_watched` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_position` int(11) DEFAULT 0,
  `last_watched_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `movie_votes`
--

CREATE TABLE `movie_votes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `vote_status` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `MovieId` int(11) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `movie_votes`
--

INSERT INTO `movie_votes` (`id`, `user_id`, `movie_id`, `vote_status`, `created_at`, `updated_at`, `MovieId`, `UserId`) VALUES
(1, 3, 3, 1, '2024-12-03 13:15:04', '2024-12-03 14:10:17', NULL, NULL),
(2, 3, 4, 1, '2024-12-03 14:10:23', '2024-12-03 14:10:23', NULL, NULL),
(3, 2, 3, 0, '2024-12-03 14:13:20', '2024-12-03 15:36:07', NULL, NULL),
(4, 2, 4, 0, '2024-12-03 14:13:20', '2024-12-04 05:14:37', NULL, NULL),
(5, 4, 3, 1, '2024-12-03 14:13:54', '2024-12-03 14:14:33', NULL, NULL),
(6, 4, 4, 0, '2024-12-03 14:13:55', '2024-12-03 14:13:55', NULL, NULL),
(7, 2, 5, 0, '2024-12-04 02:34:27', '2024-12-04 05:15:37', NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `SequelizeMeta`
--

CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data untuk tabel `SequelizeMeta`
--

INSERT INTO `SequelizeMeta` (`name`) VALUES
('20231121000000-create-user.js'),
('20231202000000-update-movie-table.js');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'User Test', 'usertest@example.com', '$2b$10$5jD0QuFjcuV11iwYVXe6Xu7As2c5QVx.9A6yIHYnmMRg4V9ffrlm6', 'user', '2024-12-01 05:57:35', '2024-12-01 05:57:35'),
(2, 'Admin User', 'admin@example.com', '$2b$10$qFqUHShfznCPwuXlmto9IuNc.FBX0zjjge4OfjRsr6FTbS6EqIQGa', 'admin', '2024-12-01 06:01:35', '2024-12-01 06:01:35'),
(3, 'Raihan', 'rehan@gmail.com', '$2b$10$HLL9iPGGXUR2RQrdOQPwIuqWrFZ8i24EZrgIw/mIgjLJOuF0/M79i', 'user', '2024-12-01 07:23:34', '2024-12-01 07:23:34'),
(4, 'john', 'john@gmail.com', '$2b$10$NTYGnx9wnii0/VOErBMsde0ao0Jh0ZDeawTpHR6JoY.BFYkbQDReu', 'user', '2024-12-01 07:40:01', '2024-12-01 07:40:01'),
(5, 'marta', 'marta@gmail.com', '$2b$10$ZpRD5/ZobX2qXoZy0dLtQuxmvrS9/y8H7c2D6Y4IE8WFXwKf6Wuem', 'user', '2024-12-01 08:47:22', '2024-12-01 08:47:22'),
(6, 'Maria', 'maria@gmail.com', '$2b$10$18n0OW5LuLTN7MHXc22qmOgvEXazYA.8DhQcBg9DIMqiA6TnZrA2O', 'user', '2024-12-04 04:43:50', '2024-12-04 04:43:50');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `Genres`
--
ALTER TABLE `Genres`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indeks untuk tabel `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `MovieViewerships`
--
ALTER TABLE `MovieViewerships`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `MovieViewerships_UserId_MovieId_unique` (`UserId`,`MovieId`),
  ADD UNIQUE KEY `movie_viewerships__user_id__movie_id` (`UserId`,`MovieId`),
  ADD KEY `MovieId` (`MovieId`);

--
-- Indeks untuk tabel `movie_genres`
--
ALTER TABLE `movie_genres`
  ADD PRIMARY KEY (`movie_id`,`genre_id`),
  ADD KEY `genre_id` (`genre_id`);

--
-- Indeks untuk tabel `movie_viewership`
--
ALTER TABLE `movie_viewership`
  ADD PRIMARY KEY (`user_id`,`movie_id`),
  ADD KEY `movie_id` (`movie_id`);

--
-- Indeks untuk tabel `movie_votes`
--
ALTER TABLE `movie_votes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `movie_votes_UserId_MovieId_unique` (`MovieId`,`UserId`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `movie_id` (`movie_id`),
  ADD KEY `UserId` (`UserId`);

--
-- Indeks untuk tabel `SequelizeMeta`
--
ALTER TABLE `SequelizeMeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `Genres`
--
ALTER TABLE `Genres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT untuk tabel `movies`
--
ALTER TABLE `movies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `MovieViewerships`
--
ALTER TABLE `MovieViewerships`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `movie_votes`
--
ALTER TABLE `movie_votes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `MovieViewerships`
--
ALTER TABLE `MovieViewerships`
  ADD CONSTRAINT `movieviewerships_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `movieviewerships_ibfk_2` FOREIGN KEY (`MovieId`) REFERENCES `Movies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `movie_genres`
--
ALTER TABLE `movie_genres`
  ADD CONSTRAINT `movie_genres_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `Movies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `movie_genres_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `Genres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `movie_viewership`
--
ALTER TABLE `movie_viewership`
  ADD CONSTRAINT `movie_viewership_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `movie_viewership_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`);

--
-- Ketidakleluasaan untuk tabel `movie_votes`
--
ALTER TABLE `movie_votes`
  ADD CONSTRAINT `movie_votes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`),
  ADD CONSTRAINT `movie_votes_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `Movies` (`id`),
  ADD CONSTRAINT `movie_votes_ibfk_3` FOREIGN KEY (`MovieId`) REFERENCES `Movies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `movie_votes_ibfk_4` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
