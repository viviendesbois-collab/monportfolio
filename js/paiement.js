/* ==========================================================================
   MonPortfolio — Logique de la page paiement (JavaScript vanilla)
   Maquette de démonstration : aucun paiement réel n'est traité.
   ========================================================================== */

const form = document.getElementById("payment-form");
const cardInput = document.getElementById("card");
const expiryInput = document.getElementById("expiry");
const cvcInput = document.getElementById("cvc");

// --- Formatage en temps réel ---

// Numéro de carte : garde les chiffres, regroupe par blocs de 4 ("1234 5678 ...")
cardInput.addEventListener("input", () => {
  const digits = cardInput.value.replace(/\D/g, "").slice(0, 16);
  cardInput.value = digits.replace(/(.{4})/g, "$1 ").trim();
});

// Expiration : insère automatiquement " / " après le mois ("MM / AA")
expiryInput.addEventListener("input", () => {
  const digits = expiryInput.value.replace(/\D/g, "").slice(0, 4);
  expiryInput.value = digits.length > 2
    ? digits.slice(0, 2) + " / " + digits.slice(2)
    : digits;
});

// CVC : chiffres uniquement
cvcInput.addEventListener("input", () => {
  cvcInput.value = cvcInput.value.replace(/\D/g, "").slice(0, 4);
});

// --- Validation ---

// Conserve le message d'origine de chaque erreur (lu une seule fois depuis le HTML)
const errorMessages = new WeakMap();

function showError(id, hasError) {
  const input = document.getElementById(id);
  const error = document.querySelector('.field__error[data-for="' + id + '"]');

  if (!errorMessages.has(error)) {
    errorMessages.set(error, error.textContent);
    error.textContent = "";
  }

  input.classList.toggle("field__input--invalid", hasError);
  input.setAttribute("aria-invalid", String(hasError));
  error.classList.toggle("field__error--visible", hasError);
  // Réécrit le texte à chaque apparition (et le vide à la disparition) : un simple changement
  // de classe CSS n'est pas garanti de déclencher l'annonce d'un role="alert" par tous les lecteurs d'écran.
  error.textContent = hasError ? errorMessages.get(error) : "";
}

function expiryIsValid(value) {
  const match = value.replace(/\s/g, "").match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  const year = 2000 + parseInt(match[2], 10);
  if (month < 1 || month > 12) return false;
  // Dernier jour du mois d'expiration
  const expiry = new Date(year, month, 0, 23, 59, 59);
  return expiry >= new Date();
}

function validate() {
  const name = document.getElementById("name").value.trim();
  const cardDigits = cardInput.value.replace(/\D/g, "");
  const cvc = cvcInput.value;

  const errors = {
    name: name.length < 2,
    card: cardDigits.length !== 16,
    expiry: !expiryIsValid(expiryInput.value),
    cvc: cvc.length < 3 || cvc.length > 4,
  };

  Object.keys(errors).forEach((id) => showError(id, errors[id]));
  return !Object.values(errors).some(Boolean);
}

// Efface l'erreur d'un champ dès que l'utilisateur le corrige
["name", "card", "expiry", "cvc"].forEach((id) => {
  document.getElementById(id).addEventListener("input", () => showError(id, false));
});

// --- Soumission ---

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validate()) return;

  // Simulation : bascule vers l'écran de confirmation
  document.getElementById("form-view").classList.add("is-hidden");
  document.getElementById("confirmation-view").classList.remove("is-hidden");
});
