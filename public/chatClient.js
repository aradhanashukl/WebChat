const socket = io();
const input = document.getElementById('input');
const messages = document.getElementById('messages');

let username;
let roomId;

// Ask for username and room ID on page load
while (!username) {
    username = prompt('Please enter your username:');
}

while (!roomId) {
    roomId = prompt('Please enter the room ID to join:');
}

// Join the specified room
socket.emit('join', { username, roomId });

input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && input.value) {
        const message = { text: input.value, user: username };
        socket.emit('chat message', { message, roomId }); // Send message to the specific room
        displayMessage(input.value, 'user-message'); // Only display text for user messages
        input.value = ''; // Clear the input
    }
});

// Listen for incoming messages
socket.on('chat message', function(msg) {
    displayMessage(msg.text, 'other-message', msg.user); // Display received messages
});

// Function to display messages
function displayMessage(text, type, sender) {
    const item = document.createElement('li');
    item.className = `message ${type}`;

    // Show sender's name only for received messages
    if (type === 'other-message') {
        item.innerHTML = `<strong>${sender}: </strong>${text}`;
    } else {
        item.innerHTML = text; // Display only the message text for user's own messages
    }

    // Append message to the list and scroll down
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
}
