import requests
import psycopg2
import random

host = 'https://t-ride.azurewebsites.net'
db_database = 'postgres'
db_user = 'test'
db_host = 't-ride-sqldb.postgres.database.azure.com'
db_port = '5432'
db_password = input('db password: ')

'''
for i in range(1, 11):
    requests.post(f'{host}/user/register', json={'username': f'user{i}', 'password': f'user{i}'})
'''

'''
conn = psycopg2.connect(
    database = db_database,
    user = db_user,
    password = db_password,
    host = db_host,
    port = db_port)
with conn.cursor() as cur:
    for i in range(1, 11):
        # the user id may need adjustment, check db table
        sql = f"INSERT INTO session VALUES ('token{i}', 2000000000, {i});"
        cur.execute(sql)
        conn.commit()
'''

'''
for i in range(1, 11):
    requests.post(f'{host}/order/passenger', json={
        'token': f'token{i}',
        'startPoint': {'lat': random.uniform(24.77, 24.81), 'lng': random.uniform(120.96, 121.02)},
        'startName': f'start{i}',
        'endPoint': {'lat': random.uniform(24.40, 24.44), 'lng': random.uniform(120.65, 120.69)},
        'endName': f'end{i}',
        'departureTime1': 1701080800,
        'departureTime2': 1701082800,
        'passengerCount': random.randint(1, 3)})
'''
