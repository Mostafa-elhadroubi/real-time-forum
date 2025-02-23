PRAGMA foreign_keys = on;

CREATE TABLE IF NOT EXISTS `users` (
    `user_id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `username` TEXT NOT NULL UNIQUE,
    `firstName` TEXT NOT NULL,
    `lastName` TEXT NOT NULL,
    `age` INTEGER NOT NULL,
    `gender` TEXT NOT NULL,
    `email` TEXT NOT NULL UNIQUE,
    `password` TEXT NOT NULL,
    `image` TEXT  NOT NULL,
    `token` TEXT UNIQUE,
    `token_exp` INTEGER,
    `created_at` INTEGER
);

CREATE TABLE IF NOT EXISTS `posts` (
    `post_id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `user_id` INTEGER NOT NULL,
    `title` TEXT NOT NULL,
    `body` TEXT NOT NULL,
    `image` TEXT,
    `created_at` INTEGER NOT NULL, 
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `comments` (
    `comment_id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `user_id` INTEGER NOT NULL,
    `post_id` INTEGER NOT NULL,
    `body` TEXT NOT NULL,
    `created_at` INTEGER NOT NULL, 
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `categories` (
    `category_id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `category_name` TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS `posts_categories` (
    `post_category_id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `post_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE,
    FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `likes` (
    `like_id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `user_id` INTEGER NOT NULL,
    `post_id` INTEGER,
    `comment_id` INTEGER,
    `like` BOOLEAN NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
    FOREIGN KEY (`comment_id`) REFERENCES `comments` (`comment_id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `messages` (
    `message_id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `sender_id` INTEGER,
    `receiver_id` INTEGER,
    `message` TEXT,
    `sent_at` INTEGER NOT NULL,
    FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`receiver_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
);