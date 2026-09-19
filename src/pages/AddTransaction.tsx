import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Transaction } from "../types";

interface AddTransactionProps {
  onAdd: (transaction: Transaction) => void;
}

export default function AddTransaction({ onAdd }: AddTransactionProps) {
  const navigate = useNavigate();

  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]); // Default to today
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate required fields
    const newErrors: Record<string, string> = {};
    if (!amount || Number(amount) <= 0) newErrors.amount = "Amount must be greater than 0";
    if (!category.trim()) newErrors.category = "Category is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!date) newErrors.date = "Date is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      type,
      amount: Number(amount),
      category: category.trim(),
      description: description.trim(),
      date,
    };

    onAdd(transaction);
    navigate("/");
  }

  return (
    <div className="pb-20 md:pb-0 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-main">Add Transaction</h1>
        <p className="text-text-muted mt-2">Record a new income or expense entry.</p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Type & Amount Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">Transaction Type</label>
              <div className="flex bg-surface-hover p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setType("expense")}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${type === "expense" ? "bg-white dark:bg-gray-700 text-expense shadow-sm" : "text-text-muted hover:text-text-main"}`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType("income")}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${type === "income" ? "bg-white dark:bg-gray-700 text-income shadow-sm" : "text-text-muted hover:text-text-main"}`}
                >
                  Income
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-2">Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-text-muted font-medium">$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (errors.amount) setErrors(prev => ({ ...prev, amount: "" }));
                  }}
                  className={`block w-full pl-8 pr-3 py-2.5 bg-surface border ${errors.amount ? 'border-expense focus:ring-expense/50' : 'border-border focus:ring-accent/50'} rounded-xl text-text-main placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && <p className="mt-1.5 text-sm text-expense">{errors.amount}</p>}
            </div>
          </div>

          <div className="border-t border-border pt-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors(prev => ({ ...prev, description: "" }));
                }}
                className={`block w-full px-4 py-2.5 bg-surface border ${errors.description ? 'border-expense focus:ring-expense/50' : 'border-border focus:ring-accent/50'} rounded-xl text-text-main placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow`}
                placeholder="e.g. Weekly Groceries, Freelance Payment"
              />
              {errors.description && <p className="mt-1.5 text-sm text-expense">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (errors.category) setErrors(prev => ({ ...prev, category: "" }));
                  }}
                  className={`block w-full px-4 py-2.5 bg-surface border ${errors.category ? 'border-expense focus:ring-expense/50' : 'border-border focus:ring-accent/50'} rounded-xl text-text-main placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow`}
                  placeholder="e.g. Food, Utilities, Salary"
                />
                {errors.category && <p className="mt-1.5 text-sm text-expense">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    if (errors.date) setErrors(prev => ({ ...prev, date: "" }));
                  }}
                  className={`block w-full px-4 py-2.5 bg-surface border ${errors.date ? 'border-expense focus:ring-expense/50' : 'border-border focus:ring-accent/50'} rounded-xl text-text-main focus:outline-none focus:ring-2 focus:border-transparent transition-shadow`}
                />
                {errors.date && <p className="mt-1.5 text-sm text-expense">{errors.date}</p>}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 mt-8 border-t border-border">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-5 py-2.5 text-sm font-medium text-text-main hover:bg-surface-hover rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium bg-accent hover:bg-accent-hover text-white rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-bg-base"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
