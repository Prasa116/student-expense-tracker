import React, { useState, useEffect, useRef } from "react";
import { 
  Terminal as TerminalIcon, 
  Plus, 
  Play, 
  Check, 
  Download, 
  AlertTriangle, 
  TrendingUp, 
  Wallet, 
  RotateCcw, 
  FileCode, 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Expense {
  date: string;
  amount: number;
  category: string;
  description: string;
}

interface TerminalLine {
  text: string;
  type: "output" | "input" | "error" | "success" | "warn" | "header";
}

const INITIAL_EXPENSES: Expense[] = [
  { date: "2026-07-01", amount: 1200.0, category: "food", description: "College Canteen" },
  { date: "2026-07-02", amount: 450.0, category: "travel", description: "Auto Rickshaw" },
  { date: "2026-07-03", amount: 299.0, category: "recharge", description: "Mobile Plan" },
];

const PYTHON_CODE_STRING = `import datetime

# Initial sample expenses as requested
expenses = [
    {"date": "2026-07-01", "amount": 1200.0, "category": "food", "description": "College Canteen"},
    {"date": "2026-07-02", "amount": 450.0, "category": "travel", "description": "Auto Rickshaw"},
    {"date": "2026-07-03", "amount": 299.0, "category": "recharge", "description": "Mobile Plan"},
]

budget = 2500.0  # Default monthly budget

def show_menu():
    print("\\n" + "="*45)
    print("      CAMPUS LEDGER: STUDENT EXPENSE CLI      ")
    print("="*45)
    print("1. Add an Expense")
    print("2. View All Expenses")
    print("3. View Total Spent & Spending Insights")
    print("4. Set Monthly Budget & Check Warning")
    print("5. Reset Expenses")
    print("6. Exit")
    print("="*45)

def add_expense():
    print("\\n--- ADD NEW EXPENSE ---")
    
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
    print(f"\\n✅ Expense of {amount:.2f} added successfully under '{category}'!")
    
    # Budget Check Warning
    total = sum(item["amount"] for item in expenses)
    if total > budget:
        print(f"⚠️  WARNING: You have crossed your monthly budget of {budget:.2f}! (Total Spent: {total:.2f})")

def view_expenses():
    print("\\n--- VIEW ALL EXPENSES ---")
    if not expenses:
        print("No expenses added yet.")
        return
        
    print(f"{'No.':<4} | {'Date':<10} | {'Category':<12} | {'Amount':<8} | {'Description'}")
    print("-" * 65)
    for idx, item in enumerate(expenses, 1):
        print(f"{idx:<4} | {item['date']:<10} | {item['category']:<12} | {item['amount']:<8.2f} | {item['description']}")
    print("-" * 65)

def view_insights():
    print("\\n--- SPENDING INSIGHTS ---")
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
        
    print("\\nCategory Breakdown:")
    for cat, amt in cat_totals.items():
        print(f"  • {cat.capitalize()}: {amt:.2f}")
        
    highest_cat = max(cat_totals, key=cat_totals.get)
    print(f"\\n🔥 Highest Spending Category: '{highest_cat.capitalize()}' with {cat_totals[highest_cat]:.2f} spent.")

def set_budget():
    global budget
    print("\\n--- SET BUDGET ---")
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
            print("\\n👋 Thank you for using Student Expense Tracker! Goodbye.")
            break
        else:
            print("❌ Invalid choice. Please select from 1-6.")

if __name__ == "__main__":
    main()`;

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem("campus_ledger_expenses");
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });
  const [budget, setBudget] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("campus_ledger_budget");
      return saved ? parseFloat(saved) : 2500.0;
    } catch {
      return 2500.0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("campus_ledger_expenses", JSON.stringify(expenses));
    } catch (e) {
      console.error("Failed to save expenses to localStorage:", e);
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem("campus_ledger_budget", budget.toString());
    } catch (e) {
      console.error("Failed to save budget to localStorage:", e);
    }
  }, [budget]);

  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [currentStep, setCurrentStep] = useState<
    "MENU" | "ADD_DATE" | "ADD_AMOUNT" | "ADD_CATEGORY" | "ADD_DESC" | "SET_BUDGET" | "RESET_CONFIRM" | "EXITED"
  >("MENU");
  const [tempExpense, setTempExpense] = useState<Partial<Expense>>({});
  const [inputValue, setInputValue] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [isMacroRunning, setIsMacroRunning] = useState<boolean>(false);
  const [isCodeExpanded, setIsCodeExpanded] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(true);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getStepDirections = () => {
    switch (currentStep) {
      case "MENU":
        return {
          step: "Step 1: Start an action",
          text: "Select an option from the menu (type a number from 1 to 6 and press Enter).",
          hint: "Tip: Type '1' and press Enter to log a new expense."
        };
      case "ADD_DATE":
        return {
          step: "Step 2: Enter Expense Date",
          text: "Type a date in YYYY-MM-DD format, or simply press Enter (or click input area) to accept today's date.",
          hint: "Press Enter to fast-forward."
        };
      case "ADD_AMOUNT":
        return {
          step: "Step 3: Enter Amount",
          text: "Type the cost/amount for this expense (e.g. 150) and press Enter.",
          hint: "Must be a positive number."
        };
      case "ADD_CATEGORY":
        return {
          step: "Step 4: Choose Category",
          text: "Type 1 for Food, 2 for Travel, 3 for Recharge, 4 for Other, or enter a custom category name.",
          hint: "Then press Enter."
        };
      case "ADD_DESC":
        return {
          step: "Step 5: Description",
          text: "Type a short description of what you bought, or press Enter to skip.",
          hint: "Then press Enter to save."
        };
      case "SET_BUDGET":
        return {
          step: "Adjusting Budget Limit",
          text: "Type your new monthly budget threshold and press Enter.",
          hint: "We will warn you if total expenses exceed this limit."
        };
      case "RESET_CONFIRM":
        return {
          step: "Reset Confirmation",
          text: "Type 'y' to delete all logs and start clean, or 'n' to cancel.",
          hint: "Press Enter to submit."
        };
      case "EXITED":
        return {
          step: "App Exited",
          text: "The program has exited. Press Enter or click the Reset State button to restart the simulator.",
          hint: "Let's restart to try again."
        };
    }
  };

  // Print initial python shell prompt
  useEffect(() => {
    const initialLines: TerminalLine[] = [
      { text: "Python 3.11.2 (main, Jul 08 2026, 00:08:00) [GCC 12.2.0] on linux", type: "header" },
      { text: 'Type "help", "copyright", "credits" or "license" for more information.', type: "output" },
      { text: "$ python3 ledger.py", type: "input" },
    ];
    
    const menuLines: TerminalLine[] = [
      { text: "=============================================", type: "header" },
      { text: "      CAMPUS LEDGER: STUDENT EXPENSE CLI      ", type: "header" },
      { text: "=============================================", type: "header" },
      { text: "1. Add an Expense", type: "output" },
      { text: "2. View All Expenses", type: "output" },
      { text: "3. View Total Spent & Spending Insights", type: "output" },
      { text: "4. Set Monthly Budget & Check Warning", type: "output" },
      { text: "5. Reset Expenses", type: "output" },
      { text: "6. Exit", type: "output" },
      { text: "=============================================", type: "header" },
    ];

    setTerminalLines([...initialLines, ...menuLines]);
    focusTerminal();
  }, []);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLines]);

  const focusTerminal = () => {
    if (!isMacroRunning) {
      inputRef.current?.focus();
    }
  };

  const appendLines = (lines: { text: string; type: TerminalLine["type"] }[]) => {
    setTerminalLines(prev => [...prev, ...lines]);
  };

  const printMenu = () => {
    appendLines([
      { text: "=============================================", type: "header" },
      { text: "      CAMPUS LEDGER: STUDENT EXPENSE CLI      ", type: "header" },
      { text: "=============================================", type: "header" },
      { text: "1. Add an Expense", type: "output" },
      { text: "2. View All Expenses", type: "output" },
      { text: "3. View Total Spent & Spending Insights", type: "output" },
      { text: "4. Set Monthly Budget & Check Warning", type: "output" },
      { text: "5. Reset Expenses", type: "output" },
      { text: "6. Exit", type: "output" },
      { text: "=============================================", type: "header" },
    ]);
  };

  const printExpenses = (expList: Expense[]) => {
    const lines: TerminalLine[] = [];
    lines.push({ text: "\n--- VIEW ALL EXPENSES ---", type: "header" });
    if (expList.length === 0) {
      lines.push({ text: "No expenses added yet.", type: "output" });
      appendLines(lines);
      return;
    }

    lines.push({ text: "No.  | Date       | Category     | Amount   | Description", type: "header" });
    lines.push({ text: "-----------------------------------------------------------------", type: "header" });
    
    expList.forEach((item, idx) => {
      const noStr = (idx + 1).toString().padEnd(4);
      const dateStr = item.date.padEnd(10);
      const catStr = item.category.toUpperCase().substring(0, 12).padEnd(12);
      const amtStr = item.amount.toFixed(2).padEnd(8);
      const descStr = item.description;
      lines.push({ text: `${noStr} | ${dateStr} | ${catStr} | ₹ ${amtStr} | {${descStr}}`, type: "output" });
    });
    lines.push({ text: "-----------------------------------------------------------------", type: "header" });
    appendLines(lines);
  };

  const printInsights = (expList: Expense[], currentBudget: number) => {
    const lines: TerminalLine[] = [];
    lines.push({ text: "\n--- SPENDING INSIGHTS ---", type: "header" });
    const totalSpent = expList.reduce((sum, item) => sum + item.amount, 0);
    lines.push({ text: `💰 Total Amount Spent: ₹ ${totalSpent.toFixed(2)}`, type: "success" });
    lines.push({ text: `📋 Monthly Budget: ₹ ${currentBudget.toFixed(2)}`, type: "output" });

    if (currentBudget > 0) {
      const percent = (totalSpent / currentBudget) * 100;
      lines.push({ text: `📊 Budget Utilization: ${percent.toFixed(1)}%`, type: totalSpent > currentBudget ? "warn" : "output" });
      if (totalSpent > currentBudget) {
        lines.push({ text: `⚠️  Over budget by: ₹ ${(totalSpent - currentBudget).toFixed(2)}!`, type: "error" });
      } else {
        lines.push({ text: `✅ Budget remaining: ₹ ${(currentBudget - totalSpent).toFixed(2)}`, type: "success" });
      }
    }

    if (expList.length === 0) {
      lines.push({ text: "No insights available. Add expenses first!", type: "warn" });
      appendLines(lines);
      return;
    }

    // Category breakdown
    const catTotals: { [key: string]: number } = {};
    expList.forEach(item => {
      const cat = item.category.toLowerCase();
      catTotals[cat] = (catTotals[cat] || 0) + item.amount;
    });

    lines.push({ text: "\nCategory Breakdown:", type: "header" });
    Object.entries(catTotals).forEach(([cat, amt]) => {
      lines.push({ text: `  • ${cat.toUpperCase()}: ₹ ${amt.toFixed(2)}`, type: "output" });
    });

    // Highest spending category
    let highestCat = "";
    let maxAmt = -1;
    Object.entries(catTotals).forEach(([cat, amt]) => {
      if (amt > maxAmt) {
        maxAmt = amt;
        highestCat = cat;
      }
    });

    lines.push({ text: `\n🔥 Highest Spending Category: '${highestCat.toUpperCase()}' with ₹ ${maxAmt.toFixed(2)} spent.`, type: "success" });
    appendLines(lines);
  };

  const handleTerminalInput = (text: string) => {
    const trimmed = text.trim();
    const newHistoryLine: TerminalLine = { text: `${getPromptLabel()}${text}`, type: "input" };
    setTerminalLines(prev => [...prev, newHistoryLine]);

    switch (currentStep) {
      case "MENU":
        if (trimmed === "1") {
          setTempExpense({});
          setCurrentStep("ADD_DATE");
          appendLines([
            { text: "\n--- ADD NEW EXPENSE ---", type: "header" },
            { text: "Enter date (YYYY-MM-DD) or press Enter for today: ", type: "output" }
          ]);
        } else if (trimmed === "2") {
          printExpenses(expenses);
          printMenu();
        } else if (trimmed === "3") {
          printInsights(expenses, budget);
          printMenu();
        } else if (trimmed === "4") {
          setCurrentStep("SET_BUDGET");
          appendLines([
            { text: "\n--- SET BUDGET ---", type: "header" },
            { text: `Current Budget: ₹ ${budget.toFixed(2)}`, type: "output" },
            { text: "Enter new monthly budget amount: ", type: "output" }
          ]);
        } else if (trimmed === "5") {
          setCurrentStep("RESET_CONFIRM");
          appendLines([
            { text: "Are you sure you want to delete all expenses? (y/n): ", type: "output" }
          ]);
        } else if (trimmed === "6") {
          setCurrentStep("EXITED");
          appendLines([
            { text: "\n👋 Thank you for using Campus Ledger! Goodbye.", type: "success" },
            { text: "[Program finished. Press Enter or click Reset to restart simulator]", type: "header" }
          ]);
        } else {
          appendLines([
            { text: "❌ Invalid choice. Please select from 1-6.", type: "error" }
          ]);
          printMenu();
        }
        break;

      case "ADD_DATE":
        let selectedDate = trimmed;
        if (!selectedDate) {
          selectedDate = "2026-07-08";
          appendLines([{ text: `Using today's date: ${selectedDate}`, type: "output" }]);
        } else {
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(selectedDate)) {
            selectedDate = "2026-07-08";
            appendLines([{ text: "❌ Invalid date format! Using today's date: 2026-07-08", type: "error" }]);
          }
        }
        setTempExpense(prev => ({ ...prev, date: selectedDate }));
        setCurrentStep("ADD_AMOUNT");
        appendLines([{ text: "Enter amount (in Rs./$): ", type: "output" }]);
        break;

      case "ADD_AMOUNT":
        const amt = parseFloat(trimmed);
        if (isNaN(amt) || amt <= 0) {
          appendLines([
            { text: isNaN(amt) ? "❌ Invalid amount! Please enter a number." : "❌ Amount must be positive.", type: "error" },
            { text: "Enter amount (in Rs./$): ", type: "output" }
          ]);
        } else {
          setTempExpense(prev => ({ ...prev, amount: amt }));
          setCurrentStep("ADD_CATEGORY");
          appendLines([
            { text: "Select Category:", type: "header" },
            { text: "  1. Food", type: "output" },
            { text: "  2. Travel", type: "output" },
            { text: "  3. Recharge", type: "output" },
            { text: "  4. Other", type: "output" },
            { text: "Enter choice (1-4) or enter custom category name: ", type: "output" }
          ]);
        }
        break;

      case "ADD_CATEGORY":
        let cat = trimmed.toLowerCase();
        if (cat === "1") cat = "food";
        else if (cat === "2") cat = "travel";
        else if (cat === "3") cat = "recharge";
        else if (cat === "4") cat = "other";
        else if (!cat) cat = "other";

        setTempExpense(prev => ({ ...prev, category: cat }));
        setCurrentStep("ADD_DESC");
        appendLines([{ text: "Enter short description (optional): ", type: "output" }]);
        break;

      case "ADD_DESC":
        const desc = trimmed ? trimmed : "Uncategorized";
        const newExp: Expense = {
          date: tempExpense.date || "2026-07-08",
          amount: tempExpense.amount || 0,
          category: tempExpense.category || "other",
          description: desc,
        };

        const updated = [...expenses, newExp];
        setExpenses(updated);

        const currentTotal = updated.reduce((sum, item) => sum + item.amount, 0);
        const addedLines: TerminalLine[] = [
          { text: `\n✅ Expense of ₹ ${newExp.amount.toFixed(2)} added successfully under '${newExp.category}'!`, type: "success" }
        ];

        if (currentTotal > budget) {
          addedLines.push({
            text: `⚠️  WARNING: You have crossed your monthly budget of ₹ ${budget.toFixed(2)}! (Total Spent: ₹ ${currentTotal.toFixed(2)})`,
            type: "warn"
          });
        }

        setTempExpense({});
        setCurrentStep("MENU");
        setTerminalLines(prev => [...prev, ...addedLines]);
        printMenu();
        break;

      case "SET_BUDGET":
        const newBud = parseFloat(trimmed);
        if (isNaN(newBud) || newBud < 0) {
          appendLines([
            { text: "❌ Invalid budget! Please enter a number.", type: "error" },
            { text: "Enter new monthly budget amount: ", type: "output" }
          ]);
        } else {
          setBudget(newBud);
          appendLines([
            { text: `✅ Monthly budget updated to ₹ ${newBud.toFixed(2)}!`, type: "success" }
          ]);
          setCurrentStep("MENU");
          printMenu();
        }
        break;

      case "RESET_CONFIRM":
        if (trimmed.toLowerCase().startsWith("y")) {
          setExpenses([]);
          appendLines([{ text: "✅ All expenses have been cleared.", type: "success" }]);
        } else {
          appendLines([{ text: "Operation cancelled.", type: "output" }]);
        }
        setCurrentStep("MENU");
        printMenu();
        break;

      case "EXITED":
        // Reset state & terminal
        setExpenses(INITIAL_EXPENSES);
        setBudget(2500.0);
        setTempExpense({});
        setCurrentStep("MENU");
        const freshLines: TerminalLine[] = [
          { text: "Python 3.11.2 (main, Jul 08 2026, 00:08:00) [GCC 12.2.0] on linux", type: "header" },
          { text: 'Type "help", "copyright", "credits" or "license" for more information.', type: "output" },
          { text: "$ python3 ledger.py", type: "input" },
        ];
        setTerminalLines(freshLines);
        setTimeout(() => {
          printMenu();
        }, 10);
        break;
    }
  };

  const getPromptLabel = () => {
    switch (currentStep) {
      case "MENU":
        return "Enter your choice (1-6): ";
      case "ADD_DATE":
        return "Enter date (YYYY-MM-DD) or press Enter for today: ";
      case "ADD_AMOUNT":
        return "Enter amount (in Rs./$): ";
      case "ADD_CATEGORY":
        return "Enter choice (1-4) or enter custom category name: ";
      case "ADD_DESC":
        return "Enter short description (optional): ";
      case "SET_BUDGET":
        return "Enter new monthly budget amount: ";
      case "RESET_CONFIRM":
        return "Are you sure you want to delete all expenses? (y/n): ";
      case "EXITED":
        return "Press [Enter] to restart script: ";
      default:
        return ">>> ";
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMacroRunning) return;
    handleTerminalInput(inputValue);
    setInputValue("");
  };

  // Automated Script Player (Typing macro simulator)
  const playMacro = async (inputs: string[]) => {
    if (isMacroRunning) return;
    setIsMacroRunning(true);
    setInputValue("");

    for (const text of inputs) {
      // Simulate slow typing characters
      let tempText = "";
      for (let i = 0; i < text.length; i++) {
        tempText += text[i];
        setInputValue(tempText);
        await new Promise(resolve => setTimeout(resolve, Math.random() * 25 + 10));
      }
      // Brief pause at the end of typing
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Submit
      handleTerminalInput(text);
      setInputValue("");
      
      // Pause before next step
      await new Promise(resolve => setTimeout(resolve, 350));
    }
    setIsMacroRunning(false);
    focusTerminal();
  };

  const resetAll = () => {
    setExpenses(INITIAL_EXPENSES);
    setBudget(2500.0);
    setTempExpense({});
    setCurrentStep("MENU");
    const initialLines: TerminalLine[] = [
      { text: "Python 3.11.2 (main, Jul 08 2026, 00:08:00) [GCC 12.2.0] on linux", type: "header" },
      { text: 'Type "help", "copyright", "credits" or "license" for more information.', type: "output" },
      { text: "$ python3 ledger.py", type: "input" },
    ];
    setTerminalLines(initialLines);
    setTimeout(() => {
      printMenu();
    }, 50);
    setInputValue("");
    focusTerminal();
  };

  // Math metrics for Dashboard
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const percentSpent = budget > 0 ? (totalSpent / budget) * 100 : 0;
  const isOverBudget = totalSpent > budget;

  // Category summary for graphics
  const categoriesMap: { [key: string]: number } = {
    food: 0,
    travel: 0,
    recharge: 0,
    other: 0
  };
  expenses.forEach(item => {
    const cat = item.category.toLowerCase();
    if (categoriesMap[cat] !== undefined) {
      categoriesMap[cat] += item.amount;
    } else {
      categoriesMap.other = (categoriesMap.other || 0) + item.amount;
    }
  });

  // Calculate highest spending category
  let highestSpendingCategory = "None";
  let maxSpent = 0;
  Object.entries(categoriesMap).forEach(([cat, val]) => {
    if (val > maxSpent) {
      maxSpent = val;
      highestSpendingCategory = cat;
    }
  });

  const getLineStyle = (type: TerminalLine["type"]) => {
    switch (type) {
      case "header": return "text-[#10B981] font-bold";
      case "input": return "text-white/90 italic font-medium";
      case "error": return "text-rose-400 font-medium";
      case "warn": return "text-yellow-500 font-medium";
      case "success": return "text-[#10B981] font-bold";
      default: return "text-white/70";
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(PYTHON_CODE_STRING);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPythonFile = () => {
    const element = document.createElement("a");
    const file = new Blob([PYTHON_CODE_STRING], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "ledger.py";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div id="app-root" className="min-h-screen ambient-animated-bg text-[#E0E0E0] font-sans selection:bg-[#10B981]/20 selection:text-[#10B981] flex flex-col p-6 md:p-10">
      
      {/* Sophisticated Georgia-Style Header Section */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-white/10 pb-6 mb-8 gap-4 shrink-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-light tracking-widest text-white" style={{ fontFamily: "Georgia, serif" }}>
            CAMPUS <span className="text-[#10B981]">LEDGER</span>
          </h1>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/40">
            Zero-Latency Financial Management for the Modern Student
          </p>
        </div>
        <div className="text-left sm:text-right flex sm:flex-col justify-between w-full sm:w-auto items-center sm:items-end gap-2 border-t border-white/5 sm:border-0 pt-3 sm:pt-0">
          <div>
            <p className="text-sm font-mono text-[#10B981]">v2.0.4 // STABLE_BUILD</p>
            <p className="text-[10px] uppercase tracking-tighter text-white/30 italic">Compiled at 14:32:01 IST</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowGuide(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#10B981]/15 hover:bg-[#10B981]/25 border border-[#10B981]/25 text-[10px] uppercase tracking-widest font-mono text-[#10B981] font-bold transition shadow-sm shadow-[#10B981]/10"
            >
              <Info className="h-3 w-3" />
              Directions & Info
            </button>
            <button 
              onClick={resetAll}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] uppercase tracking-widest font-mono text-white/60 hover:text-white transition"
            >
              <RotateCcw className="h-3 w-3" />
              Reset State
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Interactive CLI Mockup (Technical Focus) - col span 7 */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Dynamic Interactive Directions Panel */}
          {(() => {
            const dir = getStepDirections();
            return (
              <div className="bg-[#141418] border border-[#10B981]/30 rounded-lg p-4 relative overflow-hidden shadow-lg flex flex-col gap-1.5 transition">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#10B981]"></div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#10B981] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                    {dir?.step}
                  </span>
                  <button 
                    onClick={() => setShowGuide(true)}
                    className="text-[10px] font-mono text-[#10B981] hover:underline transition font-bold"
                  >
                    Interactive Map 🧭
                  </button>
                </div>
                <p className="text-xs text-white/90 leading-relaxed font-sans">{dir?.text}</p>
                <p className="text-[10px] font-mono text-white/40 italic">{dir?.hint}</p>
              </div>
            );
          })()}

          <div className="flex-grow flex flex-col">
            <div 
              onClick={focusTerminal}
              className="flex-grow bg-black/40 border border-white/10 rounded-lg p-6 font-mono text-sm shadow-2xl relative flex flex-col cursor-text min-h-[440px] lg:min-h-[480px]"
            >
              {/* Decorative Window dots */}
              <div className="absolute top-4 right-5 flex gap-1.5 opacity-40">
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
                <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
              </div>

              {/* Shell output area */}
              <div className="flex-grow overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-white/5 max-h-[380px] lg:max-h-[420px] pt-4">
                {terminalLines.map((line, index) => (
                  <div key={index} className={`${getLineStyle(line.type)} whitespace-pre-wrap leading-relaxed`}>
                    {line.type === "input" && <span className="text-[#10B981] mr-2 font-bold">$</span>}
                    {line.text}
                  </div>
                ))}

                {/* Shell Input Row */}
                <form onSubmit={handleFormSubmit} className="flex items-center pt-1">
                  <span className="text-[#10B981] font-bold mr-2 select-none">$</span>
                  <span className="text-white/40 italic font-mono mr-1.5 select-none text-xs">
                    {getPromptLabel()}
                  </span>
                  <div className="flex-1 relative flex items-center">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      disabled={isMacroRunning}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-text pointer-events-auto"
                      autoFocus
                    />
                    <span className="text-white/90 italic font-mono select-none break-all whitespace-pre-wrap">
                      {inputValue}
                    </span>
                    {/* Pulsing blinking cursor */}
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "steps(2, start)" }}
                      className={`inline-block w-2 h-4.5 ml-1 bg-[#10B981] ${
                        isFocused && !isMacroRunning ? "opacity-100" : "opacity-0"
                      }`}
                    ></motion.span>
                  </div>
                </form>
                <div ref={terminalEndRef} />
              </div>

              {/* Status report embedded box inside the terminal mockup when active */}
              <div className="mt-6 p-4 bg-[#10B981]/5 border border-[#10B981]/15 rounded-md">
                <p className="text-[#10B981] font-bold text-xs uppercase tracking-widest font-mono">Status Quick-Report</p>
                <div className="grid grid-cols-2 mt-3 gap-y-1.5 text-xs font-mono">
                  <span className="text-white/40 uppercase">Total Expenses</span>
                  <span className="text-right text-white/90">₹ {totalSpent.toFixed(2)}</span>
                  <span className="text-white/40 uppercase">Top Category</span>
                  <span className="text-right text-[#10B981] font-semibold uppercase">{highestSpendingCategory}</span>
                  <span className="text-white/40 uppercase">Budget Utilized</span>
                  <span className="text-right text-white/90">{percentSpent.toFixed(1)}%</span>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Script info and controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white/30 font-mono text-[10px] tracking-widest uppercase border-t border-white/5 pt-4">
            <div className="flex flex-wrap items-center gap-3">
              <span>CMD+ENTER TO SUBMIT</span>
              <span className="w-1.5 h-1.5 bg-white/10 rounded-full"></span>
              <span>PYTHON 3.11</span>
              <span className="w-1.5 h-1.5 bg-white/10 rounded-full"></span>
              <span>STANDALONE_STANDARD_LIBRARY</span>
            </div>
          </div>

        </div>

        {/* Right Column: Visual Summary (Sophisticated Focus) - col span 5 */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Metric Card: Total spent with Sophisticated Georgia style */}
          <div className="bg-[#141418] p-8 border border-white/5 rounded-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#10B981]"></div>
            <p className="text-[10px] tracking-[0.4em] text-[#10B981] mb-2 uppercase font-semibold">Monthly Velocity</p>
            <h2 className="text-6xl font-light text-white tracking-tighter" style={{ fontFamily: "Georgia, serif" }}>
              ₹ {totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </h2>
            <p className="text-xs text-white/40 mt-4 font-mono">
              Calculated across {expenses.length} transaction records
            </p>
          </div>

          {/* Metric Card: Budget */}
          <div className="bg-[#141418] p-6 border border-white/5 rounded-sm flex justify-between items-center">
            <div>
              <p className="text-[10px] tracking-[0.3em] text-white/40 mb-1 uppercase font-semibold">Allocated Cap</p>
              <p className="text-2xl font-light text-white font-serif">₹ {budget.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] tracking-[0.3em] text-white/40 mb-1 uppercase font-semibold">Utilization</p>
              <p className={`text-2xl font-mono ${isOverBudget ? "text-rose-400" : "text-[#10B981]"}`}>
                {percentSpent.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Category Distribution Matrix */}
          <div className="bg-[#141418] p-8 border border-white/5 rounded-sm flex flex-col flex-grow">
            <p className="text-[10px] tracking-[0.4em] text-white/40 mb-8 uppercase font-semibold">Distribution Matrix</p>
            
            <div className="space-y-6 flex-grow">
              {Object.entries(categoriesMap).map(([category, amt]) => {
                const percent = totalSpent > 0 ? (amt / totalSpent) * 100 : 0;
                return (
                  <div key={category} className="group">
                    <div className="flex justify-between text-xs mb-2 font-mono">
                      <span className="uppercase tracking-widest text-white/80 group-hover:text-white transition">
                        {category}
                      </span>
                      <span className="text-white/60">
                        ₹ {amt.toFixed(2)} <span className="text-white/30 text-[10px]">({percent.toFixed(0)}%)</span>
                      </span>
                    </div>
                    {/* Sophisticated ultra-thin 1px high divider-bar indicator */}
                    <div className="h-[1px] w-full bg-white/5 relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.6 }}
                        className={`h-[1px] absolute top-0 left-0 ${
                          category.toLowerCase() === highestSpendingCategory.toLowerCase() && amt > 0 
                            ? "bg-[#10B981]" 
                            : "bg-white/40"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Budget Warning Section inside card */}
            <div className="mt-8 border-t border-white/5 pt-6">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${isOverBudget ? "bg-rose-500 animate-pulse" : percentSpent > 80 ? "bg-amber-500 animate-pulse" : "bg-[#10B981]"}`}></div>
                <span className={`text-[10px] uppercase tracking-widest font-semibold ${isOverBudget ? "text-rose-400" : "text-white/60"}`}>
                  {isOverBudget ? "Budget Cap Exceeded Warning" : "Safe Capacity Margin"}
                </span>
              </div>
              <p className="text-xs text-white/40 mt-2 font-serif leading-relaxed">
                {isOverBudget 
                  ? `Overdue warnings active. Please restructure limits or reset logs. Deficit of ₹ ${(totalSpent - budget).toFixed(2)}.`
                  : `Remaining capacity: ₹ ${(budget - totalSpent).toFixed(2)} before monthly threshold allocation limits reset.`}
              </p>
            </div>
          </div>

          {/* Python Code Viewer Section removed as requested */}

        </div>

      </main>

      {/* Decorative Footer */}
      <footer className="mt-8 flex flex-col sm:flex-row justify-between items-center text-[9px] uppercase tracking-[0.4em] text-white/20 border-t border-white/5 pt-4 gap-2">
        <span>Open Source Project // Student Edition</span>
        <span>Design by Ledger Terminal Systems</span>
      </footer>

      {/* Information Popup (What is What & Directions Onboarding Modal) */}
      <AnimatePresence>
        {showGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-[#141418] border border-white/10 rounded-lg max-w-2xl w-full p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh] relative flex flex-col gap-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowGuide(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white font-mono text-sm border border-white/10 rounded px-2.5 py-1 hover:bg-white/5 transition"
              >
                ✕ Close
              </button>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#10B981] rounded-full animate-pulse"></div>
                  <h2 className="text-2xl font-serif text-white tracking-wide">Campus Ledger Directions</h2>
                </div>
                <p className="text-xs uppercase tracking-widest text-[#10B981] font-mono font-bold">
                  Interactive Information Map & User Guide
                </p>
              </div>

              {/* What is What Section */}
              <div className="space-y-4 border-t border-b border-white/5 py-5">
                <h3 className="text-xs font-mono text-white/80 uppercase tracking-widest font-bold">
                  🔍 What is What? (Interface Map)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3.5 bg-white/5 rounded border border-white/5 space-y-1.5">
                    <div className="text-xs font-mono text-[#10B981] font-bold">💻 CLI Emulator</div>
                    <p className="text-xs text-white/60 leading-relaxed font-sans">
                      The interactive terminal on the left simulates a Python-based console. Type choices (1-6) and respond to input prompts here!
                    </p>
                  </div>
                  <div className="p-3.5 bg-white/5 rounded border border-white/5 space-y-1.5">
                    <div className="text-xs font-mono text-[#10B981] font-bold">📂 Persistent Logs</div>
                    <p className="text-xs text-white/60 leading-relaxed font-sans">
                      Any transaction you log is saved securely inside your browser's storage, preserving your history across sessions.
                    </p>
                  </div>
                  <div className="p-3.5 bg-white/5 rounded border border-white/5 space-y-1.5">
                    <div className="text-xs font-mono text-[#10B981] font-bold">📊 Live Metrics</div>
                    <p className="text-xs text-white/60 leading-relaxed font-sans">
                      The right-hand cards and visual distribution bars update dynamically as you add items, keeping track of your budget limits.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Guide */}
              <div className="space-y-3.5">
                <h3 className="text-xs font-mono text-white/80 uppercase tracking-widest font-bold">
                  🚀 Step-by-Step Directions
                </h3>
                <div className="space-y-3 font-sans text-xs text-white/70">
                  <div className="flex gap-3">
                    <span className="text-[#10B981] font-mono font-bold shrink-0">STEP 1</span>
                    <p>
                      <strong>Trigger Expense Add:</strong> Type <code className="bg-white/5 px-1 py-0.5 rounded text-white font-mono">1</code> into the terminal input and press <code className="bg-white/5 px-1 py-0.5 rounded text-white font-mono">Enter</code> to begin logging a new transaction.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-[#10B981] font-mono font-bold shrink-0">STEP 2</span>
                    <p>
                      <strong>Fill Prompts:</strong> Follow the green text prompts in the terminal. Type your values and press <code className="bg-white/5 px-1 py-0.5 rounded text-white font-mono">Enter</code> for Date, Amount, Category, and Description.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-[#10B981] font-mono font-bold shrink-0">STEP 3</span>
                    <p>
                      <strong>View Records:</strong> Type <code className="bg-white/5 px-1 py-0.5 rounded text-white font-mono">2</code> in the terminal to print your transactions table directly inside the terminal console, or check the distribution meter bars on the right side.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-[#10B981] font-mono font-bold shrink-0">STEP 4</span>
                    <p>
                      <strong>Check Budget Limits:</strong> Adjust monthly budget caps using menu option <code className="bg-white/5 px-1 py-0.5 rounded text-white font-mono">4</code>. If total costs exceed your budget, the terminal and visual metrics will immediately highlight budget warning states!
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => setShowGuide(false)}
                  className="px-5 py-2.5 bg-[#10B981] text-black font-bold text-xs uppercase tracking-widest hover:bg-[#10B981]/90 rounded transition"
                >
                  Start Tracking Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
