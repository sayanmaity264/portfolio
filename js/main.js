/* ==========================================================================
   Sayan Maity — Portfolio
   Vanilla JS: theme toggle, mobile nav, scroll-spy, reveal animations, contact form.
   No frameworks/libraries — keeps the page light and dependency-free.
   ========================================================================== */

(function () {
	"use strict";

	/* ---------- Theme toggle (persisted, respects OS preference on first visit) ---------- */
	const THEME_KEY = "sm-theme";
	const root = document.documentElement;
	const themeToggle = document.getElementById("themeToggle");

	function applyTheme(theme) {
		root.setAttribute("data-theme", theme);
		themeToggle.setAttribute("aria-pressed", theme === "dark");
		themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
	}

	const storedTheme = localStorage.getItem(THEME_KEY);
	const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	applyTheme(storedTheme || (systemPrefersDark ? "dark" : "light"));

	themeToggle.addEventListener("click", () => {
		const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
		applyTheme(next);
		localStorage.setItem(THEME_KEY, next);
	});

	/* ---------- Mobile nav ---------- */
	const sidebar = document.getElementById("sidebar");
	const navToggle = document.getElementById("navToggle");
	const overlay = document.getElementById("sidebarOverlay");

	function closeNav() {
		sidebar.classList.remove("open");
		overlay.classList.remove("open");
		navToggle.classList.remove("open");
		navToggle.setAttribute("aria-expanded", "false");
	}

	function toggleNav() {
		const isOpen = sidebar.classList.toggle("open");
		overlay.classList.toggle("open", isOpen);
		navToggle.classList.toggle("open", isOpen);
		navToggle.setAttribute("aria-expanded", String(isOpen));
	}

	navToggle.addEventListener("click", toggleNav);
	overlay.addEventListener("click", closeNav);
	document.querySelectorAll(".nav-link").forEach((link) => link.addEventListener("click", closeNav));

	/* ---------- Scroll-spy: highlight the nav link for the section in view ---------- */
	const sections = document.querySelectorAll("main .section");
	const navLinks = document.querySelectorAll(".nav-link");

	const spyObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				const id = entry.target.getAttribute("id");
				navLinks.forEach((link) => {
					link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
				});
			});
		},
		{ rootMargin: "-45% 0px -50% 0px", threshold: 0 }
	);
	sections.forEach((section) => spyObserver.observe(section));

	/* ---------- Reveal-on-scroll animations ---------- */
	const revealObserver = new IntersectionObserver(
		(entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("in-view");
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.15 }
	);
	document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

	/* ---------- Contact form ----------
	   This is a static site with no backend, so submitting opens the visitor's
	   email client with the message pre-filled. Swap this for a Formspree /
	   Netlify Forms endpoint if the site ever gets a backend. */
	const contactForm = document.getElementById("contactForm");
	const formNote = document.getElementById("formNote");

	contactForm.addEventListener("submit", (event) => {
		event.preventDefault();
		const name = document.getElementById("name").value.trim();
		const email = document.getElementById("email").value.trim();
		const message = document.getElementById("message").value.trim();

		if (!name || !email || !message) {
			formNote.textContent = "Please fill in every field before sending.";
			return;
		}

		const subject = encodeURIComponent(`Portfolio contact from ${name}`);
		const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
		window.location.href = `mailto:sayanmaity264@gmail.com?subject=${subject}&body=${body}`;
		formNote.textContent = "Opening your email client...";
	});

	/* ---------- Footer year ---------- */
	document.getElementById("year").textContent = new Date().getFullYear();
})();
