import pyodbc
import pandas as pd

# Connection to the database
server = "oopservername.database.windows.net"
database = "OOP_PROJECT_DB"
username = "sqladmin"
password = "tarek055@"

connection_string = f"DRIVER={{SQL Server}};SERVER={server};DATABASE={database};UID={username};PWD={password}"

try:
    connection = pyodbc.connect(
        connection_string, timeout=5
    )  # Set a timeout value (in seconds)
    cursor = connection.cursor()

    def fetch_and_print_data(table_name):
        cursor.execute(f"SELECT * FROM {table_name};")
        rows = cursor.fetchall()

        # Convert rows to a DataFrame without specifying columns
        df = pd.DataFrame(rows)

        # Print the DataFrame
        print(f"\nData from {table_name}:")
        print(df)

    # Example usage
    fetch_and_print_data("Users")
    fetch_and_print_data("Answers")
    fetch_and_print_data("Questions")
    fetch_and_print_data("FriendshipRequests")

except pyodbc.Error as ex:
    sqlstate = ex.args[1]
    print(f"Error connecting to the database. SQL State: {sqlstate}")
finally:
    # Close the database connection
    if connection:
        connection.close()
