import React, { useState } from "react";
import { 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Copy, 
  Check, 
  Award,
  Link as LinkIcon 
} from "lucide-react";
import { InterviewStarStory } from "../../types/career";
import { SAMPLE_STAR_STORIES } from "../../data/sampleCareerData";

export function InterviewKit() {
  const [stories, setStories] = useState<InterviewStarStory[]>(SAMPLE_STAR_STORIES);
  const [expandedId, setExpandedId] = useState<string | null>("star-1");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const copyStarStory = (story: InterviewStarStory) => {
    const text = `COMPETENCY: ${story.competency}
QUESTION: ${story.question}
SITUATION: ${story.star.situation}
TASK: ${story.star.task}
ACTION: ${story.star.action}
RESULT: ${story.star.result}`;
    navigator.clipboard.writeText(text);
    setCopiedId(story.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            Interview Preparation Kit
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            STAR Story Bank &amp; Competency Questions
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            UK hiring managers assess candidates using structured competency-based frameworks. 
            This kit extracts high-probability interview questions from your target job and links them directly to your 
            verified CV bullets in the proven <strong>STAR</strong> format (Situation, Task, Action, Result).
          </p>
        </div>
      </div>

      {/* Stories List */}
      <div className="space-y-4">
        {stories.map((story) => {
          const isExpanded = expandedId === story.id;

          return (
            <div 
              key={story.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-all"
            >
              <div 
                onClick={() => toggleExpand(story.id)}
                className="p-5 cursor-pointer flex items-start justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {story.competency}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <LinkIcon className="w-3 h-3 text-slate-400" />
                      Linked to CV achievement
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    "{story.question}"
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    CV Bullet: {story.linkedCvBullet}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyStarStory(story);
                    }}
                    className="p-2 rounded-lg text-xs text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Copy STAR Story"
                  >
                    {copiedId === story.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <div className="p-1 rounded-lg text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">
                        S - Situation (Context)
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {story.star.situation}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">
                        T - Task (Your Responsibility)
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {story.star.task}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
                        A - Action (What You Specifically Did)
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {story.star.action}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">
                        R - Result (Measurable UK Impact)
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {story.star.result}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
