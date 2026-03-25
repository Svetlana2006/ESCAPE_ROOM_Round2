/* ── Audio player (signal page) ── */
function toggleAudio() {
  const audio = document.getElementById("clue-audio");
  const label = document.getElementById("play-label");
  const icon  = document.getElementById("play-icon");
  if (!audio) return;

  if (audio.paused) {
    audio.play();
    label.textContent = "Pause";
    icon.setAttribute("d", "M6 19h4V5H6v14zm8-14v14h4V5h-4z"); // pause icon
  } else {
    audio.pause();
    label.textContent = "Play";
    icon.setAttribute("d", "M8 5v14l11-7z"); // play icon
  }

  // Reset button when audio ends
  audio.onended = () => {
    label.textContent = "Play";
    icon.setAttribute("d", "M8 5v14l11-7z");
  };
}

function downloadClue() {
  fetch("morse_code/morse_code_noised.wav")
    .then((r) => r.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "clue_audio.wav";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
}

/* ── Hidden rift trigger ── */
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
  const feedback = document.querySelector(".form-feedback");
  const expectedKey = (keyForm.dataset.expectedKey || "").toUpperCase();

  keyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const providedKey = (input.value || "").trim().toUpperCase().replace(/\s+/g, "");

    if (providedKey === expectedKey) {
      feedback.textContent = "Signal aligned. Opening the next chamber.";
      feedback.className = "form-feedback success";
      window.setTimeout(() => {
        window.location.href = "unlocked.html";
      }, 700);
      return;
    }

    feedback.textContent = "Incorrect key. Clean the audio and decode it again.";
    feedback.className = "form-feedback error";
  });
}
