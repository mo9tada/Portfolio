"use client";

import { useEffect, useState } from "react";

/** Types, pauses, and deletes each word in turn. Screen readers get the full list. */
export function Typewriter({ words, className }: { words: string[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(words[0].length);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index];
    // Reduced motion: swap whole words instead of typing.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = setTimeout(() => {
        const next = (index + 1) % words.length;
        setIndex(next);
        setLength(words[next].length);
      }, 2600);
      return () => clearTimeout(id);
    }

    const done = !deleting && length === word.length;
    const empty = deleting && length === 0;
    const delay = done ? 1800 : empty ? 250 : deleting ? 35 : 70;

    const id = setTimeout(() => {
      if (done) setDeleting(true);
      else if (empty) {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      } else setLength((l) => l + (deleting ? -1 : 1));
    }, delay);
    return () => clearTimeout(id);
  }, [length, deleting, index, words]);

  return (
    <span className={className}>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden>
        {words[index].slice(0, length)}
        <span className="caret ml-0.5 inline-block w-[2px] translate-y-[2px] bg-accent">&nbsp;</span>
      </span>
    </span>
  );
}
