import json
import os
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''Система чата с профилями пользователей'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        if method == 'GET':
            return get_messages(event)
        elif method == 'POST':
            return send_message(event)
        elif method == 'DELETE':
            return delete_message(event)
        else:
            return error_response('Method not allowed', 405)
            
    except Exception as e:
        return error_response(str(e), 500)

def get_user_from_token(token: str):
    import psycopg2
    
    if not token:
        return None
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        cur.execute('''
            SELECT id, username, avatar_url, is_admin, level, online_status
            FROM darkhaven_users WHERE token = %s
        ''', (token,))
        
        user = cur.fetchone()
        if user:
            return {
                'id': user[0],
                'username': user[1],
                'avatarUrl': user[2],
                'isAdmin': user[3],
                'level': user[4],
                'onlineStatus': user[5]
            }
        return None
        
    finally:
        cur.close()
        conn.close()

def get_messages(event: dict) -> dict:
    import psycopg2
    
    params = event.get('queryStringParameters') or {}
    limit = int(params.get('limit', 50))
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        cur.execute('''
            SELECT m.id, m.message, m.created_at, m.edited,
                   u.id, u.username, u.avatar_url, u.is_admin, u.level, u.online_status
            FROM darkhaven_messages m
            JOIN darkhaven_users u ON m.user_id = u.id
            ORDER BY m.created_at DESC
            LIMIT %s
        ''', (limit,))
        
        messages = []
        for row in cur.fetchall():
            messages.append({
                'id': row[0],
                'message': row[1],
                'timestamp': row[2].isoformat(),
                'edited': row[3],
                'user': {
                    'id': row[4],
                    'username': row[5],
                    'avatarUrl': row[6],
                    'isAdmin': row[7],
                    'level': row[8],
                    'onlineStatus': row[9]
                }
            })
        
        messages.reverse()
        return success_response({'messages': messages})
        
    finally:
        cur.close()
        conn.close()

def send_message(event: dict) -> dict:
    import psycopg2
    
    token = event.get('headers', {}).get('X-Authorization', '').replace('Bearer ', '')
    user = get_user_from_token(token)
    
    if not user:
        return error_response('Unauthorized', 401)
    
    body = json.loads(event.get('body', '{}'))
    message = body.get('message', '').strip()
    
    if not message:
        return error_response('Message cannot be empty', 400)
    
    if len(message) > 1000:
        return error_response('Message too long', 400)
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        cur.execute('''
            INSERT INTO darkhaven_messages (user_id, message, created_at)
            VALUES (%s, %s, CURRENT_TIMESTAMP)
            RETURNING id, message, created_at, edited
        ''', (user['id'], message))
        
        msg = cur.fetchone()
        
        cur.execute('''
            UPDATE darkhaven_users 
            SET total_messages = total_messages + 1, 
                experience = experience + 10
            WHERE id = %s
        ''', (user['id'],))
        
        conn.commit()
        
        return success_response({
            'message': {
                'id': msg[0],
                'message': msg[1],
                'timestamp': msg[2].isoformat(),
                'edited': msg[3],
                'user': user
            }
        })
        
    finally:
        cur.close()
        conn.close()

def delete_message(event: dict) -> dict:
    import psycopg2
    
    token = event.get('headers', {}).get('X-Authorization', '').replace('Bearer ', '')
    user = get_user_from_token(token)
    
    if not user:
        return error_response('Unauthorized', 401)
    
    params = event.get('queryStringParameters') or {}
    message_id = params.get('id')
    
    if not message_id:
        return error_response('Message ID required', 400)
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        cur.execute('SELECT user_id FROM darkhaven_messages WHERE id = %s', (message_id,))
        msg = cur.fetchone()
        
        if not msg:
            return error_response('Message not found', 404)
        
        if msg[0] != user['id'] and not user['isAdmin']:
            return error_response('Forbidden', 403)
        
        cur.execute('DELETE FROM darkhaven_messages WHERE id = %s', (message_id,))
        conn.commit()
        
        return success_response({'message': 'Message deleted'})
        
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