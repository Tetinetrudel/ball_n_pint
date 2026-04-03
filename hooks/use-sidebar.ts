"use client";

import { useState } from "react";

export function useSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => setCollapsed((prev) => !prev);

  return { collapsed, toggle };
}