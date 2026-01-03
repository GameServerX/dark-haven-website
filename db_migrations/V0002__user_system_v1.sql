CREATE TABLE darkhaven_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    token VARCHAR(255),
    is_admin BOOLEAN DEFAULT FALSE,
    avatar_url TEXT DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
    bio TEXT DEFAULT '',
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    total_messages INTEGER DEFAULT 0,
    total_time_online INTEGER DEFAULT 0,
    achievements TEXT DEFAULT '[]',
    friends TEXT DEFAULT '[]',
    online_status VARCHAR(20) DEFAULT 'offline',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    last_seen TIMESTAMP,
    CONSTRAINT darkhaven_users_username_key UNIQUE (username),
    CONSTRAINT darkhaven_users_token_key UNIQUE (token)
);

CREATE TABLE darkhaven_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    edited BOOLEAN DEFAULT FALSE
);
