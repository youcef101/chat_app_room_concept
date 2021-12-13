import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { formatMessage } from './utils/messages.js'
import { userJoin, userLeft, getCurrentUser, getRoomUsers } from './utils/users.js'

const app = express()
const port = 3000 || process.env.PORT
app.use(express.static('public'))
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})
const dName = 'ChatBot'
io.on('connection', socket => {
    socket.on('roomJoin', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        socket.emit('sendMsg', formatMessage(dName, 'Welcome to chatCord !!!'))
        socket.broadcast.to(user.room).emit('sendMsg', formatMessage(dName, `${user.username} joined the room !!!`))
        io.to(user.room).emit('roomInfo', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })


    socket.on('sendMsg', Msg => {
        const user = getCurrentUser(socket.id)
        io.emit('sendMsg', formatMessage(user.username, Msg))
    })

    socket.on('disconnect', () => {
        const user = userLeft(socket.id)
        if (user) {
            io.to(user.room).emit('sendMsg', formatMessage(dName, `${user.username} left the room !!!`))
        }
        io.to(user.room).emit('roomInfo', {
            room: user.room,
            users: getRoomUsers
        })
    })


})

httpServer.listen(port, () => {
    console.log(`server listen on localhost :${port}`)
})