"use client";

import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend, CartesianGrid, LabelList,
  AreaChart, Area, Brush, ReferenceLine
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/dashboard/ui/card';
import api from '@/lib/api';

type EnrollmentItem = { month: string; count: number };
type CompletionItem = { name: string; value: number };

const COLORS = ['#2563eb', '#60a5fa', '#34d399', '#f59e0b', '#ef4444', '#a78bfa'];

function formatNumber(n: number) {
  return new Intl.NumberFormat().format(n);
}

// CustomTooltip will be defined inside the component so it can access chart data for deltas

export default function DashboardCharts() {
  const [enrollment, setEnrollment] = useState<EnrollmentItem[]>([]);
  const [completion, setCompletion] = useState<CompletionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyChartType, setMonthlyChartType] = useState<'area' | 'bar'>('area');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get('/academics/stats/enrollment').catch(() => ({ data: { monthly: [] } }));
        const compl = await api.get('/academics/stats/completion').catch(() => ({ data: { breakdown: [] } }));
        if (!mounted) return;
        // Defensive mapping: adapt if backend returns top-level arrays
        const monthly: EnrollmentItem[] = res.data?.monthly ?? res.data ?? [];
        const breakdown: CompletionItem[] = compl.data?.breakdown ?? compl.data ?? [];
        setEnrollment(monthly);
        setCompletion(breakdown);
      } catch (e) {
        // keep empty
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const totalEnrollments = useMemo(() => enrollment.reduce((s, i) => s + (i.count ?? 0), 0), [enrollment]);
  const avgEnrollment = useMemo(() => (enrollment.length ? Math.round(totalEnrollments / enrollment.length) : 0), [totalEnrollments, enrollment]);
  const lastDelta = useMemo(() => {
    if (enrollment.length < 2) return 0;
    const last = enrollment[enrollment.length - 1].count ?? 0;
    const prev = enrollment[enrollment.length - 2].count ?? 0;
    if (prev === 0) return 100;
    return Math.round(((last - prev) / prev) * 100);
  }, [enrollment]);

  function exportCSV(data: any[], filename = 'export.csv') {
    if (!data || !data.length) return;
    const keys = Object.keys(data[0]);
    const rows = [keys.join(','), ...data.map(row => keys.map(k => `"${String(row[k] ?? '')}"`).join(','))];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload || payload.length === 0) return null;
    const item = payload[0];
    // compute delta for labeled month vs previous
    const idx = enrollment.findIndex(e => e.month === label);
    let delta = null;
    if (idx > 0) {
      const prev = enrollment[idx - 1].count ?? 0;
      const cur = enrollment[idx].count ?? 0;
      if (prev !== 0) delta = Math.round(((cur - prev) / prev) * 100);
    }
    return (
      <div className="bg-white shadow rounded px-3 py-2 text-sm border">
        {label !== undefined && <div className="text-xs text-slate-500 mb-1">{label}</div>}
        <div className="font-medium">{item.name}: {formatNumber(item.value)}</div>
        {delta !== null && (
          <div className={`text-xs mt-1 ${delta >= 0 ? 'text-green-600' : 'text-rose-600'}`}>{delta >= 0 ? `+${delta}%` : `${delta}%`} vs prev</div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <CardTitle>Monthly Enrollments</CardTitle>
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-500 mr-4">Total: {formatNumber(totalEnrollments)}
                <span className={`ml-2 text-xs font-medium ${lastDelta >= 0 ? 'text-green-600' : 'text-rose-600'}`}>
                  {lastDelta >= 0 ? `▲ ${Math.abs(lastDelta)}%` : `▼ ${Math.abs(lastDelta)}%`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMonthlyChartType('area')}
                  className={`px-2 py-1 text-xs rounded ${monthlyChartType === 'area' ? 'bg-slate-100 text-slate-800' : 'text-slate-500'}`}>
                  Area
                </button>
                <button
                  onClick={() => setMonthlyChartType('bar')}
                  className={`px-2 py-1 text-xs rounded ${monthlyChartType === 'bar' ? 'bg-slate-100 text-slate-800' : 'text-slate-500'}`}>
                  Bars
                </button>
                <button onClick={() => exportCSV(enrollment, 'enrollment.csv')} className="px-2 py-1 text-xs rounded text-slate-600">Export</button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-72 flex items-center justify-center text-sm text-slate-500">Loading chart…</div>
          ) : enrollment.length === 0 ? (
            <div className="h-72 flex items-center justify-center text-sm text-slate-500">No enrollment data</div>
          ) : (
            <div style={{ width: '100%', height: 320 }} role="img" aria-label="Monthly enrollments chart">
              <ResponsiveContainer>
                {monthlyChartType === 'area' ? (
                  <AreaChart data={enrollment} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="gradEnroll" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e6e9ef" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis tickFormatter={(v) => formatNumber(Number(v))} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip content={<div />} />
                    <Legend verticalAlign="top" height={36} />
                    <Area type="monotone" dataKey="count" name="Enrollments" stroke="#2563eb" fill="url(#gradEnroll)" animationDuration={700} />
                    <ReferenceLine y={avgEnrollment} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: `Avg ${formatNumber(avgEnrollment)}`, position: 'right', fill: '#64748b' }} />
                    <Brush dataKey="month" height={28} stroke="#cbd5e1" travellerWidth={10} />
                  </AreaChart>
                ) : (
                  <BarChart data={enrollment} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="gradEnroll" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e6e9ef" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis tickFormatter={(v) => formatNumber(Number(v))} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip content={<div />} />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="count" name="Enrollments" fill="url(#gradEnroll)" radius={[6,6,0,0]} animationDuration={700}>
                      <LabelList dataKey="count" position="top" formatter={(v: any) => formatNumber(v)} />
                      {enrollment.map((_, idx) => (
                        <Cell key={`cell-enroll-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Bar>
                    <ReferenceLine y={avgEnrollment} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: `Avg ${formatNumber(avgEnrollment)}`, position: 'right', fill: '#64748b' }} />
                    <Brush dataKey="month" height={28} stroke="#cbd5e1" travellerWidth={10} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <CardTitle>Completion Breakdown</CardTitle>
            <div className="flex items-center gap-2">
              <button onClick={() => exportCSV(completion, 'completion.csv')} className="px-2 py-1 text-xs rounded text-slate-600">Export</button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-72 flex items-center justify-center text-sm text-slate-500">Loading chart…</div>
          ) : completion.length === 0 ? (
            <div className="h-72 flex items-center justify-center text-sm text-slate-500">No completion data</div>
          ) : (
            <div>
              <div className="mb-3" style={{ height: 36 }}>
                {/* small sparkline */}
                <ResponsiveContainer>
                  <AreaChart data={completion.slice(0, 8).map((c) => ({ name: c.name, value: c.value }))}>
                    <defs>
                      <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#spark)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ width: '100%', height: 260 }} role="img" aria-label="Completion breakdown bar chart">
                <ResponsiveContainer>
                  <BarChart layout="vertical" data={completion} margin={{ top: 5, right: 10, left: 90, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e6e9ef" />
                    <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis dataKey="name" type="category" width={180} tick={{ fontSize: 12, fill: '#334155' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="value" name="Completion (%)" fill="#10b981" radius={[6,6,6,6]} animationDuration={700}>
                      <LabelList dataKey="value" position="right" formatter={(v: any) => `${v}%`} />
                      {completion.map((_, idx) => (
                        <Cell key={`cell-comp-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
