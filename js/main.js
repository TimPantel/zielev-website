// ============================================================
// Ziel e.V. - Main JavaScript
// ============================================================

// Mobile Navigation Toggle
function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', function (event) {
    const menu = document.getElementById('nav-menu');
    const toggle = document.querySelector('.nav__toggle');

    if (menu && toggle && !menu.contains(event.target) && !toggle.contains(event.target)) {
        menu.classList.remove('active');
    }
});

// Newsletter Form Handler
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('newsletter-form');
    const message = document.getElementById('newsletter-message');
    const submitBtn = document.getElementById('newsletter-submit');

    // ⚠️ WICHTIG: Diese URL nach der Web-App-Bereitstellung ersetzen!
    const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbwSHY67vtumGTsHBqAAEtvrmQ4wwKehddD9MltG46R-ZkCl2Imjwy0uDPZF0EUIIiNyzw/exec';

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Button deaktivieren
            submitBtn.disabled = true;
            submitBtn.textContent = '⏳ Wird gesendet...';

            const vorname = document.getElementById('newsletter-vorname').value;
            const email = document.getElementById('newsletter-email').value;

            try {
                // URL prüfen
                if (WEBAPP_URL === 'IHRE_WEBAPP_URL_HIER_EINFUEGEN') {
                    showMessage('error', '⚠️ Das System wird gerade eingerichtet. Bitte versuchen Sie es später erneut.');
                    return;
                }

                // Daten senden
                await fetch(WEBAPP_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `vorname=${encodeURIComponent(vorname)}&email=${encodeURIComponent(email)}`
                });

                // Bei no-cors können wir die Antwort nicht lesen, also zeigen wir Erfolg an
                showMessage('success', '✅ Vielen Dank! Sie wurden erfolgreich in unseren E-Mailverteiler eingetragen. Wir werden Sie unter der angegebenen E-Mail-Adresse benachrichtigen, sobald das Anmeldeformular für das Schuljahr 2026 freigeschaltet ist und Sie Ihr Kind anmelden können.');
                form.reset();

            } catch (error) {
                console.error('Newsletter-Fehler:', error);
                showMessage('error', '❌ Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = '✉️ Jetzt eintragen';
            }
        });
    }

    function showMessage(type, text) {
        if (!message) return;

        message.style.display = 'block';
        message.textContent = text;

        if (type === 'success') {
            message.style.background = 'rgba(76, 175, 80, 0.3)';
            message.style.border = '1px solid rgba(76, 175, 80, 0.5)';
        } else if (type === 'duplicate') {
            message.style.background = 'rgba(255, 193, 7, 0.3)';
            message.style.border = '1px solid rgba(255, 193, 7, 0.5)';
        } else {
            message.style.background = 'rgba(244, 67, 54, 0.3)';
            message.style.border = '1px solid rgba(244, 67, 54, 0.5)';
        }

        // Nach 10 Sekunden ausblenden
        setTimeout(() => {
            message.style.display = 'none';
        }, 10000);
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

    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const btnNext = document.getElementById('btn-next');
    const btnPrev = document.getElementById('btn-prev');
    const btnSubmit = document.getElementById('btn-submit');
    const successScreen = document.getElementById('form-success');
    const displayEmail = document.getElementById('display-email');
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

        // Final UI feedback
        btnSubmit.disabled = true;
        btnSubmit.textContent = '⏳ Wird übermittelt...';

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => { data[key] = value; });

        // ⚠️ WICHTIG: Die URL Ihrer Google Web App API
        const API_URL = 'https://script.google.com/macros/s/AKfycbwEUpDI3tKNW4woqAOCxWQKJE0FSW9gsoDzuN9giiKJtUpUJQb5iRYX7603xm7UzjZa/exec'; // Beispiel

        try {
            // Wir nutzen 'no-cors' für die Google Apps Script Schnittstelle
            await fetch(API_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(data).toString()
            });

            // Success UI
            form.style.display = 'none';
            document.querySelector('.progress-container').style.display = 'none';
            document.querySelector('.form-header p').textContent = 'Anmeldung abgeschlossen';
            displayEmail.textContent = data.email;
            successScreen.style.display = 'block';

        } catch (error) {
            console.error('Submission Error:', error);
            alert('Es ist ein Fehler aufgetreten. Bitte prüfen Sie Ihre Internetverbindung oder kontaktieren Sie uns per E-Mail.');
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
