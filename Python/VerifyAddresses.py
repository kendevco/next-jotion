import mysql.connector
from truepeoplesearch import TruePeopleSearch

# Configure database connection (replace with your actual details)
db = mysql.connector.connect(
    host="localhost",
    user="your_username",
    password="your_password",
    database="vicidial_leads"  # Adjust database name if needed
)

# Initialize TruePeopleSearch API client (replace with your API key)
tps_client = TruePeopleSearch("YOUR_API_KEY")

def update_lead_info(lead_id, address):
  """
  Updates lead information in the database with TruePeopleSearch results.

  Args:
      lead_id (int): The ID of the lead in the database.
      address (str): The address to verify.
  """
  try:
    # Call TruePeopleSearch API
    response = tps_client.search(query=address)
    
    # Extract best data if available
    if response["results"]:
      best_result = response["results"][0]
      delivery_line_1 = best_result.get("deliveryLine1")
      # Add other relevant data points you want to capture (e.g., city, state, zip)
    else:
      delivery_line_1 = None  # Address not found

    # Update lead record in database
    cursor = db.cursor()
    sql = """
      UPDATE vicidial_leads
      SET delivery_line_1 = %s
      WHERE lead_id = %s
    """
    cursor.execute(sql, (delivery_line_1, lead_id))
    db.commit()
    print(f"Lead ID {lead_id} - Updated with: {delivery_line_1}")
  except Exception as e:
    print(f"Error updating lead ID {lead_id}: {e}")

def main():
  """
  Main function to iterate through leads and verify addresses.
  """
  try:
    cursor = db.cursor()
    sql = "SELECT lead_id, address FROM vicidial_leads"
    cursor.execute(sql)
    leads = cursor.fetchall()

    for lead_id, address in leads:
      update_lead_info(lead_id, address)

  except Exception as e:
    print(f"Error processing leads: {e}")
  finally:
    db.close()

if __name__ == "__main__":
  main()