const url = "https://openlibrary.org/search.json?q=";
const searchBox = document.getElementById('searchBox');
const button = document.getElementById('searchButton');
const results = document.getElementById('results');

button.addEventListener('click', function(e){
    e.preventDefault();
    const book = searchBox.value.trim();
    results.innerHTML = '';

    if (!book){
        results.innerHTML = '<p class="text center">Por favor, digite um título de livro para buscar.</p>';
        return;
    }

    const endpoint = `${url}${book}`;
    
    results.innerHTML = '<p class="text center">Carregando...</p>';
    
    fetch(endpoint)
        .then(response => {
            if(!response.ok){
                throw new Error(`Erro na busca: Status: ${response.status}`);
            }

            return response.json();
        })
        .then(data => {
            if (data.docs && data.docs.length > 0){
                const bookResults = data.docs.slice(0, 8).map(doc => {
                    const cover = doc.cover_edition_key ? `<img src="https://covers.openlibrary.org/b/olid/${doc.cover_edition_key}-M.jpg" alt="Capa do livro ${doc.title}">` : `<img src="assets/images/nocover.jpg" alt="Capa indisponível">`;

                    const workId = doc.cover_edition_key ? `works/${doc.cover_edition_key}` : doc.key;

                    return `<div class="results__item">
                        <a href="https://openlibrary.org/${workId}" target="_blank">${cover}
                        <span class="material-symbols-outlined openSymbol">open_in_new</span>
                        <p class="title">${doc.title || 'Título Desconhecido'}</p></a>
                        <p class="text">Autor(a): ${doc.author_name ? doc.author_name.join(', ') : 'Desconhecido'}</p>
                        <p class="text">Publicado em: ${doc.first_publish_year || 'Ano Desconhecido'}</p>
                    </div>`;
                }).join('');

                results.innerHTML = bookResults;
                
            } else {
                results.innerHTML = `<p class="text center"> Nenhum livro encontrado para "${book}". Tente outra pesquisa.`
            }
        }).catch(error => {
            console.error('Ocorreu um problema interno:', error);
            results.innerHTML = `<p class="text center">Houve um problema ao buscar os dados.</p>`;
        });
});
