document.getElementById('searchBtn').addEventListener('click', async function() {
    const category = document.getElementById('category').value;
    if (!category) {
        alert('Per favore, inserisci una categoria.');
        return;
    }

    // richiesta all'API di Open Library
    const response = await fetch(`https://openlibrary.org/subjects/${category}.json`);
    const data = await response.json();

    // Pulisce i risultati precedenti
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    // libri
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
});

async function showDescription(bookKey) {
    // richiesta all'API per ottenere la descrizione del libro
    const response = await fetch(`https://openlibrary.org${bookKey}.json`);
    const data = await response.json();

    // descrizione del libro
    const descriptionDiv = document.getElementById('description');

    // Controllo se la descrizione è disponibile e se è un oggetto o una stringa
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

    // popup
    document.getElementById('popup').classList.add('active');
    document.getElementById('popupOverlay').classList.add('active');
}

// chiusura del popup
document.getElementById('popupClose').addEventListener('click', () => {
    document.getElementById('popup').classList.remove('active');
    document.getElementById('popupOverlay').classList.remove('active');
});

document.getElementById('popupOverlay').addEventListener('click', () => {
    document.getElementById('popup').classList.remove('active');
    document.getElementById('popupOverlay').classList.remove('active');
});
