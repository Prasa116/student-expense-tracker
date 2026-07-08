import datetime

# Initial sample expenses as requested
expenses = [
    {"date": "2026-07-01", "amount": 150.0, "category": "food", "description": "Canteen lunch"},
    {"date": "2026-07-03", "amount": 350.0, "category": "recharge", "description": "Monthly mobile pack"},
    {"date": "2026-07-05", "amount": 120.0, "category": "travel", "description": "Metro smartcard recharge"},
]

budget = 1000.0  # Default monthly budget

def show_menu():
    print("\n" + "="*45)
    print("      STUDENT BUDGET & EXPENSE TRACKER CLI      ")
    print("="*45)
    print("1. Add an Expense")
    print("2. View All Expenses")
    print("3. View Total Spent & Spending Insights")
    print("4. Set Monthly Budget & Check Warning")
    print("5. Reset Expenses")
    print("6. Exit")
    print("="*45)

def add_expense():
    print("\n--- ADD NEW EXPENSE ---")
    
    # 1. Input Date
    date_str = input("Enter date (YYYY-MM-DD) or press Enter for today: ").strip()
    if not date_str:
        date_str = datetime.date.today().strftime("%Y-%m-%d")
    else:
        try:
            datetime.datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            print("❌ Invalid date format! Using today's date.")
            date_str = datetime.date.today().strftime("%Y-%m-%d")
            
    # 2. Input Amount
    while True:
        try:
            amount_input = input("Enter amount (in Rs./$): ").strip()
            amount = float(amount_input)
            if amount <= 0:
                print("❌ Amount must be positive.")
                continue
            break
        except ValueError:
            print("❌ Invalid amount! Please enter a number.")
            
    # 3. Input Category
    categories = ["food", "travel", "recharge", "other"]
    print("Select Category:")
    for idx, cat in enumerate(categories, 1):
        print(f"  {idx}. {cat.capitalize()}")
    
    cat_choice = input("Enter choice (1-4) or enter custom category name: ").strip()
    if cat_choice.isdigit() and 1 <= int(cat_choice) <= len(categories):
        category = categories[int(cat_choice) - 1]
    elif cat_choice:
        category = cat_choice.lower()
    else:
        category = "other"
        
    # 4. Input Description
    description = input("Enter short description (optional): ").strip()
    if not description:
        description = "Uncategorized"
        
    # Create and add expense
    expense = {
        "date": date_str,
        "amount": amount,
        "category": category,
        "description": description
    }
    expenses.append(expense)
    print(f"\n✅ Expense of {amount:.2f} added successfully under '{category}'!")
    
    # Budget Check Warning
    total = sum(item["amount"] for item in expenses)
    if total > budget:
        print(f"⚠️  WARNING: You have crossed your monthly budget of {budget:.2f}! (Total Spent: {total:.2f})")

def view_expenses():
    print("\n--- VIEW ALL EXPENSES ---")
    if not expenses:
        print("No expenses added yet.")
        return
        
    print(f"{'No.':<4} | {'Date':<10} | {'Category':<12} | {'Amount':<8} | {'Description'}")
    print("-" * 65)
    for idx, item in enumerate(expenses, 1):
        print(f"{idx:<4} | {item['date']:<10} | {item['category']:<12} | {item['amount']:<8.2f} | {item['description']}")
    print("-" * 65)

def view_insights():
    print("\n--- SPENDING INSIGHTS ---")
    total_spent = sum(item["amount"] for item in expenses)
    print(f"💰 Total Amount Spent: {total_spent:.2f}")
    print(f"📋 Monthly Budget: {budget:.2f}")
    
    if budget > 0:
        percent = (total_spent / budget) * 100
        print(f"📊 Budget Utilization: {percent:.1f}%")
        if total_spent > budget:
            print(f"⚠️  Over budget by: {total_spent - budget:.2f}!")
        else:
            print(f"✅ Budget remaining: {budget - total_spent:.2f}")
    
    if not expenses:
        print("No insights available. Add expenses first!")
        return
        
    # Highest spending category
    cat_totals = {}
    for item in expenses:
        cat = item["category"]
        cat_totals[cat] = cat_totals.get(cat, 0) + item["amount"]
        
    print("\nCategory Breakdown:")
    for cat, amt in cat_totals.items():
        print(f"  • {cat.capitalize()}: {amt:.2f}")
        
    highest_cat = max(cat_totals, key=cat_totals.get)
    print(f"\n🔥 Highest Spending Category: '{highest_cat.capitalize()}' with {cat_totals[highest_cat]:.2f} spent.")

def set_budget():
    global budget
    print("\n--- SET BUDGET ---")
    print(f"Current Budget: {budget:.2f}")
    while True:
        try:
            new_budget = float(input("Enter new monthly budget amount: "))
            if new_budget < 0:
                print("❌ Budget cannot be negative.")
                continue
            budget = new_budget
            print(f"✅ Monthly budget updated to {budget:.2f}!")
            break
        except ValueError:
            print("❌ Invalid budget! Please enter a number.")

def reset_expenses():
    global expenses
    confirm = input("Are you sure you want to delete all expenses? (y/n): ").strip().lower()
    if confirm == 'y':
        expenses = []
        print("✅ All expenses have been cleared.")
    else:
        print("Operation cancelled.")

def main():
    while True:
        show_menu()
        choice = input("Enter your choice (1-6): ").strip()
        if choice == "1":
            add_expense()
        elif choice == "2":
            view_expenses()
        elif choice == "3":
            view_insights()
        elif choice == "4":
            set_budget()
        elif choice == "5":
            reset_expenses()
        elif choice == "6":
            print("\n👋 Thank you for using Student Expense Tracker! Goodbye.")
            break
        else:
            print("❌ Invalid choice. Please select from 1-6.")

if __name__ == "__main__":
    main()
