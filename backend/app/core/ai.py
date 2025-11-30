import google.generativeai as genai
import os
import json
from datetime import datetime

# You should move this to .env later
GOOGLE_API_KEY = "AIzaSyCIDsNIkZmSm4TrYvGTcaT8j0bx8bo-eTU" 

genai.configure(api_key=GOOGLE_API_KEY)
# Using gemini-1.5-flash as it is the current standard for Flash
model = genai.GenerativeModel('gemini-flash-latest')

def parse_natural_language_task(text: str):
    print(f"AI Processing: {text}")
    current_time = datetime.now().isoformat()
    prompt = f"""
    I am a Todo app task parser.
    Current time: {current_time}
    
    User input: "{text}"
    
    You must extract the following strictly in JSON format. Do not output any markdown formatting like ```json ... ```. Just the raw JSON string.
    
    Fields:
    - title: The main task description (string)
    - priority: One of ["high", "medium", "low"] (string).
        - "high": Urgent words like 'ASAP', 'urgent', 'immediately', 'today', 'critical', 'important'.
        - "low": Words like 'eventually', 'whenever', 'low priority', 'maybe', 'later'.
        - "medium": Default if no urgency is specified.
    - due_date: ISO 8601 format datetime string (e.g. "2023-12-25T18:00:00") or null.
    
    Response format:
    {{
        "title": "Task title",
        "priority": "medium",
        "due_date": null
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        print(f"AI Raw Response: {response.text}")
        
        # Robust cleanup
        cleaned_text = response.text.strip()
        if cleaned_text.startswith("```json"):
            cleaned_text = cleaned_text[7:]
        if cleaned_text.startswith("```"):
            cleaned_text = cleaned_text[3:]
        if cleaned_text.endswith("```"):
            cleaned_text = cleaned_text[:-3]
        cleaned_text = cleaned_text.strip()
            
        data = json.loads(cleaned_text)
        
        # Ensure priority is lowercase
        if "priority" in data and isinstance(data["priority"], str):
            data["priority"] = data["priority"].lower()
            
        return data
    except Exception as e:
        print(f"AI Error parsing task: {e}")
        # Fallback if AI fails
        return {"title": text, "priority": "medium", "due_date": None}

def generate_subtasks(task_title: str):
    prompt = f"""
    Break down this task into 3-5 actionable sub-tasks: "{task_title}"
    Return ONLY a JSON array of strings. Example: ["Book venue", "Call caterer"]
    """
    try:
        response = model.generate_content(prompt)
        print(f"AI Subtasks Response: {response.text}")
        cleaned_text = response.text.replace('```json', '').replace('```', '')
        return json.loads(cleaned_text)
    except Exception as e:
        print(f"AI Error generating subtasks: {e}")
        return []
