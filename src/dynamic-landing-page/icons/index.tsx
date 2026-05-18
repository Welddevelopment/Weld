"use client";

import type { ComponentType, SVGProps } from "react";
import type { LucideProps } from "lucide-react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock,
  Code2,
  Folder,
  Paperclip,
  Send,
  Shield,
  Smile,
  User,
} from "lucide-react";

const stroke = 1.65;
const sz = 20;

function wrap(Icon: ComponentType<LucideProps>) {
  return function Wrapped(props: LucideProps) {
    return <Icon size={sz} strokeWidth={stroke} aria-hidden {...props} />;
  };
}

export const IconCheck = wrap(Check);
export const IconUser = wrap(User);
export const IconShield = wrap(Shield);
export const IconFolder = wrap(Folder);
export const IconCode = wrap(Code2);
export const IconClock = wrap(Clock);
export const IconArrowLeft = wrap(ArrowLeft);
export const IconArrowUpRight = wrap(ArrowUpRight);
export const IconChevronDown = wrap(ChevronDown);
export const IconPaperclip = wrap(Paperclip);
export const IconSmile = wrap(Smile);
export const IconSend = wrap(Send);

export { ArrowLeft, ArrowUpRight, Check, ChevronDown, Clock, Code2, Folder, Paperclip, Send, Shield, Smile, User };

function RobloxGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M5.2 3.8 20.2 7l-3.1 15-15-3.1 3.1-15Zm5.3 6.5-.8 4 4 .8.8-4-4-.8Z" />
    </svg>
  );
}

function DiscordGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.7 6.4A15 15 0 0 0 15 5.2l-.4.9a12.9 12.9 0 0 0-5.2 0L9 5.2a15 15 0 0 0-3.7 1.2c-2.3 3.4-2.9 6.7-2.6 10a15 15 0 0 0 4.6 2.3l.9-1.5c-.5-.2-1-.4-1.5-.7l.4-.3c2.9 1.4 6.1 1.4 9 0l.4.3c-.5.3-1 .5-1.5.7l.9 1.5a15 15 0 0 0 4.6-2.3c.4-3.8-.7-7-2.8-10Zm-9.5 7.9c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Zm5.6 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Z" />
    </svg>
  );
}

function GithubGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 3.2a8.9 8.9 0 0 0-2.8 17.3c.4.1.6-.2.6-.4v-1.7c-2.5.6-3-1.1-3-1.1-.4-1-.9-1.3-.9-1.3-.8-.5.1-.5.1-.5.9.1 1.4.9 1.4.9.8 1.4 2.1 1 2.6.8.1-.6.3-1 .6-1.2-2-.2-4.1-1-4.1-4.4 0-1 .3-1.8.9-2.4-.1-.2-.4-1.2.1-2.4 0 0 .8-.2 2.5.9a8.7 8.7 0 0 1 4.5 0c1.7-1.1 2.5-.9 2.5-.9.5 1.2.2 2.2.1 2.4.6.6.9 1.4.9 2.4 0 3.4-2.1 4.2-4.1 4.4.3.3.6.9.6 1.8v2.7c0 .2.2.5.6.4A8.9 8.9 0 0 0 12 3.2Z" />
    </svg>
  );
}

function LinkedInGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.8 8.9h3.1v10H6.8v-10Zm1.6-4.8a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6Zm3.5 4.8h3v1.4h.1c.4-.8 1.5-1.7 3-1.7 3.2 0 3.8 2.1 3.8 4.8v5.5h-3.1V14c0-1.2 0-2.7-1.7-2.7s-1.9 1.3-1.9 2.6v5h-3.1v-10Z" />
    </svg>
  );
}

export function IconRoblox(props: SVGProps<SVGSVGElement>) {
  return <RobloxGlyph width={20} height={20} {...props} />;
}
export function IconDiscord(props: SVGProps<SVGSVGElement>) {
  return <DiscordGlyph width={20} height={20} {...props} />;
}
export function IconGithub(props: SVGProps<SVGSVGElement>) {
  return <GithubGlyph width={20} height={20} {...props} />;
}
export function IconLinkedIn(props: SVGProps<SVGSVGElement>) {
  return <LinkedInGlyph width={20} height={20} {...props} />;
}
