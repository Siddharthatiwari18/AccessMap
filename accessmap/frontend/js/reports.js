function setupReportForm() {
  const form = document.getElementById("reportForm");
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const placeId = document.getElementById("reportPlace").value;
    const message = document.getElementById("reportMessage");
    if (!placeId) { message.textContent = "Please choose a place."; return; }
    const report = {
      feature: document.getElementById("reportFeature").value,
      status: document.getElementById("reportStatus").value,
      notes: document.getElementById("reportNotes").value.trim(),
      reporterName: "Community member"
    };
    message.textContent = "Submitting report…";
    try {
      const saved = await AccessMapAPI.submitReport(placeId, report);
      message.textContent = `Report submitted. Reference: ${saved.id || "received"}. Thank you for sharing what you observed.`;
      form.reset();
      await loadPlaces();
    } catch {
      message.textContent = "Could not submit: check that the Spring Boot API is running at localhost:8080.";
    }
  });
}
