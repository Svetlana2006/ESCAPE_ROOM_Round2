const CLUE_AUDIO_PATH = "morse_code/morse_code_noised.wav";
const PUZZLE_SHEET_PATH = "find_the_anamoly.xlsx";
const PUZZLE_SHEET_NAME = "find_the_anamoly.xlsx";

function forceDownload(filePath, filename) {
  return fetch(filePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }
      return response.blob();
    })
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      return true;
    })
    .catch(() => {
      const link = document.createElement("a");
      link.href = filePath;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      return false;
    });
}

function toggleAudio() {
  const audio = document.getElementById("clue-audio");
  const label = document.getElementById("play-label");
  const icon = document.getElementById("play-icon");
  if (!audio) return;

  if (audio.paused) {
    audio.play();
    label.textContent = "Pause";
    icon.setAttribute("d", "M6 19h4V5H6v14zm8-14v14h4V5h-4z");
  } else {
    audio.pause();
    label.textContent = "Play";
    icon.setAttribute("d", "M8 5v14l11-7z");
  }

  audio.onended = () => {
    label.textContent = "Play";
    icon.setAttribute("d", "M8 5v14l11-7z");
  };
}

function downloadClue() {
  return forceDownload(CLUE_AUDIO_PATH, "clue_audio.wav");
}

function downloadPuzzleSheet() {
  return forceDownload(PUZZLE_SHEET_PATH, PUZZLE_SHEET_NAME);
}

window.toggleAudio = toggleAudio;
window.downloadClue = downloadClue;

const trigger = document.querySelector(".hidden-rift-trigger");

if (trigger) {
  trigger.addEventListener("click", () => {
    const nextPage = trigger.dataset.nextPage;
    if (nextPage) {
      window.location.href = nextPage;
    }
  });
}

const keyForm = document.querySelector(".key-form");

if (keyForm) {
  const input = keyForm.querySelector("input");
  const submitButton = keyForm.querySelector("button[type='submit']");
  const feedback = document.querySelector(".form-feedback");
  const expectedKey = (keyForm.dataset.expectedKey || "").toUpperCase();

  keyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const providedKey = (input.value || "").trim().toUpperCase().replace(/\s+/g, "");

    if (providedKey === expectedKey) {
      if (input) input.disabled = true;
      if (submitButton) submitButton.disabled = true;

      feedback.textContent = "Signal aligned. Check your system. The sheet is already there.";
      feedback.className = "form-feedback success";
      downloadPuzzleSheet();

      window.setTimeout(() => {
        window.location.href = "unlocked.html";
      }, 1100);
      return;
    }

    feedback.textContent = "Incorrect key. Clean the audio and decode it again.";
    feedback.className = "form-feedback error";
  });
}
