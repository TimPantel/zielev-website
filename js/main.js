// ============================================================
// Ziel e.V. - Main JavaScript
// ============================================================

// Mobile Navigation Toggle
function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    const toggle = document.querySelector('.nav__toggle');
    const isOpen = menu.classList.toggle('active');

    if (toggle) {
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
    }
}

function closeMenu() {
    const menu = document.getElementById('nav-menu');
    const toggle = document.querySelector('.nav__toggle');

    if (menu) menu.classList.remove('active');
    if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Menü öffnen');
    }
}

// Close menu when clicking outside
document.addEventListener('click', function (event) {
    const menu = document.getElementById('nav-menu');
    const toggle = document.querySelector('.nav__toggle');

    if (menu && toggle && !menu.contains(event.target) && !toggle.contains(event.target)) {
        closeMenu();
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        const menu = document.getElementById('nav-menu');
        if (menu && menu.classList.contains('active')) {
            closeMenu();
            document.querySelector('.nav__toggle')?.focus();
        }
    }
});



// Smooth Scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active class to current page in navigation
document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav__link');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('nav__link--active');
        } else {
            link.classList.remove('nav__link--active');
        }
    });
});
// ============================================================
// Multi-Step Enrollment Form Logic
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('enrollment-form');
    if (!form) return;

    const startedAtField = document.getElementById('enrollment-started-at');
    const submissionIdField = document.getElementById('enrollment-submission-id');
    const markFormStarted = () => {
        if (startedAtField && !startedAtField.value) startedAtField.value = String(Date.now());
    };
    form.addEventListener('focusin', markFormStarted, { once: true });
    form.addEventListener('input', markFormStarted, { once: true });
    form.addEventListener('change', markFormStarted, { once: true });
    if (submissionIdField) {
        submissionIdField.value = window.crypto?.randomUUID
            ? window.crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
    }

    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const btnNext = document.getElementById('btn-next');
    const btnPrev = document.getElementById('btn-prev');
    const btnSubmit = document.getElementById('btn-submit');
    const successScreen = document.getElementById('form-success');
    const ibanInput = document.getElementById('iban-input');
    const ibanHelper = document.getElementById('iban-helper');

    let currentStep = 1;

    // --- Navigation Functions ---

    function updateForm() {
        // Update Steps Visibility
        steps.forEach(step => {
            step.classList.remove('form-step--active');
            if (parseInt(step.id.split('-')[1]) === currentStep) {
                step.classList.add('form-step--active');
            }
        });

        // Update Progress Bar
        progressSteps.forEach(pStep => {
            const stepNum = parseInt(pStep.dataset.step);
            pStep.classList.remove('progress-step--active', 'progress-step--completed');

            if (stepNum === currentStep) {
                pStep.classList.add('progress-step--active');
            } else if (stepNum < currentStep) {
                pStep.classList.add('progress-step--completed');
                pStep.innerHTML = '✓';
            } else {
                pStep.innerHTML = stepNum;
            }
        });

        // Update Buttons
        btnPrev.style.visibility = currentStep === 1 ? 'hidden' : 'visible';

        if (currentStep === steps.length) {
            btnNext.style.display = 'none';
            btnSubmit.style.display = 'block';
        } else {
            btnNext.style.display = 'block';
            btnSubmit.style.display = 'none';
        }

        // Scroll to top of form
        document.querySelector('.enrollment-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function validateStep(stepNum) {
        const currentStepEl = document.getElementById(`step-${stepNum}`);
        if (!currentStepEl) return true;

        const inputs = currentStepEl.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim() || (input.type === 'checkbox' && !input.checked)) {
                input.style.borderColor = 'var(--color-error)';
                isValid = false;
            } else {
                input.style.borderColor = 'var(--color-gray-200)';
            }

            // Special Pattern Validation (PLZ)
            if (input.pattern && !new RegExp(input.pattern).test(input.value)) {
                input.style.borderColor = 'var(--color-error)';
                isValid = false;
            }
        });

        // IBAN Validation on Step 5
        if (stepNum === 5) {
            if (!validateIBAN(ibanInput.value)) {
                ibanInput.style.borderColor = 'var(--color-error)';
                isValid = false;
            }
        }

        return isValid;
    }

    // --- Module Detail Toggles ---
    const setupToggle = (checkId, detailId) => {
        const check = document.getElementById(checkId);
        const detail = document.getElementById(detailId);
        if (check && detail) {
            // Initial state
            detail.style.display = check.checked ? 'block' : 'none';
            check.addEventListener('change', () => {
                detail.style.display = check.checked ? 'block' : 'none';
                if (check.checked) {
                    detail.style.animation = 'fadeIn 0.3s ease';
                }
            });
        }
    };

    setupToggle('check-homework', 'details-homework');
    setupToggle('check-lunch', 'details-lunch');
    setupToggle('check-afternoon', 'details-afternoon');

    // --- Event Listeners ---

    btnNext.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            currentStep++;
            updateForm();
        }
    });

    btnPrev.addEventListener('click', () => {
        currentStep--;
        updateForm();
    });

    // IBAN Real-time Check
    ibanInput.addEventListener('input', (e) => {
        const val = e.target.value.replace(/\s/g, '').toUpperCase();
        e.target.value = val.match(/.{1,4}/g)?.join(' ') || val; // Formatting

        if (validateIBAN(val)) {
            ibanHelper.textContent = '✅ IBAN ist formal gültig';
            ibanHelper.className = 'iban-valid';
        } else {
            ibanHelper.textContent = '❌ Bitte geben Sie eine gültige deutsche IBAN ein';
            ibanHelper.className = 'iban-invalid';
        }
    });

    // Form Submission
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Final validation check for all steps before submission
        let isFormValid = true;
        for (let i = 1; i <= steps.length; i++) {
            if (!validateStep(i)) {
                isFormValid = false;
                // If invalid, go back to the first invalid step
                currentStep = i;
                updateForm();
                alert('Bitte überprüfen Sie Ihre Eingaben. Einige Pflichtfelder (z.B. E-Mail) sind nicht korrekt ausgefüllt.');
                break; // Stop checking further steps once we found an invalid one
            }
        }

        if (!isFormValid) {
            return; // Stop submission
        }

        const hasSelectedModule = ['check-homework', 'check-lunch', 'check-afternoon']
            .some(id => document.getElementById(id)?.checked);
        const hasSelectedLunchDay = ['lunch_day_mo', 'lunch_day_di', 'lunch_day_mi', 'lunch_day_do', 'lunch_day_fr']
            .some(name => form.querySelector(`[name="${name}"]`)?.checked);
        if (!hasSelectedModule || (document.getElementById('check-lunch')?.checked && !hasSelectedLunchDay)) {
            currentStep = 3;
            updateForm();
            alert(!hasSelectedModule
                ? 'Bitte wählen Sie mindestens ein Betreuungsangebot aus.'
                : 'Bitte wählen Sie mindestens einen Wochentag für das Mittagessen aus.');
            return;
        }

        // Final UI feedback
        btnSubmit.disabled = true;
        btnSubmit.textContent = '⏳ Wird übermittelt...';

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => { data[key] = value; });

        // ⚠️ WICHTIG: Die URL Ihrer Google Web App API
        const API_URL = 'https://script.google.com/macros/s/AKfycbwEUpDI3tKNW4woqAOCxWQKJE0FSW9gsoDzuN9giiKJtUpUJQb5iRYX7603xm7UzjZa/exec';

        try {
            // Die Apps-Script-Antwort ist cross-origin nicht lesbar. Der Request
            // wird daher nur als abgesendet, nicht als serverseitig bestätigt behandelt.
            await fetch(API_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(data).toString()
            });

            // Keine Erfolgszusage: no-cors verrät nicht, ob das Apps Script
            // gespeichert und die Bestätigungs-E-Mail versendet hat.
            form.style.display = 'none';
            const progressContainer = document.querySelector('.progress-bar-container');
            if (progressContainer) progressContainer.style.display = 'none';

            const formHeaderP = document.querySelector('.form-header p');
            if (formHeaderP) formHeaderP.textContent = 'Übermittlung gestartet';

            const statusText = successScreen.querySelector('p');
            if (statusText) {
                statusText.textContent = `Die Anfrage wurde abgesendet. Die Website kann die technische Annahme durch das Formularsystem nicht bestätigen. Bitte prüfen Sie, ob eine Bestätigung an ${data.email || 'Ihre E-Mail-Adresse'} eingeht. Falls nicht, kontaktieren Sie uns unter info.zielev@gmail.com.`;
            }
            successScreen.style.display = 'block';

        } catch (error) {
            console.error('Submission Error:', error);
            alert('Es ist ein Netzwerkfehler aufgetreten. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.');
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Kostenpflichtig anmelden';
        }
    });

    // --- Helper Functions ---

    function validateIBAN(iban) {
        iban = iban.replace(/\s/g, '').toUpperCase();
        const DE_REGEX = /^DE\d{20}$/;
        if (!DE_REGEX.test(iban)) return false;

        // Simple modulo 97 check could be added here for full security,
        // but regex DE + 20 digits is a good start for UI feedback.
        return true;
    }
});
// ============================================================
// Swibble - Service Tabs Logic
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
    const swibbleBtns = document.querySelectorAll('.swibble__btn');
    const swibblePanels = document.querySelectorAll('.swibble__panel');

    if (swibbleBtns.length > 0) {
        swibbleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.target;

                // Remove active class from all buttons and panels
                swibbleBtns.forEach(b => b.classList.remove('active'));
                swibblePanels.forEach(p => p.classList.remove('active'));

                // Add active class to current selection
                btn.classList.add('active');
                const panel = document.getElementById(target);
                if (panel) {
                    panel.classList.add('active');
                }
            });
        });

        // Handle hash navigation (e.g. from dropdown)
        const hash = window.location.hash.substring(1);
        if (hash) {
            const btn = document.querySelector(`.swibble__btn[data-hash="${hash}"]`);
            if (btn) {
                btn.click();
                // Smooth scroll to the swibble section
                const swibbleSection = document.querySelector('.swibble');
                if (swibbleSection) {
                    swibbleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
    }
});

// ============================================================
// FAQ Accordion Logic
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!question || !answer) return;

        if (!answer.id) answer.id = `faq-answer-${index + 1}`;
        question.setAttribute('aria-controls', answer.id);
        const initiallyExpanded = item.classList.contains('active');
        question.setAttribute('aria-expanded', String(initiallyExpanded));
        answer.setAttribute('aria-hidden', String(!initiallyExpanded));
        answer.inert = !initiallyExpanded;

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Toggle current item
            item.classList.toggle('active');
            const isExpanded = !isActive;
            question.setAttribute('aria-expanded', String(isExpanded));
            answer.setAttribute('aria-hidden', String(!isExpanded));
            answer.inert = !isExpanded;
        });
    });
});


