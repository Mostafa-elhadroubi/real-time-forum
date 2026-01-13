# Real-Time Forum with Private Messaging

This project is an upgraded forum application built using Golang, SQLite, HTML, CSS, and Vanilla JavaScript. It includes user authentication, posts, comments, and real-time private messaging using WebSockets. The application is implemented as a Single Page Application (SPA) using only one HTML file, where all navigation and page changes are handled dynamically with JavaScript.

The forum allows users to register and log in in order to access its features. Users must provide a nickname, age, gender, first name, last name, email, and password during registration. Login can be done using either the nickname or the email combined with the password. Passwords are securely hashed using bcrypt, and authentication is handled using sessions and cookies. Users are able to log out from any page of the forum.

Authenticated users can create posts that belong to specific categories. Posts are displayed in a feed, and comments are only visible when a post is clicked. Users can add comments to any post. This functionality is similar to a classic forum system.

The application also includes a real-time private messaging system using WebSockets. Users can send private messages to each other without refreshing the page. A users list is always visible and shows online and offline users. This list is ordered by the last message sent, and if no messages exist, users are ordered alphabetically. When a user selects another user to chat with, the last 10 messages are loaded. When scrolling up, 10 more messages are loaded at a time using throttling or debouncing to optimize performance. Each message includes the date, time, sender username, and content.

The backend is written in Golang and uses Gorilla WebSocket to handle real-time communication. SQLite is used as the database to store users, posts, comments, and messages. UUIDs are used for unique identification, and goroutines and channels are used to manage concurrent WebSocket connections. The frontend is built using plain HTML, CSS, and Vanilla JavaScript without using any frontend frameworks or libraries.

Project structure:

backend contains the Go server, handlers, routes, websocket logic, database logic, and models.
frontend contains index.html (the only HTML file), styles.css, and app.js.
forum.db is the SQLite database file.
go.mod manages Go dependencies.

To run the project locally, follow these steps:

Clone the repository:
git clone https://github.com/Mostafa-elhadroubi/real-time-forum.git

Move into the project directory:
cd real-time-forum

Install dependencies:
go mod tidy

Run the backend server:
go run main.go

Open your browser and go to:
http://localhost:8080

WebSockets are used to handle private messages, online and offline user status, and real-time message notifications. Messages are delivered instantly without refreshing the page.

Security considerations include hashing passwords with bcrypt, managing sessions using cookies, and not exposing sensitive data to the frontend.

Allowed packages for this project include all standard Go packages, Gorilla WebSocket, sqlite3, bcrypt, and UUID. No frontend frameworks such as React, Angular, or Vue are used.

This project helped me learn and practice web fundamentals such as HTML, CSS, HTTP, sessions, cookies, backend and frontend communication, DOM manipulation, WebSockets in Go and JavaScript, SQL and database management, and concurrency using goroutines and channels.

Author: Mostafa El Hadroubi  
Computer Science Student – Interested in Backend Development and Networking
