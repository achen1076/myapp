import psycopg2
import psycopg2.extras
import pandas as pd
from datetime import datetime, timezone
from .init_db import DatabaseInitializer
import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class PostgresDatabase:
    def __init__(self, host, port, user, password, database):
        self.host = host
        self.port = port
        self.user = user
        self.password = password
        self.database = database
        self.connection = None

    def connect(self):
        try:
            self.connection = psycopg2.connect(
                host=self.host,
                port=self.port,
                user=self.user,
                password=self.password,
                database=self.database
            )
            return True

        except Exception as e:
            print(f"Error connecting to database: {e}")
            return False

    def init_db(self):
        initializer = DatabaseInitializer()
        logging.info('hi')
        return initializer.initialize_database(self.connection)

    def disconnect(self):
        if self.connection:
            self.connection.close()
            self.connection = None

    def get_connection_info(self):
        logging.info('ho')
        return {"database": self.database, "user": self.user, "host": self.host, "port": self.port}

    def get_cursor(self):
        if self.connection:
            return self.connection.cursor()
        else:
            try:
                self.connect()
                return self.connection.cursor()
            except:
                return None

    def get_connection(self):
        return self.connection

    def insert(self, data: list[list[str], list[str]], table):
        if self.connection:
            columns = data[0]
            values = data[1]

            entries = len(values)

            vals = ", ".join(["%s"] * entries)
            columns_part = ", ".join(columns)

            sql_query = f"INSERT INTO {table} ({columns_part}) VALUES ({vals})"
            cur = self.connection.cursor()
            cur.execute(sql_query, values)
            self.connection.commit()
            cur.close()

    def update(self, table_name, columns_and_values, id, id_column_name):
        cursor = self.connection.cursor()
        set_clause = ", ".join(
            [f"{col} = %s" for col in columns_and_values.keys()])
        #fmt:off
        query = f"UPDATE {table_name} SET {set_clause} WHERE {id_column_name} = %s;"
        #fmt:on
        cursor.execute(query, (*columns_and_values.values(), id))
        self.connection.commit()
        cursor.close()

    def get_dataframe(self, table_name: str):
        if self.connection:
            cur = self.connection.cursor()
            cur.execute(f"SELECT * FROM {table_name};")
            rows = cur.fetchall()

            # Process data into pandas dataframe
            column_names = [desc[0] for desc in cur.description]
            df = pd.DataFrame(rows, columns=column_names)

            cur.close()
            return df

        return None

    def clear_table(self, table_name: str) -> bool:
        """Clear all records from a table"""
        if self.connection:
            try:
                cur = self.connection.cursor()
                cur.execute(f"DELETE FROM {table_name};")
                self.connection.commit()
                cur.close()
                return True
            except Exception as e:
                logger.error(f"Error clearing table {table_name}: {e}")
                return False
        return False
