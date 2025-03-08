function showContact() {
    alert('Contact us at: +1234567890');
}

function attachFiles() {
    alert('Attachment feature coming soon!');
}

function toggleEmoji() {
    const emojiContainer = document.getElementById('emojiContainer');
    emojiContainer.style.display = emojiContainer.style.display === 'block' ? 'none' : 'block';
}

function addEmoji(emoji) {
    const inputField = document.querySelector('#chatInput');
    inputField.value += emoji;
}

function updateChatBody(message) {
    const chatBody = document.getElementById('chatBody');
    const botMessageElement = document.createElement('div');
    botMessageElement.classList.add('message', 'bot');

    if (!message || message.trim() === "") {
        message = "Sorry, I didn't understand that. Please try rephrasing.";
    }

    const formattedMessage = message.replace(/(https?:\/\/[\w\-\.]+(\.[\w\-]+)+(\/[\w\-\.\?%&=]*)?)/g, '<a href="$1" target="_blank">$1</a>');
    botMessageElement.innerHTML = `<p>${formattedMessage}</p>`;
    chatBody.appendChild(botMessageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function sendMessage() {
    const inputField = document.getElementById('chatInput');
    const userInput = inputField.value.trim();

    if (!userInput) {
        alert("Please enter a message.");
        return;
    }

    const chatBody = document.getElementById('chatBody');
    const userMessageElement = document.createElement('div');
    userMessageElement.classList.add('message', 'user');
    userMessageElement.innerHTML = `<p>${userInput}</p>`;
    chatBody.appendChild(userMessageElement);
    chatBody.scrollTop = chatBody.scrollHeight;

    inputField.value = "";

    const loadingMessage = document.createElement('div');
    loadingMessage.classList.add('message', 'bot');
    loadingMessage.innerHTML = `<p class="loading-message">...Typing...</p>`;
    chatBody.appendChild(loadingMessage);
    chatBody.scrollTop = chatBody.scrollHeight;

    fetch("https://junkjet.onrender.com/chatbot/chatbotquery", {
        method: "POST",
        headers: {
            "Content-Type": "text/plain",
        },
        body: userInput,
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorText => {
                throw new Error(errorText);
            });
        }
        return response.text();
    })
    .then(data => {
        chatBody.removeChild(loadingMessage);
        updateChatBody(data);
    })
    .catch(error => {
        console.error("Fetch error:", error);
        chatBody.removeChild(loadingMessage);
        alert("Something went wrong. Please try again.");
    });
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
}
