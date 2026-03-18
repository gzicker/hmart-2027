import { useState, useRef, useEffect } from "react";
import { Play } from "lucide-react";

interface LazyTikTokEmbedProps {
  videoId: string;
  caption: string;
  username: string;
  views: string;
}

export default function LazyTikTokEmbed({ videoId, caption, username, views }: LazyTikTokEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ width: 325, height: 578 }} className="relative overflow-hidden rounded-xl bg-foreground/5">
      {loaded ? (
        <iframe
          src={`https://www.tiktok.com/embed/v2/${videoId}`}
          style={{ width: 325, height: 578, border: "none", borderRadius: 12, overflow: "hidden" }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={caption}
        />
      ) : (
        <button
          onClick={() => { if (inView) setLoaded(true); }}
          className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center transition-colors hover:bg-foreground/10"
          aria-label={`Play TikTok video: ${caption}`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
            <Play className="h-6 w-6 fill-current" />
          </div>
          <p className="text-sm font-medium text-foreground line-clamp-2">{caption}</p>
          <p className="text-xs text-muted-foreground">@{username} · {views} views</p>
          <span className="mt-1 text-xs font-medium text-primary">Tap to play</span>
        </button>
      )}
    </div>
  );
}
