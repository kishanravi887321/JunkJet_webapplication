document.addEventListener('DOMContentLoaded', () => {
    const chatbot = document.getElementById('chatbot');
    const toggleButton = document.getElementById('toggle-chatbot');
    const minimizeButton = document.getElementById('minimize-chatbot');
    const expandButton = document.getElementById('expand-chatbot');
    const chatInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.chat-input button');
    const chatMessages = document.querySelector('.chat-messages');

    // Toggle chatbot visibility
    toggleButton.addEventListener('click', () => {
        chatbot.classList.toggle('active');
    });

    // Minimize chatbot
    minimizeButton.addEventListener('click', () => {
        chatbot.classList.remove('active');
    });

    // Expand/collapse chatbot
    expandButton.addEventListener('click', function () {
        chatbot.classList.toggle('expanded');
        const icon = this.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-expand');
            icon.classList.toggle('fa-compress');
        }
    });

    // Send message function
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            const userMessageElement = document.createElement('div');
            userMessageElement.classList.add('message', 'user');
            userMessageElement.innerHTML = `<p>${message}</p>`;
            chatMessages.appendChild(userMessageElement);

            // Clear input
            chatInput.value = '';

            // Auto scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Simulate bot response (in a real app, this would call an API)
            setTimeout(() => {
                const botResponse = getBotResponse(message);
                const botMessageElement = document.createElement('div');
                botMessageElement.classList.add('message', 'bot');
                botMessageElement.innerHTML = `<p>${botResponse}</p>`;
                chatMessages.appendChild(botMessageElement);

                // Auto scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }
    }

    // Send message on button click
    sendButton.addEventListener('click', sendMessage);

    // Send message on Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Simple bot responses (replace with AI in a real app)
    function getBotResponse(message) {
        message = message.toLowerCase();

        if (message.includes('hello') || message.includes('hi')) {
            return 'Hello! How can I help you with waste management today?';
        } else if (message.includes('waste') || message.includes('recycle')) {
            return 'We offer various waste management solutions. Would you like to know more about our services?';
        } else if (message.includes('price') || message.includes('cost')) {
            return 'Pricing depends on the type and volume of waste. Please provide more details or contact our support team.';
        } else if (message.includes('login') || message.includes('register')) {
            return 'You can login or register by clicking on the Login/Register option in the top menu.';
        } else if (message.includes('thank')) {
            return 'You\'re welcome! Is there anything else I can help you with?';
        } else {
            return 'I\'m not sure I understand. Could you please rephrase your question?';
        }
    }

    // Make chatbot draggable
    let isDragging = false;
    let offsetX, offsetY;

    const chatbotHeader = document.querySelector('.chatbot-header');

    chatbotHeader.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - chatbot.getBoundingClientRect().left;
        offsetY = e.clientY - chatbot.getBoundingClientRect().top;

        chatbot.style.position = 'absolute';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;

            // Keep chatbot within viewport
            const maxX = window.innerWidth - chatbot.offsetWidth;
            const maxY = window.innerHeight - chatbot.offsetHeight;

            const boundedX = Math.max(0, Math.min(x, maxX));
            const boundedY = Math.max(0, Math.min(y, maxY));

            chatbot.style.left = boundedX + 'px';
            chatbot.style.top = boundedY + 'px';
            chatbot.style.right = 'auto';
            chatbot.style.bottom = 'auto';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
});
