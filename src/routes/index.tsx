import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

type Priority = "Low" | "Medium" | "High";
type Category = "Homework" | "Project" | "Work" | "Personal";
type ProofStatus = "none" | "checking" | "verified" | "review" | "incomplete";

type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  category: Category;
  link?: string;
  progress: number; // 0-100
  done: boolean;
  proofStatus: ProofStatus;
  proofNote?: string;
};

type BlockItem = { id: string; name: string; emoji: string; blocked: boolean; custom?: boolean };

const uid = () => Math.random().toString(36).slice(2, 10);
const todayISO = () => new Date().toISOString().slice(0, 10);

const DEFAULT_TASKS: Task[] = [
  { id: uid(), title: "Math homework — pg. 42", description: "Problems 1–20, show work.", dueDate: todayISO(), priority: "High", category: "Homework", link: "https://classroom.google.com", progress: 40, done: false, proofStatus: "none" },
  { id: uid(), title: "Read 10 pages of English novel", description: "Chapter 3, take notes.", dueDate: todayISO(), priority: "Medium", category: "Homework", progress: 0, done: false, proofStatus: "none" },
  { id: uid(), title: "Draft project proposal", description: "One-page summary + timeline.", dueDate: todayISO(), priority: "High", category: "Project", link: "https://docs.google.com", progress: 70, done: false, proofStatus: "none" },
];

const DEFAULT_BLOCKS: BlockItem[] = [
  { id: "tiktok", name: "TikTok", emoji: "🎵", blocked: true },
  { id: "instagram", name: "Instagram", emoji: "📸", blocked: true },
  { id: "youtube", name: "YouTube", emoji: "▶️", blocked: true },
  { id: "x", name: "X / Twitter", emoji: "𝕏", blocked: true },
  { id: "snapchat", name: "Snapchat", emoji: "👻", blocked: false },
  { id: "reddit", name: "Reddit", emoji: "👽", blocked: true },
  { id: "facebook", name: "Facebook", emoji: "📘", blocked: false },
  { id: "netflix", name: "Netflix", emoji: "🎬", blocked: false },
  { id: "twitch", name: "Twitch", emoji: "🎮", blocked: false },
  { id: "discord", name: "Discord", emoji: "💬", blocked: false },
];

const DEFAULT_ALLOW = [
  "docs.google.com",
  "classroom.google.com",
  "canvas.instructure.com",
  "mail.google.com",
  "office.com",
  "khanacademy.org",
];

type Tab = "home" | "tasks" | "focus";

function Index() {
  const [tab, setTab] = useState<Tab>("home");
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [blocks, setBlocks] = useState<BlockItem[]>(DEFAULT_BLOCKS);
  const [allow, setAllow] = useState<string[]>(DEFAULT_ALLOW);
  const [focusOn, setFocusOn] = useState(true);
  const [xp, setXp] = useState(240);
  const [streak, setStreak] = useState(4);
  const [editing, setEditing] = useState<Task | null>(null);
  const [proofFor, setProofFor] = useState<Task | null>(null);

  const today = todayISO();
  const todayTasks = useMemo(() => tasks.filter((t) => t.dueDate === today), [tasks, today]);
  const completedToday = todayTasks.filter((t) => t.done).length;

  const upsertTask = (t: Task) =>
    setTasks((prev) => (prev.some((x) => x.id === t.id) ? prev.map((x) => (x.id === t.id ? t : x)) : [t, ...prev]));
  const deleteTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const toggleDone = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done, progress: !t.done ? 100 : t.progress } : t)));

  const onVerified = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: true, progress: 100, proofStatus: "verified" } : t)));
    setXp((v) => v + 25);
    setStreak((v) => v + 1);
    // Notify extension (best-effort)
    try {
      window.postMessage({ source: "do-ur-work", type: "task-completed", taskId: id }, "*");
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 pb-32 pt-6 sm:px-6">
        <Header focusOn={focusOn} onToggleFocus={() => setFocusOn((v) => !v)} xp={xp} streak={streak} />

        <div className="mt-6">
          {tab === "home" && (
            <Dashboard
              tasks={todayTasks}
              xp={xp}
              streak={streak}
              completedToday={completedToday}
              focusOn={focusOn}
              onOpenTasks={() => setTab("tasks")}
              onSubmitProof={(t) => setProofFor(t)}
              onToggle={toggleDone}
            />
          )}
          {tab === "tasks" && (
            <TasksPage
              tasks={tasks}
              onNew={() =>
                setEditing({
                  id: uid(),
                  title: "",
                  description: "",
                  dueDate: today,
                  priority: "Medium",
                  category: "Homework",
                  link: "",
                  progress: 0,
                  done: false,
                  proofStatus: "none",
                })
              }
              onEdit={setEditing}
              onDelete={deleteTask}
              onToggle={toggleDone}
              onProof={setProofFor}
            />
          )}
          {tab === "focus" && (
            <FocusPage
              focusOn={focusOn}
              setFocusOn={setFocusOn}
              blocks={blocks}
              setBlocks={setBlocks}
              allow={allow}
              setAllow={setAllow}
            />
          )}
        </div>
      </div>

      <BottomNav tab={tab} setTab={setTab} />

      {editing && (
        <TaskEditor
          task={editing}
          onClose={() => setEditing(null)}
          onSave={(t) => {
            upsertTask(t);
            setEditing(null);
          }}
        />
      )}
      {proofFor && (
        <ProofModal
          task={proofFor}
          onClose={() => setProofFor(null)}
          onStatus={(status) => {
            setTasks((prev) => prev.map((x) => (x.id === proofFor.id ? { ...x, proofStatus: status } : x)));
          }}
          onVerified={() => {
            onVerified(proofFor.id);
            setProofFor(null);
          }}
        />
      )}
    </div>
  );
}

/* ---------- Header ---------- */
function Header({ focusOn, onToggleFocus, xp, streak }: { focusOn: boolean; onToggleFocus: () => void; xp: number; streak: number }) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 text-lg font-black text-white shadow-md shadow-blue-600/30">
          ✓
        </div>
        <div>
          <div className="text-base font-black tracking-tight">DO UR WORK</div>
          <div className="text-[11px] font-medium text-slate-500">Finish work. Unlock the rest.</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 sm:inline-flex">
          🔥 {streak} day streak
        </span>
        <span className="hidden rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 sm:inline-flex">
          ⚡ {xp} XP
        </span>
        <button
          onClick={onToggleFocus}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
            focusOn ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" : "bg-slate-900 text-white"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${focusOn ? "animate-pulse bg-white" : "bg-slate-500"}`} />
          Focus {focusOn ? "ON" : "OFF"}
        </button>
      </div>
    </header>
  );
}

/* ---------- Bottom Nav ---------- */
function BottomNav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; label: string; icon: string }[] = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "tasks", label: "Tasks", icon: "📋" },
    { id: "focus", label: "Focus", icon: "🛡️" },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-4 z-30 mx-auto flex w-[min(94%,420px)] items-center justify-between rounded-2xl bg-slate-900 p-1.5 shadow-xl">
      {items.map((it) => {
        const active = tab === it.id;
        return (
          <button
            key={it.id}
            onClick={() => setTab(it.id)}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
              active ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <span className="text-lg">{it.icon}</span>
            {it.label}
          </button>
        );
      })}
    </nav>
  );
}

/* ---------- Dashboard ---------- */
function Dashboard({
  tasks,
  xp,
  streak,
  completedToday,
  focusOn,
  onOpenTasks,
  onSubmitProof,
  onToggle,
}: {
  tasks: Task[];
  xp: number;
  streak: number;
  completedToday: number;
  focusOn: boolean;
  onOpenTasks: () => void;
  onSubmitProof: (t: Task) => void;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-5">
      {/* Focus session card */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-600/40 blur-3xl" />
        <div className="relative">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-300">Current focus session</div>
          <div className="mt-1 flex items-end justify-between">
            <h2 className="text-3xl font-black tracking-tight">
              {focusOn ? "You're locked in." : "Focus is off."}
            </h2>
            <div className="text-right">
              <div className="text-2xl font-black">🔥 {streak}</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">streak</div>
            </div>
          </div>
          <p className="mt-2 text-sm text-slate-300">
            {focusOn
              ? "Distracting sites are blocked. Finish tasks to unlock them."
              : "Turn Focus on to start blocking distractions."}
          </p>
        </div>
      </section>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="XP" value={String(xp)} tint="blue" />
        <StatCard label="Done today" value={`${completedToday}/${tasks.length || 0}`} tint="slate" />
        <StatCard label="Streak" value={`${streak}d`} tint="blue" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3">
        <QuickBtn label="Start Focus" icon="🛡️" onClick={onOpenTasks} primary />
        <QuickBtn label="Tasks" icon="📋" onClick={onOpenTasks} />
        <QuickBtn
          label="Submit Proof"
          icon="📤"
          onClick={() => {
            const next = tasks.find((t) => !t.done);
            if (next) onSubmitProof(next);
          }}
        />
      </div>

      {/* Today */}
      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black tracking-tight">Today&apos;s tasks</h3>
            <p className="text-xs text-slate-500">{tasks.length} scheduled · {completedToday} complete</p>
          </div>
          <button
            onClick={onOpenTasks}
            className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
          >
            View all
          </button>
        </div>
        {tasks.length === 0 ? (
          <EmptyState label="Nothing due today. Nice." />
        ) : (
          <ul className="space-y-2">
            {tasks.map((t) => (
              <TaskRow key={t.id} task={t} onToggle={() => onToggle(t.id)} onProof={() => onSubmitProof(t)} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, tint }: { label: string; value: string; tint: "blue" | "slate" }) {
  const styles = tint === "blue" ? "bg-blue-600 text-white" : "bg-white text-slate-900 ring-1 ring-slate-200";
  return (
    <div className={`rounded-2xl p-4 shadow-sm ${styles}`}>
      <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">{label}</div>
      <div className="mt-1 text-2xl font-black tracking-tight">{value}</div>
    </div>
  );
}

function QuickBtn({ label, icon, onClick, primary }: { label: string; icon: string; onClick: () => void; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-4 text-xs font-bold transition active:scale-95 ${
        primary
          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 hover:bg-blue-500"
          : "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
      }`}
    >
      <span className="text-xl">{icon}</span>
      {label}
    </button>
  );
}

function EmptyState({ label }: { label: string }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">{label}</div>;
}

/* ---------- Task row ---------- */
function priorityBadge(p: Priority) {
  const map: Record<Priority, string> = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-amber-100 text-amber-700",
    Low: "bg-slate-100 text-slate-600",
  };
  return map[p];
}
function proofBadge(s: ProofStatus) {
  const map: Record<ProofStatus, { text: string; cls: string }> = {
    none: { text: "No proof yet", cls: "bg-slate-100 text-slate-600" },
    checking: { text: "⏳ Checking", cls: "bg-blue-100 text-blue-700" },
    verified: { text: "✅ Verified", cls: "bg-emerald-100 text-emerald-700" },
    review: { text: "⚠ Needs review", cls: "bg-amber-100 text-amber-700" },
    incomplete: { text: "❌ Incomplete", cls: "bg-red-100 text-red-700" },
  };
  return map[s];
}

function TaskRow({
  task,
  onToggle,
  onProof,
  onEdit,
  onDelete,
}: {
  task: Task;
  onToggle: () => void;
  onProof: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const badge = proofBadge(task.proofStatus);
  return (
    <li className="group rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:ring-blue-300">
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition ${
            task.done ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 hover:border-blue-500"
          }`}
          aria-label="Toggle done"
        >
          {task.done && "✓"}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-sm font-bold ${task.done ? "text-slate-400 line-through" : "text-slate-900"}`}>
              {task.title || "Untitled task"}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${priorityBadge(task.priority)}`}>
              {task.priority}
            </span>
            <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              {task.category}
            </span>
          </div>
          {task.description && <p className="mt-1 text-xs text-slate-500">{task.description}</p>}
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: `${task.done ? 100 : task.progress}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-500">{task.done ? 100 : task.progress}%</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-500">Due {task.dueDate}</span>
            {task.link && (
              <a
                href={task.link}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-semibold text-blue-600 hover:underline"
              >
                🔗 Assignment link
              </a>
            )}
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.cls}`}>{badge.text}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={onProof}
              className="rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-blue-500"
            >
              Submit Proof
            </button>
            {onEdit && (
              <button
                onClick={onEdit}
                className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-200"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

/* ---------- Tasks Page ---------- */
function TasksPage({
  tasks,
  onNew,
  onEdit,
  onDelete,
  onToggle,
  onProof,
}: {
  tasks: Task[];
  onNew: () => void;
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onProof: (t: Task) => void;
}) {
  const [filter, setFilter] = useState<"all" | "open" | "done">("all");
  const filtered = tasks.filter((t) =>
    filter === "all" ? true : filter === "open" ? !t.done : t.done,
  );
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Tasks</h2>
          <p className="text-sm text-slate-500">Create, track, and submit proof of your work.</p>
        </div>
        <button
          onClick={onNew}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-500"
        >
          + New task
        </button>
      </div>
      <div className="flex gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200">
        {(["all", "open", "done"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
              filter === f ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState label="No tasks here. Add one to get started." />
      ) : (
        <ul className="space-y-2">
          {filtered.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              onToggle={() => onToggle(t.id)}
              onProof={() => onProof(t)}
              onEdit={() => onEdit(t)}
              onDelete={() => onDelete(t.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- Task Editor ---------- */
function TaskEditor({ task, onClose, onSave }: { task: Task; onClose: () => void; onSave: (t: Task) => void }) {
  const [draft, setDraft] = useState<Task>(task);
  const set = <K extends keyof Task>(k: K, v: Task[K]) => setDraft((d) => ({ ...d, [k]: v }));
  return (
    <Modal onClose={onClose} title={task.title ? "Edit task" : "New task"}>
      <div className="space-y-3">
        <Field label="Title">
          <input
            value={draft.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Finish physics lab report"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </Field>
        <Field label="Description">
          <textarea
            value={draft.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Due date">
            <input
              type="date"
              value={draft.dueDate}
              onChange={(e) => set("dueDate", e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </Field>
          <Field label="Priority">
            <select
              value={draft.priority}
              onChange={(e) => set("priority", e.target.value as Priority)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </Field>
        </div>
        <Field label="Assignment type">
          <div className="flex flex-wrap gap-1.5">
            {(["Homework", "Project", "Work", "Personal"] as Category[]).map((c) => (
              <button
                key={c}
                onClick={() => set("category", c)}
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  draft.category === c ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Assignment link (optional)">
          <input
            value={draft.link || ""}
            onChange={(e) => set("link", e.target.value)}
            placeholder="Google Docs, Classroom, Canvas…"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </Field>
        <Field label={`Progress: ${draft.progress}%`}>
          <input
            type="range"
            min={0}
            max={100}
            value={draft.progress}
            onChange={(e) => set("progress", Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </Field>
      </div>
      <div className="mt-5 flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200"
        >
          Cancel
        </button>
        <button
          onClick={() => draft.title.trim() && onSave(draft)}
          className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-500"
        >
          Save task
        </button>
      </div>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-600">{label}</span>
      {children}
    </label>
  );
}

/* ---------- Proof Modal ---------- */
function ProofModal({
  task,
  onClose,
  onStatus,
  onVerified,
}: {
  task: Task;
  onClose: () => void;
  onStatus: (s: ProofStatus) => void;
  onVerified: () => void;
}) {
  const [status, setStatus] = useState<ProofStatus>(task.proofStatus);
  const [note, setNote] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const runCheck = (label: string) => {
    setNote(label);
    setStatus("checking");
    onStatus("checking");
    setTimeout(() => {
      // Simulated AI verdict — bias toward verified.
      const r = Math.random();
      const verdict: ProofStatus = r < 0.75 ? "verified" : r < 0.9 ? "review" : "incomplete";
      setStatus(verdict);
      onStatus(verdict);
      if (verdict === "verified") {
        setTimeout(onVerified, 700);
      }
    }, 1400);
  };

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) runCheck(`File: ${f.name}`);
  };

  const badge = proofBadge(status);

  return (
    <Modal onClose={onClose} title="Submit proof">
      <div className="mb-4 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Task</div>
        <div className="mt-0.5 text-sm font-bold text-slate-900">{task.title}</div>
        {task.description && <div className="mt-0.5 text-xs text-slate-500">{task.description}</div>}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <ProofBtn
          icon="📄"
          label="Upload document"
          hint="PDF, Word, PPT"
          onClick={() => fileRef.current?.click()}
        />
        <ProofBtn
          icon="🔗"
          label="Paste link"
          hint="Docs / Classroom / Canvas"
          onClick={() => {
            const url = window.prompt("Paste assignment link");
            if (url) runCheck(`Link: ${url}`);
          }}
        />
        <ProofBtn
          icon="📷"
          label="Camera"
          hint="Photo of handwritten work"
          onClick={() => cameraRef.current?.click()}
        />
        <ProofBtn
          icon="🖼️"
          label="From gallery"
          hint="Upload a photo"
          onClick={() => fileRef.current?.click()}
        />
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx,image/*"
        className="hidden"
        onChange={onFile}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onFile}
      />

      <div className="mt-5 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">AI verification</div>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.cls}`}>{badge.text}</span>
        </div>
        <div className="mt-2 min-h-[36px] text-sm text-slate-700">
          {status === "none" && <span className="text-slate-400">Choose a submission method above.</span>}
          {status === "checking" && (
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              Reviewing {note || "your submission"}…
            </span>
          )}
          {status === "verified" && <span>Great work — task marked complete. +25 XP.</span>}
          {status === "review" && <span>Looks close, but the AI flagged this for manual review.</span>}
          {status === "incomplete" && <span>The submission looks incomplete. Try again.</span>}
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

function ProofBtn({ icon, label, hint, onClick }: { icon: string; label: string; hint: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-1 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition hover:ring-blue-400 active:scale-[0.98]"
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-sm font-bold text-slate-900">{label}</span>
      <span className="text-[11px] text-slate-500">{hint}</span>
    </button>
  );
}

/* ---------- Focus Page ---------- */
function FocusPage({
  focusOn,
  setFocusOn,
  blocks,
  setBlocks,
  allow,
  setAllow,
}: {
  focusOn: boolean;
  setFocusOn: (v: boolean) => void;
  blocks: BlockItem[];
  setBlocks: (b: BlockItem[]) => void;
  allow: string[];
  setAllow: (a: string[]) => void;
}) {
  const [q, setQ] = useState("");
  const [customName, setCustomName] = useState("");
  const [allowInput, setAllowInput] = useState("");

  const filtered = blocks.filter((b) => b.name.toLowerCase().includes(q.toLowerCase()));

  const toggle = (id: string) =>
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, blocked: !b.blocked } : b)));
  const addCustom = () => {
    const name = customName.trim();
    if (!name) return;
    setBlocks([...blocks, { id: uid(), name, emoji: "🌐", blocked: true, custom: true }]);
    setCustomName("");
  };
  const removeItem = (id: string) => setBlocks(blocks.filter((b) => b.id !== id));
  const addAllow = () => {
    const v = allowInput.trim().toLowerCase();
    if (!v || allow.includes(v)) return;
    setAllow([...allow, v]);
    setAllowInput("");
  };
  const removeAllow = (v: string) => setAllow(allow.filter((x) => x !== v));

  return (
    <div className="space-y-5">
      <section className="flex items-center justify-between rounded-3xl bg-slate-900 p-5 text-white shadow-xl">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-300">Focus mode</div>
          <div className="mt-1 text-2xl font-black tracking-tight">{focusOn ? "ON" : "OFF"}</div>
          <p className="mt-1 text-xs text-slate-300">
            The DO UR WORK browser extension blocks these sites until tasks are verified.
          </p>
        </div>
        <button
          onClick={() => setFocusOn(!focusOn)}
          className={`relative h-9 w-16 rounded-full transition ${focusOn ? "bg-blue-600" : "bg-slate-700"}`}
          aria-label="Toggle focus"
        >
          <span
            className={`absolute top-1 h-7 w-7 rounded-full bg-white shadow transition-all ${focusOn ? "left-8" : "left-1"}`}
          />
        </button>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-black tracking-tight">Block list</h3>
          <span className="text-xs text-slate-500">{blocks.filter((b) => b.blocked).length} blocked</span>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search websites & apps…"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />
        <ul className="mt-3 divide-y divide-slate-100">
          {filtered.map((b) => (
            <li key={b.id} className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-lg">{b.emoji}</span>
                <div>
                  <div className="text-sm font-bold text-slate-900">{b.name}</div>
                  <div className="text-[11px] text-slate-500">{b.blocked ? "Blocked during focus" : "Allowed"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {b.custom && (
                  <button onClick={() => removeItem(b.id)} className="text-xs font-semibold text-red-600 hover:underline">
                    Remove
                  </button>
                )}
                <Switch on={b.blocked} onChange={() => toggle(b.id)} />
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2">
          <input
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Add site or app (e.g. news.ycombinator.com)"
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white"
          />
          <button
            onClick={addCustom}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
          >
            Add
          </button>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-black tracking-tight">Always allowed</h3>
          <span className="text-xs text-slate-500">{allow.length} sites</span>
        </div>
        <p className="mb-3 text-xs text-slate-500">
          These stay open even during focus — for real work like Docs, Classroom, Canvas.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {allow.map((a) => (
            <span key={a} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {a}
              <button onClick={() => removeAllow(a)} className="text-blue-500 hover:text-blue-700" aria-label={`Remove ${a}`}>
                ✕
              </button>
            </span>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={allowInput}
            onChange={(e) => setAllowInput(e.target.value)}
            placeholder="e.g. khanacademy.org"
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white"
          />
          <button
            onClick={addAllow}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-500"
          >
            Allow
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-dashed border-slate-300 p-4 text-xs text-slate-600">
        <span className="font-bold text-slate-900">How blocking works:</span> the DO UR WORK browser extension enforces
        this list in real time. When a task is verified, the extension is notified and unblocks the matching sites.
      </section>
    </div>
  );
}

function Switch({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full transition ${on ? "bg-blue-600" : "bg-slate-300"}`}
      aria-pressed={on}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-5" : "left-0.5"}`} />
    </button>
  );
}

/* ---------- Modal shell ---------- */
function Modal({ children, onClose, title }: { children: ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-black tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
