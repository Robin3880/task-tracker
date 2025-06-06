from wsgiref.handlers import CGIHandler
import cgitb
cgitb.enable(display=1, format="html")
from app import app
CGIHandler().run(app)
