import { Youtube, ExternalLink } from "lucide-react";

// 1. Updated interface to match backend
interface YouTubeVideo {
  title: string;
  channel: string;
  url: string;
  // The other fields (duration, views, etc.) are no longer expected from the backend
}

interface YouTubeVideoCardProps {
  video: YouTubeVideo;
}

export const YouTubeVideoCard = ({ video }: YouTubeVideoCardProps) => {
  return (
    <div className="p-4 bg-accent/5 rounded-xl border border-border hover:border-primary/50 transition-smooth group">
      <div className="flex items-start gap-3">
        <Youtube className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold line-clamp-2 mb-1">{video.title}</p>
          {/* 2. Simplified to only show channel */}
          <p className="text-xs text-muted-foreground">
            {video.channel}
          </p>
        </div>
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-smooth ml-auto"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};