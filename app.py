from flask import Flask, render_template, url_for
from flask_session import Session
from database import get_db, close_db 
from werkzeug.security import generate_password_hash, check_password_hash



app = Flask(__name__) 
app.teardown_appcontext(close_db)  

app.config["SECRET_KEY"] = "insert-your-key-here"

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.route("/")
def index():
    return render_template("index.html")