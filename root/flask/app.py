from flask import Flask, jsonify, request
from flask_cors import CORS
from database.postgresql import PostgresDatabase
from flask.cli import with_appcontext
import click

app = Flask(__name__)
CORS(app)

# Initialize database connection
db = PostgresDatabase(
    host='db',
    port=5432,
    user='postgres',
    password='postgres',
    database='mdrdb'
)


@click.command('init-db')
@with_appcontext
def init_db_command():
    if db.connect():
        if db.init_db():
            click.echo('Database initialized successfully.')
        else:
            click.echo('Error initializing database.')
    else:
        click.echo('Error connecting to database.')


app.cli.add_command(init_db_command)

with app.app_context():
    if db.connect():
        if db.init_db():
            print("Database initialized successfully")
        else:
            print("Error initializing database")
    else:
        print("Error connecting to database")


@app.route('/test', methods=['GET'])
def test():
    if not db.connection or db.connection.closed:
        db.connect()
    info = db.get_connection_info()
    return jsonify({"status": info}), 200


@app.route('/api/users', methods=['POST'])
def create_user():
    """Create a new user"""
    if not db.connection or db.connection.closed:
        db.connect()

    data = request.get_json()
    if not all(k in data for k in ['name', 'username', 'email', 'password']):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        db.insert(
            [['name', 'username', 'email', 'password'],
             [data['name'], data['username'], data['email'], data['password']]],
            'users'
        )
        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/users', methods=['GET'])
def get_users():
    """Get all users"""
    if not db.connection or db.connection.closed:
        db.connect()

    try:
        df = db.get_dataframe('users')
        if df is not None:
            # Convert DataFrame to list of dictionaries for JSON response
            users = df.to_dict('records')
            return jsonify(users), 200
        return jsonify([]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/users', methods=['DELETE'])
def clear_users():
    """Clear all users from the database"""
    if not db.connection or db.connection.closed:
        db.connect()

    if db.clear_table('users'):
        return jsonify({"message": "All users deleted successfully"}), 200
    else:
        return jsonify({"error": "Failed to clear users table"}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
