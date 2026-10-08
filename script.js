const projectMenuItem = document.querySelector(".nav-item--projects");
const projectMenuToggle = document.querySelector(".project-menu-toggle");
const projectMenu = document.querySelector(".project-menu");

const projectDetails = {
  "good-things-grow": {
    title: "Good Things Grow",
    meta: "Brand identity · 2025",
    description: "A small seed of an idea, given room to become something generous. Good Things Grow is a warm identity for patient hands and hopeful beginnings, where every leaf marks the quiet joy of showing up again.",
  },
  "slow-studio": {
    title: "Slow Studio",
    meta: "Digital experience · 2024",
    description: "A softer corner of the internet, made for taking your time. Slow Studio lets calm colours, generous space and unhurried details invite you to stay a little longer and find your own pace.",
  },
  "notes-to-self": {
    title: "Notes to Self",
    meta: "Editorial · 2024",
    description: "A page can hold the things we almost forget to tell ourselves. Notes to Self turns passing thoughts into a little paper refuge: honest, imperfect and always ready for one more line.",
  },
  "little-rituals": {
    title: "Little Rituals",
    meta: "Art direction · 2024",
    description: "The day is made of small returns: a light in the window, a familiar cup, a breath between things. Little Rituals gives those ordinary moments a gentle orbit of their own.",
  },
  "open-house": {
    title: "Open House",
    meta: "Web design · 2023",
    description: "An open door, afternoon light, and the feeling that there is room for you here. Open House is a welcoming digital home built from warm edges, thoughtful paths and space to gather.",
  },
};

document.querySelectorAll(".project-card .project-info h3").forEach((heading) => {
  const title = heading.textContent.trim();
  const letterStagger = 42;
  const letterDuration = 320;
  heading.closest(".project-card")?.style.setProperty(
    "--title-animation-time",
    `${(title.length - 1) * letterStagger + letterDuration}ms`,
  );
  const titleLayer = document.createElement("span");
  titleLayer.className = "project-title-layer";
  heading.setAttribute("aria-label", title);

  [...title].forEach((character, index) => {
    const letter = document.createElement("span");
    letter.className = "project-letter";
    letter.style.setProperty("--enter-delay", `${index * letterStagger}ms`);
    letter.style.setProperty("--exit-delay", `${index * letterStagger}ms`);

    const normal = document.createElement("span");
    normal.className = "project-letter-normal";
    normal.textContent = character === " " ? "\u00a0" : character;

    const script = document.createElement("span");
    script.className = "project-letter-script";
    script.setAttribute("aria-hidden", "true");
    script.textContent = character === " " ? "\u00a0" : character;

    letter.append(normal, script);
    titleLayer.append(letter);
  });

  heading.replaceChildren(titleLayer);
});

const projectDialog = document.querySelector(".project-dialog");

if (projectDialog) {
  const dialogTitle = projectDialog.querySelector("#project-dialog-title");
  const dialogMeta = projectDialog.querySelector(".project-dialog-meta");
  const dialogDescription = projectDialog.querySelector(".project-dialog-description");
  const preview = projectDialog.querySelector(".project-preview-art");
  let lastProjectCard = null;

  const openProject = (card) => {
    const details = projectDetails[card.dataset.project];
    const artwork = card.querySelector(".project-visual");
    if (!details || !artwork) return;

    lastProjectCard = card;
    dialogTitle.textContent = details.title;
    dialogMeta.textContent = details.meta;
    dialogDescription.textContent = details.description;
    projectDialog.className = `project-dialog ${Array.from(card.classList).find((className) => className.startsWith("project-card--"))}`;
    preview.replaceChildren(artwork.cloneNode(true));
    projectDialog.showModal();
    projectDialog.focus();
  };

  document.querySelectorAll(".project-card[data-project]").forEach((card) => {
    card.addEventListener("click", () => openProject(card));
    card.addEventListener("keydown", (event) => {
      if (event.target !== card || (event.key !== "Enter" && event.key !== " ")) return;
      event.preventDefault();
      openProject(card);
    });
  });

  projectDialog.addEventListener("click", (event) => {
    if (event.target === projectDialog) projectDialog.close();
  });
  projectDialog.addEventListener("close", () => lastProjectCard?.focus());
}

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
  contactForm.addEventListener("invalid", (event) => {
    const field = event.target;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;

    if (field.validity.valueMissing) {
      field.setCustomValidity("Please fill in all required fields before sending your message.");
    } else if (field.validity.typeMismatch && field.type === "email") {
      field.setCustomValidity("Please enter a valid email address.");
    }
  }, true);

  contactForm.addEventListener("input", (event) => {
    const field = event.target;
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
      field.setCustomValidity("");
    }
  });

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
      submitButton.textContent = "Send message";
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
