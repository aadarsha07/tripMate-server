const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();
// Initialize Express app
const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Configuration
mongoose.connect('mongodb+srv://tripmate:1234@cluster0.oel14cc.mongodb.net/tripMate')
mongoose.connection.on('error', err => {
    console.log('database connection failed');
});
mongoose.connection.on('connected', connected => {
    console.log(' database Connected successfully');
});



// Passport Middleware
app.use(passport.initialize());
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/destinations', require('./routes/destinationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// const messages = []
// Start the server
const port = process.env.PORT || 3000;
// io.on('connection', (socket) => {
//     const username = socket.handshake.query.username;
//     socket.on('message', (data) => {
//         const message = {
//             message: data.message,
//             senderUsername: username,
//             sentAt: Date.now()
//         }
//         messages.push(message)
//         io.emit('message', message)


//     })

// });

app.listen(port, () => {
    console.log('Server running ');
});