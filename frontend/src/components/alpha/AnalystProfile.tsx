"use client";

import { formatDistanceToNow } from "date-fns";
import { TrendingUp, AlertTriangle, Clock } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AnalystProfile as AnalystProfileType } from "@/hooks/use-copilot-api";

type Props = {
  profile: AnalystProfileType;
  lastUpdated?: string;
};

export function AnalystProfile({ profile, lastUpdated }: Props) {
  return (
    <div className="space-y-6">
      {/* Meta */}
      {(profile.domain || lastUpdated || profile.last_updated) && (
        <div className="flex items-center gap-3 text-xs text-slate-400">
          {profile.domain && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium capitalize">
              {profile.domain}
            </span>
          )}
          {(lastUpdated ?? profile.last_updated) && (
            <span>
              Updated{" "}
              {formatDistanceToNow(new Date(lastUpdated ?? profile.last_updated!), {
                addSuffix: true,
              })}
            </span>
          )}
        </div>
      )}

      {/* Current Outlook */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-700">Current Outlook</h3>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
            {profile.current_outlook ?? "No outlook available yet."}
          </p>
        </CardContent>
      </Card>

      {/* Key Themes */}
      {profile.key_themes && profile.key_themes.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-slate-700">Key Themes</h3>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.key_themes.map((theme) => (
                <Badge key={theme} variant="accent">
                  {theme}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Summary */}
      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-slate-700">Recent Summary</h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
            {profile.recent_summary ?? "No summary available yet."}
          </p>
        </CardContent>
      </Card>

      {/* Confidence Signals */}
      {profile.confidence_signals && Object.keys(profile.confidence_signals).length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-700">Confidence Signals</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(profile.confidence_signals).map(([key, value]) => (
                <div key={key} className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{key.replace(/_/g, " ")}</p>
                  <p className="text-sm font-semibold text-slate-700 mt-1">{String(value)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Change Log */}
      {profile.change_log && profile.change_log.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-700">Change Log</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile.change_log.map((entry, i) => (
                <div key={`${entry.timestamp}-${i}`} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-slate-300 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs text-slate-400">
                      {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                    </span>
                    <p className="text-slate-600">
                      <span className="font-medium">{entry.field}</span> updated
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
