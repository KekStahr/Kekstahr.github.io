const projectMenuItem = document.querySelector(".nav-item--projects");
const projectMenuToggle = document.querySelector(".project-menu-toggle");
const projectMenu = document.querySelector(".project-menu");

const projectDetails = {
  "reso-jeanne-darc": {
    title: "Reşo Jeanne d’Arc",
    meta: "Mobile & web app · 2026",
    description: "Reşo Jeanne d’Arc helps a group stay in touch while they’re out together. Share your location if you choose, send a message, or let everyone know when plans change. It’s a simple way to keep the group on the same page, with location sharing always in each person’s hands.",
    webUrl: "https://rescho-o4ry.onrender.com/",
    downloadUrl: "https://github.com/KekStahr/Kekstahr.github.io/releases/download/v1.0.0/ResoJeanneDarc.apk",
    downloadLabel: "Download for Android",
  },
  "reso-motivation": {
    title: "Reso Motivation",
    meta: "Android app · 2026 · Pre-release",
    description: "Reso Motivation helps you organize tasks, stay focused, and track your progress. It is an early work-in-progress version, so features may change as development continues. Tasks, focus sessions, and settings are stored locally on your device.",
    features: [
      "Tasks with priorities and deadlines",
      "A customizable focus timer with breaks",
      "Statistics for focus time and completed tasks",
      "Calendar and daily views",
      "Custom habits and streaks",
      "Appearance, accent color, and language settings",
      "An optional Gemini coach that requires your own API key",
    ],
    downloadUrl: "https://github.com/KekStahr/Kekstahr.github.io/releases/download/version1.0/Reso_Motivation.apk",
    downloadLabel: "Download for Android",
  },
  "reso-agent-clicker": {
    title: "Reso Agent Clicker",
    meta: "Windows desktop software · 2026",
    description: "Reso Agent Clicker is a Windows desktop tool that watches your screen for image templates and performs the clicks you configure. Build and save setups for different tasks, decide how each match should be clicked, and let the software wait for an image before acting. With global start and stop hotkeys plus a separate autoclicker, the controls stay close at hand.",
    features: [
      "Detect configured image templates on screen",
      "Choose single, double, or repeated clicks for each match",
      "Optionally wait for an image to appear before clicking",
      "Adjust mouse movement speed and click interval",
      "Start or stop detection with configurable global hotkeys",
      "Use a standalone autoclicker at the current cursor position",
      "Save, load, and manage multiple setups",
      "Standalone Windows executable included in the release",
    ],
    downloadUrl: "https://github.com/KekStahr/Kekstahr.github.io/releases/download/ver1.0/Reso.Agent.Clicker.exe",
    downloadLabel: "Download for Windows",
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
  const projectFeatures = projectDialog.querySelector(".project-dialog-features");
  const projectTerms = projectDialog.querySelector(".project-terms");
  const projectActions = projectDialog.querySelector(".project-dialog-actions");
  const projectWebLink = projectDialog.querySelector(".project-dialog-web-link");
  const projectDownload = projectDialog.querySelector(".project-download");
  const projectDownloadLabel = projectDialog.querySelector(".project-download-label");
  const preview = projectDialog.querySelector(".project-preview-art");
  const previewPanel = projectDialog.querySelector(".project-dialog-preview");
  const closeButton = projectDialog.querySelector(".project-dialog-close");
  let lastProjectCard = null;

  const openProject = (card) => {
    const details = projectDetails[card.dataset.project];
    const artwork = card.querySelector(".project-visual");
    if (!details || !artwork) return;

    lastProjectCard = card;
    dialogTitle.textContent = details.title;
    dialogMeta.textContent = details.meta;
    dialogDescription.textContent = details.description;
    const features = details.features || [];
    projectFeatures.replaceChildren(...features.map((feature) => {
      const item = document.createElement("li");
      item.textContent = feature;
      return item;
    }));
    projectFeatures.hidden = !features.length;
    const isJeanneDarcProject = card.dataset.project === "reso-jeanne-darc";
    projectTerms.hidden = !isJeanneDarcProject;
    projectTerms.open = false;
    projectActions.hidden = !details.downloadUrl;
    projectWebLink.hidden = !details.webUrl;
    if (details.webUrl) {
      projectWebLink.querySelector("a").href = details.webUrl;
    }
    if (details.downloadUrl) {
      projectDownload.href = details.downloadUrl;
      projectDownloadLabel.textContent = details.downloadLabel;
      if (details.downloadUrl.includes("/releases/tag/")) {
        projectDownload.removeAttribute("download");
        projectDownload.target = "_blank";
        projectDownload.rel = "noopener noreferrer";
      } else {
        projectDownload.setAttribute("download", new URL(details.downloadUrl).pathname.split("/").pop());
        projectDownload.removeAttribute("target");
        projectDownload.removeAttribute("rel");
      }
    }
    projectDialog.className = `project-dialog ${Array.from(card.classList).find((className) => className.startsWith("project-card--"))}`;
    preview.replaceChildren(artwork.cloneNode(true));
    projectDialog.showModal();
    closeButton.focus();
  };

  document.querySelectorAll(".project-card[data-project]").forEach((card) => {
    card.addEventListener("click", () => openProject(card));
    card.addEventListener("keydown", (event) => {
      if (event.target !== card || (event.key !== "Enter" && event.key !== " ")) return;
      event.preventDefault();
      openProject(card);
    });
  });

  closeButton.addEventListener("click", () => projectDialog.close());
  previewPanel.addEventListener("wheel", (event) => {
    projectDialog.scrollTop += event.deltaY;
    event.preventDefault();
  }, { passive: false });

  projectDialog.addEventListener("click", (event) => {
    if (event.target !== projectDialog) return;

    const bounds = projectDialog.getBoundingClientRect();
    const clickedOutside =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;

    if (clickedOutside) projectDialog.close();
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
  let lastHeartAt = Number.NEGATIVE_INFINITY;

  const showHeart = (clientX, clientY) => {
    const bounds = contactCatStage.getBoundingClientRect();
    if (
      !bounds.width ||
      !bounds.height ||
      clientX < bounds.left ||
      clientX > bounds.right ||
      clientY < bounds.top ||
      clientY > bounds.bottom
    ) return;

    const now = performance.now();
    if (now - lastHeartAt < 180) return;
    lastHeartAt = now;

    const heart = document.createElement("span");
    heart.className = "cat-heart";
    heart.textContent = "♥";
    heart.style.left = `${clientX - bounds.left}px`;
    heart.style.top = `${clientY - bounds.top}px`;
    heart.style.setProperty("--heart-drift", `${Math.round(Math.random() * 28 - 14)}px`);
    heart.addEventListener("animationend", () => heart.remove(), { once: true });
    catHearts.append(heart);
    window.setTimeout(() => heart.remove(), 1100);
  };

  const updateCatGaze = (clientX, clientY) => {
    const bounds = contactCatStage.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height * 0.43;
    const offsetX = (clientX - centerX) / (bounds.width / 2);
    const offsetY = (clientY - centerY) / (bounds.height / 2);
    const distance = Math.hypot(clientX - centerX, clientY - centerY);
    const isNear = distance < 240;

    contactCatStage.classList.toggle("is-curious", isNear);
    catHead.style.transform = `rotate(${(Math.max(-1, Math.min(1, offsetX)) * 11).toFixed(1)}deg)`;
    contactCatStage.style.setProperty("--pupil-x", `${(Math.max(-1, Math.min(1, offsetX)) * 2.5).toFixed(1)}px`);
    contactCatStage.style.setProperty("--pupil-y", `${(Math.max(-1, Math.min(1, offsetY)) * 1.5).toFixed(1)}px`);
  };

  document.addEventListener("pointerdown", (event) => {
    updateCatGaze(event.clientX, event.clientY);
    if (event.pointerType === "touch") {
      showHeart(event.clientX, event.clientY);
    }
  }, { passive: true });

  document.addEventListener("pointermove", (event) => {
    updateCatGaze(event.clientX, event.clientY);

    if (event.pointerType !== "touch") {
      showHeart(event.clientX, event.clientY);
    }
  }, { passive: true });
}
