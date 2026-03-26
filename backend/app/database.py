import psycopg

def get_connection():
    conn = psycopg.connect(
        dbname='movie_library',
        user='movie_user',
        password='1234',
        host='localhost',
        port='5432',
    )
    return conn

if __name__ == "__main__":
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT 1;")
    result = cur.fetchall()
    print(result)
    cur.close()
    conn.close()