-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 30 Jun 2025 pada 17.55
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sea_catering_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `status` enum('active','paused','canceled') NOT NULL DEFAULT 'active',
  `customer_name` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `plan_name` varchar(50) NOT NULL,
  `plan_price` decimal(10,2) NOT NULL,
  `meal_types` varchar(255) NOT NULL,
  `delivery_days` varchar(255) NOT NULL,
  `allergies` text DEFAULT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `pause_start_date` date DEFAULT NULL,
  `pause_end_date` date DEFAULT NULL,
  `cancellation_date` datetime DEFAULT NULL,
  `reactivation_date` datetime DEFAULT NULL,
  `subscription_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `user_id`, `status`, `customer_name`, `phone_number`, `plan_name`, `plan_price`, `meal_types`, `delivery_days`, `allergies`, `total_price`, `pause_start_date`, `pause_end_date`, `cancellation_date`, `reactivation_date`, `subscription_date`) VALUES
(1, NULL, 'active', 'Dewi Anggraini', '081211112222', 'protein', 40000.00, 'Lunch, Dinner', 'Monday, Tuesday, Wednesday, Thursday, Friday', 'Tidak ada', 1720000.00, NULL, NULL, NULL, NULL, '2025-06-29 09:04:55'),
(2, NULL, 'active', 'Eko Prasetyo', '085733334444', 'diet', 30000.00, 'Breakfast, Lunch, Dinner', 'Saturday, Sunday', 'Alergi kacang', 774000.00, NULL, NULL, NULL, NULL, '2025-06-29 09:04:55'),
(3, NULL, 'active', 'Rangga', '851 7538 8196', 'diet', 30000.00, 'Breakfast', 'Tuesday, Wednesday', 'ya', 258000.00, NULL, NULL, NULL, NULL, '2025-06-29 09:11:14'),
(4, 2, 'active', 'rangga aja', '000', 'diet', 30000.00, 'Lunch', 'Monday, Tuesday', 'Ngga ada', 258000.00, NULL, NULL, NULL, NULL, '2025-06-29 11:01:51'),
(5, 2, 'active', 'rangga aja', '085175388196', 'royal', 60000.00, 'Breakfast, Lunch', 'Wednesday, Friday, Saturday', 'Beli lah', 1548000.00, NULL, NULL, NULL, NULL, '2025-06-29 11:24:13'),
(6, 2, 'active', 'rangga aja', '000', 'diet', 30000.00, 'Dinner', 'Wednesday, Thursday', 'qoqqqq', 258000.00, NULL, NULL, NULL, NULL, '2025-06-29 11:37:10'),
(7, 2, 'active', 'rangga aja', '+62 851-7538-8196', 'diet', 30000.00, 'Lunch, Dinner', 'Tuesday, Wednesday', 'gada\n', 516000.00, NULL, NULL, NULL, NULL, '2025-06-30 02:20:58'),
(8, 3, 'active', 'Ranggaku', '+62 851-7538-8196', 'diet', 30000.00, 'Lunch, Dinner', 'Thursday, Friday', 'wdwdjw', 516000.00, NULL, NULL, NULL, NULL, '2025-06-30 09:16:35'),
(9, 2, 'active', 'rangga aja', '+62 851-7538-8196', 'diet', 30000.00, 'Lunch, Dinner', 'Wednesday, Thursday, Friday', 'Lasttt', 774000.00, NULL, NULL, NULL, NULL, '2025-06-30 14:50:43');

-- --------------------------------------------------------

--
-- Struktur dari tabel `testimonials`
--

CREATE TABLE `testimonials` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `customer_name` varchar(255) NOT NULL,
  `review_message` text NOT NULL,
  `rating` int(1) NOT NULL,
  `submission_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `testimonials`
--

INSERT INTO `testimonials` (`id`, `user_id`, `customer_name`, `review_message`, `rating`, `submission_date`) VALUES
(1, NULL, 'Andini Putri', 'Makanannya enak-enak dan tidak terasa seperti diet. Berat badanku turun 3 kg dalam 2 minggu! Terima kasih SEA Catering!', 5, '2025-06-29 09:04:55'),
(2, NULL, 'Budi Santoso', 'Pengiriman selalu tepat waktu dan menunya variatif setiap hari. Sangat membantu untuk saya yang sibuk.', 4, '2025-06-29 09:04:55'),
(3, NULL, 'Citra Lestari', 'Saya ambil paket Muscle Gain, dan hasilnya terasa. Latihan di gym jadi lebih bertenaga. Recommended!', 5, '2025-06-29 09:04:55'),
(4, 2, 'rangga aja', 'Mantappppoll', 5, '2025-06-29 12:55:35'),
(5, 3, 'Ranggaku', 'alhamdulillah', 5, '2025-06-30 09:18:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Admin SEA', 'admin@seacatering.com', '$2y$10$E/gY0jO5F6Z2aN1c.K.G/.0p3d0xY4S.F9aG2c.B6a4Z1E.9I7a/O', 'admin', '2025-06-29 09:21:52'),
(2, 'rangga aja', 'rrr@gmail.com', '$2b$10$OzDV3TjMg23Tk4IUTsVu3eUp60SztkR4BrRgimT3q9v1/QJRb0.aS', 'admin', '2025-06-29 11:01:21'),
(3, 'Ranggaku', 'admin@gmail.com', '$2b$10$zNkmbyszOPwDtWqW6EcQ/uqSh0kz9LXWSwW229Vw6mPe.Tf9VNi16', 'user', '2025-06-30 09:16:01');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_id` (`user_id`);

--
-- Indeks untuk tabel `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_testimonial_user_id` (`user_id`);

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
-- AUTO_INCREMENT untuk tabel `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `testimonials`
--
ALTER TABLE `testimonials`
  ADD CONSTRAINT `testimonials_fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
