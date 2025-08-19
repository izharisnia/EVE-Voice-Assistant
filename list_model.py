import google.generativeai as genai

genai.configure(api_key="AIzaSyC6omLpIq1gifm0oGPuBA7j4tjC--yAH2U")  

def list_available_models():
    try:
        models = genai.list_models()
        for model in models:
            print(f"✅ Model: {model.name} — Supports: {model.supported_generation_methods}")
    except Exception as e:
        print("❌ Error while listing models:", e)

if __name__ == "__main__":
    list_available_models()
