import axios from 'axios';
import { isEmpty } from 'lodash';

// Funzione per avviare la ricerca
async function performSearch() {
    const category = document.getElementById('category').value.trim().toLowerCase();
    
    if (isEmpty(category)) {
        alert('Per favore, inserisci una categoria.');
        return;
    }

    if (category !== 'fantasy') {
        alert('Errore: Puoi cercare solo la categoria "fantasy".');
        return;
    }

    try {
        // Richiesta all'API di Open Library
        const response = await axios.get(`https://openlibrary.org/subjects/${category}.json`);
        const data = response.data;

        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        // Mostra i libri della categoria "fantasy"
        data.works.forEach(work => {
            const bookDiv = document.createElement('div');
            bookDiv.className = 'book';
            bookDiv.innerHTML = `
                <strong>${work.title}</strong><br>
                Autori: ${work.authors.map(author => author.name).join(', ')}
            `;
            bookDiv.addEventListener('click', () => showDescription(work.key));
            resultsDiv.appendChild(bookDiv);
        });
    } catch (error) {
        console.error('Errore nella richiesta:', error);
        alert('Si è verificato un errore. Per favore, riprova.');
    }
}

// Aggiungi un event listener alla casella di input del campo "categoria"
document.getElementById('category').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();  // Previene il comportamento predefinito, come l'invio di un form
        performSearch();  // Esegue la funzione di ricerca
    }
});

document.getElementById('searchBtn').addEventListener('click', performSearch);

// Funzione per mostrare la descrizione del libro
async function showDescription(bookKey) {
    try {
        // Richiesta all'API per ottenere la descrizione del libro
        const response = await axios.get(`https://openlibrary.org${bookKey}.json`);
        const data = response.data;

        const descriptionDiv = document.getElementById('description');

        // Controlla se la descrizione è disponibile e se è un oggetto o una stringa
        let descriptionText = 'Descrizione non disponibile.';
        if (data.description) {
            if (typeof data.description === 'string') {
                descriptionText = data.description;
            } else if (data.description.value) {
                descriptionText = data.description.value;
            }
        }

        descriptionDiv.innerHTML = `
            <h3>Descrizione</h3>
            <p>${descriptionText}</p>
        `;

        // Mostra il popup
        document.getElementById('popup').classList.add('active');
        document.getElementById('popupOverlay').classList.add('active');
    } catch (error) {
        console.error('Errore nella richiesta della descrizione:', error);
        alert('Si è verificato un errore nella richiesta della descrizione.');
    }
}

// Chiusura del popup
document.getElementById('popupClose').addEventListener('click', () => {
    document.getElementById('popup').classList.remove('active');
    document.getElementById('popupOverlay').classList.remove('active');
});

document.getElementById('popupOverlay').addEventListener('click', () => {
    document.getElementById('popup').classList.remove('active');
    document.getElementById('popupOverlay').classList.remove('active');
});
