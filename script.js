const countriesContainer = document.getElementById('countriesContainer');
const searchInput = document.getElementById('searchInput');
const countryDetail = document.getElementById('countryDetail');
const clearButton = document.getElementById('clearSearch');

// Кэш для загруженных изображений
const imageCache = {};

// Рендер карточек стран
function renderCountries(countries) {
    // Удаляем скелетоны
    countriesContainer.innerHTML = '';
    
    countriesContainer.innerHTML = countries.map(country => `
        <div class="country-card" data-name="${country.name}">
            <div class="flag-wrapper">
                <img 
                    src="images/${country.flagRes}.webp" 
                    alt="Флаг ${country.name}" 
                    class="flag-image"
                    loading="lazy"
                    onerror="this.classList.add('error')"
                >
            </div>
            <h2 class="country-name">${country.name}</h2>
            <p class="country-capital">${country.capital}</p>
        </div>
    `).join('');

    // Добавляем обработчики клика
    document.querySelectorAll('.country-card').forEach(card => {
        card.addEventListener('click', () => showCountryDetail(card.dataset.name));
    });
}

// Форматирование описания
function formatDescription(desc) {
    // Разделяем на абзацы по двойным переносам строк
    const paragraphs = desc.split('\n\n');
    
    return paragraphs.map(para => {
        // Заменяем одиночные переносы на <br>
        const withBreaks = para.replace(/\n/g, '<br>');
        
        // Оборачиваем в <p> только если это не пустой абзац
        return para.trim() ? `<p>${withBreaks}</p>` : '';
    }).join('');
}

// Показать детали страны
function showCountryDetail(countryName) {
    const country = countries.find(c => c.name === countryName);
    if (!country) return;

    // Плавное скрытие списка стран
    countriesContainer.style.opacity = '0';
    countriesContainer.style.transform = 'translateY(20px)';
    
    
    setTimeout(() => {
        countriesContainer.style.display = 'none';

         // * НОВОЕ: Сбрасываем стили и классы для countryDetail перед показом
        countryDetail.classList.remove('active'); // Убедитесь, что класс удален
        countryDetail.style.opacity = '0'; // Убедитесь, что он полностью невидимый
        countryDetail.style.transform = 'translateY(20px)'; // Сброс трансформации
        
        // Форматируем описание
        const formattedDescription = formatDescription(country.description);
        
        // Создаем HTML для детальной страницы
        countryDetail.innerHTML = `
            <div class="detail-header">
                <div class="detail-title">
                    <h2>${country.name}</h2>
                    <p>${country.capital}</p>
                </div>
            </div>
            
            <div class="detail-grid">
                <!-- Основная информация -->
                <div class="info-card">
                    <h3 class="info-title"><i class="fas fa-info-circle"></i> Основная информация</h3>
                    <div class="info-item">
                        <span class="info-label"><i class="fas fa-users"></i> Население</span>
                        <span class="info-value">${country.population}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label"><i class="fas fa-language"></i> Язык</span>
                        <span class="info-value">${country.language}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label"><i class="fas fa-money-bill-wave"></i> Валюта</span>
                        <span class="info-value">${country.currency}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label"><i class="fas fa-globe-asia"></i> Площадь</span>
                        <span class="info-value">${country.area}</span>
                    </div>
                </div>
                
                <!-- Символика страны -->
                <div class="info-card symbols-card">
                    <h3 class="info-title"><i class="fas fa-flag"></i> Государственная символика</h3>
                    
                    <div class="symbols-grid">
                        <div class="symbol-item">
                            <img 
                                src="images/${country.flagRes}.webp" 
                                alt="Флаг ${country.name}" 
                                class="symbol-image"
                                loading="lazy"
                                onerror="this.classList.add('error')"
                            >
                            <p class="symbol-label">Флаг</p>
                        </div>
                        
                        <div class="symbol-item">
                            <img 
                                src="images/${country.coatOfArmsRes}.webp" 
                                alt="Герб ${country.name}" 
                                class="symbol-image"
                                loading="lazy"
                                onerror="this.classList.add('error')"
                            >
                            <p class="symbol-label">Герб</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Описание страны -->
            <div class="info-card description-card">
                <h3 class="info-title"><i class="fas fa-book-open"></i> О стране</h3>
                <div class="description-text">
                    ${formattedDescription}
                </div>
            </div>
            
            <div class="detail-footer">
                <button class="back-button" onclick="hideDetail()">
                    <i class="fas fa-arrow-left"></i> Назад к списку
                </button>
            </div>
        `;
        
                // Плавное отображение деталей
        // Добавляем класс 'active' после того, как контент установлен
        // и сброшены предыдущие стили
        setTimeout(() => { // Небольшая задержка, чтобы браузер успел применить сброс стилей
            countryDetail.classList.add('active');
            countryDetail.style.opacity = '1';
            countryDetail.style.transform = 'translateY(1)';
        }, 50); // Или 0, если transition на active-классе уже есть
        
        // Прокрутка наверх
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
}

// Скрыть детали
function hideDetail() {
    // Плавное скрытие деталей
    countryDetail.style.opacity = '0';
    countryDetail.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        countryDetail.classList.remove('active');
        
        // Показываем список стран
        countriesContainer.style.display = 'grid';
        
        // Плавное отображение списка
        setTimeout(() => {
            countriesContainer.style.opacity = '1';
            countriesContainer.style.transform = 'translateY(0)';
        }, 50);
    }, 300);
}

// Поиск
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    // Показать/скрыть кнопку очистки
    if (searchTerm) {
        clearButton.classList.add('visible');
    } else {
        clearButton.classList.remove('visible');
    }
    
    // Фильтрация стран
    const filtered = countries.filter(country => 
        country.name.toLowerCase().includes(searchTerm) ||
        country.capital.toLowerCase().includes(searchTerm)
    );
    
    renderCountries(filtered);
});

// Очистка поиска
clearButton.addEventListener('click', () => {
    searchInput.value = '';
    clearButton.classList.remove('visible');
    renderCountries(countries);
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Имитация загрузки данных
    setTimeout(() => {
        renderCountries(countries);
    }, 800);
});

// Глобальные функции для использования в HTML
window.hideDetail = hideDetail;