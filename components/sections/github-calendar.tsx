"use client";

import { useEffect, useState } from "react";
import { GitHubCalendar as Calendar } from "react-github-calendar";

export function GitHubCalendarSection() {
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const html = document.documentElement;
    const update = () =>
      setColorScheme(html.classList.contains("dark") ? "dark" : "light");

    update();

    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="py-8">
      <h2 className="mb-6 text-3xl font-bold">GitHub Contributions</h2>
      <div className="overflow-x-auto">
        <Calendar username="gyanranjan-priyam" colorScheme={colorScheme} year={new Date().getFullYear()} />
      </div>
    </div>
  );
}
