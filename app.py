from flask import Flask, render_template
from config import Config
from flask_session import Session
from database import get_db, close_db 
from werkzeug.security import generate_password_hash, check_password_hash



app = Flask(__name__) 
app.teardown_appcontext(close_db)  
app.config.from_object(Config)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)