from flask import Flask, jsonify, json
from flask import render_template
from flask import request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.declarative import DeclarativeMeta

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///Expenses.db'
db = SQLAlchemy(app)

class expenses(db.Model):
	id = db.Column('expense_id', db.Integer, primary_key = True)
	date = db.Column(db.String(1000))
	amount = db.Column(db.Integer)
	reason = db.Column(db.String(1000))

	def __init__(self,date,amount,reason):
		self.date = date
		self.amount = amount
		self.reason = reason

db.create_all()

class AlchemyEncoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj.__class__, DeclarativeMeta):
            # an SQLAlchemy class
            fields = {}
            for field in [x for x in dir(obj) if not x.startswith('_') and x != 'metadata']:
                data = obj.__getattribute__(field)
                try:
                    json.dumps(data) # this will fail on non-encodable values, like other classes
                    fields[field] = data
                except TypeError:
                    fields[field] = None
            # a json-encodable dict
            return fields

        return json.JSONEncoder.default(self, obj)
        
@app.route("/")
def home():
	return render_template('home.html',topic='Home')

@app.route("/daily")
def daily():
	return render_template('daily.html',topic='Daily')

@app.route("/monthly")
def monthly():
	return render_template('monthly.html',topic='Monthly')

@app.route('/data', methods = ['GET', 'POST'])
def collect():
		c = expenses.query.all()
		return json.dumps(c, cls = AlchemyEncoder)


@app.route('/', methods = ['GET', 'POST'])
def new():
	if request.method == 'POST':
		expense = expenses(request.form['date'], request.form['amt'],request.form['about'])
		db.session.add(expense)
		db.session.commit()

	collect()
	return render_template('home.html')

@app.route("/delete", methods=['GET','POST'])
def delete():

 	data = request.get_json()
 	print(data)
 	remove = expenses.query.filter_by(id=data).first()
 	db.session.delete(remove)
 	db.session.commit()
 	return render_template('home.html')


if __name__ == '__main__':
	app.run(debug=True)