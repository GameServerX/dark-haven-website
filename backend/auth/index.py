import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta

def handler(event: dict, context) -> dict:
    '''Система авторизации и регистрации пользователей'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        if action == 'register':
            return register_user(body)
        elif action == 'login':
            return login_user(body)
        elif action == 'verify':
            return verify_token(event)
        elif action == 'update_profile':
            return update_profile(event, body)
        else:
            return error_response('Invalid action', 400)
            
    except Exception as e:
        return error_response(str(e), 500)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    return secrets.token_urlsafe(32)

def register_user(data: dict) -> dict:
    import psycopg2
    
    username = data.get('username', '').strip()
    password = data.get('password', '')
    email = data.get('email', '').strip()
    
    if not username or not password:
        return error_response('Username and password required', 400)
    
    if len(username) < 3:
        return error_response('Username must be at least 3 characters', 400)
    
    if len(password) < 4:
        return error_response('Password must be at least 4 characters', 400)
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        cur.execute("SELECT id FROM darkhaven_users WHERE LOWER(username) = LOWER(%s)", (username,))
        if cur.fetchone():
            return error_response('Username already exists', 409)
        
        password_hash = hash_password(password)
        token = generate_token()
        
        is_admin = username == 'GameServerX' and password == '4444DIALOG7777777'
        
        cur.execute('''
            INSERT INTO darkhaven_users (username, password_hash, email, token, is_admin, created_at, last_login)
            VALUES (%s, %s, %s, %s, %s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING id, username, email, is_admin, avatar_url, bio, level, experience, online_status
        ''', (username, password_hash, email, token, is_admin))
        
        user = cur.fetchone()
        conn.commit()
        
        return success_response({
            'token': token,
            'user': {
                'id': user[0],
                'username': user[1],
                'email': user[2],
                'isAdmin': user[3],
                'avatarUrl': user[4],
                'bio': user[5],
                'level': user[6],
                'experience': user[7],
                'onlineStatus': user[8]
            }
        })
        
    finally:
        cur.close()
        conn.close()

def login_user(data: dict) -> dict:
    import psycopg2
    
    username = data.get('username', '').strip()
    password = data.get('password', '')
    
    if not username or not password:
        return error_response('Username and password required', 400)
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        password_hash = hash_password(password)
        
        cur.execute('''
            SELECT id, username, email, is_admin, token, avatar_url, bio, level, experience, 
                   total_messages, total_time_online, achievements, friends, online_status
            FROM darkhaven_users 
            WHERE LOWER(username) = LOWER(%s) AND password_hash = %s
        ''', (username, password_hash))
        
        user = cur.fetchone()
        
        if not user:
            return error_response('Invalid username or password', 401)
        
        new_token = generate_token()
        cur.execute('UPDATE darkhaven_users SET token = %s, last_login = CURRENT_TIMESTAMP, online_status = %s WHERE id = %s', 
                   (new_token, 'online', user[0]))
        conn.commit()
        
        return success_response({
            'token': new_token,
            'user': {
                'id': user[0],
                'username': user[1],
                'email': user[2],
                'isAdmin': user[3],
                'avatarUrl': user[5],
                'bio': user[6],
                'level': user[7],
                'experience': user[8],
                'totalMessages': user[9],
                'totalTimeOnline': user[10],
                'achievements': json.loads(user[11]) if user[11] else [],
                'friends': json.loads(user[12]) if user[12] else [],
                'onlineStatus': 'online'
            }
        })
        
    finally:
        cur.close()
        conn.close()

def verify_token(event: dict) -> dict:
    import psycopg2
    
    token = event.get('headers', {}).get('X-Authorization', '').replace('Bearer ', '')
    
    if not token:
        return error_response('Token required', 401)
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        cur.execute('''
            SELECT id, username, email, is_admin, avatar_url, bio, level, experience,
                   total_messages, total_time_online, achievements, friends, online_status
            FROM darkhaven_users WHERE token = %s
        ''', (token,))
        
        user = cur.fetchone()
        
        if not user:
            return error_response('Invalid token', 401)
        
        cur.execute('UPDATE darkhaven_users SET last_seen = CURRENT_TIMESTAMP WHERE id = %s', (user[0],))
        conn.commit()
        
        return success_response({
            'user': {
                'id': user[0],
                'username': user[1],
                'email': user[2],
                'isAdmin': user[3],
                'avatarUrl': user[4],
                'bio': user[5],
                'level': user[6],
                'experience': user[7],
                'totalMessages': user[8],
                'totalTimeOnline': user[9],
                'achievements': json.loads(user[10]) if user[10] else [],
                'friends': json.loads(user[11]) if user[11] else [],
                'onlineStatus': user[12]
            }
        })
        
    finally:
        cur.close()
        conn.close()

def update_profile(event: dict, data: dict) -> dict:
    import psycopg2
    
    token = event.get('headers', {}).get('X-Authorization', '').replace('Bearer ', '')
    
    if not token:
        return error_response('Token required', 401)
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        cur.execute('SELECT id FROM darkhaven_users WHERE token = %s', (token,))
        user = cur.fetchone()
        
        if not user:
            return error_response('Invalid token', 401)
        
        user_id = user[0]
        updates = []
        values = []
        
        if 'bio' in data:
            updates.append('bio = %s')
            values.append(data['bio'])
        
        if 'avatarUrl' in data:
            updates.append('avatar_url = %s')
            values.append(data['avatarUrl'])
        
        if 'onlineStatus' in data:
            updates.append('online_status = %s')
            values.append(data['onlineStatus'])
        
        if 'experience' in data:
            updates.append('experience = %s')
            values.append(data['experience'])
            updates.append('level = %s')
            values.append(data['experience'] // 100 + 1)
        
        if updates:
            values.append(user_id)
            cur.execute(f"UPDATE darkhaven_users SET {', '.join(updates)} WHERE id = %s", values)
            conn.commit()
        
        return success_response({'message': 'Profile updated'})
        
    finally:
        cur.close()
        conn.close()

def success_response(data: dict) -> dict:
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(data),
        'isBase64Encoded': False
    }

def error_response(message: str, status_code: int) -> dict:
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': message}),
        'isBase64Encoded': False
    }