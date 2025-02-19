import json
import boto3
import sys
#sys.path.append("opt/python")
from bs4 import BeautifulSoup
s3_client = boto3.client("s3")
def lambda_handler(event, context):
   # Extract bucket name and object key from the event
   bucket_name = "s3emailstoragebucket"
   object_key = "connect/ccaa-aws-connect-sandbox/EmailMessages/2025/02/17/5620c63a-3d90-4914-95d1-6422def08d90_909ec44c-e53e-46d2-b432-610b700ded22_20250217T13:20_UTC.json"
   # Retrieve the email JSON from S3
   response = s3_client.get_object(Bucket=bucket_name, Key=object_key)   
   email_data = json.loads(response["Body"].read().decode("utf-8"))   
   # Extract email body
   print("Response ",email_data)
   email_body = email_data.get("messageContent", "No email body found")  # Adjust key as needed
   # Convert HTML to plain text
   plain_text = BeautifulSoup(email_body, "html.parser").get_text(separator="\n")
   return {"email_body": plain_text}