from flask_wtf import FlaskForm 
from wtforms import StringField, SubmitField, PasswordField
from wtforms.validators import InputRequired, EqualTo

class RegisterForm(FlaskForm):
    username = StringField("username:", validators=[InputRequired()])
    password1 = PasswordField("password:", validators=[InputRequired()])
    password2 = PasswordField("confirm password:", validators=[InputRequired(), EqualTo("password1","passwords must match")])
    submit = SubmitField("Register")


class LoginForm(FlaskForm):
    username = StringField("username:", validators=[InputRequired()])
    password = PasswordField("password:", validators=[InputRequired()])
    submit = SubmitField("Log in")