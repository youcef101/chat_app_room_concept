let myForm = document.getElementById('chat-form')
let myMsgInput = document.getElementById('msg')
let myMsgDisplayField = document.querySelector('.chat-messages')
let roomField = document.getElementById('room-name')
let roomUsers = document.getElementById('users')
const socket = io()
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

//emit message to server
myForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentMsg = myMsgInput.value
    socket.emit('sendMsg', currentMsg);

    myMsgInput.value = ''
})
socket.emit('roomJoin', { username, room });

socket.on('sendMsg', Msg => {
    DisplayMsg(Msg)
    myMsgDisplayField.scrollTop = myMsgDisplayField.scrollHeight
})

const DisplayMsg = ({ username, content, time }) => {
    let div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${username} <span>${time}</span></p>
					<p class="text">
					${content}
					</p>`
    myMsgDisplayField.appendChild(div)
}

socket.on('roomInfo', (Msg) => {
    DisplayRoomInfo(Msg)
})
const DisplayRoomInfo = ({ room, users }) => {
    roomField.textContent = room
    roomUsers.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`
}