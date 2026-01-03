import json
import os
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''Управление профилями пользователей и друзьями'''
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
        params = event.get('queryStringParameters') or {}
        
        if 'id' in params:
            return get_user_profile(params['id'])
        elif 'search' in params:
            return search_users(params['search'])
        elif method == 'POST':
            return handle_friend_action(event)
        else:
            return get_online_users()
            
    except Exception as e:
        return error_response(str(e), 500)

def get_user_profile(user_id: str) -> dict:
    import psycopg2
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        cur.execute('''
            SELECT id, username, email, avatar_url, bio, level, experience,
                   total_messages, total_time_online, achievements, friends,
                   online_status, created_at, last_login, last_seen
            FROM darkhaven_users WHERE id = %s
        ''', (user_id,))
        
        user = cur.fetchone()
        
        if not user:
            return error_response('User not found', 404)
        
        return success_response({
            'user': {
                'id': user[0],
                'username': user[1],
                'email': user[2],
                'avatarUrl': user[3],
                'bio': user[4],
                'level': user[5],
                'experience': user[6],
                'totalMessages': user[7],
                'totalTimeOnline': user[8],
                'achievements': json.loads(user[9]) if user[9] else [],
                'friends': json.loads(user[10]) if user[10] else [],
                'onlineStatus': user[11],
                'createdAt': user[12].isoformat(),
                'lastLogin': user[13].isoformat() if user[13] else None,
                'lastSeen': user[14].isoformat() if user[14] else None
            }
        })
        
    finally:
        cur.close()
        conn.close()

def search_users(query: str) -> dict:
    import psycopg2
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        cur.execute('''
            SELECT id, username, avatar_url, level, online_status
            FROM darkhaven_users 
            WHERE LOWER(username) LIKE LOWER(%s)
            LIMIT 20
        ''', (f'%{query}%',))
        
        users = []
        for row in cur.fetchall():
            users.append({
                'id': row[0],
                'username': row[1],
                'avatarUrl': row[2],
                'level': row[3],
                'onlineStatus': row[4]
            })
        
        return success_response({'users': users})
        
    finally:
        cur.close()
        conn.close()

def get_online_users() -> dict:
    import psycopg2
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        cur.execute('''
            SELECT id, username, avatar_url, level, online_status
            FROM darkhaven_users 
            WHERE online_status = 'online'
            ORDER BY last_seen DESC
            LIMIT 50
        ''')
        
        users = []
        for row in cur.fetchall():
            users.append({
                'id': row[0],
                'username': row[1],
                'avatarUrl': row[2],
                'level': row[3],
                'onlineStatus': row[4]
            })
        
        return success_response({'users': users})
        
    finally:
        cur.close()
        conn.close()

def handle_friend_action(event: dict) -> dict:
    import psycopg2
    
    token = event.get('headers', {}).get('X-Authorization', '').replace('Bearer ', '')
    body = json.loads(event.get('body', '{}'))
    
    action = body.get('action')
    friend_id = body.get('friendId')
    
    if not token or not friend_id:
        return error_response('Invalid request', 400)
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        cur.execute('SELECT id, friends FROM darkhaven_users WHERE token = %s', (token,))
        user = cur.fetchone()
        
        if not user:
            return error_response('Unauthorized', 401)
        
        user_id = user[0]
        friends = json.loads(user[1]) if user[1] else []
        
        if action == 'add' and friend_id not in friends:
            friends.append(friend_id)
        elif action == 'remove' and friend_id in friends:
            friends.remove(friend_id)
        
        cur.execute('UPDATE darkhaven_users SET friends = %s WHERE id = %s', 
                   (json.dumps(friends), user_id))
        conn.commit()
        
        return success_response({'friends': friends})
        
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