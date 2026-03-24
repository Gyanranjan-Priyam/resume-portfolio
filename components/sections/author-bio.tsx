'use client';

import { Github, Globe, Instagram, Linkedin, Mail, Twitter } from "lucide-react";
import Image from "next/image";
import { Card } from "../ui/card";

/**
 * <AuthorBio />
 *
 * Props:
 *  name        string   – Author's display name
 *  initials    string   – 2-char fallback when no avatarSrc
 *  avatarSrc   string?  – Optional avatar image URL
 *  college     string   – College / institution name
 *  tagline     string?  – Overrides the default role line
 *  bio         string   – 2–3 sentence author paragraph
 *  github      string?  – GitHub profile URL
 *  linkedin    string?  – LinkedIn profile URL
 *  twitter     string?  – Twitter/X profile URL
 *  articles    number?  – Article count stat
 *  readers     string?  – Reader count stat e.g. "3.2k"
 *  yearsActive number?  – Years writing stat
 *  badge       string?  – Badge label (default: "GFG Campus Mantri")
 */

type AuthorBioProps = {
  name: string;
  initials: string;
  avatarSrc: string;
  college: string;
  tagline: string;
  bio: string;
  github: string;
  linkedin: string;
  twitter: string;
  articles: number;
  readers: string;
  yearsActive: number;
  badge: string;
}

export default function AuthorBio( {name, initials, avatarSrc, college, tagline, bio, github, linkedin, twitter, articles, readers, yearsActive, badge}: AuthorBioProps) {
  const roleLabel =
    tagline ||
    `ECE Student at ${college} · ${badge} · Web Developer`;

  const socials = [
    { href: "https://www.priyam.tech", Icon: Globe, label: "Website" },
    { href: "mailto:info@priyam.tech", Icon: Mail, label: "Email" },
    { href: github, Icon: Github, label: "GitHub" },
    { href: linkedin, Icon: Linkedin, label: "LinkedIn" },
    { href: twitter, Icon: Twitter, label: "Twitter" },
    { href: "https://www.instagram.com/gyanranjanpriyam", Icon: Instagram, label: "Instagram" },
  ].filter((s) => s.href);

  return (
    <div className="py-8 font-sans">
      {/* Section label */}
      <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400 font-medium mb-4">
        Written by
      </p>

      {/* Card */}
      <Card
        className="
          rounded-2xl border
          p-6 md:p-8
          flex flex-col items-center text-center
          md:flex-row md:items-start md:text-left
          gap-6
        "
      >
        {/* ── Avatar column ── */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div
            className="
              w-20 h-20 rounded-full
              border-2 border-amber-300 shadow-sm
              overflow-hidden
              
              flex items-center justify-center
            "
          >
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt={name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <span
                className="text-2xl font-bold text-amber-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {initials}
              </span>
            )}
          </div>

          {badge && (
            <span
              className="
                text-[9.5px] font-medium tracking-wide
                bg-amber-100 text-amber-800
                border border-amber-200
                rounded-full px-2.5 py-0.5
                whitespace-nowrap
              "
            >
              {badge}
            </span>
          )}
        </div>

        {/* ── Content column ── */}
        <div className="flex-1 min-w-0">
          {/* Name */}
          <h2
            className="text-2xl font-bold text-foreground tracking-widest mb-1"
            style={{ fontFamily: "var(--font-mokoto)" }}
          >
            {name}
          </h2>

          {/* Role / tagline */}
          <p className="text-xl mb-3 font-bold" style={{ fontFamily: "var(--font-jetbrains-mono"}}>{roleLabel}</p>

          {/* Stats row */}
          <div className="flex items-center gap-4 justify-center md:justify-start mb-4">
            {[
              { value: articles, label: "articles" },
              { value: readers, label: "readers" },
              { value: `${yearsActive} yrs`, label: "writing" },
            ].map(({ value, label }, i, arr) => (
              <div key={label} className="flex items-center gap-4">
                <span className="text-[13px]">
                  <span className="text-[14px] font-medium">
                    {value}
                  </span>{" "}
                  {label}
                </span>
                {i < arr.length - 1 && (
                  <div className="w-px h-4 bg-gray-200 self-center" />
                )}
              </div>
            ))}
          </div>

          {/* Bio */}
          <p className="text-[14px] leading-[1.75] mb-5">
            {bio}
          </p>

          {/* Social links */}
          {socials.length > 0 && (
            <div className="flex gap-2 justify-center md:justify-start">
              {socials.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="
                    w-9 h-9 rounded-full
                    bg-muted text-muted-foreground
                    flex items-center justify-center
                    border border-border
                    transition-all duration-150
                   
                  "
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}