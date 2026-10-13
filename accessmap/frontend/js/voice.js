function setupVoiceInput() {
  const button = document.getElementById("voiceButton");
  const input = document.getElementById("questionInput");
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!button) return;
  if (!SpeechRecognition) {
    button.title = "Voice input is not supported in this browser";
    button.addEventListener("click", () => {
      addChatMessage("Voice input is not available in this browser. You can type your question instead.", "assistant");
    });
    return;
  }
  button.addEventListener("click", () => {
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    button.textContent = "…";
    recognition.onresult = event => {
      input.value = event.results[0][0].transcript;
      input.focus();
    };
    recognition.onerror = () => addChatMessage("I couldn't hear that clearly. Please try again or type your question.", "assistant");
    recognition.onend = () => { button.textContent = "🎙"; };
    recognition.start();
  });
}
