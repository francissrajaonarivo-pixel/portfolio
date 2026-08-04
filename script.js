// Year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Scroll progress bar
const progressBar = document.getElementById("progressBar");
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + "%";
});

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// Theme toggle (persisted)
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  root.setAttribute("data-theme", savedTheme);
  themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";
}
themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const next = current === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  themeToggle.textContent = next === "dark" ? "☀️" : "🌙";
});

// Formulaire de message : envoi via WhatsApp (ou email en repli)
const WHATSAPP_NUMBER = "261389510134";
const CONTACT_EMAIL = "francissrajaonarivo@gmail.com";

function buildContactMessage() {
  const name = document.getElementById("cfName").value.trim();
  const email = document.getElementById("cfEmail").value.trim();
  const message = document.getElementById("cfMessage").value.trim();
  let text = `Bonjour, je m'appelle ${name}.\n\n${message}`;
  if (email) text += `\n\nMon email : ${email}`;
  return text;
}

const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = buildContactMessage();
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
});

document.getElementById("cfEmailFallback").addEventListener("click", (e) => {
  e.preventDefault();
  const name = document.getElementById("cfName").value.trim();
  const message = document.getElementById("cfMessage").value.trim();
  const subject = `Message depuis le portfolio — ${name || "Visiteur"}`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
});
