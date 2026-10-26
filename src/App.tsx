import { useEffect, useState } from "react";
import { Review } from "./Review";
import { Add } from "./Add";
import { Browse } from "./Browse";
import { Stats } from "./Stats";
import { SettingsScreen } from "./Settings";

type Tab = "review" | "add" | "browse" | "stats" | "settings";

const TABS: { id: Tab; label: string }[] = [
  { id: "review", label: "Review" },
  { id: "add", label: "Add" },
  { id: "browse", label: "Browse" },
  { id: "stats", label: "Stats" },
  { id: "settings", label: "More" },
];

export default function App() {
  const [tab, setTab] = useState<Tab>("review");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1600);
    return () => clearTimeout(t);
  }, [toast]);

  // Remounting on tab change is deliberate: every screen reads the database
  // on mount, so switching back to Review after adding a word shows the new
  // card without any cross-screen invalidation plumbing.
  return (
    <>
      {tab === "review" && <Review key="review" />}
      {tab === "add" && <Add key="add" onToast={setToast} />}
      {tab === "browse" && <Browse key="browse" onToast={setToast} />}
      {tab === "stats" && <Stats key="stats" />}
      {tab === "settings" && <SettingsScreen key="settings" onToast={setToast} />}

      {toast && <div className="toast">{toast}</div>}

      <nav className="tabbar">
        {TABS.map((t) => (
          <button key={t.id} className="tab" data-on={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>
    </>
  );
}
