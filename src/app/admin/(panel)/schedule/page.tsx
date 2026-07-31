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
    fetch("/api/admin/schedule")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok && json.schedule) {
          setWeek(json.schedule.week);
          setTimezoneLabel(json.schedule.timezoneLabel || "Philippine Time (GMT+8)");
          setRaw(JSON.stringify(json.schedule.week, null, 2));
        }
      });
  }, []);

  useEffect(() => {
    if (week) setRaw(JSON.stringify(week, null, 2));
  }, [week]);

  function updateBlock(index: number, patch: Partial<ScheduleBlock>) {
    if (!week) return;
    const blocks = week[day].map((b, i) => (i === index ? { ...b, ...patch } : b));
    setWeek({ ...week, [day]: blocks });
  }

  function addBlock() {
    if (!week) return;
    setWeek({
      ...week,
      [day]: [...week[day], { start: "00:00", end: "01:00", showSlug: "" }],
    });
  }

  function removeBlock(index: number) {
    if (!week) return;
    setWeek({ ...week, [day]: week[day].filter((_, i) => i !== index) });
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
          <p className="mt-1 text-sm text-white/50">Weekly blocks in Philippine Time (24h).</p>
        </div>
        <button type="button" className="admin-btn" onClick={save}>
          Save schedule
        </button>
      </div>

      {message && <p className="text-sm text-white/70">{message}</p>}

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
