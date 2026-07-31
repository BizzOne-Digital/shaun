"use client";

import { useEffect, useState } from "react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

type Settings = {
  name: string;
  tagline: string;
  heroHeadline: string;
  description: string;
  logoUrl: string;
  mascotUrl: string;
  contact: {
    phone: string;
    phoneHref: string;
    email: string;
    emailAlt: string;
    hoursLabel: string;
    locationLabel: string;
  };
  social: { facebook: string; website: string };
  mediaKitUrl: string;
  mediaKitAvailable: boolean;
  showAdvertisingPrices: boolean;
  genres: string[];
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setSettings(json.settings);
      });
  }, []);

  async function save() {
    if (!settings) return;
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    const json = await res.json();
    setMessage(json.ok ? "Settings saved." : json.error || "Save failed");
  }

  if (!settings) {
    return <p className="text-sm text-white/50">Loading settings…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Site Settings</h2>
          <p className="mt-1 text-sm text-white/50">
            Global brand, contact details, logos and toggles.
          </p>
        </div>
        <button type="button" className="admin-btn" onClick={save}>
          Save settings
        </button>
      </div>

      {message && <p className="text-sm text-white/70">{message}</p>}

      <div className="admin-card grid gap-4 md:grid-cols-2">
        <label className="admin-label">
          Station name
          <input
            className="admin-input mt-1"
            value={settings.name}
            onChange={(e) => setSettings({ ...settings, name: e.target.value })}
          />
        </label>
        <label className="admin-label">
          Tagline
          <input
            className="admin-input mt:1 mt-1"
            value={settings.tagline}
            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
          />
        </label>
        <label className="admin-label md:col-span-2">
          Hero headline
          <input
            className="admin-input mt-1"
            value={settings.heroHeadline}
            onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
          />
        </label>
        <label className="admin-label md:col-span-2">
          Description
          <textarea
            className="admin-input mt-1 min-h-24"
            value={settings.description}
            onChange={(e) => setSettings({ ...settings, description: e.target.value })}
          />
        </label>
      </div>

      <div className="admin-card space-y-4">
        <h3 className="font-bold text-white">Contact</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {(
            [
              ["email", "Email"],
              ["emailAlt", "Alt email"],
              ["phone", "Phone"],
              ["phoneHref", "Phone href (tel:+…)"],
              ["hoursLabel", "Hours label"],
              ["locationLabel", "Location label"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="admin-label">
              {label}
              <input
                className="admin-input mt-1"
                value={settings.contact[key] || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, [key]: e.target.value },
                  })
                }
              />
            </label>
          ))}
        </div>
      </div>

      <div className="admin-card space-y-4">
        <h3 className="font-bold text-white">Social</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="admin-label">
            Facebook
            <input
              className="admin-input mt-1"
              value={settings.social.facebook || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  social: { ...settings.social, facebook: e.target.value },
                })
              }
            />
          </label>
          <label className="admin-label">
            Website
            <input
              className="admin-input mt-1"
              value={settings.social.website || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  social: { ...settings.social, website: e.target.value },
                })
              }
            />
          </label>
        </div>
      </div>

      <div className="admin-card space-y-4">
        <ImageUploadField
          label="Logo"
          folder="misc"
          value={settings.logoUrl || ""}
          onChange={(logoUrl) => setSettings({ ...settings, logoUrl })}
        />
        <ImageUploadField
          label="Mascot"
          folder="misc"
          value={settings.mascotUrl || ""}
          onChange={(mascotUrl) => setSettings({ ...settings, mascotUrl })}
        />
      </div>

      <div className="admin-card space-y-3">
        <label className="admin-label">
          Media kit URL
          <input
            className="admin-input mt-1"
            value={settings.mediaKitUrl || ""}
            onChange={(e) => setSettings({ ...settings, mediaKitUrl: e.target.value })}
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={!!settings.mediaKitAvailable}
            onChange={(e) => setSettings({ ...settings, mediaKitAvailable: e.target.checked })}
          />
          Media kit available for download
        </label>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={!!settings.showAdvertisingPrices}
            onChange={(e) =>
              setSettings({ ...settings, showAdvertisingPrices: e.target.checked })
            }
          />
          Show advertising prices
        </label>
        <label className="admin-label">
          Genres (comma separated)
          <input
            className="admin-input mt-1"
            value={(settings.genres || []).join(", ")}
            onChange={(e) =>
              setSettings({
                ...settings,
                genres: e.target.value
                  .split(",")
                  .map((g) => g.trim())
                  .filter(Boolean),
              })
            }
          />
        </label>
      </div>
    </div>
  );
}
