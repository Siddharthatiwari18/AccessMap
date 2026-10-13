function addChatMessage(text, role) {
  const messages = document.getElementById("chatMessages");
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${role === "user" ? "user-bubble" : "assistant-bubble"}`;
  bubble.textContent = text;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
}

function setupAssistant() {
  const form = document.getElementById("askForm");
  const input = document.getElementById("questionInput");
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    addChatMessage(question, "user");
    input.value = "";
    const pending = document.createElement("div");
    pending.className = "chat-bubble assistant-bubble";
    pending.textContent = "Checking the available reports…";
    document.getElementById("chatMessages").appendChild(pending);
    try {
      const result = await AccessMapAPI.ask(question);
      pending.textContent = result.answer || "I don't have enough report information to answer that yet.";
    } catch {
      pending.textContent = "The API isn't reachable right now. Start the Spring Boot backend and try again. Please verify important access needs directly with the venue.";
    }
    document.getElementById("chatMessages").scrollTop = document.getElementById("chatMessages").scrollHeight;
  });
}
