from flask import Flask, send_file, render_template, request, session, redirect, url_for, jsonify
from models import db, User, Address, Job, Application, Reference, Employment, Link, Education, Newhire
from werkzeug.utils import secure_filename
from flask_mail import Mail, Message
import os
import datetime

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:rs214LIFE@localhost/rs21'
db.init_app(app)

app.config['MAIL_SERVER'] = 'rs21-io.mail.protection.outlook.com'
app.config['MAIL_PORT'] = 25
app.config['MAIL_USE_SSL'] = False

mail = Mail(app)

app.secret_key = "rs214LIFE"

ALLOWED_EXTENSIONS = set(["pdf"])


def allowed_file(filename):
	return '.' in filename and \
		filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/')
@app.route('/index')
def index():
	return send_file("templates/index.html")


@app.route('/api/signup/', methods=["POST"])
def sign_up():
	if request.method == "POST":
		data = request.get_json()

		newhire = Newhire(data['nhname'], data['nhpwd'])
		db.session.add(newhire)
		db.session.commit()

		return "OK"


@app.route('/api/login/', methods=["POST"])
def sign_in():

	if request.method == "POST":
		username = request.get_json()["nhname"]
		password = request.get_json()["nhpwd"]

		user = Newhire.query.filter_by(nhname=username).first()
		if user is not None and user.check_password(password):
			print "SESSION"
			session['user'] = True
			return jsonify({"status": 200})
		else:
			print "FAIL"
			return jsonify({"status": 404})


@app.route('/api/logout/', methods=["GET"])
def logout():
	session.pop('user', None);
	return "Success"


@app.route("/api/contact/", methods=["POST"])
def contact():
	if request.method == "POST":
		name = str(request.get_json()['name'])
		email = str(request.get_json()['email'])
		text = str(request.get_json()['text'])

		message = Message("Contact From Website - Name: " + name + " Email: " + email,
			sender="website@rs21.io",
			recipients=["matt@resilientsolutions21.com"],
			reply_to=email)

		message.body = text

		print message

		mail.send(message)

		return "OK"


@app.route("/api/application/", methods=["POST"])
def application():
	if request.method == "POST":

		newaddress = Address(request.get_json()["addresscity"],"US",request.get_json()["addressline1"],request.get_json()["addressstate"],request.get_json()["addresszip"],request.get_json()["addressline2"])
		db.session.add(newaddress)
		db.session.commit()
		newapp = Application(request.get_json()["appnamefirst"],request.get_json()["appnamelast"],datetime.datetime.now(),newaddress.addressid,request.get_json()["appphone"],request.get_json()["appemail"],request.get_json()["appdateavailable"],request.get_json()["appdesiredsalary"],request.get_json()["appjobtitle"],request.get_json()["appauthorizedinus"],request.get_json()["appsecurityclearance"],request.get_json()["appveteran"],request.get_json()["appnamemiddle"],request.get_json()["apphearabout"],request.get_json()["appfelonreason"])
		db.session.add(newapp)
		db.session.commit()

		for reference in request.get_json()["reference"]:
			newref = Reference(newapp.appid,reference["refemail"],reference["refcompany"],reference["refname"],reference["refphone"],reference["refrelationship"])
			db.session.add(newref)
		for employer in request.get_json()["employer"]:
			newaddress = Address(employer["addresscity"],"US",employer["addressline1"],employer["addressstate"],employer["addresszip"],employer["addressline2"])
			db.session.add(newaddress)
			db.session.commit()
			newemp = Employment(newapp.appid,newaddress.addressid,employer["pecompany"],employer["pedatestart"],employer["pedateend"],employer["pemaycontact"],employer["pephone"], employer["peresponsibilities"],employer["pereasonforleaving"],employer["pesalarystart"],employer["pesalaryend"],employer["pesupervisor"],employer["pejobtitle"])
			db.session.add(newemp)

		for education in request.get_json()["education"]:
			newed = Education(newapp.appid, education["edname"],education["eddatestart"],education["eddateend"],education["edgrad"],education["eddegree"])
			db.session.add(newed)

		for link in request.get_json()["links"]:
			newlink = Link(newapp.appid, link["linkurl"])
			db.session.add(newlink)

		db.session.commit()

		# EMAIL
		message = Message("New Application - " + newapp.appnamefirst + " " + newapp.appnamelast + " - " + str(datetime.date.today()),
			sender="website@rs21.io",
			recipients=["matt@rs21.io"])

		message.html = """
<style></style>
<h1>New Application</h1>
<h3>Appicant Info</h3>
<p><b>First Name:</b>  %s</p>
<p><b>Middle Name:</b> %s </p>
<p><b>Last Name:</b> %s</p>
<p><b>Street</b> %s</p>
<p><b>Unit #:</b> %s</p>
<p><b>City:</b> %s</p>
<p><b>State:</b> %s</p>
<p><b>Zip:</b> %s</p>
<p><b>Phone:</b> %s</p>
<p><b>Email:</b> %s</p>
<p><b>Position:</b> %s</p>
<p><b>Date Available: </b> %s</p>
<p><b>Desired Salary: </b> %s</p>
<p><b>How Did You Hear About Us?: </b> %s</p>
<p><b>Vet: </b> %s</p>
<p><b>Authorized: </b> %s</p>
<p><b>Felony Reason: </b> %s</p>
<p><b>Clearance: </b> %s</p>
		""" % (newapp.appnamefirst, newapp.appnamemiddle, newapp.appnamelast, newaddress.addressline1, newaddress.addressline2, newaddress.addresscity, newaddress.addressstate, newaddress.addresszip, newapp.appphone, newapp.appemail, newapp.appjobtitle, newapp.appdateavailable, newapp.appdesiredsalary, newapp.apphearabout, newapp.appveteran, newapp.appauthorizedinus, newapp.appfelonreason, newapp.appsecurityclearance)

		for link in request.get_json()["links"]:
			message.html += """
			<p><b>Link URL: </b> %s</p>
			""" % (link["linkurl"])

		message.html += '<br><h3>Education</h3>'

		for education in request.get_json()["education"]:
			message.html += """
			<p><b>College: </b> %s</p>
			<p><b>From: </b> %s</p>
			<p><b>To: </b> %s</p>
			<p><b>Graduate: </b> %s</p>
			<p><b>Degree: </b> %s</p><br>
			""" % (education["edname"],education["eddatestart"],education["eddateend"],education["edgrad"],education["eddegree"])

		message.html += '<h3>References</h3>'

		for reference in request.get_json()["reference"]:
			message.html += """
			<p><b>Name: </b> %s</p>
			<p><b>Relationship: </b> %s</p>
			<p><b>Company: </b> %s</p>
			<p><b>Phone: </b> %s</p>
			<p><b>Email: </b> %s</p><br>
			""" % (reference["refname"],reference["refrelationship"],reference["refcompany"],reference["refphone"],reference["refemail"])

		message.html += '<h3>Previous Employment</h3>'

		for employer in request.get_json()["employer"]:
			message.html += """
			<p><b>Company: </b> %s</p>
			<p><b>Phone: </b> %s</p>
			<p><b>Address: </b> %s</p>
			<p><b>Unit: </b> %s</p>
			<p><b>City: </b> %s</p>
			<p><b> State: </b> %s</p>
			<p><b>Zip: </b> %s</p>
			<p><b>Job Title: </b> %s</p>
			<p><b>Supervisor: </b> %s</p>
			<p><b>Start Salary: </b> %s</p>
			<p><b>Ending Salary: </b> %s</p>
			<p><b>Responsibilities: </b> %s</p>
			<p><b>From: </b> %s</p>
			<p><b>To: </b> %s</p>
			<p><b>Reason for Leaving: </b> %s</p>
			<p><b>Contact?: </b> %s</p><br>
			""" % (employer["pecompany"], employer["pephone"], employer["addressline1"], employer["addressline2"], employer["addresscity"], employer["addressstate"], employer["addresszip"], employer["pejobtitle"], employer["pesupervisor"], employer["pesalarystart"], employer["pesalaryend"], employer["peresponsibilities"], employer["pedatestart"], employer["pedateend"], employer["pereasonforleaving"], employer["pemaycontact"])

		resumeFilename = newapp.appnamefirst.lower() + "-" + newapp.appnamelast.lower() + "-" + str(request.get_json()["timestamp"]) + "-resume.pdf"
		with app.open_resource(os.path.join("static", "files", resumeFilename)) as resume:
			message.attach(resumeFilename, "application/pdf", resume.read())

		coverLetterFilename = newapp.appnamefirst.lower() + "-" + newapp.appnamelast.lower() + "-" + str(request.get_json()["timestamp"]) + "-coverletter.pdf"
		if (os.path.exists(os.path.join(os.path.abspath(os.path.dirname(__file__)), "static", "files", coverLetterFilename))) == True:
			with app.open_resource(os.path.join("static", "files", coverLetterFilename)) as coverLetter:
				message.attach(coverLetterFilename, "application/pdf", coverLetter.read())


		mail.send(message)

		if (os.path.exists(os.path.join(os.path.abspath(os.path.dirname(__file__)), "static", "files", coverLetterFilename))) == True:
			os.remove(str(os.path.join(os.path.abspath(os.path.dirname(__file__)), "static", "files", coverLetterFilename)))

		os.remove(str(os.path.join(os.path.abspath(os.path.dirname(__file__)), "static", "files", resumeFilename)))
		return "Application submitted!"


@app.route("/api/file/", methods=["POST"])
def file():
	if request.method == "POST":
		resume = None
		if "resume" in request.files:
			resume = request.files["resume"]

		coverLetter = None
		if "coverLetter" in request.files:
			coverLetter = request.files["coverLetter"]

		if resume and allowed_file(resume.filename):
			resumeFilename = secure_filename(request.values.get("firstName").lower() + "-" + request.values.get("lastName").lower() + "-" + request.values.get("timestamp") + "-resume." + resume.filename.rsplit('.', 1)[1].lower())
			resume.save(os.path.join(os.path.abspath(os.path.dirname(__file__)), "static", "files", resumeFilename))

			if coverLetter is not None and coverLetter and allowed_file(coverLetter.filename):
				coverLetterFilename = secure_filename(request.values.get("firstName").lower() + "-" + request.values.get("lastName").lower() + "-" + request.values.get("timestamp") + "-coverletter." + coverLetter.filename.rsplit('.', 1)[1].lower())
				coverLetter.save(os.path.join("static", "files", coverLetterFilename))

			return "OK"


if __name__ == "__main__":
	app.run(debug=True)
