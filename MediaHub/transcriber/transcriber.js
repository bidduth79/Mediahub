const fileInput = document.getElementById("fileInput");
const btn = document.getElementById("btnTranscribe");
const output = document.getElementById("output");
const statusEl = document.getElementById("status");
const timestamp = document.getElementById("timestamp");

btn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) return alert("ফাইল দিন!");

  statusEl.textContent = "Transcribing... ⏳";
  output.value = "";

  try {
    // Electron gives real path:
    const transcript = await window.electronAPI.transcribe(file.path, timestamp.checked);
    output.value = transcript;
    statusEl.textContent = "Done ✅";
  } catch (err) {
    console.log(err);
    statusEl.textContent = "Error ❌";
    alert("Transcribe error: " + err);
  }
});
