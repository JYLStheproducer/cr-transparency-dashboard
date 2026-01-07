import { Newspaper, CalendarDays } from "lucide-react";
import { News } from "@/types/data";

interface NewsFeedProps {
  news: News[];
}

const NewsFeed = ({ news }: NewsFeedProps) => {
  return (
    <div className="bg-card rounded-2xl border shadow-card overflow-hidden animate-fade-in">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
            <Newspaper className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-display font-semibold text-foreground">
              Actualités
            </h2>
            <p className="text-sm text-muted-foreground">
              Dernières annonces du CR
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y">
        {news.map((item, index) => (
          <article 
            key={index} 
            className="p-6 hover:bg-muted/30 transition-colors animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary font-display font-bold text-sm shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <CalendarDays className="h-3 w-3" />
                  <time>{item.date}</time>
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {item.titre}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.texte}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
