"use client";

import { useEffect, useState } from "react";
import type { DayKey, ScheduleBlock, WeekSchedule } from "@/types";

const DAYS: DayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export default function AdminSchedulePage() {
  const [week, setWeek] = useState<WeekSchedule | null>(null);
  const [timezoneLabel, setTimezoneLabel] = useState("Philippine Time (GMT+8)");
  const [day, setDay] = useState<DayKey>("monday");
  const [message, setMessage] = useState("");
  const [raw, setRaw] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/schedule")
      .then((r) => r.json())
      .then((json) => {
        if (cancelled || !json.ok || !json.schedule) return;
        setWeek(json.schedule.week);
        setTimezoneLabel(json.schedule.timezoneLabel || "Philippine Time (GMT+8)");
        setRaw(JSON.stringify(json.schedule.week, null, 2));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function commitWeek(next: WeekSchedule) {
    setWeek(next);
    setRaw(JSON.stringify(next, null, 2));
  }

  function updateBlock(index: number, patch: Partial<ScheduleBlock>) {
    if (!week) return;
    const blocks = week[day].map((b, i) => (i === index ? { ...b, ...patch } : b));
    commitWeek({ ...week, [day]: blocks });
  }

  function addBlock() {
    if (!week) return;
    commitWeek({
      ...week,
      [day]: [...week[day], { start: "00:00", end: "01:00", showSlug: "" }],
    });
  }

  function removeBlock(index: number) {
    if (!week) return;
    commitWeek({ ...week, [day]: week[day].filter((_, i) => i !== index) });
  }

  async function save() {
    let weekPayload = week;
    try {
      weekPayload = JSON.parse(raw) as WeekSchedule;
      setWeek(weekPayload);
    } catch {
      setMessage("Invalid JSON in raw editor.");
      return;
    }

    const res = await fetch("/api/admin/schedule", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ week: weekPayload, timezoneLabel }),
    });
    const json = await res.json();
    setMessage(json.ok ? "Schedule saved." : json.error || "Save failed");
  }

  if (!week) {
    return <p className="text-sm text-white/50">Loading schedule…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Schedule</h2>
          <p className="mt-1 text-sm text-white/50">
            Weekly blocks in Philippine Time (24h). This controls what appears on the Shows page grid
            and full schedule — not the Shows editor alone.
          </p>
        </div>
        <button type="button" className="admin-btn" onClick={save}>
          Save schedule
        </button>
      </div>

      {message && <p className="text-sm text-white/70">{message}</p>}

      <div className="admin-card space-y-2 border-lime/20 bg-lime/5 text-sm text-white/75">
        <p className="font-bold text-lime">Show slug must match a show in Admin → Shows</p>
        <p>
          Example: Sunday 9:00–14:00 with slug <code className="text-lime">golds</code> plays the Golds
          show. Friday regular programming = use slugs like <code className="text-lime">the-daily-dose</code>,{" "}
          <code className="text-lime">low-down</code>, etc. — copy slugs from the Shows list.
        </p>
      </div>

      <label className="admin-label max-w-md">
        Timezone label
        <input
          className="admin-input mt-1"
          value={timezoneLabel}
          onChange={(e) => setTimezoneLabel(e.target.value)}
        />
      </label>

      <div className="flex flex-wrap gap-2">
        {DAYS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDay(d)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${
              day === d ? "bg-lime text-ink" : "bg-white/5 text-white/60"
            }`}
          >
            {d.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {week[day].map((block, index) => (
          <div key={index} className="admin-card grid gap-3 md:grid-cols-4">
            <label className="admin-label">
              Start
              <input
                className="admin-input mt-1"
                value={block.start}
                onChange={(e) => updateBlock(index, { start: e.target.value })}
              />
            </label>
            <label className="admin-label">
              End
              <input
                className="admin-input mt-1"
                value={block.end}
                onChange={(e) => updateBlock(index, { end: e.target.value })}
              />
            </label>
            <label className="admin-label md:col-span-2">
              Show slug
              <div className="mt-1 flex gap-2">
                <input
                  className="admin-input"
                  value={block.showSlug}
                  onChange={(e) => updateBlock(index, { showSlug: e.target.value })}
                />
                <button type="button" className="text-xs text-magenta" onClick={() => removeBlock(index)}>
                  Remove
                </button>
              </div>
            </label>
          </div>
        ))}
        <button type="button" className="text-sm font-bold text-lime" onClick={addBlock}>
          + Add block
        </button>
      </div>

      <div className="admin-card space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-white/40">Raw JSON (advanced)</p>
        <textarea
          className="admin-input min-h-48 font-mono text-xs"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
        />
      </div>
    </div>
  );
}
