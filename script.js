document.getElementById('celebrateButton').addEventListener('click', () => {
  // Apply fade-out animation to body
  document.body.classList.add("fade-out");

  // Redirect to slides page after animation
  setTimeout(() => {
    window.location.href = "slides.html";
  }, 4000); // 1-second delay for smooth transition
});