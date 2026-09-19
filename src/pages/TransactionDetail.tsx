import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Transaction } from "../types";

interface TransactionDetailProps {
  getTransaction: (id: string) => Transaction | null;
  onUpdate: (id: string, updated: Partial<Transaction>) => void;
  onDelete: (id: string) => void;
}

export default function TransactionDetail({
  getTransaction,
  onUpdate,
  onDelete,
}: TransactionDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const transaction = id ? getTransaction(id) : null;

  const [editing, setEditing] = useState(false);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form fields when transaction loads
  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(String(transaction.amount));
      setCategory(transaction.category);
      setDescription(transaction.description);
      setDate(transaction.date);
    }
  }, [transaction]);

  if (!transaction) {
    return (
      <div className="text-center py-12 px-4 border border-dashed border-border rounded-2xl max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-text-main mb-2">Transaction Not Found</h1>
        <p className="text-text-muted mb-6">
          The transaction you're looking for doesn't exist or has been deleted.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2.5 text-sm font-medium bg-surface border border-border hover:bg-surface-hover text-text-main rounded-xl transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  function handleSave() {
    const newErrors: Record<string, string> = {};
    if (!amount || Number(amount) <= 0) newErrors.amount = "Amount must be greater than 0";
    if (!category.trim()) newErrors.category = "Category is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!date) newErrors.date = "Date is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onUpdate(transaction!.id, {
      type,
      amount: Number(amount),
      category: category.trim(),
      description: description.trim(),
      date,
    });
    setEditing(false);
    setErrors({});
  }

  function handleDelete() {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      onDelete(transaction!.id);
      navigate("/");
    }
  }

  const isIncome = transaction.type === "income";

  return (
    <div className="pb-20 md:pb-0 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-sm font-medium text-text-muted hover:text-text-main transition-colors mb-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </button>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-main">
            {editing ? "Edit Transaction" : "Transaction Details"}
          </h1>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
        {editing ? (
          <div className="p-6 md:p-8">
            <div className="space-y-6">
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
                  onClick={() => {
                    setEditing(false);
                    setErrors({});
                  }}
                  className="px-5 py-2.5 text-sm font-medium text-text-main hover:bg-surface-hover rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 text-sm font-medium bg-accent hover:bg-accent-hover text-white rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-bg-base"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className={`p-8 border-b border-border flex items-center justify-between ${isIncome ? 'bg-income-bg/50' : 'bg-expense-bg/50'}`}>
               <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isIncome ? 'bg-income-bg text-income' : 'bg-expense-bg text-expense'}`}>
                   {isIncome ? (
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
                     </svg>
                   ) : (
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
                     </svg>
                   )}
                 </div>
                 <div>
                   <h2 className="text-xl font-bold text-text-main">{transaction.description}</h2>
                   <div className="text-sm font-medium mt-1 uppercase tracking-wider text-text-muted">
                     {transaction.category}
                   </div>
                 </div>
               </div>
               <div className={`text-3xl font-bold ${isIncome ? 'text-income' : 'text-text-main'}`}>
                 {isIncome ? "+" : "-"}${transaction.amount.toFixed(2)}
               </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="text-sm font-medium text-text-muted mb-1">Date</div>
                  <div className="text-lg font-medium text-text-main">{new Date(transaction.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-text-muted mb-1">Type</div>
                  <div className="text-lg font-medium text-text-main capitalize">{transaction.type}</div>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-border">
                <button
                  onClick={() => setEditing(true)}
                  className="px-5 py-2.5 text-sm font-medium bg-surface border border-border hover:bg-surface-hover text-text-main rounded-xl transition-colors shadow-sm"
                >
                  Edit Details
                </button>
                <button
                  onClick={handleDelete}
                  className="px-5 py-2.5 text-sm font-medium bg-transparent border border-expense/50 text-expense hover:bg-expense-bg rounded-xl transition-colors"
                >
                  Delete Transaction
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
