-- Создание таблиц для Dark Haven Website

-- Пользователи
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    is_admin BOOLEAN DEFAULT FALSE,
    avatar TEXT,
    bio TEXT,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Новости
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Правила сервера
CREATE TABLE rules (
    id SERIAL PRIMARY KEY,
    number INTEGER UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Категории Wiki
CREATE TABLE wiki_categories (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    icon VARCHAR(100),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Страницы Wiki
CREATE TABLE wiki_pages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    category_id INTEGER REFERENCES wiki_categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(title, category_id)
);

-- Комнаты чата
CREATE TABLE chat_rooms (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Сообщения чата
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    chat_room_id VARCHAR(100) REFERENCES chat_rooms(id),
    username VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    avatar TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Элементы дорожной карты
CREATE TABLE roadmap_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status VARCHAR(50) DEFAULT 'planned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Музыкальные треки
CREATE TABLE music_tracks (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    url TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Настройки сайта
CREATE TABLE site_config (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(255) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Контент главной страницы (Hero)
CREATE TABLE hero_content (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500),
    subtitle VARCHAR(500),
    description TEXT,
    button1_text VARCHAR(100),
    button2_text VARCHAR(100),
    feature1_title VARCHAR(255),
    feature1_desc TEXT,
    feature2_title VARCHAR(255),
    feature2_desc TEXT,
    feature3_title VARCHAR(255),
    feature3_desc TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Кастомные вкладки (header/sidebar)
CREATE TABLE custom_tabs (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    location VARCHAR(20) CHECK (location IN ('header', 'sidebar')),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Элементы страниц (текст, кнопки, изображения, видео)
CREATE TABLE page_elements (
    id VARCHAR(100) PRIMARY KEY,
    section VARCHAR(255) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('text', 'button', 'image', 'video')),
    content TEXT,
    position_x FLOAT,
    position_y FLOAT,
    width FLOAT,
    height FLOAT,
    styles JSONB,
    link TEXT,
    video_url TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Фоны страниц
CREATE TABLE page_backgrounds (
    id SERIAL PRIMARY KEY,
    section VARCHAR(255) UNIQUE NOT NULL,
    background_type VARCHAR(50) CHECK (background_type IN ('static', 'animated', 'video', 'parallax')),
    url TEXT,
    parallax_speed FLOAT DEFAULT 0.5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации запросов
CREATE INDEX idx_news_date ON news(date DESC);
CREATE INDEX idx_wiki_pages_category ON wiki_pages(category_id);
CREATE INDEX idx_chat_messages_room ON chat_messages(chat_room_id, timestamp DESC);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp DESC);
CREATE INDEX idx_page_elements_section ON page_elements(section);
CREATE INDEX idx_custom_tabs_location ON custom_tabs(location, order_index);
CREATE INDEX idx_rules_number ON rules(number);

-- Вставка дефолтных данных
INSERT INTO hero_content (title, subtitle, description, button1_text, button2_text, 
    feature1_title, feature1_desc, feature2_title, feature2_desc, feature3_title, feature3_desc)
VALUES (
    'Dark Haven',
    'Добро пожаловать в Dark Haven',
    'Место для вашего сообщества',
    'Начать игру',
    'Правила',
    'Активное сообщество',
    'Присоединяйтесь к тысячам игроков',
    'Постоянные обновления',
    'Регулярные новинки и улучшения',
    'Поддержка 24/7',
    'Всегда готовы помочь'
);

-- Создание комнаты чата по умолчанию
INSERT INTO chat_rooms (id, name, icon, description) 
VALUES ('general', 'Общий чат', '💬', 'Общая комната для всех участников');

-- Категории Wiki по умолчанию
INSERT INTO wiki_categories (title, icon, order_index) VALUES
    ('Начало игры', '🎮', 1),
    ('Механики', '⚙️', 2),
    ('Команды', '📝', 3),
    ('FAQ', '❓', 4);