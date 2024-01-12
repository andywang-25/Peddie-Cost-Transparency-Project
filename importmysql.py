#This imports winter textbooks into the mysql database 
#THIS IS ALREADY IN THE DATABASE, DO NOT RUN AGAIN OR THE TABLE WILL DOUBLE

#table name is 'test textbooks' inside the park project database
#athletics information is in 'winter athletics cost'
#need to change to host on Peddie server, right now it's on my computer

import gspread
from oauth2client.service_account import ServiceAccountCredentials
import mysql.connector

# Function to authenticate and open a Google Sheets document
def authenticate_and_open_sheet(creds_path, sheet_url):
    scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
    credentials = ServiceAccountCredentials.from_json_keyfile_name(creds_path, scope)
    gc = gspread.authorize(credentials)
    
    sheet = gc.open_by_url(sheet_url)
    return sheet

#database configuration (this just logs into the database, you'll need this to access the table)
db_config = {
    'user': 'root',
    'password': 'Peddie!305',
    'host': '127.0.0.1',
    'database': 'Park Project',
}

# path to Google Sheets API credentials
credentials_path = "/credentials.json"

# Replace this with the Google Sheets URL
google_sheets_url = 'https://docs.google.com/spreadsheets/d/1AnwH-vTcBINZMuSID2ihle-LqfYzkdSK5gKzWecJ25k/edit?usp=sharing'

connection = None  # Initialize connection variable

try:
    # Authenticate and open the Google Sheets document
    sheet = authenticate_and_open_sheet(credentials_path, google_sheets_url)

    # Get the values from the first worksheet
    worksheet = sheet.get_worksheet(0)
    values = worksheet.get_all_values()[2:]

    print("Values from Google Sheet:", values)

    # Connect to MySQL database
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    # Check if values is not empty and has at least one row
    if values and len(values) > 0:
        # Extract column names from the first row of the Google Sheets data
        columns = values[0]

        print("Columns:", columns)

        # Create a table if it doesn't exist
        create_table_query = f"CREATE TABLE IF NOT EXISTS textbooks ({', '.join(f'`{col}` VARCHAR(255)' for col in columns)})"
        cursor.execute(create_table_query)

        # Insert data into the MySQL table without specifying column names
        insert_query = f"INSERT INTO textbooks VALUES ({', '.join(['%s']*len(columns))})"
        cursor.executemany(insert_query, values)
        # Commit the changes
        connection.commit()

        print("Data imported successfully into MySQL.")
    else:
        print("No data to process.")

except PermissionError as pe:
    print(f"PermissionError: {pe}")
except Exception as e:
    print(f"Error: {e}")

finally:
    # Close the database connection
    if connection and connection.is_connected():
        cursor.close()
        connection.close()