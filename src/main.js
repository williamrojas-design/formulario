import "./style.css";

let countries = [
  { countryName: "Argentina", countryCode: "ar" },
  { countryName: "Colombia", countryCode: "co" },
  { countryName: "Spain", countryCode: "es" },
  { countryName: "United States", countryCode: "us" },
];

document.addEventListener("DOMContentLoaded", () => {
  // Obtener referencias a los elementos del DOM
  const passwordInput = document.getElementById("password");
  const rePasswordInput = document.getElementById("re-password");
  const emailInput = document.getElementById("email-address");
  const fullNameInput = document.getElementById("full-name");
  const selectCountry = document.getElementById("select-country");
  const rulesCheckbox = document.getElementById("agree-rules");
  const submitButton = document.getElementById("create-btn");
  const form = document.getElementById("registration-form");

  // Elementos del listado que actúa como selector
  const countryDisplay = document.getElementById("country-selected-display");
  const countryListContainer = document.getElementById(
    "country-list-container"
  );
  const countryOptionsList = document.getElementById("country-options-list");

  // Ocultar el select nativo para usar la versión personalizada
  selectCountry.style.display = "none";

  // Deshabilitar el botón 'Create Account' de entrada
  submitButton.disabled = true;

  // Funciones de Validación

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function applyValidationStyle(input, isValid) {
    if (isValid && input.value.trim() !== "") {
      input.classList.add("is-valid");
      input.classList.remove("is-invalid");
    } else if (!isValid && input.value.trim() !== "") {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
    } else {
      input.classList.remove("is-valid", "is-invalid");
    }
  }

  //Verifica todas las condiciones para habilitar/deshabilitar el botón.

  function updateSubmitButton() {
    const arePasswordsSame =
      passwordInput.value === rePasswordInput.value &&
      passwordInput.value.length > 0;
    const isEmailValid = isValidEmail(emailInput.value);
    const rulesAccepted = rulesCheckbox.checked;
    const countrySelected = selectCountry.value !== "";

    const canSubmit =
      arePasswordsSame && isEmailValid && rulesAccepted && countrySelected;
    submitButton.disabled = !canSubmit;

    if (passwordInput.value.length > 0 && rePasswordInput.value.length > 0) {
      if (arePasswordsSame) {
        applyValidationStyle(passwordInput, true);
        applyValidationStyle(rePasswordInput, true);
      } else {
        applyValidationStyle(passwordInput, false);
        applyValidationStyle(rePasswordInput, false);
      }
    }
  }

  // Función para construir el listado para la selección de país
  function createCustomCountryList() {
    countries.forEach((country) => {
      const li = document.createElement("li");
      li.classList.add("country-option");
      li.dataset.name = country.countryName;

      // Construir la URL del SVG y el HTML
      const flagSvgUrl = `./${country.countryCode}.svg`;
      const flagHtml = `<img src="${flagSvgUrl}" alt="Bandera de ${country.countryName}" class="flag-icon">`;

      li.innerHTML = `${flagHtml} ${country.countryName}`;

      // Incluye el manejador de selección de la lista
      li.addEventListener("click", handleCountrySelection);

      countryOptionsList.appendChild(li);
    });
  }

  // Función para manejar la selección del país
  function handleCountrySelection(event) {
    const li = event.currentTarget;
    const name = li.dataset.name;
    const content = li.innerHTML; // Contenido con <img> y nombre

    // Creo el option en el select con el valor seleccionado de la lista
    selectCountry.innerHTML = `<option value="${name}">${name}</option>`;
    selectCountry.value = name;

    // Actualizar el elemento de visualización
    countryDisplay.innerHTML = content;
    countryDisplay.classList.add("selected");

    // Ocultar la lista
    countryListContainer.classList.add("hidden");

    // Ejecutar la validación del formulario
    updateSubmitButton();
  }

  // Ocultar la visibilidad de la lista al hacer clic en el display
  countryDisplay.addEventListener("click", () => {
    countryListContainer.classList.toggle("hidden");
  });

  // Cerrar la lista si se hace clic fuera
  document.addEventListener("click", (event) => {
    // Comprueba si el clic NO está dentro del display O NO está dentro de la lista
    if (
      !countryDisplay.contains(event.target) &&
      !countryListContainer.contains(event.target)
    ) {
      countryListContainer.classList.add("hidden");
    }
  });

  // Inilializar la lista
  createCustomCountryList();

  // Escucha a cambios en todos los campos que afectan la habilitación del botón
  form.addEventListener("input", updateSubmitButton);
  // Escucha el checkbox también
  rulesCheckbox.addEventListener("change", updateSubmitButton);

  // Verificación de Full Name al salir, aplica estilo dinámico
  fullNameInput.addEventListener("blur", () => {
    const isValid = fullNameInput.value.trim().length > 0;
    applyValidationStyle(fullNameInput, isValid);
  });

  // Verificación de Email al salir, aplica estilo dinámico
  emailInput.addEventListener("blur", () => {
    const isValid = isValidEmail(emailInput.value);
    applyValidationStyle(emailInput, isValid);
    updateSubmitButton();
  });
});
