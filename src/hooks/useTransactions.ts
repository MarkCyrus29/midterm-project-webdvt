import { useState, useCallback } from "react";
import type { Transaction } from "../types";
import sampleTransactions from "../data/sampleTransactions";

const STORAGE_KEY = "budget_transactions";

function getInitialTransactions(): Transaction[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTransactions));
  return sampleTransactions;
}

function saveTransactions(transactions: Transaction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(getInitialTransactions);

  const addTransaction = useCallback((transaction: Transaction) => {
    setTransactions((prev) => {
      const next = [...prev, transaction];
      saveTransactions(next);
      return next;
    });
  }, []);

  const updateTransaction = useCallback((id: string, updated: Partial<Transaction>) => {
    setTransactions((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...updated } : t));
      saveTransactions(next);
      return next;
    });
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => {
      const next = prev.filter((t) => t.id !== id);
      saveTransactions(next);
      return next;
    });
  }, []);

  const getTransaction = useCallback(
    (id: string) => transactions.find((t) => t.id === id) ?? null,
    [transactions]
  );

  return { transactions, addTransaction, updateTransaction, deleteTransaction, getTransaction };
}
