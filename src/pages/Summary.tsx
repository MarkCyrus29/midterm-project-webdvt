import { useMemo } from "react";
import type { Transaction } from "../types";

interface SummaryProps {
  transactions: Transaction[];
}

export default function Summary({ transactions }: SummaryProps) {
  // Group expense totals by category
  const categoryTotals = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of transactions) {
      if (t.type === "expense") {
        map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
      }
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  const totalSpending = useMemo(
    () => categoryTotals.reduce((sum, [, amt]) => sum + amt, 0),
    [categoryTotals]
  );

  return (
    <div className="pb-20 md:pb-0 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-main">Spending Summary</h1>
        <p className="text-text-muted mt-2">A breakdown of your expenses by category.</p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="mb-8 pb-8 border-b border-border flex items-center justify-between">
           <div>
             <div className="text-sm font-medium text-text-muted mb-1">Total Expenses</div>
             <div className="text-4xl font-bold text-text-main">${totalSpending.toFixed(2)}</div>
           </div>
           <div className="w-16 h-16 rounded-full bg-expense-bg text-expense flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
               <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
               <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
             </svg>
           </div>
        </div>

        <h2 className="text-lg font-semibold text-text-main mb-6">Category Breakdown</h2>

        {categoryTotals.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-border rounded-xl">
            <div className="text-text-muted">No expenses recorded yet.</div>
          </div>
        ) : (
          <div className="space-y-6">
            {categoryTotals.map(([category, amount]) => {
              const percentage = totalSpending > 0 ? (amount / totalSpending) * 100 : 0;
              return (
                <div key={category}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-medium text-text-main">{category}</span>
                    <div className="text-right">
                      <span className="font-semibold text-text-main">${amount.toFixed(2)}</span>
                      <span className="text-sm text-text-muted ml-2 w-12 inline-block">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-3 w-full bg-surface-hover rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
