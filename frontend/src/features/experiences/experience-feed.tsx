

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  Heart, MessageCircle, Share2, MapPin,
  VolumeX, Volume2, Play, ChevronUp, ChevronDown,
  Bell, BellOff, Users, Loader2, Search, X,
  Package, CalendarCheck, Globe, Menu,
} from "lucide-react";
import { cn } from "@/src/utils/cn";
import { useAuth } from "@/src/hooks/useAuth";
import { useToastStore } from "@/src/store/toast-store";
import { shareUrl } from "@/src/utils/share";
import { formatDate } from "@/src/utils/formatDate";
import type { Experience } from "@/src/types/experience";
import {
  useLikeExperienceMutation,
  useUnlikeExperienceMutation,
  useExperienceComments,
  useInfinitePublicFeed,
} from "./tourist-hooks";
import { useFollowSiteMutation, useUnfollowSiteMutation } from "@/src/features/sites/hooks";
import { useProtectedAction } from "@/src/features/auth/useProtectedAction";
import { LoadingState } from "@/src/components/shared/loading-state";
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";
import { ROUTES } from "@/src/constants/routes";
import { useQuery } from "@tanstack/react-query";
import { searchAll } from "@/src/lib/api/search";
import type { SearchSiteResult, SearchExperienceResult } from "@/src/lib/api/search";
import { usePublicFeed } from "./hooks";


// ── Caption with expand/collapse (TikTok-style) ──
function ExpandableCaption({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 80;
  const { data, isLoading, isError } = usePublicFeed();

  return (
    <div className="text-sm leading-6 text-white/90">
      {!expanded && isLong ? (
        <>
          <span>{text.slice(0, 80)}</span>
          <span className="text-white/40">... </span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
            className="text-white/70 font-semibold hover:text-white transition-colors"
          >
            more
          </button>
        </>
      ) : (
        <>
          <span>{text}</span>
          {isLong && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
              className="ml-1 text-white/70 font-semibold hover:text-white transition-colors"
            >
              less
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ── Search overlay ────────────────────────────
function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isFetching } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchAll(debouncedQuery),
    enabled: debouncedQuery.length >= 1,
    staleTime: 30_000,
  });

  const sites: SearchSiteResult[] = data?.data.sites ?? [];
  const experiences: SearchExperienceResult[] = data?.data.experiences ?? [];
  const hasResults = sites.length > 0 || experiences.length > 0;
  const isSearching = debouncedQuery.length >= 1;

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md">

      {/* Search bar */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
        {isFetching
          ? <Loader2 className="h-5 w-5 text-amber-400 animate-spin shrink-0" />
          : <Search className="h-5 w-5 text-white/40 shrink-0" />
        }
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search sites, experiences, locations..."
          className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 transition-all"
          >
            <X className="h-3 w-3" />
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="ml-1 text-xs font-semibold text-white/50 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">

        {!isSearching && (
          <div className="px-4 py-6 space-y-6">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">
                Explore
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Cultural Sites", href: ROUTES.sites, icon: Globe },
                  { label: "Packages", href: ROUTES.packages, icon: Package },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-all"
                  >
                    <item.icon className="h-4 w-4 text-amber-400" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {isSearching && isFetching && !data && (
          <div className="px-4 py-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-10 w-10 rounded-xl bg-white/10 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 w-2/3 rounded-full bg-white/10" />
                  <div className="h-2.5 w-1/3 rounded-full bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isSearching && !isFetching && !hasResults && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Search className="h-10 w-10 text-white/10" />
            <p className="text-sm text-white/40">
              No results for <span className="text-white/60 font-medium">"{debouncedQuery}"</span>
            </p>
            <p className="text-xs text-white/20">Try different keywords</p>
          </div>
        )}

        {isSearching && hasResults && (
          <div className="px-4 py-4 space-y-6">
            {sites.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">
                  Cultural Sites
                </p>
                <div className="space-y-1">
                  {sites.map((site) => (
                    <Link
                      key={site.id}
                      href={`/sites/${site.id}`}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-2xl px-3 py-2.5 hover:bg-white/8 transition-all"
                    >
                      {site.logo_url ? (
                        <img
                          src={site.logo_url}
                          alt={site.site_name}
                          className="h-10 w-10 shrink-0 rounded-xl object-cover border border-white/10"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/20 text-xs font-bold text-amber-400">
                          {site.site_name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {site.site_name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {site.location && (
                            <p className="flex items-center gap-1 text-xs text-white/40 truncate">
                              <MapPin className="h-2.5 w-2.5 shrink-0" />
                              {site.location}
                            </p>
                          )}
                          {site.verification_status === "verified" && (
                            <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 rounded-full px-1.5 py-0.5">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                      <Globe className="h-4 w-4 text-white/20 shrink-0 ml-auto" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {experiences.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">
                  Experiences
                </p>
                <div className="space-y-1">
                  {experiences.map((exp) => (
                    <Link
                      key={exp.id}
                      href={`/experiences/${exp.id}`}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-2xl px-3 py-2.5 hover:bg-white/8 transition-all"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                        <MessageCircle className="h-4 w-4 text-white/40" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white line-clamp-1">
                          {exp.caption}
                        </p>
                        {exp.location && (
                          <p className="flex items-center gap-1 text-xs text-white/40 mt-0.5 truncate">
                            <MapPin className="h-2.5 w-2.5 shrink-0" />
                            {exp.location}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Floating Navbar ───────────────────────────
function FeedNavbar({
  onSearchOpen,
}: {
  onSearchOpen: () => void;
}) {
  const { user, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Sites", href: ROUTES.sites, icon: Globe },
    { label: "Packages", href: ROUTES.packages, icon: Package },
    ...(isAuthenticated && user?.role === "tourist"
      ? [{ label: "Bookings", href: ROUTES.touristBookings, icon: CalendarCheck }]
      : []),
  ];

  return (
    <>
      <div className="absolute top-0 left-0 right-0 z-40 pointer-events-none">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">

          <Link
            href={ROUTES.welcome}
            className="pointer-events-auto flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 shadow-lg shadow-amber-400/30">
              <span className="text-xs font-black text-slate-900">CH</span>
            </div> */}
            <img
              src="/mock/logo_cultural_hub-bg.png"
              alt="CulturalHub"
              className="h-11 w-11 object-contain shrink-0"
              style={{ imageRendering: "crisp-edges" }}
            />
            {/* Text block — both lines tight together, matching logo colors */}
            <div className="flex flex-col justify-center leading-none gap-0.5">
              <span
                className="text-sm font-bold tracking-wide"
                style={{ color: "#f97316" }}   /* orange — matches left side of logo mark */
              >
                CulturalHub
              </span>
            </div>
          </Link>

          <div className="pointer-events-auto hidden items-center gap-1 rounded-2xl border border-white/10 bg-black/30 px-2 py-1.5 backdrop-blur-md sm:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-white/70 transition-all hover:bg-white/10 hover:text-white"
              >
                <link.icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSearchOpen(); }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all"
            >
              <Search className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all sm:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            {!isAuthenticated && (
              <Link
                href={ROUTES.login}
                onClick={(e) => e.stopPropagation()}
                className="hidden rounded-xl bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-900 hover:bg-amber-300 transition-all sm:block"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>

        {menuOpen && (
          <div
            className="pointer-events-auto mx-4 mt-1 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-md p-2"
            onClick={(e) => e.stopPropagation()}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all"
              >
                <link.icon className="h-4 w-4 text-amber-400" />
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <Link
                href={ROUTES.login}
                onClick={() => setMenuOpen(false)}
                className="mt-1 flex items-center justify-center rounded-xl bg-amber-400 px-3 py-2.5 text-sm font-bold text-slate-900 hover:bg-amber-300 transition-all"
              >
                Sign in to CulturalHub
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ── Feed Item ─────────────────────────────────
type ExperienceFeedItemProps = {
  experience: Experience;
  isActive: boolean;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  globalMuted: boolean;
  onMuteToggle: () => void;
};

function ExperienceFeedItem({
  experience,
  isActive,
  onNext,
  onPrev,
  isFirst,
  isLast,
  globalMuted,
  onMuteToggle,
}: ExperienceFeedItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [progress, setProgress] = useState(0);

  const { user } = useAuth();
  const { addToast } = useToastStore();
  const { runProtectedAction } = useProtectedAction();
  const isTourist = user?.role === "tourist";

  const likeMutation = useLikeExperienceMutation(experience.id);
  const unlikeMutation = useUnlikeExperienceMutation(experience.id);
  const [isFollowing, setIsFollowing] = useState(experience.provider.following ?? false);

  useEffect(() => {
    setIsFollowing(experience.provider.following ?? false);
  }, [experience.provider.following]);

  const followMutation = useFollowSiteMutation(experience.provider.id);
  const unfollowMutation = useUnfollowSiteMutation(experience.provider.id);

  const { data: comments = [] } = useExperienceComments(experience.id, 20);

  const firstMedia = experience.media_items?.[0];
  const isVideo = firstMedia?.media_type === "video";
  const mediaSrc = firstMedia?.media_url;

  // ── Core fix: drive play/pause purely from isActive ──
  // This handles both arrow-button navigation AND free scroll/swipe.
  // When isActive flips to false (any cause), we immediately pause + reset.
  // When isActive flips to true, we play after a short settle delay.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;

    if (isActive) {
      const t = setTimeout(() => {
        video.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }, 80);
      return () => clearTimeout(t);
    } else {
      // Immediate stop — no delay, no matter how the scroll happened
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive, isVideo]);

  // Sync mute state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = globalMuted;
  }, [globalMuted]);

  // Progress bar
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;
    const update = () => setProgress((video.currentTime / video.duration) * 100 || 0);
    video.addEventListener("timeupdate", update);
    return () => video.removeEventListener("timeupdate", update);
  }, [isVideo]);

  // Close comments when scrolled away
  useEffect(() => {
    if (!isActive) setShowComments(false);
  }, [isActive]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { video.play(); setIsPlaying(true); }
    else { video.pause(); setIsPlaying(false); }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    runProtectedAction(async () => {
      if (!isTourist) {
        addToast({ type: "error", title: "Not available", description: "Only tourists can like." });
        return;
      }
      try {
        if (experience.liked_by_current_user) {
          await unlikeMutation.mutateAsync();
        } else {
          await likeMutation.mutateAsync();
        }
      } catch {
        addToast({ type: "error", title: "Something went wrong" });
      }
    }, "Login as a tourist to like experiences.");
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    runProtectedAction(() => {
      if (!isTourist) {
        addToast({ type: "error", title: "Not available", description: "Only tourists can comment." });
        return;
      }
      setShowComments((prev) => !prev);
    }, "Login as a tourist to comment on experiences.");
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/experiences/${experience.id}`;
    try {
      const result = await shareUrl({ title: "Cultural Experience", text: "Check this out!", url });
      addToast({
        type: "success",
        title: result === "shared" ? "Shared!" : "Link copied",
        description: result === "shared" ? "Experience shared." : "Link copied to clipboard.",
      });
    } catch {
      addToast({ type: "error", title: "Could not share" });
    }
  };

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    runProtectedAction(async () => {
      if (!isTourist) {
        addToast({ type: "error", title: "Not available", description: "Only tourists can follow sites." });
        return;
      }
      const wasFollowing = isFollowing;
      setIsFollowing(!wasFollowing);
      try {
        if (wasFollowing) {
          await unfollowMutation.mutateAsync();
          addToast({ type: "success", title: "Unfollowed" });
        } else {
          await followMutation.mutateAsync();
          addToast({ type: "success", title: "Following!" });
        }
      } catch {
        setIsFollowing(wasFollowing);
        addToast({ type: "error", title: "Something went wrong" });
      }
    }, "Login as a tourist to follow cultural sites.");
  };

  const isFollowProcessing = followMutation.isPending || unfollowMutation.isPending;

  return (
    <div className="relative h-screen w-full snap-start snap-always overflow-hidden bg-black">

      {/* Media */}
      {isVideo && mediaSrc ? (
        <video
          ref={videoRef}
          src={mediaSrc}
          poster={firstMedia?.thumbnail_url ?? undefined}
          className="absolute inset-0 h-full w-full object-cover"
          loop
          muted={globalMuted}
          playsInline
          onClick={togglePlay}
        />
      ) : mediaSrc ? (
        <img
          src={mediaSrc}
          alt={experience.caption}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-slate-900" />
      )}

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-black/50 pointer-events-none" />

      {/* Video progress bar */}
      {isVideo && (
        <div className="absolute top-0 left-0 right-0 z-20 h-0.5 bg-white/10">
          <div
            className="h-full bg-amber-400 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Play/pause indicator */}
      {isVideo && !isPlaying && isActive && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
            <Play className="h-8 w-8 fill-white text-white ml-1" />
          </div>
        </div>
      )}

      {/* Provider info bar */}
      <div className="absolute top-14 left-0 right-0 z-20 flex items-center justify-between px-4 gap-3">
        <Link
          href={`/sites/${experience.provider.id}`}
          className="flex items-center gap-2.5 min-w-0"
          onClick={(e) => e.stopPropagation()}
        >
          {experience.provider.logo_url ? (
            <img
              src={experience.provider.logo_url}
              alt={experience.provider.site_name}
              className="h-10 w-10 shrink-0 rounded-2xl object-cover border border-white/20"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm text-xs font-bold text-white border border-white/20">
              {experience.provider.site_name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white leading-tight truncate">
              {experience.provider.site_name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {experience.provider.location && (
                <p className="flex items-center gap-1 text-xs text-white/60 truncate">
                  <MapPin className="h-2.5 w-2.5 shrink-0" />
                  {experience.provider.location}
                </p>
              )}
              {experience.provider.followers_count != null && (
                <p className="flex items-center gap-1 text-xs text-white/60 shrink-0">
                  <Users className="h-2.5 w-2.5" />
                  {experience.provider.followers_count.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2 shrink-0">
          {isVideo && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onMuteToggle(); }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all"
            >
              {globalMuted
                ? <VolumeX className="h-4 w-4" />
                : <Volume2 className="h-4 w-4" />
              }
            </button>
          )}

          <button
            type="button"
            onClick={handleFollowToggle}
            disabled={isFollowProcessing}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all disabled:opacity-50",
              isFollowing
                ? "border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                : "bg-amber-400 text-slate-900 hover:bg-amber-300 shadow-lg shadow-amber-400/25"
            )}
          >
            {isFollowing
              ? <><BellOff className="h-3 w-3" /> Following</>
              : <><Bell className="h-3 w-3" /> Follow</>
            }
          </button>
        </div>
      </div>

      {/* Right sidebar actions */}
      <div className="absolute right-3 bottom-32 z-20 flex flex-col items-center gap-6">

        <button type="button" onClick={handleLike} className="flex flex-col items-center gap-1.5">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200",
            experience.liked_by_current_user
              ? "bg-rose-500 scale-110 shadow-lg shadow-rose-500/40"
              : "bg-black/30 backdrop-blur-sm hover:bg-black/50"
          )}>
            <Heart className={cn(
              "h-6 w-6 transition-all",
              experience.liked_by_current_user ? "fill-white text-white" : "text-white"
            )} />
          </div>
          <span className="text-xs font-bold text-white drop-shadow-md">{experience.likes_count}</span>
        </button>

        <button type="button" onClick={handleComment} className="flex flex-col items-center gap-1.5">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200",
            showComments
              ? "bg-amber-500 shadow-lg shadow-amber-500/40"
              : "bg-black/30 backdrop-blur-sm hover:bg-black/50"
          )}>
            <MessageCircle className={cn(
              "h-6 w-6 transition-all",
              showComments ? "fill-white text-white" : "text-white"
            )} />
          </div>
          <span className="text-xs font-bold text-white drop-shadow-md">{experience.comments_count}</span>
        </button>

        <button type="button" onClick={handleShare} className="flex flex-col items-center gap-1.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all">
            <Share2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs font-bold text-white drop-shadow-md">Share</span>
        </button>

        <Link
          href={`/experiences/${experience.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-center gap-1.5"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm border border-white/20 hover:bg-black/50 transition-all">
            <span className="text-base text-white">→</span>
          </div>
          <span className="text-xs font-bold text-white drop-shadow-md">View</span>
        </Link>
      </div>

      {/* Up/Down arrows — left side */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
        {!isFirst && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
        )}
        {!isLast && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* ── Bottom info: date + caption, aligned with "View" button ── */}
      {/* bottom-32 matches the top of the right sidebar so they sit on the same line */}
      <div className="absolute bottom-32 left-0 right-16 z-20 px-4">
        <p className="mb-1.5 text-xs text-white/40">{formatDate(experience.created_at)}</p>
        <ExpandableCaption text={experience.caption} />
        {experience.media_items?.length > 1 && (
          <div className="mt-2.5 flex gap-1">
            {experience.media_items.map((_, i) => (
              <span key={i} className="h-1 w-4 rounded-full bg-white/30" />
            ))}
          </div>
        )}
      </div>

      {/* Comments drawer */}
      {showComments && (
        <div
          className="absolute inset-x-0 bottom-0 z-30 rounded-t-[28px] bg-white"
          style={{ maxHeight: "65vh", overflowY: "auto" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center pt-3 pb-2">
            <div className="h-1 w-10 rounded-full bg-slate-300" />
          </div>
          <div className="px-4 pb-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Comments
                {comments.length > 0 && (
                  <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                    {comments.length}
                  </span>
                )}
              </h3>
              <button
                type="button"
                onClick={() => setShowComments(false)}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </div>
            <CommentForm experienceId={experience.id} />
            {comments.length > 0 ? (
              <CommentList comments={comments} />
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-sm text-slate-500">No comments yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Fetch-more sentinel ───────────────────────
function FetchMoreSentinel({ onVisible }: { onVisible: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onVisible(); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible]);

  return (
    <div
      ref={ref}
      className="h-screen w-full snap-start snap-always bg-black flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-6 w-6 text-amber-400 animate-spin" />
        <p className="text-xs text-white/30 uppercase tracking-widest">Loading more</p>
      </div>
    </div>
  );
}

// ── Main Feed ─────────────────────────────────
export function ExperienceFeed() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [globalMuted, setGlobalMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePublicFeed();

  const experiences: Experience[] = data?.pages
    .flatMap((page) => page.data.items ?? [])
    .filter(Boolean) ?? [];

  // Splash
  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Auto-unmute after first scroll
  useEffect(() => {
    if (activeIndex > 0 && globalMuted) {
      setGlobalMuted(false);
    }
  }, [activeIndex]);

  // Pause ALL videos when search opens
  useEffect(() => {
    if (showSearch) {
      document.querySelectorAll("video").forEach((v) => {
        v.pause();
      });
    }
  }, [showSearch]);

  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    isProgrammaticScroll.current = true;
    setActiveIndex(index);
    container.scrollTo({ top: index * container.clientHeight, behavior: "smooth" });
    setTimeout(() => { isProgrammaticScroll.current = false; }, 450);
  }, []);

  const goNext = useCallback(() => {
    scrollToIndex(Math.min(activeIndex + 1, experiences.length - 1));
  }, [activeIndex, experiences.length, scrollToIndex]);

  const goPrev = useCallback(() => {
    scrollToIndex(Math.max(activeIndex - 1, 0));
  }, [activeIndex, scrollToIndex]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") goNext();
      if (e.key === "ArrowUp") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  // ── Core fix: use a high threshold (0.8) so activeIndex only updates
  // when a slide is almost fully in view. This ensures the outgoing slide's
  // isActive flips to false quickly, triggering its pause effect immediately.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(container.children).indexOf(entry.target as HTMLElement);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { root: container, threshold: 0.8 } // raised from 0.6 → 0.8
    );

    const observeChildren = () => {
      Array.from(container.children).forEach((child) => observer.observe(child));
    };
    observeChildren();

    const mutation = new MutationObserver(observeChildren);
    mutation.observe(container, { childList: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, []);

  // Pre-fetch next page
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    if (activeIndex >= experiences.length - 3) {
      fetchNextPage();
    }
  }, [activeIndex, experiences.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading || showSplash) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          
          <img
            src="/mock/logo_cultural_hub-bg.png"
            alt="CulturalHub"
            className="h-25 w-25 object-contain shrink-0 mt-0.4"
            style={{ imageRendering: "crisp-edges" }}
          />         
            <div className="flex flex-col mb-0.9">
              <span
                className="text-sm font-bold  "
                style={{ color: "#f97316" }}  
              >
                CulturalHub
              </span>
              
            </div>
          
        </div>
      </div>
    );
  }

  if (!experiences.length) return null;

  return (
    <div className="relative h-screen overflow-hidden">
      <FeedNavbar onSearchOpen={() => setShowSearch(true)} />

      {showSearch && (
        <SearchOverlay onClose={() => setShowSearch(false)} />
      )}

      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {experiences.map((experience, index) => (
          <ExperienceFeedItem
            key={experience.id}
            experience={experience}
            isActive={index === activeIndex && !showSplash && !showSearch}
            onNext={goNext}
            onPrev={goPrev}
            isFirst={index === 0}
            isLast={index === experiences.length - 1 && !hasNextPage}
            globalMuted={globalMuted}
            onMuteToggle={() => setGlobalMuted((v) => !v)}
          />
        ))}

        {hasNextPage && (
          <FetchMoreSentinel onVisible={fetchNextPage} />
        )}
      </div>
    </div>
  );
}



