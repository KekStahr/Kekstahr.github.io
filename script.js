const projectMenuItem = document.querySelector(".nav-item--projects");
const projectMenuToggle = document.querySelector(".project-menu-toggle");
const projectMenu = document.querySelector(".project-menu");

if (projectMenuItem && projectMenuToggle && projectMenu) {
  projectMenuToggle.addEventListener("click", () => {
    const isOpen = projectMenuToggle.getAttribute("aria-expanded") === "true";
    projectMenuToggle.setAttribute("aria-expanded", String(!isOpen));
    projectMenuItem.classList.toggle("is-open", !isOpen);
  });

  projectMenu.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;

    projectMenuToggle.setAttribute("aria-expanded", "false");
    projectMenuItem.classList.remove("is-open");
  });

  document.addEventListener("click", (event) => {
    if (projectMenuItem.contains(event.target)) return;

    projectMenuToggle.setAttribute("aria-expanded", "false");
    projectMenuItem.classList.remove("is-open");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    projectMenuToggle.setAttribute("aria-expanded", "false");
    projectMenuItem.classList.remove("is-open");
    projectMenuToggle.focus();
  });
}

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const submitButton = contactForm?.querySelector('button[type="submit"]');

if (contactForm && formStatus && submitButton) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (contactForm.action.includes("YOUR_FORM_ID")) {
      formStatus.textContent = "Der Versand ist noch nicht eingerichtet. Bitte trage zuerst deinen Formspree-Link ein.";
      formStatus.classList.add("is-error");
      formStatus.classList.remove("is-success");
      return;
    }

    submitButton.disabled = true;
    submitButton.setAttribute("aria-busy", "true");
    submitButton.textContent = "Sending…";
    formStatus.textContent = "";
    formStatus.classList.remove("is-error", "is-success");

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Form submission failed with status ${response.status}`);
      }

      contactForm.reset();
      formStatus.textContent = "The E-Mail was sent.";
      formStatus.classList.add("is-success");
    } catch (error) {
      console.error("Unable to send the contact form.", error);
      formStatus.textContent = "Die Nachricht konnte nicht gesendet werden. Bitte versuche es erneut.";
      formStatus.classList.add("is-error");
    } finally {
      submitButton.disabled = false;
      submitButton.removeAttribute("aria-busy");
      submitButton.innerHTML = 'Send message <span aria-hidden="true">↗</span>';
    }
  });
}

const contactCatStage = document.querySelector(".contact-cat-stage");

if (contactCatStage) {
  const catHead = contactCatStage.querySelector(".cat-head");
  const catHearts = contactCatStage.querySelector(".cat-hearts");
  let lastHeartAt = 0;

  document.addEventListener("pointermove", (event) => {
    const bounds = contactCatStage.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height * 0.43;
    const offsetX = (event.clientX - centerX) / (bounds.width / 2);
    const offsetY = (event.clientY - centerY) / (bounds.height / 2);
    const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
    const isNear = distance < 240;

    contactCatStage.classList.toggle("is-curious", isNear);
    catHead.style.transform = `rotate(${(Math.max(-1, Math.min(1, offsetX)) * 11).toFixed(1)}deg)`;
    contactCatStage.style.setProperty("--pupil-x", `${(Math.max(-1, Math.min(1, offsetX)) * 2.5).toFixed(1)}px`);
    contactCatStage.style.setProperty("--pupil-y", `${(Math.max(-1, Math.min(1, offsetY)) * 1.5).toFixed(1)}px`);

    const isPetting =
      event.clientX >= bounds.left &&
      event.clientX <= bounds.right &&
      event.clientY >= bounds.top &&
      event.clientY <= bounds.bottom;
    const now = performance.now();

    if (!isPetting || now - lastHeartAt < 180) return;
    lastHeartAt = now;

    const heart = document.createElement("span");
    heart.className = "cat-heart";
    heart.textContent = "♥";
    heart.style.left = `${event.clientX - bounds.left}px`;
    heart.style.top = `${event.clientY - bounds.top}px`;
    heart.style.setProperty("--heart-drift", `${Math.round(Math.random() * 28 - 14)}px`);
    heart.addEventListener("animationend", () => heart.remove(), { once: true });
    catHearts.append(heart);
    window.setTimeout(() => heart.remove(), 1100);
  }, { passive: true });
}
