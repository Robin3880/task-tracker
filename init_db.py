from app import app
from database import get_db  

with app.app_context():
    db = get_db()
    with open('schema.sql') as f:
        db.executescript(f.read())