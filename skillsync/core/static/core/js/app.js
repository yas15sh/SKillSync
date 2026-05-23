(() => {
    const root = document.documentElement;
    const storedTheme = localStorage.getItem("skillsync-theme");

    if (storedTheme) {
        root.dataset.theme = storedTheme;
    }

    document.querySelectorAll("[data-theme-toggle] i").forEach((icon) => {
        icon.className = root.dataset.theme === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
    });

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
        button.addEventListener("click", () => {
            const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
            root.dataset.theme = nextTheme;
            localStorage.setItem("skillsync-theme", nextTheme);
            const icon = button.querySelector("i");
            if (icon) {
                icon.className = nextTheme === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
            }
        });
    });

    document.querySelectorAll("[data-dismiss-toast]").forEach((button) => {
        button.addEventListener("click", () => {
            button.closest(".app-toast")?.remove();
        });
    });

    document.querySelectorAll("[data-password-toggle]").forEach((button) => {
        const field = button.closest(".password-field");
        const input = field?.querySelector("[data-password-input]");
        const icon = button.querySelector("i");

        button.addEventListener("click", () => {
            if (!input) {
                return;
            }
            const isHidden = input.type === "password";
            input.type = isHidden ? "text" : "password";
            button.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
            if (icon) {
                icon.className = isHidden ? "bi bi-eye-slash" : "bi bi-eye";
            }
        });
    });

    document.querySelectorAll("[data-card-toggle]").forEach((button) => {
        const card = button.closest("[data-project-card]");
        const body = card?.querySelector("[data-card-body]");
        const icon = button.querySelector("i");

        button.addEventListener("click", () => {
            if (!body) {
                return;
            }
            const isHidden = body.hidden;
            body.hidden = !isHidden;
            button.setAttribute("aria-expanded", String(isHidden));
            if (icon) {
                icon.className = isHidden ? "bi bi-chevron-up" : "bi bi-chevron-down";
            }
        });
    });

    const projectSearch = document.querySelector("[data-project-search]");
    const projectFilter = document.querySelector("[data-project-filter]");
    const projectCards = Array.from(document.querySelectorAll("[data-project-card]"));
    const projectEmpty = document.querySelector("[data-project-empty]");

    const filterProjects = () => {
        const query = (projectSearch?.value || "").trim().toLowerCase();
        const status = (projectFilter?.value || "").trim().toLowerCase();
        let visibleCount = 0;

        projectCards.forEach((card) => {
            const haystack = (card.dataset.searchText || "").toLowerCase();
            const cardStatus = (card.dataset.status || "").toLowerCase();
            const matchesQuery = !query || haystack.includes(query);
            const matchesStatus = !status || cardStatus.includes(status);
            const visible = matchesQuery && matchesStatus;
            card.classList.toggle("d-none", !visible);
            if (visible) {
                visibleCount += 1;
            }
        });

        projectEmpty?.classList.toggle("d-none", visibleCount !== 0 || projectCards.length === 0);
    };

    projectSearch?.addEventListener("input", filterProjects);
    projectFilter?.addEventListener("change", filterProjects);

    window.setTimeout(() => {
        document.querySelectorAll(".app-toast").forEach((toast) => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(8px)";
            window.setTimeout(() => toast.remove(), 200);
        });
    }, 5000);

    document.querySelectorAll("form[data-loading]").forEach((form) => {
        form.addEventListener("submit", (event) => {
            const submitter = event.submitter || form.querySelector("button[type='submit']");
            if (!submitter) {
                return;
            }
            submitter.disabled = true;
            submitter.dataset.originalText = submitter.innerHTML;
            submitter.innerHTML = "<span class='spinner-border spinner-border-sm me-2'></span>Working";
        });
    });
})();
