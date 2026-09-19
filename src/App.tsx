import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import { useTransactions } from "./hooks/useTransactions";
import Dashboard from "./pages/Dashboard";
import AddTransaction from "./pages/AddTransaction";
import TransactionDetail from "./pages/TransactionDetail";
import Summary from "./pages/Summary";

function NavLinks() {
  const location = useLocation();
  const baseClasses = "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200";
  const activeClasses = "bg-accent/10 text-accent dark:bg-accent/20";
  const inactiveClasses = "text-text-muted hover:bg-surface-hover hover:text-text-main";

  return (
    <>
      <Link
        to="/"
        className={`${baseClasses} ${location.pathname === "/" ? activeClasses : inactiveClasses}`}
      >
        Dashboard
      </Link>
      <Link
        to="/add"
        className={`${baseClasses} ${location.pathname === "/add" ? activeClasses : inactiveClasses}`}
      >
        Add Transaction
      </Link>
      <Link
        to="/summary"
        className={`${baseClasses} ${location.pathname === "/summary" ? activeClasses : inactiveClasses}`}
      >
        Summary
      </Link>
    </>
  );
}

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const { transactions, addTransaction, updateTransaction, deleteTransaction, getTransaction } =
    useTransactions();

  // Sync the dark class on <html> so dark: utilities apply everywhere
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="flex h-screen bg-bg-base text-text-main overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-surface">
        <div className="p-6">
          <Link to="/" className="text-xl font-bold tracking-tight text-text-main flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
                <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
              </svg>
            </div>
            Budget Tracker
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <NavLinks />
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b border-border bg-surface/80 backdrop-blur-md flex items-center justify-end px-6 z-10">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-surface-hover text-text-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            )}
          </button>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard transactions={transactions} />} />
              <Route
                path="/add"
                element={<AddTransaction onAdd={addTransaction} />}
              />
              <Route
                path="/transaction/:id"
                element={
                  <TransactionDetail
                    getTransaction={getTransaction}
                    onUpdate={updateTransaction}
                    onDelete={deleteTransaction}
                  />
                }
              />
              <Route
                path="/summary"
                element={<Summary transactions={transactions} />}
              />
            </Routes>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-2 flex justify-around z-20">
        <Link
          to="/"
          className="flex flex-col items-center p-2 text-text-muted hover:text-accent"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
          <span className="text-xs mt-1">Dashboard</span>
        </Link>
        <Link
          to="/add"
          className="flex flex-col items-center p-2 text-text-muted hover:text-accent"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="text-xs mt-1">Add</span>
        </Link>
        <Link
          to="/summary"
          className="flex flex-col items-center p-2 text-text-muted hover:text-accent"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
          </svg>
          <span className="text-xs mt-1">Summary</span>
        </Link>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
