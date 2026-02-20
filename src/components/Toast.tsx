"use client";

import { useEffect, useState, useCallback } from "react";

let showToastFn: ((msg: string) => void) | null = null;

export function useToast() {
  const show = useCallback((message: string) => {
    if (showToastFn) showToastFn(message);
  }, []);
  return show;
}

export default function Toast() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    showToastFn = (msg: string) => {
      setMessage(msg);
      setVisible(true);
      setTimeout(() => setVisible(false), 3000);
    };
    return () => {
      showToastFn = null;
    };
  }, []);

  return (
    <div className={`toast ${visible ? "show" : ""}`}>
      <span>🎉</span>
      <span>{message}</span>
    </div>
  );
}
