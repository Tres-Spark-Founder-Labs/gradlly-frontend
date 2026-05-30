"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { cn } from "@/utils/helper";

const CATEGORIES = [
  "Self-study/research",
  "Workshop/training course",
  "Shadowing/mentoring",
  "Project work (new skills)",
  "Portfolio/EPA prep",
  "Industry event",
];

const KSBS = [
  ...Array.from({ length: 12 }, (_, i) => `K${i + 1}`),
  ...Array.from({ length: 17 }, (_, i) => `S${i + 1}`),
  ...Array.from({ length: 9 }, (_, i) => `B${i + 1}`),
];

const INPUT =
  "w-full text-sm rounded-lg border border-neutral-200 px-3 py-2.5 text-neutral-800 placeholder:text-neutral-400 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-colors";

export function OTJLogForm() {
  const [selected, setSelected] = useState([]);
  const toggle = (k) =>
    setSelected((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));

  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-neutral-800">
          Log a new off-the-job session
        </h2>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-neutral-600 block mb-1.5">
              What did you do?
            </label>
            <input
              type="text"
              className={INPUT}
              placeholder="Describe the training activity..."
            />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-600 block mb-1.5">
              Category
            </label>
            <select className={INPUT}>
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-neutral-600 block mb-1.5">
                Date
              </label>
              <input type="date" className={INPUT} />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-600 block mb-1.5">
                Hours
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                className={INPUT}
                placeholder="0.0"
              />
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-neutral-600 mb-2">
            Maps to KSBs — tap the ones this session develops
          </p>
          <div className="flex flex-wrap gap-1.5">
            {KSBS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => toggle(k)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
                  selected.includes(k)
                    ? "bg-primary-700 border-primary-700 text-white"
                    : "bg-white border-neutral-200 text-neutral-600 hover:border-primary-300 hover:text-primary-700",
                )}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <Button type="submit" size="md">
            Log session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
