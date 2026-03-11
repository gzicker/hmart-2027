import { useLanguage } from "@/contexts/LanguageContext";
import { LANGUAGES } from "@/i18n/translations";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const current = LANGUAGES.find((l) => l.code === language)!;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1.5 text-sm transition-colors hover:bg-secondary">
          <span className="text-base leading-none">{current.flag}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-40 p-1">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
              language === lang.code
                ? "bg-primary/10 font-medium text-primary"
                : "text-foreground hover:bg-secondary"
            }`}
          >
            <span className="text-base">{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
