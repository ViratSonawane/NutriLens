import gradio as gr
import cv2
import numpy as np
import json
from PIL import Image
from ultralytics import YOLO

# Load model and nutrition database
model = YOLO('best.pt')

with open('nutrition_db.json', 'r') as f:
    nutrition_db = json.load(f)

def predict_food(image):
    """
    Takes an image (PIL), runs YOLO detection,
    returns JSON for API and annotated image for UI
    """
    # Convert PIL image to numpy
    img = np.array(image)
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

    # Run model
    results = model(img)

    total_nutrition = {
        "calories": 0,
        "protein": 0,
        "carbs": 0,
        "fats": 0
    }

    detected_foods_summary = []

    for r in results:
        food_counts = {}
        for box in r.boxes:
            class_id = int(box.cls[0])
            food_name = model.names[class_id]
            food_counts[food_name] = food_counts.get(food_name, 0) + 1

        for food_name, count in food_counts.items():
            if food_name in nutrition_db:
                food_data = nutrition_db[food_name]

                cal_per_100g = food_data["calories_per_100g"]
                prot_per_100g = food_data["protein_per_100g"]
                carbs_per_100g = food_data["carbs_per_100g"]
                fats_per_100g = food_data["fats_per_100g"]

                total_grams = food_data["standard_serving_grams"] * count

                total_nutrition["calories"] += (cal_per_100g / 100) * total_grams
                total_nutrition["protein"] += (prot_per_100g / 100) * total_grams
                total_nutrition["carbs"] += (carbs_per_100g / 100) * total_grams
                total_nutrition["fats"] += (fats_per_100g / 100) * total_grams

                detected_foods_summary.append(f"{count}x {food_name}")

    # Annotated image
    annotated_image = results[0].plot()
    annotated_image = cv2.cvtColor(annotated_image, cv2.COLOR_BGR2RGB)
    pil_annotated = Image.fromarray(annotated_image)

    # JSON for API
    json_output = {
        "detections": detected_foods_summary,
        "total_nutrition": total_nutrition,
    }

    return pil_annotated, json_output

demo = gr.Interface(
    fn=predict_food,
    inputs=gr.Image(type="pil", label="Upload Food Image"),
    outputs=[
        gr.Image(type="pil", label="Detected Foods"),
        gr.JSON(label="Nutrition Info"),
    ],
    title="🍽️ NutriLens - Food Detection & Nutrition Analysis",
    description="Upload a food image and get nutrition info.",
    allow_flagging="never",
    api_name="predict"  # ✅ THIS CREATES /api/predict
)

if __name__ == "__main__":
    demo.launch()
