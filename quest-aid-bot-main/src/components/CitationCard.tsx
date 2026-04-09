import { FileText, ExternalLink } from "lucide-react";

interface Citation {
  filename: string;
  page: number;
  relevance: number;
  excerpt: string;
}

interface CitationCardProps {
  citation: Citation;
}

export const CitationCard = ({ citation }: CitationCardProps) => {
  return (
    <div className="p-4 bg-accent/5 rounded-xl border border-border hover:border-primary/50 transition-smooth">
      <div className="flex items-start gap-3 mb-2">
        <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{citation.filename}</p>
          <p className="text-xs text-muted-foreground">
            Page {citation.page} • {Math.round(citation.relevance * 100)}% relevant
          </p>
        </div>
        <button className="text-muted-foreground hover:text-primary transition-smooth">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-3">{citation.excerpt}</p>
    </div>
  );
};
