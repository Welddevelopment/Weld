"use client";

import { useEffect, useRef, type ElementType, type ComponentPropsWithoutRef } from "react";

type ScrollRevealProps<T extends ElementType = "div"> = {
  as?: T;
  delay?: 0 | 100 | 200 | 300 | 400;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "delay">;

export default function ScrollReveal<T extends ElementType = "div">({
  as,
  delay = 0,
  children,
  ...props
}: ScrollRevealProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const className = (props as Record<string, unknown>).className as string | undefined ?? "";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal
      {...(delay ? { "data-delay": delay } : {})}
      className={className}
      {...props}
    >
      {children}
    </Tag>
  );
}
