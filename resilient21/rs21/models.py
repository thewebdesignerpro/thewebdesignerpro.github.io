from flask_sqlalchemy import SQLAlchemy
from werkzeug import generate_password_hash, check_password_hash

db = SQLAlchemy()

class Address(db.Model):
	__tablename__ = 'address'
	addressid = db.Column(db.Integer, primary_key = True)
	addresscity = db.Column(db.String(128))
	addresscountry = db.Column(db.String(128))
	addressline1 = db.Column(db.String(128))
	addressstate = db.Column(db.String(2))
	addresszip = db.Column(db.String(10))
	addressline2 = db.Column(db.String(128), default=None)

	def __init__(self, addresscity, addresscountry, addressline1, addressstate, addresszip, addressline2=None):
		self.addresscity = addresscity
		self.addresscountry = addresscountry
		self.addressline1 = addressline1
		self.addressstate = addressstate
		self.addresszip = addresszip
		self.addressline2 = addressline2

class Job(db.Model):
	__tablename__ = 'job'
	jobid = db.Column(db.Integer, primary_key = True)
	jobtitle = db.Column(db.String(128))
	jobisopen = db.Column(db.Boolean)

	def __init__(self, jobid, jobtitle, jobisopen):
		self.jobid = jobid
		self.jobtitle = jobtitle
		self.jobisopen = jobisopen

class User(db.Model):
	__tablename__ = 'users'
	userid = db.Column(db.Integer, primary_key = True)
	useraddressid = db.Column(db.Integer, db.ForeignKey("address.addressid"))
	useremail = db.Column(db.String(64))
	userjobid = db.Column(db.Integer, db.ForeignKey("job.jobid"))
	usernamefirst = db.Column(db.String(64))
	usernamemiddle = db.Column(db.String(64))
	usernamelast = db.Column(db.String(64))
	userphone = db.Column(db.String(11))
	userpwd = db.Column(db.String(64))

	def __init__(self, userid, useraddresid, useremail, userjobid, usernamefirst, usernamemiddle, usernamelast, userphone, userpwd):
		self.userid = userid
		self.useraddressid = useraddressid
		self.useremail = useremail
		self.userjobid = userjobid
		self.usernamefirst = usernamefirst
		self.usernamemiddle = usernamemiddle
		self.usernamelast = usernamelast
		self.userphone = userphone
		self.set_password(password)


	def set_password(self, password):
		self.userpwd = generate_password_hash(password)

	def check_password(self, password):
		return check_password_hash(self.userpwd, password)

class Application(db.Model):
	__tablename__ = 'application'
	appid = db.Column(db.Integer, primary_key = True)
	appnamefirst = db.Column(db.String(64))
	appnamelast = db.Column(db.String(64))
	appdate= db.Column(db.TIMESTAMP)
	appaddressid = db.Column(db.Integer, db.ForeignKey("address.addressid"))
	appphone = db.Column(db.String(11))
	appemail = db.Column(db.String(64))
	appdateavailable = db.Column(db.TIMESTAMP)
	appdesiredsalary = db.Column(db.Integer)
	appjobtitle = db.Column(db.String(128))
	appauthorizedinus= db.Column(db.Boolean)
	appsecurityclearance = db.Column(db.Boolean)
	appveteran = db.Column(db.Boolean)
	appnamemiddle = db.Column(db.String(64), default=None)
	apphearabout = db.Column(db.String(2048), default=None)
	appfelonreason = db.Column(db.String(2048),default=None)

	def __init__(self, appnamefirst, appnamelast, appdate, appaddressid, appphone, appemail, appdateavailable, appdesiredsalary, appjobtitle, appauthorizedinus,appsecurityclearance, appveteran, appnamemiddle=None, apphearabout=None, appfelonreason=None):
		self.appnamefirst  = appnamefirst
		self.appnamelast = appnamelast
		self.appdate = appdate
		self.appaddressid = appaddressid
		self.appphone = appphone
		self.appemail = appemail
		self.appdateavailable = appdateavailable
		self.appdesiredsalary = appdesiredsalary 
		self.appjobtitle = appjobtitle
		self.appauthorizedinus = appauthorizedinus
		self.appsecurityclearance = appsecurityclearance
		self.appveteran = appveteran 
		self.appnamemiddle = appnamemiddle
		self.apphearabout = apphearabout
		self.appfelonreason =  appfelonreason

class Reference(db.Model):
	__tablename__ = 'reference'
	refid = db.Column(db.Integer, primary_key = True)
	refappid = db.Column(db.Integer, db.ForeignKey("application.appid"))
	refemail = db.Column(db.String(64))
	refcompany = db.Column(db.String(128))
	refname = db.Column(db.String(128))
	refphone = db.Column(db.String(11))
	refrelationship = db.Column(db.String(128))

	def __init__(self, refappid, refemail, refcompany, refname,refphone, refrelationship):
		self.refappid = refappid
		self.refemail = refemail
		self.refcompany = refcompany
		self.refname = refname
		self.refphone = refphone
		self.refrelationship = refrelationship

class Employment(db.Model):
	__tablename__ = 'previousemployment'
	peid = db.Column(db.Integer, primary_key = True)
	peappid = db.Column(db.Integer, db.ForeignKey("application.appid"))
	peaddressid = db.Column(db.Integer, db.ForeignKey("address.addressid"))
	pecompany = db.Column(db.String(128))
	pedatestart = db.Column(db.TIMESTAMP) 
	pedateend = db.Column(db.TIMESTAMP)
	pemaycontact = db.Column(db.Boolean)
	pephone = db.Column(db.String(11))
	peresponsibilities = db.Column(db.String(2048))
	pereasonforleaving = db.Column(db.String(2048))
	pesalarystart = db.Column(db.Integer)
	pesalaryend = db.Column(db.Integer)
	pesupervisor = db.Column(db.String(128))
	pejobtitle = db.Column(db.String(64))

	def __init__(self, peappid, peaddressid, pecompany, pedatestart, pedateend, pemaycontact, pephone, peresponsibilities,pereasonforleaving, pesalarystart, pesalaryend, pesupervisor,pejobtitle):
		self.peappid = peappid
		self.peaddressid = peaddressid
		self.pecompany = pecompany
		self.pedatestart = pedatestart
		self.pedateend = pedateend
		self.pemaycontact =  pemaycontact
		self.pephone = pephone
		self.peresponsibilities = peresponsibilities
		self.pereasonforleaving = pereasonforleaving
		self.pesalarystart = pesalarystart
		self.pesalaryend = pesalaryend
		self.pesupervisor = pesupervisor
		self.pejobtitle = pejobtitle

class Link(db.Model):
	__tablename__ = 'link'
	linkid = db.Column(db.Integer, primary_key = True)
	linkappid = db.Column(db.Integer, db.ForeignKey("application.appid"))
	linkurl = db.Column(db.String(256), default=None)

	def __init__(self, linkappid, linkurl=None):
		self.linkappid = linkappid
		self.linkurl = linkurl

class Education(db.Model):
	__tablename__ = 'education'
	edid = db.Column(db.Integer, primary_key = True)
	edappid = db.Column(db.Integer, db.ForeignKey("application.appid"))
	edname = db.Column(db.String(128))
	eddatestart = db.Column(db.TIMESTAMP) 
	eddateend = db.Column(db.TIMESTAMP)
	edgrad = db.Column(db.Boolean)
	eddegree = db.Column(db.String(128), nullable=True, default=None)

	def __init__(self, edappid, edname, eddatestart, eddateend, edgrad, eddegree=None):
		self.edappid = edappid
		self.edname = edname
		self.eddatestart = eddatestart
		self.eddateend = eddateend
		self.edgrad =  edgrad
		self.eddegree = eddegree

class Newhire(db.Model):
	__tablename__ = 'newhire'
	nhid = db.Column(db.Integer, primary_key = True)
	nhname = db.Column(db.String(64))
	nhpwd = db.Column(db.String(128))

	def __init__(self, nhname, password):
		self.nhname = nhname
		self.set_password(password)

	def set_password(self, password):
		self.nhpwd = generate_password_hash(password)

	def check_password(self, password):
		return check_password_hash(self.nhpwd, password)