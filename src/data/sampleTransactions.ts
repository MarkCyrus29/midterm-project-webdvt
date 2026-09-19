import type { Transaction } from "../types";

const sampleTransactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    amount: 45000,
    category: "Salary",
    description: "Monthly salary",
    date: "2026-08-01",
  },
  {
    id: "2",
    type: "expense",
    amount: 2200,
    category: "Shopping",
    description: "New keyboard",
    date: "2026-08-06",
  },
  {
    id: "3",
    type: "expense",
    amount: 12000,
    category: "Rent",
    description: "August rent",
    date: "2026-08-02",
  },
  {
    id: "4",
    type: "expense",
    amount: 3500,
    category: "Groceries",
    description: "Weekly grocery run",
    date: "2026-08-04",
  },
  {
    id: "5",
    type: "expense",
    amount: 1200,
    category: "Utilities",
    description: "Electricity bill",
    date: "2026-08-05",
  },
  {
    id: "6",
    type: "expense",
    amount: 600,
    category: "Transportation",
    description: "Gas and toll fees",
    date: "2026-08-05",
  },
  {
    id: "7",
    type: "expense",
    amount: 950,
    category: "Dining",
    description: "Dinner with friends",
    date: "2026-08-06",
  },
];

export default sampleTransactions;