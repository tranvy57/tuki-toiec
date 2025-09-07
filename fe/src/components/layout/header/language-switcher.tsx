"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import Image from "next/image";

const languages = [
  { code: "vi", label: "Tiếng Việt" },
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const currentLang = languages.find((l) => l.code === locale);

  const changeLanguage = (newLocale: string) => {
    if (newLocale === locale) return;

    startTransition(() => {
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/`;
      window.location.reload();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex">
          {currentLang && (
            <Image
              src={`/flags/${currentLang.code}.svg`}
              alt={currentLang.label}
              width={20}
              height={15}
              className="rounded-sm opacity-60"
            />
          )}
          <Globe className="icon-button" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={
              lang.code === locale
                ? "text-red-400 font-bold pointer-events-none"
                : ""
            }
          >
            <div className="flex items-center gap-2">
              <Image
                src={`/flags/${lang.code}.svg`}
                alt={lang.label}
                width={20}
                height={15}
                className="rounded-sm"
              />
              <span>{lang.label}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
