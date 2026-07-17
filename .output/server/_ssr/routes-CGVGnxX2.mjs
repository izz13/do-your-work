import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CGVGnxX2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var uid = () => Math.random().toString(36).slice(2, 10);
var todayISO = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
var DEFAULT_TASKS = [
	{
		id: uid(),
		title: "Math homework — pg. 42",
		description: "Problems 1–20, show work.",
		dueDate: todayISO(),
		priority: "High",
		category: "Homework",
		link: "https://classroom.google.com",
		progress: 40,
		done: false,
		proofStatus: "none"
	},
	{
		id: uid(),
		title: "Read 10 pages of English novel",
		description: "Chapter 3, take notes.",
		dueDate: todayISO(),
		priority: "Medium",
		category: "Homework",
		progress: 0,
		done: false,
		proofStatus: "none"
	},
	{
		id: uid(),
		title: "Draft project proposal",
		description: "One-page summary + timeline.",
		dueDate: todayISO(),
		priority: "High",
		category: "Project",
		link: "https://docs.google.com",
		progress: 70,
		done: false,
		proofStatus: "none"
	}
];
var DEFAULT_BLOCKS = [
	{
		id: "tiktok",
		name: "TikTok",
		emoji: "🎵",
		blocked: true
	},
	{
		id: "instagram",
		name: "Instagram",
		emoji: "📸",
		blocked: true
	},
	{
		id: "youtube",
		name: "YouTube",
		emoji: "▶️",
		blocked: true
	},
	{
		id: "x",
		name: "X / Twitter",
		emoji: "𝕏",
		blocked: true
	},
	{
		id: "snapchat",
		name: "Snapchat",
		emoji: "👻",
		blocked: false
	},
	{
		id: "reddit",
		name: "Reddit",
		emoji: "👽",
		blocked: true
	},
	{
		id: "facebook",
		name: "Facebook",
		emoji: "📘",
		blocked: false
	},
	{
		id: "netflix",
		name: "Netflix",
		emoji: "🎬",
		blocked: false
	},
	{
		id: "twitch",
		name: "Twitch",
		emoji: "🎮",
		blocked: false
	},
	{
		id: "discord",
		name: "Discord",
		emoji: "💬",
		blocked: false
	}
];
var DEFAULT_ALLOW = [
	"docs.google.com",
	"classroom.google.com",
	"canvas.instructure.com",
	"mail.google.com",
	"office.com",
	"khanacademy.org"
];
function Index() {
	const [tab, setTab] = (0, import_react.useState)("home");
	const [tasks, setTasks] = (0, import_react.useState)(DEFAULT_TASKS);
	const [blocks, setBlocks] = (0, import_react.useState)(DEFAULT_BLOCKS);
	const [allow, setAllow] = (0, import_react.useState)(DEFAULT_ALLOW);
	const [focusOn, setFocusOn] = (0, import_react.useState)(true);
	const [xp, setXp] = (0, import_react.useState)(240);
	const [streak, setStreak] = (0, import_react.useState)(4);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [proofFor, setProofFor] = (0, import_react.useState)(null);
	const today = todayISO();
	const todayTasks = (0, import_react.useMemo)(() => tasks.filter((t) => t.dueDate === today), [tasks, today]);
	const completedToday = todayTasks.filter((t) => t.done).length;
	const upsertTask = (t) => setTasks((prev) => prev.some((x) => x.id === t.id) ? prev.map((x) => x.id === t.id ? t : x) : [t, ...prev]);
	const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));
	const toggleDone = (id) => setTasks((prev) => prev.map((t) => t.id === id ? {
		...t,
		done: !t.done,
		progress: !t.done ? 100 : t.progress
	} : t));
	const onVerified = (id) => {
		setTasks((prev) => prev.map((t) => t.id === id ? {
			...t,
			done: true,
			progress: 100,
			proofStatus: "verified"
		} : t));
		setXp((v) => v + 25);
		setStreak((v) => v + 1);
		try {
			window.postMessage({
				source: "do-ur-work",
				type: "task-completed",
				taskId: id
			}, "*");
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-slate-50 text-slate-900",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-5xl px-4 pb-32 pt-6 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
					focusOn,
					onToggleFocus: () => setFocusOn((v) => !v),
					xp,
					streak
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6",
					children: [
						tab === "home" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, {
							tasks: todayTasks,
							xp,
							streak,
							completedToday,
							focusOn,
							onOpenTasks: () => setTab("tasks"),
							onSubmitProof: (t) => setProofFor(t),
							onToggle: toggleDone
						}),
						tab === "tasks" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TasksPage, {
							tasks,
							onNew: () => setEditing({
								id: uid(),
								title: "",
								description: "",
								dueDate: today,
								priority: "Medium",
								category: "Homework",
								link: "",
								progress: 0,
								done: false,
								proofStatus: "none"
							}),
							onEdit: setEditing,
							onDelete: deleteTask,
							onToggle: toggleDone,
							onProof: setProofFor
						}),
						tab === "focus" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusPage, {
							focusOn,
							setFocusOn,
							blocks,
							setBlocks,
							allow,
							setAllow
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {
				tab,
				setTab
			}),
			editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskEditor, {
				task: editing,
				onClose: () => setEditing(null),
				onSave: (t) => {
					upsertTask(t);
					setEditing(null);
				}
			}),
			proofFor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProofModal, {
				task: proofFor,
				onClose: () => setProofFor(null),
				onStatus: (status) => {
					setTasks((prev) => prev.map((x) => x.id === proofFor.id ? {
						...x,
						proofStatus: status
					} : x));
				},
				onVerified: () => {
					onVerified(proofFor.id);
					setProofFor(null);
				}
			})
		]
	});
}
function Header({ focusOn, onToggleFocus, xp, streak }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 text-lg font-black text-white shadow-md shadow-blue-600/30",
				children: "✓"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-base font-black tracking-tight",
				children: "DO UR WORK"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] font-medium text-slate-500",
				children: "Finish work. Unlock the rest."
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "hidden rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 sm:inline-flex",
					children: [
						"🔥 ",
						streak,
						" day streak"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "hidden rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 sm:inline-flex",
					children: [
						"⚡ ",
						xp,
						" XP"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onToggleFocus,
					className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${focusOn ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" : "bg-slate-900 text-white"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${focusOn ? "animate-pulse bg-white" : "bg-slate-500"}` }),
						"Focus ",
						focusOn ? "ON" : "OFF"
					]
				})
			]
		})]
	});
}
function BottomNav({ tab, setTab }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "fixed inset-x-0 bottom-4 z-30 mx-auto flex w-[min(94%,420px)] items-center justify-between rounded-2xl bg-slate-900 p-1.5 shadow-xl",
		children: [
			{
				id: "home",
				label: "Home",
				icon: "🏠"
			},
			{
				id: "tasks",
				label: "Tasks",
				icon: "📋"
			},
			{
				id: "focus",
				label: "Focus",
				icon: "🛡️"
			}
		].map((it) => {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setTab(it.id),
				className: `flex flex-1 flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${tab === it.id ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-lg",
					children: it.icon
				}), it.label]
			}, it.id);
		})
	});
}
function Dashboard({ tasks, xp, streak, completedToday, focusOn, onOpenTasks, onSubmitProof, onToggle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-600/40 blur-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold uppercase tracking-wider text-blue-300",
							children: "Current focus session"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-end justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl font-black tracking-tight",
								children: focusOn ? "You're locked in." : "Focus is off."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-2xl font-black",
									children: ["🔥 ", streak]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] uppercase tracking-wider text-slate-400",
									children: "streak"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-slate-300",
							children: focusOn ? "Distracting sites are blocked. Finish tasks to unlock them." : "Turn Focus on to start blocking distractions."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "XP",
						value: String(xp),
						tint: "blue"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Done today",
						value: `${completedToday}/${tasks.length || 0}`,
						tint: "slate"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Streak",
						value: `${streak}d`,
						tint: "blue"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickBtn, {
						label: "Start Focus",
						icon: "🛡️",
						onClick: onOpenTasks,
						primary: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickBtn, {
						label: "Tasks",
						icon: "📋",
						onClick: onOpenTasks
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickBtn, {
						label: "Submit Proof",
						icon: "📤",
						onClick: () => {
							const next = tasks.find((t) => !t.done);
							if (next) onSubmitProof(next);
						}
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-black tracking-tight",
						children: "Today's tasks"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-slate-500",
						children: [
							tasks.length,
							" scheduled · ",
							completedToday,
							" complete"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onOpenTasks,
						className: "rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800",
						children: "View all"
					})]
				}), tasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { label: "Nothing due today. Nice." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: tasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskRow, {
						task: t,
						onToggle: () => onToggle(t.id),
						onProof: () => onSubmitProof(t)
					}, t.id))
				})]
			})
		]
	});
}
function StatCard({ label, value, tint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-2xl p-4 shadow-sm ${tint === "blue" ? "bg-blue-600 text-white" : "bg-white text-slate-900 ring-1 ring-slate-200"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] font-bold uppercase tracking-wider opacity-70",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-2xl font-black tracking-tight",
			children: value
		})]
	});
}
function QuickBtn({ label, icon, onClick, primary }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: `flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-4 text-xs font-bold transition active:scale-95 ${primary ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 hover:bg-blue-500" : "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xl",
			children: icon
		}), label]
	});
}
function EmptyState({ label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500",
		children: label
	});
}
function priorityBadge(p) {
	return {
		High: "bg-red-100 text-red-700",
		Medium: "bg-amber-100 text-amber-700",
		Low: "bg-slate-100 text-slate-600"
	}[p];
}
function proofBadge(s) {
	return {
		none: {
			text: "No proof yet",
			cls: "bg-slate-100 text-slate-600"
		},
		checking: {
			text: "⏳ Checking",
			cls: "bg-blue-100 text-blue-700"
		},
		verified: {
			text: "✅ Verified",
			cls: "bg-emerald-100 text-emerald-700"
		},
		review: {
			text: "⚠ Needs review",
			cls: "bg-amber-100 text-amber-700"
		},
		incomplete: {
			text: "❌ Incomplete",
			cls: "bg-red-100 text-red-700"
		}
	}[s];
}
function TaskRow({ task, onToggle, onProof, onEdit, onDelete }) {
	const badge = proofBadge(task.proofStatus);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
		className: "group rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:ring-blue-300",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onToggle,
				className: `mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition ${task.done ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 hover:border-blue-500"}`,
				"aria-label": "Toggle done",
				children: task.done && "✓"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-sm font-bold ${task.done ? "text-slate-400 line-through" : "text-slate-900"}`,
								children: task.title || "Untitled task"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${priorityBadge(task.priority)}`,
								children: task.priority
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white",
								children: task.category
							})
						]
					}),
					task.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-slate-500",
						children: task.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-blue-600 transition-all duration-500",
								style: { width: `${task.done ? 100 : task.progress}%` }
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] font-mono text-slate-500",
							children: [task.done ? 100 : task.progress, "%"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-slate-500",
								children: ["Due ", task.dueDate]
							}),
							task.link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: task.link,
								target: "_blank",
								rel: "noreferrer",
								className: "text-[11px] font-semibold text-blue-600 hover:underline",
								children: "🔗 Assignment link"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.cls}`,
								children: badge.text
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: onProof,
								className: "rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-blue-500",
								children: "Submit Proof"
							}),
							onEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: onEdit,
								className: "rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-200",
								children: "Edit"
							}),
							onDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: onDelete,
								className: "rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-red-600 hover:bg-red-50",
								children: "Delete"
							})
						]
					})
				]
			})]
		})
	});
}
function TasksPage({ tasks, onNew, onEdit, onDelete, onToggle, onProof }) {
	const [filter, setFilter] = (0, import_react.useState)("all");
	const filtered = tasks.filter((t) => filter === "all" ? true : filter === "open" ? !t.done : t.done);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-black tracking-tight",
					children: "Tasks"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-slate-500",
					children: "Create, track, and submit proof of your work."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onNew,
					className: "rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-500",
					children: "+ New task"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200",
				children: [
					"all",
					"open",
					"done"
				].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setFilter(f),
					className: `flex-1 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${filter === f ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"}`,
					children: f
				}, f))
			}),
			filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { label: "No tasks here. Add one to get started." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: filtered.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskRow, {
					task: t,
					onToggle: () => onToggle(t.id),
					onProof: () => onProof(t),
					onEdit: () => onEdit(t),
					onDelete: () => onDelete(t.id)
				}, t.id))
			})
		]
	});
}
function TaskEditor({ task, onClose, onSave }) {
	const [draft, setDraft] = (0, import_react.useState)(task);
	const set = (k, v) => setDraft((d) => ({
		...d,
		[k]: v
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		onClose,
		title: task.title ? "Edit task" : "New task",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Title",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: draft.title,
						onChange: (e) => set("title", e.target.value),
						placeholder: "e.g. Finish physics lab report",
						className: "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Description",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: draft.description,
						onChange: (e) => set("description", e.target.value),
						rows: 3,
						className: "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Due date",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: draft.dueDate,
							onChange: (e) => set("dueDate", e.target.value),
							className: "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Priority",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: draft.priority,
							onChange: (e) => set("priority", e.target.value),
							className: "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Low" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Medium" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "High" })
							]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Assignment type",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5",
						children: [
							"Homework",
							"Project",
							"Work",
							"Personal"
						].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => set("category", c),
							className: `rounded-full px-3 py-1 text-xs font-bold ${draft.category === c ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`,
							children: c
						}, c))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Assignment link (optional)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: draft.link || "",
						onChange: (e) => set("link", e.target.value),
						placeholder: "Google Docs, Classroom, Canvas…",
						className: "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: `Progress: ${draft.progress}%`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 0,
						max: 100,
						value: draft.progress,
						onChange: (e) => set("progress", Number(e.target.value)),
						className: "w-full accent-blue-600"
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onClose,
				className: "flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200",
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => draft.title.trim() && onSave(draft),
				className: "flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-500",
				children: "Save task"
			})]
		})]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-600",
			children: label
		}), children]
	});
}
function ProofModal({ task, onClose, onStatus, onVerified }) {
	const [status, setStatus] = (0, import_react.useState)(task.proofStatus);
	const [note, setNote] = (0, import_react.useState)("");
	const fileRef = (0, import_react.useRef)(null);
	const cameraRef = (0, import_react.useRef)(null);
	const runCheck = (label) => {
		setNote(label);
		setStatus("checking");
		onStatus("checking");
		setTimeout(() => {
			const r = Math.random();
			const verdict = r < .75 ? "verified" : r < .9 ? "review" : "incomplete";
			setStatus(verdict);
			onStatus(verdict);
			if (verdict === "verified") setTimeout(onVerified, 700);
		}, 1400);
	};
	const onFile = (e) => {
		const f = e.target.files?.[0];
		if (f) runCheck(`File: ${f.name}`);
	};
	const badge = proofBadge(status);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		onClose,
		title: "Submit proof",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-bold uppercase tracking-wider text-slate-500",
						children: "Task"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 text-sm font-bold text-slate-900",
						children: task.title
					}),
					task.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 text-xs text-slate-500",
						children: task.description
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProofBtn, {
						icon: "📄",
						label: "Upload document",
						hint: "PDF, Word, PPT",
						onClick: () => fileRef.current?.click()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProofBtn, {
						icon: "🔗",
						label: "Paste link",
						hint: "Docs / Classroom / Canvas",
						onClick: () => {
							const url = window.prompt("Paste assignment link");
							if (url) runCheck(`Link: ${url}`);
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProofBtn, {
						icon: "📷",
						label: "Camera",
						hint: "Photo of handwritten work",
						onClick: () => cameraRef.current?.click()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProofBtn, {
						icon: "🖼️",
						label: "From gallery",
						hint: "Upload a photo",
						onClick: () => fileRef.current?.click()
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				accept: ".pdf,.doc,.docx,.ppt,.pptx,image/*",
				className: "hidden",
				onChange: onFile
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: cameraRef,
				type: "file",
				accept: "image/*",
				capture: "environment",
				className: "hidden",
				onChange: onFile
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 rounded-2xl bg-white p-4 ring-1 ring-slate-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-bold uppercase tracking-wider text-slate-500",
						children: "AI verification"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.cls}`,
						children: badge.text
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 min-h-[36px] text-sm text-slate-700",
					children: [
						status === "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-slate-400",
							children: "Choose a submission method above."
						}),
						status === "checking" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-3 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" }),
								"Reviewing ",
								note || "your submission",
								"…"
							]
						}),
						status === "verified" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Great work — task marked complete. +25 XP." }),
						status === "review" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Looks close, but the AI flagged this for manual review." }),
						status === "incomplete" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "The submission looks incomplete. Try again." })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200",
					children: "Close"
				})
			})
		]
	});
}
function ProofBtn({ icon, label, hint, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: "flex flex-col items-start gap-1 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition hover:ring-blue-400 active:scale-[0.98]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-2xl",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-bold text-slate-900",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[11px] text-slate-500",
				children: hint
			})
		]
	});
}
function FocusPage({ focusOn, setFocusOn, blocks, setBlocks, allow, setAllow }) {
	const [q, setQ] = (0, import_react.useState)("");
	const [customName, setCustomName] = (0, import_react.useState)("");
	const [allowInput, setAllowInput] = (0, import_react.useState)("");
	const filtered = blocks.filter((b) => b.name.toLowerCase().includes(q.toLowerCase()));
	const toggle = (id) => setBlocks(blocks.map((b) => b.id === id ? {
		...b,
		blocked: !b.blocked
	} : b));
	const addCustom = () => {
		const name = customName.trim();
		if (!name) return;
		setBlocks([...blocks, {
			id: uid(),
			name,
			emoji: "🌐",
			blocked: true,
			custom: true
		}]);
		setCustomName("");
	};
	const removeItem = (id) => setBlocks(blocks.filter((b) => b.id !== id));
	const addAllow = () => {
		const v = allowInput.trim().toLowerCase();
		if (!v || allow.includes(v)) return;
		setAllow([...allow, v]);
		setAllowInput("");
	};
	const removeAllow = (v) => setAllow(allow.filter((x) => x !== v));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex items-center justify-between rounded-3xl bg-slate-900 p-5 text-white shadow-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-bold uppercase tracking-wider text-blue-300",
						children: "Focus mode"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-2xl font-black tracking-tight",
						children: focusOn ? "ON" : "OFF"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-slate-300",
						children: "The DO UR WORK browser extension blocks these sites until tasks are verified."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setFocusOn(!focusOn),
					className: `relative h-9 w-16 rounded-full transition ${focusOn ? "bg-blue-600" : "bg-slate-700"}`,
					"aria-label": "Toggle focus",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute top-1 h-7 w-7 rounded-full bg-white shadow transition-all ${focusOn ? "left-8" : "left-1"}` })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-black tracking-tight",
							children: "Block list"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-slate-500",
							children: [blocks.filter((b) => b.blocked).length, " blocked"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search websites & apps…",
						className: "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 divide-y divide-slate-100",
						children: filtered.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-lg",
									children: b.emoji
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-bold text-slate-900",
									children: b.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-slate-500",
									children: b.blocked ? "Blocked during focus" : "Allowed"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [b.custom && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => removeItem(b.id),
									className: "text-xs font-semibold text-red-600 hover:underline",
									children: "Remove"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									on: b.blocked,
									onChange: () => toggle(b.id)
								})]
							})]
						}, b.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: customName,
							onChange: (e) => setCustomName(e.target.value),
							placeholder: "Add site or app (e.g. news.ycombinator.com)",
							className: "flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: addCustom,
							className: "rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800",
							children: "Add"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-black tracking-tight",
							children: "Always allowed"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-slate-500",
							children: [allow.length, " sites"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-xs text-slate-500",
						children: "These stay open even during focus — for real work like Docs, Classroom, Canvas."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5",
						children: allow.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700",
							children: [a, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => removeAllow(a),
								className: "text-blue-500 hover:text-blue-700",
								"aria-label": `Remove ${a}`,
								children: "✕"
							})]
						}, a))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: allowInput,
							onChange: (e) => setAllowInput(e.target.value),
							placeholder: "e.g. khanacademy.org",
							className: "flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: addAllow,
							className: "rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-500",
							children: "Allow"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl border border-dashed border-slate-300 p-4 text-xs text-slate-600",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-bold text-slate-900",
					children: "How blocking works:"
				}), " the DO UR WORK browser extension enforces this list in real time. When a task is verified, the extension is notified and unblocks the matching sites."]
			})
		]
	});
}
function Switch({ on, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: onChange,
		className: `relative h-6 w-11 rounded-full transition ${on ? "bg-blue-600" : "bg-slate-300"}`,
		"aria-pressed": on,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-5" : "left-0.5"}` })
	});
}
function Modal({ children, onClose, title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-black tracking-tight",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200",
					"aria-label": "Close",
					children: "✕"
				})]
			}), children]
		})
	});
}
//#endregion
export { Index as component };
