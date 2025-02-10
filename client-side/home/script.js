const chatbotIcon = document.getElementById("chatbot-icon");

let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let dragStarted = false;

chatbotIcon.addEventListener("mousedown", (e) => {
  isDragging = true;
  dragStarted = false;
  offsetX = e.clientX - chatbotIcon.offsetLeft;
  offsetY = e.clientY - chatbotIcon.offsetTop;
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    dragStarted = true;
    chatbotIcon.style.left = `${e.clientX - offsetX}px`;
    chatbotIcon.style.top = `${e.clientY - offsetY}px`;
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

chatbotIcon.addEventListener("click", (e) => {
  if (!dragStarted) {
    window.open("../chatbot1/index.html", "_blank");
  }
});

// Handle navigation to login form
const loginLink = document.getElementById("login-link");

if (loginLink) {
  loginLink.addEventListener("click", () => {
    window.location.href = "../users/loginForm/loginForm.html"; // Ensure this path matches your directory structure
  });
}
