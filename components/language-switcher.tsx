"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { code: "en", name: "English" },
  { code: "zh", name: "中文" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // 获取保存的语言设置
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (!savedLanguage) {
      // 如果没有保存的语言设置，则使用系统语言
      const systemLanguage = navigator.language.toLowerCase();
      const targetLang = systemLanguage.startsWith('zh') ? 'zh' : 'en';
      if (i18n.language !== targetLang) {
        i18n.changeLanguage(targetLang);
      }
    }
  }, [i18n]);

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    // 保存语言设置到 localStorage
    localStorage.setItem('i18nextLng', value);
  };

  // 在组件挂载前不渲染，避免水合错误
  if (!mounted) {
    return null;
  }

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
