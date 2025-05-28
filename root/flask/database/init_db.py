from typing import List


class DatabaseInitializer:
    @staticmethod
    def get_init_commands() -> List[str]:
        return [
            """
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            );
            """
        ]

    def initialize_database(self, connection):
        try:
            cur = connection.cursor()
            for command in self.get_init_commands():
                cur.execute(command)
            connection.commit()
            cur.close()
            return True
        except Exception as e:
            print(f"Error initializing database: {e}")
            connection.rollback()
            return False
