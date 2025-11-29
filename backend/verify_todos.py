import requests
import sys

BASE_URL = "http://127.0.0.1:8000"
EMAIL = "todo_test@example.com"
PASSWORD = "password123"

def run_verification():
    # 1. Signup
    print("1. Signing up...")
    resp = requests.post(f"{BASE_URL}/auth/signup", json={
        "email": EMAIL,
        "password": PASSWORD,
        "full_name": "Todo Tester"
    })
    if resp.status_code == 400 and "already registered" in resp.text:
        print("   User already exists, proceeding to login.")
    elif resp.status_code != 200:
        print(f"   Signup failed: {resp.text}")
        sys.exit(1)
    else:
        print("   Signup successful.")

    # 2. Login
    print("2. Logging in...")
    resp = requests.post(f"{BASE_URL}/auth/login", json={
        "email": EMAIL,
        "password": PASSWORD
    })
    if resp.status_code != 200:
        print(f"   Login failed: {resp.text}")
        sys.exit(1)
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("   Login successful, token received.")

    # 3. Create Todo
    print("3. Creating Todo...")
    resp = requests.post(f"{BASE_URL}/todos/", headers=headers, json={
        "title": "Test Todo",
        "completed": False
    })
    if resp.status_code != 200:
        print(f"   Create failed: {resp.text}")
        sys.exit(1)
    todo = resp.json()
    todo_id = todo["id"]
    print(f"   Todo created: {todo}")

    # 4. List Todos
    print("4. Listing Todos...")
    resp = requests.get(f"{BASE_URL}/todos/", headers=headers)
    if resp.status_code != 200:
        print(f"   List failed: {resp.text}")
        sys.exit(1)
    todos = resp.json()
    print(f"   Todos found: {len(todos)}")
    if not any(t["id"] == todo_id for t in todos):
        print("   Created todo not found in list!")
        sys.exit(1)

    # 5. Update Todo
    print("5. Updating Todo...")
    resp = requests.put(f"{BASE_URL}/todos/{todo_id}", headers=headers, json={
        "title": "Updated Todo",
        "completed": True
    })
    if resp.status_code != 200:
        print(f"   Update failed: {resp.text}")
        sys.exit(1)
    updated_todo = resp.json()
    print(f"   Todo updated: {updated_todo}")
    if updated_todo["title"] != "Updated Todo" or not updated_todo["completed"]:
        print("   Update verification failed!")
        sys.exit(1)

    # 6. Delete Todo
    print("6. Deleting Todo...")
    resp = requests.delete(f"{BASE_URL}/todos/{todo_id}", headers=headers)
    if resp.status_code != 200:
        print(f"   Delete failed: {resp.text}")
        sys.exit(1)
    print("   Todo deleted.")

    # 7. Verify Deletion
    print("7. Verifying Deletion...")
    resp = requests.get(f"{BASE_URL}/todos/", headers=headers)
    todos = resp.json()
    if any(t["id"] == todo_id for t in todos):
        print("   Todo still exists after deletion!")
        sys.exit(1)
    print("   Deletion verified.")

    print("\nALL TESTS PASSED!")

if __name__ == "__main__":
    run_verification()
