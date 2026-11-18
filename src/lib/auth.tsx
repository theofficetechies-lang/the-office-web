import { createContext, useCallback, useContext, useState } from "react";

/**
 * Lightweight customer accounts, stored in the browser (localStorage).
 * A customer must be signed in before paying, per the owner's requirement.
 *
 * This is intentionally dependency-free. For accounts that persist across
 * devices, swap this module for a real auth provider — the rest of the app
 * only talks to useAuth().
 */
export interface Customer {
  name: string;
  email: string;
}

const CUSTOMERS_KEY = "the-office360:customers";
const SESSION_KEY = "the-office360:session";

function readSession(): Customer | null {
  if (typeof window === "undefined") return null;
  try {
    const email = window.localStorage.getItem(SESSION_KEY);
    if (!email) return null;
    return readCustomers().find((x) => x.email === email) ?? { name: email.split("@")[0], email };
  } catch {
    return null;
  }
}

function readCustomers(): Customer[] {
  try {
    const raw = window.localStorage.getItem(CUSTOMERS_KEY);
    return raw ? (JSON.parse(raw) as Customer[]) : [];
  } catch {
    return [];
  }
}

interface AuthValue {
  user: Customer | null;
  signIn: (name: string, email: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Customer | null>(() => readSession());

  const signIn = useCallback((name: string, email: string) => {
    const customers = readCustomers();
    if (!customers.some((c) => c.email === email)) customers.push({ name, email });
    try {
      window.localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
      window.localStorage.setItem(SESSION_KEY, email);
    } catch {
      // storage unavailable
    }
    setUser({ name, email });
  }, []);

  const signOut = useCallback(() => {
    try {
      window.localStorage.removeItem(SESSION_KEY);
    } catch {
      // storage unavailable
    }
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
