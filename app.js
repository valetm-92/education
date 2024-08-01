document.getElementById('searchBtn').addEventListener('click', async function() {
    const category = document.getElementById('category').value;
    if (!category) {
        alert('Per favore, inserisci una categoria.');
        return;
    }

    // Effettua la richiesta all'API di Open Library
    const response = await fetch(`https://openlibrary.org/subjects/${category}.json`);
    const data = await response.json();

    // Pulisce i risultati precedenti
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    // Mostra i libri
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
    // Effettua la richiesta all'API per ottenere la descrizione del libro
    const response = await fetch(`https://openlibrary.org${bookKey}.json`);
    const data = await response.json();

    // Mostra la descrizione del libro
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
}
