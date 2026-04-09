import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load the .env file to get your key
load_dotenv()

# Configure the API key
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY not found in .env file.")
        exit()
        
    genai.configure(api_key=api_key)
except Exception as e:
    print(f"Error configuring Gemini: {e}")
    exit()

# --- Main logic ---
print("Attempting to list available models for your API key...")
print("-" * 30)

try:
    for model in genai.list_models():
        # We only care about models that can generate content
        if 'generateContent' in model.supported_generation_methods:
            print(f"Model name: {model.name}")
            print(f"  Description: {model.description}")
            print(f"  Input Tokens: {model.input_token_limit}")
            print(f"  Output Tokens: {model.output_token_limit}")
            print("-" * 30)
            
    print("\nSUCCESS: Model list retrieved.")

except Exception as e:
    print(f"\n--- FAILED ---")
    print(f"An error occurred while trying to list models: {e}")
    print("This might be an API key issue or a regional access problem.")