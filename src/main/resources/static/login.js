// Redirect to dashboard if already logged in
if (sessionStorage.getItem('user')) {
  window.location.href = 'index.html';
}

// Toggle password visibility
const togglePass = document.getElementById('togglePass');
const passwordInput = document.getElementById('password');
const eyeIcon = document.getElementById('eyeIcon');

togglePass.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  eyeIcon.innerHTML = isPassword
    ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>`
    : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
});

// Login form submission
const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('error-msg');
const loginBtn = document.getElementById('loginBtn');
const btnText = document.getElementById('btnText');
const btnSpinner = document.getElementById('btnSpinner');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !password) {
    showError('Bütün sahələri doldurun.');
    return;
  }

  setLoading(true);
  hideError();

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      sessionStorage.setItem('user', JSON.stringify(data));
      window.location.href = 'index.html';
    } else {
      showError(data.message || 'Giriş uğursuz oldu.');
      document.getElementById('password').classList.add('input-error');
    }
  } catch (err) {
    showError('Serverə qoşulmaq mümkün olmadı. Zəhmət olmasa yenidən cəhd edin.');
  } finally {
    setLoading(false);
  }
});

// Clear error styling on input
['username', 'password'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    document.getElementById(id).classList.remove('input-error');
    hideError();
  });
});

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.style.display = 'block';
}

function hideError() {
  errorMsg.style.display = 'none';
}

function setLoading(isLoading) {
  loginBtn.disabled = isLoading;
  btnText.style.display = isLoading ? 'none' : 'inline';
  btnSpinner.style.display = isLoading ? 'inline-block' : 'none';
}
