from flask import Flask, render_template, url_for, redirect, g, request, session, jsonify
from flask_session import Session
from database import get_db, close_db 
from functools import wraps 
from werkzeug.security import generate_password_hash, check_password_hash
from forms import RegisterForm, LoginForm



app = Flask(__name__) 
app.teardown_appcontext(close_db)  

app.config["SECRET_KEY"] = "insert-your-key-here"

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.before_request
def load_logged_in_user():
    g.user = session.get("username", None)

def login_required(view):
    @wraps(view)
    def wrapped_view(*args,**kwargs):
        if g.user is None:
            return redirect(url_for("login", next=request.url))
        return view(*args,**kwargs)
    return wrapped_view


@app.route("/")
@login_required
def index():
    return render_template("index.html")


@app.route("/save", methods = ["POST"])
def save():
    cards = request.get_json()
    db = get_db()

    #delete all cards no longer there
    current_ids = set([str(card["id"]) for card in cards if card["id"] != ""])
    database_ids = set((str(card["id"]) for card in db.execute('''SELECT id FROM cards''').fetchall()))
    difference = database_ids - current_ids
    for id in difference:
        db.execute('''DELETE FROM cards WHERE id = ?''',(id,))

    #update all cards that changed 
    updated_cards = [] 
    for card in cards:
        if card["id"] != "": 
            row = db.execute('SELECT title, description, status FROM cards WHERE id = ?', (card["id"],)).fetchone()
            if row and (row["title"] != card["title"] or row["description"] != card["description"] or row["status"] != card["status"]):
                db.execute('''UPDATE cards SET title = ?, description = ?, status = ? WHERE id = ?''',(card["title"], card["description"], card["status"], card["id"]))
        else:
            # new cards (no id)
            cursor = db.execute('''INSERT INTO cards ('title', 'description', 'status') VALUES (?,?,?)''',(card["title"], card["description"], card["status"]))
            new_id = cursor.lastrowid
            updated_cards.append({
                "id": new_id,  
                "tempId": card.get("tempId", ""),
                "title": card["title"],
                "description": card["description"],
                "status": card["status"]
            })
    db.commit() 

    return jsonify({
        "status": "saved",
        "updated_cards": updated_cards
    })

@app.route("/init", methods=["POST"])
def init():
    db = get_db()
    cards = db.execute('''SELECT * FROM cards''').fetchall()
    cards_as_dicts = [dict(card) for card in cards]
    return jsonify({
        "status": "initialised",
        "cards": cards_as_dicts
    })


@app.route("/register", methods = ["POST","GET"])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        username = form.username.data
        if username.strip() == "":
            form.username.errors.append("username must have characters")
            return render_template("register.html", form = form)
        password = form.password1.data
        db = get_db()
        username_in_db = db.execute('''SELECT * FROM users WHERE username = ?;''', (username,)).fetchone()
        if username_in_db == None:
            db.execute('''INSERT INTO users VALUES (?, ?);''',(username, generate_password_hash(password)))
            db.commit()
        else:
            form.username.errors.append("username already taken")
        return redirect(url_for("login"))
    return render_template("register.html", form=form)


@app.route("/login", methods = ["POST", "GET"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        db = get_db()
        username_in_db = db.execute('''SELECT * FROM users WHERE username = ?;''', (username,)).fetchone()
        if username_in_db == None:
            form.username.errors.append(f"user {username} does not exist")
        elif not check_password_hash(username_in_db["password"], password):
            form.password.errors.append("Incorrect Password")
        else:
            session["username"] = username
            session.modified = True
            next_page = request.args.get("next")
            if not next_page:                   
                next_page = url_for("index")
            return redirect(next_page)
    return render_template("login.html", form=form)

@app.route("/logout")
def logout():
    session.clear()
    session.modified = True
    return redirect(url_for("login"))