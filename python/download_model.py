from sentence_transformers import SentenceTransformer

# Specify the model name and local directory
model_name = "all-MiniLM-L6-v2"
save_path = "./models"  # Directory to save the model

# Download and save the model
model = SentenceTransformer(model_name, cache_folder=save_path)
print(f"Model '{model_name}' downloaded and saved to '{save_path}'")
