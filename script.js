const booksData = [
    {
        id: 1,
        title: "Dom Casmurro",
        author: "Machado de Assis",
        category: "ficção",
        cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
        description: "Um dos maiores clássicos da literatura brasileira, Dom Casmurro narra a história de Bentinho e sua obsessão por Capitu.",
        year: 1899
    },
    {
        id: 2,
        title: "1984",
        author: "George Orwell",
        category: "ficção",
        cover: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=400&fit=crop",
        description: "Uma distopia sobre um futuro totalitário onde o governo controla todos os aspectos da vida humana.",
        year: 1949
    },
    {
        id: 3,
        title: "O Cortiço",
        author: "Aluísio Azevedo",
        category: "romance",
        cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
        description: "Romance naturalista que retrata a vida em um cortiço no Rio de Janeiro do século XIX.",
        year: 1890
    },
    {
        id: 4,
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "tecnologia",
        cover: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=300&h=400&fit=crop",
        description: "Um guia essencial para escrever código limpo e maintível, fundamental para desenvolvedores.",
        year: 2008
    },
    {
        id: 5,
        title: "Sapiens",
        author: "Yuval Noah Harari",
        category: "história",
        cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJvb2t8ZW58MHx8MHx8fDA%3D",
        description: "Uma breve história da humanidade, desde os primórdios até os dias atuais.",
        year: 2011
    },
    {
        id: 6,
        title: "O Alquimista",
        author: "Paulo Coelho",
        category: "ficção",
        cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
        description: "A jornada de um jovem pastor em busca de seu tesouro pessoal.",
        year: 1988
    },
    {
        id: 7,
        title: "Orgulho e Preconceito",
        author: "Jane Austen",
        category: "romance",
        cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
        description: "Romance clássico sobre Elizabeth Bennet e Mr. Darcy na Inglaterra do século XIX.",
        year: 1813
    },
    {
        id: 8,
        title: "JavaScript: The Good Parts",
        author: "Douglas Crockford",
        category: "tecnologia",
        cover: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=400&fit=crop",
        description: "Guia definitivo para as melhores práticas em JavaScript.",
        year: 2008
    },
    {
        id: 9,
        title: "Uma Breve História do Tempo",
        author: "Stephen Hawking",
        category: "história",
        cover: "https://images.unsplash.com/photo-1577627444534-b38e16c9d796?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njh8fGJvb2t8ZW58MHx8MHx8fDA%3D",
        description: "Exploração fascinante dos mistérios do universo e do tempo.",
        year: 1988
    },
    {
        id: 10,
        title: "A Moreninha",
        author: "Joaquim Manuel de Macedo",
        category: "romance",
        cover: "https://plus.unsplash.com/premium_photo-1681126228712-83bd4101603a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODF8fGJvb2t8ZW58MHx8MHx8fDA%3D",
        description: "Romance brasileiro que narra a história de amor entre Augusto e Carolina.",
        year: 1844
    }
];

let filteredBooks = [...booksData];
let currentCategory = 'all';
let savedBooks = JSON.parse(localStorage.getItem('savedBooks')) || [];
let currentBookId = null;

const booksGrid = document.getElementById('books-grid');
const savedBooksGrid = document.getElementById('saved-books-grid');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');
const noResults = document.getElementById('no-results');
const noSavedBooks = document.getElementById('no-saved-books');
const bookModal = document.getElementById('book-modal');
const readingModal = document.getElementById('reading-modal');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const exploreBtn = document.getElementById('explore-btn');
const notificationContainer = document.getElementById('notification-container');

document.addEventListener('DOMContentLoaded', function () {
    displayBooks(booksData);
    displaySavedBooks();
    updateSavedCount();
    setupEventListeners();
});

function setupEventListeners() {
    searchInput.addEventListener('input', handleSearch);

    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    exploreBtn.addEventListener('click', () => {
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('close-reading-modal').addEventListener('click', closeReadingModal);

    bookModal.addEventListener('click', (e) => {
        if (e.target === bookModal) closeModal();
    });

    readingModal.addEventListener('click', (e) => {
        if (e.target === readingModal) closeReadingModal();
    });

    document.getElementById('read-now-btn').addEventListener('click', openReadingModal);
    document.getElementById('save-book-btn').addEventListener('click', toggleSaveBook);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeReadingModal();
        }
    });
}

function displayBooks(books) {
    if (books.length === 0) {
        booksGrid.classList.add('hidden');
        noResults.classList.remove('hidden');
        return;
    }

    booksGrid.classList.remove('hidden');
    noResults.classList.add('hidden');

    booksGrid.innerHTML = books.map(book => {
        const isSaved = savedBooks.includes(book.id);
        return `
            <div class="book-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer fade-in-up relative" onclick="openBookModal(${book.id})">
                ${isSaved ? '<div class="saved-indicator"><i class="fas fa-bookmark mr-1"></i>Salvo</div>' : ''}
                <div class="relative">
                    <img src="${book.cover}" alt="${book.title}" class="w-full h-64 object-cover">
                    <div class="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                        ${book.category}
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-lg mb-2 text-gray-800 line-clamp-2">${book.title}</h3>
                    <p class="text-blue-600 mb-2">${book.author}</p>
                    <p class="text-gray-600 text-sm mb-3 line-clamp-3">${book.description}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-500 text-sm">${book.year}</span>
                        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            Ver Detalhes
                        </button>
                    </div>
                </div>
              </div>
        `;
    }).join('');
}

function displaySavedBooks() {
    const savedBooksData = booksData.filter(book => savedBooks.includes(book.id));

    if (savedBooksData.length === 0) {
        savedBooksGrid.classList.add('hidden');
        noSavedBooks.classList.remove('hidden');
        return;
    }

    savedBooksGrid.classList.remove('hidden');
    noSavedBooks.classList.add('hidden');

    savedBooksGrid.innerHTML = savedBooksData.map(book => `
        <div class="book-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer fade-in-up relative" onclick="openBookModal(${book.id})">
            <div class="saved-indicator"><i class="fas fa-bookmark mr-1"></i>Salvo</div>
            <div class="relative">
                <img src="${book.cover}" alt="${book.title}" class="w-full h-64 object-cover">
                <div class="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                    ${book.category}
                </div>
            </div>
            <div class="p-4">
                <h3 class="font-bold text-lg mb-2 text-gray-800 line-clamp-2">${book.title}</h3>
                <p class="text-blue-600 mb-2">${book.author}</p>
                <p class="text-gray-600 text-sm mb-3 line-clamp-3">${book.description}</p>
                <div class="flex justify-between items-center">
                    <span class="text-gray-500 text-sm">${book.year}</span>
                    <div class="flex gap-2">
                        <button onclick="event.stopPropagation(); removeFromSaved(${book.id})" class="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors">
                            <i class="fas fa-trash mr-1"></i>Remover
                        </button>
                        <button class="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors">
                            Ver Detalhes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();

    filteredBooks = booksData.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.category.toLowerCase().includes(searchTerm);

        const matchesCategory = currentCategory === 'all' || book.category === currentCategory;

        return matchesSearch && matchesCategory;
    });

    displayBooks(filteredBooks);
}

function handleFilter(e) {
    const category = e.target.dataset.category;
    currentCategory = category;

    filterButtons.forEach(btn => {
        btn.classList.remove('bg-blue-100', 'text-blue-800');
        btn.classList.add('bg-gray-100', 'text-gray-800');
    });

    e.target.classList.remove('bg-gray-100', 'text-gray-800');
    e.target.classList.add('bg-blue-100', 'text-blue-800');

    const searchTerm = searchInput.value.toLowerCase();

    filteredBooks = booksData.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.category.toLowerCase().includes(searchTerm);

        const matchesCategory = category === 'all' || book.category === category;

        return matchesSearch && matchesCategory;
    });

    displayBooks(filteredBooks);
}

function toggleMobileMenu() {
    mobileMenu.classList.toggle('hidden');
}

function openBookModal(bookId) {
    const book = booksData.find(b => b.id === bookId);
    if (!book) return;

    currentBookId = bookId;
    const isSaved = savedBooks.includes(bookId);

    document.getElementById('modal-title').textContent = book.title;
    document.getElementById('modal-author').textContent = `Por ${book.author}`;
    document.getElementById('modal-category').textContent = `${book.category} • ${book.year}`;
    document.getElementById('modal-description').textContent = book.description;
    document.getElementById('modal-cover').src = book.cover;
    document.getElementById('modal-cover').alt = book.title;

    const saveBtn = document.getElementById('save-book-btn');
    const saveBtnText = document.getElementById('save-btn-text');

    if (isSaved) {
        saveBtn.classList.remove('bg-gray-200', 'text-gray-800', 'hover:bg-gray-300');
        saveBtn.classList.add('bg-green-500', 'text-white', 'hover:bg-green-600');
        saveBtnText.textContent = 'Salvo';
        saveBtn.querySelector('i').className = 'fas fa-check mr-2';
    } else {
        saveBtn.classList.remove('bg-green-500', 'text-white', 'hover:bg-green-600');
        saveBtn.classList.add('bg-gray-200', 'text-gray-800', 'hover:bg-gray-300');
        saveBtnText.textContent = 'Salvar';
        saveBtn.querySelector('i').className = 'fas fa-bookmark mr-2';
    }

    bookModal.classList.remove('hidden');
    bookModal.classList.add('flex');
    bookModal.querySelector('.bg-white').classList.add('modal-enter');

    document.body.style.overflow = 'hidden';
}

function closeModal() {
    bookModal.classList.add('hidden');
    bookModal.classList.remove('flex');
    currentBookId = null;

    document.body.style.overflow = 'auto';
}

function openReadingModal() {
    if (!currentBookId) return;

    const book = booksData.find(b => b.id === currentBookId);
    if (!book) return;

    document.getElementById('reading-title').textContent = book.title;

    readingModal.classList.remove('hidden');
    readingModal.classList.add('flex');
    readingModal.querySelector('.bg-white').classList.add('modal-enter');

    closeModal();
}

function closeReadingModal() {
    readingModal.classList.add('hidden');
    readingModal.classList.remove('flex');

    document.body.style.overflow = 'auto';
}

function toggleSaveBook() {
    if (!currentBookId) return;

    const book = booksData.find(b => b.id === currentBookId);
    if (!book) return;

    const isSaved = savedBooks.includes(currentBookId);

    if (isSaved) {
        savedBooks = savedBooks.filter(id => id !== currentBookId);
        showNotification(`"${book.title}" foi removido dos salvos`, 'info');
    } else {
        savedBooks.push(currentBookId);
        showNotification(`"${book.title}" foi salvo com sucesso!`, 'success');
    }

    localStorage.setItem('savedBooks', JSON.stringify(savedBooks));

    updateSavedCount();
    displayBooks(filteredBooks);
    displaySavedBooks();

    const saveBtn = document.getElementById('save-book-btn');
    const saveBtnText = document.getElementById('save-btn-text');

    if (!isSaved) {
        saveBtn.classList.remove('bg-gray-200', 'text-gray-800', 'hover:bg-gray-300');
        saveBtn.classList.add('bg-green-500', 'text-white', 'hover:bg-green-600');
        saveBtnText.textContent = 'Salvo';
        saveBtn.querySelector('i').className = 'fas fa-check mr-2';
    } else {
        saveBtn.classList.remove('bg-green-500', 'text-white', 'hover:bg-green-600');
        saveBtn.classList.add('bg-gray-200', 'text-gray-800', 'hover:bg-gray-300');
        saveBtnText.textContent = 'Salvar';
        saveBtn.querySelector('i').className = 'fas fa-bookmark mr-2';
    }
}

function removeFromSaved(bookId) {
    const book = booksData.find(b => b.id === bookId);
    if (!book) return;

    savedBooks = savedBooks.filter(id => id !== bookId);
    localStorage.setItem('savedBooks', JSON.stringify(savedBooks));

    updateSavedCount();
    displayBooks(filteredBooks);
    displaySavedBooks();

    showNotification(`"${book.title}" foi removido dos salvos`, 'info');
}

function updateSavedCount() {
    const count = savedBooks.length;
    document.getElementById('saved-count').textContent = count;
    document.getElementById('saved-count-mobile').textContent = count;
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification bg-white border-l-4 p-4 rounded-lg shadow-lg max-w-sm ${type === 'success' ? 'border-green-500' :
        type === 'error' ? 'border-red-500' :
            'border-blue-500'
        }`;

    const icon = type === 'success' ? 'fas fa-check-circle text-green-500' :
        type === 'error' ? 'fas fa-exclamation-circle text-red-500' :
            'fas fa-info-circle text-blue-500';

    notification.innerHTML = `
        <div class="flex items-center">
            <i class="${icon} mr-3"></i>
            <p class="text-gray-800 font-medium">${message}</p>
            <button onclick="removeNotification(this)" class="ml-auto text-gray-400 hover:text-gray-600">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    notificationContainer.appendChild(notification);

    setTimeout(() => {
        removeNotification(notification.querySelector('button'));
    }, 5000);
}

function removeNotification(button) {
    const notification = button.closest('.notification');
    notification.classList.add('removing');

    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

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

        mobileMenu.classList.add('hidden');
    });
});    