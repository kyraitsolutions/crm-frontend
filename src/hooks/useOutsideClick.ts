// hooks/useOutsideClick.ts

import { useEffect, type RefObject } from "react";

const useOutsideClick = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  onOutsideClick: () => void,
  enabled = true,
) => {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!ref.current) return;

      const target = event.target as Node;

      if (!ref.current.contains(target)) {
        onOutsideClick();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onOutsideClick, enabled]);
};

export default useOutsideClick;
