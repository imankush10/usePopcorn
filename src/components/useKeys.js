import { useEffect } from "react";

export function useKeys(key, action) {
  useEffect(() => {
    function callback(e) {
      if (e.code === key) {
        action();
      }
    }
    document.addEventListener("keydown", callback);

    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, [action, key]);
}
