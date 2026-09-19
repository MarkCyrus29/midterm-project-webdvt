import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import type { Transaction } from "../types";

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem = React.memo(function TransactionItem({
  transaction,
}: TransactionItemProps) {
  const isIncome = transaction.type === "income";

  return (
    <Link
      to={`/transaction/${transaction.id}`}
      className="group flex items-center justify-between p-4 mb-3 rounded-xl border border-border bg-surface hover:border-accent/30 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncome ? 'bg-income-bg text-income' : 'bg-expense-bg text-expense'}`}>
          {isIncome ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
            </svg>
          )}
        </div>
        <div>
          <div className="font-medium text-text-main group-hover:text-accent transition-colors">
            {transaction.description}
          </div>
          <div className="text-sm text-text-muted mt-0.5">
            {transaction.category} &middot; {transaction.date}
          </div>
        </div>
      </div>
      <div className={`font-semibold text-lg ${isIncome ? 'text-income' : 'text-text-main'}`}>
        {isIncome ? "+" : "-"}${transaction.amount.toFixed(2)}
      </div>
    </Link>
  );
});

interface DashboardProps {
  transactions: Transaction[];
}

export default function Dashboard({ transactions }: DashboardProps) {
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState<"" | "income" | "expense">("");

  const categories = useMemo(
    () => Array.from(new Set(transactions.map((t) => t.category))).sort(),
    [transactions]
  );

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (filterCategory && t.category !== filterCategory) return false;
      if (filterType && t.type !== filterType) return false;
      return true;
    });
  }, [transactions, filterCategory, filterType]);

  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalExpenses = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const balance = totalIncome - totalExpenses;

  return (
    <div className="pb-20 md:pb-0">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-main">Dashboard</h1>
        <Link 
          to="/add" 
          className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="hidden sm:inline">Add Transaction</span>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-6 rounded-2xl border border-border bg-surface shadow-sm">
          <div className="text-sm font-medium text-text-muted mb-1">Total Balance</div>
          <div className="text-3xl font-bold text-text-main">${balance.toFixed(2)}</div>
        </div>
        <div className="p-6 rounded-2xl border border-border bg-surface shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-text-muted mb-1">
            <div className="w-2 h-2 rounded-full bg-income"></div>
            Income
          </div>
          <div className="text-2xl font-bold text-text-main">${totalIncome.toFixed(2)}</div>
        </div>
        <div className="p-6 rounded-2xl border border-border bg-surface shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-text-muted mb-1">
            <div className="w-2 h-2 rounded-full bg-expense"></div>
            Expenses
          </div>
          <div className="text-2xl font-bold text-text-main">${totalExpenses.toFixed(2)}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-lg font-semibold text-text-main">Recent Transactions</h2>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex bg-surface border border-border rounded-lg p-1">
            <button
              onClick={() => setFilterType("")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filterType === "" ? "bg-accent/10 text-accent" : "text-text-muted hover:text-text-main"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("income")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filterType === "income" ? "bg-income-bg text-income" : "text-text-muted hover:text-text-main"}`}
            >
              Income
            </button>
            <button
              onClick={() => setFilterType("expense")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filterType === "expense" ? "bg-expense-bg text-expense" : "text-text-muted hover:text-text-main"}`}
            >
              Expense
            </button>
          </div>

          {categories.length > 0 && (
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-surface border border-border text-text-main text-sm font-medium rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-accent/50 transition-shadow appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Transaction list */}
      <div className="mt-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-border rounded-2xl">
            <div className="text-text-muted mb-4">No transactions found matching your filters.</div>
            <Link 
              to="/add" 
              className="text-accent hover:text-accent-hover font-medium underline underline-offset-2"
            >
              Add a new transaction
            </Link>
          </div>
        ) : (
          filtered.map((t) => <TransactionItem key={t.id} transaction={t} />)
        )}
      </div>
    </div>
  );
}
