try:
    from .api_keys import *
except ImportError:
    print("Warning: api_keys.py not found. Please copy api_keys_template.py to api_keys.py and add your API keys.")
    import os
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'YOUR_API_KEY_HERE')