document.addEventListener('DOMContentLoaded', () => {
    const resultsContainer = document.getElementById('results-container');
    
    // Obtener los datos de la URL
    const urlParams = new URLSearchParams(window.location.search);

    const newEntry = {};
    for (const [key, value] of urlParams.entries()) {
        newEntry[key] = value;
    }

    const storedDataJSON = localStorage.getItem('registrations');
    let registrations = [];

    if (storedDataJSON) {
        try {
            registrations = JSON.parse(storedDataJSON);
            // Asegurar que es un Array
            if (!Array.isArray(registrations)) {
                registrations = [];
            }
        } catch (e) {
            console.error("Error al recuperar datos de localStorage.", e);
            registrations = []; 
        }
    }

const uniqueKey = 'email-address';
let alreadyExists = registrations.some(
    (entry) => entry[uniqueKey] === newEntry[uniqueKey]
);


if (!alreadyExists) {
    if (newEntry[uniqueKey]) { 
        registrations.push(newEntry);
        localStorage.setItem('registrations', JSON.stringify(registrations));
    }
}
    

    displayRegistrationsTable();
});

/**
    Recupera los registros de localStorage y genera la tabla HTML
 */
function displayRegistrationsTable() {
    const resultsContainer = document.getElementById('results-container');
    const storedDataJSON = localStorage.getItem('registrations');

    if (!storedDataJSON) {
        resultsContainer.innerHTML = '<p>Aún no se ha completado ningún registro. ¡Vuelve al formulario para crear una cuenta!</p>';
        return;
    }

    try {
        const registrations = JSON.parse(storedDataJSON);
        
        if (!Array.isArray(registrations) || registrations.length === 0) {
            resultsContainer.innerHTML = '<p>El archivo de registros está vacío.</p>';
            return;
        }

        
        const formKeys = new Set();
        registrations.forEach(data => {
            Object.keys(data).forEach(key => {
                // Excluir claves internas
                if (key !== 're-password') {
                    formKeys.add(key);
                }
            });
        });

        const rawHeaders = [...Array.from(formKeys)];
        
        const getDisplayValue = (key, data) => {
            const value = data[key];
            
            if (key === 'password') return value || ''; 
            
            if (key === 'agree-rules') return value === 'on' ? 'Yes' : 'No';
            
            return value || '';
        };


        let tableHTML = '<table class="registration-table"><thead><tr>';
        
        rawHeaders.forEach(header => {
            const displayHeader = header.replace(/-/g, ' ').toUpperCase();
            tableHTML += `<th>${displayHeader}</th>`; 
        });
        tableHTML += '</tr></thead><tbody>';

        registrations.slice().reverse().forEach((data) => {
            
            tableHTML += '<tr>';
            
            rawHeaders.forEach(headerKey => {
                let cellContent = '';

                
                cellContent = getDisplayValue(headerKey, data);

                tableHTML += `<td>${cellContent}</td>`;
            });

            tableHTML += '</tr>';
        });

        tableHTML += '</tbody></table>';
        
        resultsContainer.innerHTML = tableHTML;

    } catch (e) {
        resultsContainer.innerHTML = '<p style="color: red;">Error al procesar los datos guardados.</p>';
        console.error("Error al mostrar registros:", e);
    }
}