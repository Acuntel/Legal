"use client";

import { useEffect, useState } from "react";

export default function DemoWidget() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Seed the demo firm first, then load widget
    async function init() {
      try {
        await fetch("/api/v1/demo/setup");
      } catch {
        // Demo firm might already exist, that's fine
      }

      // Load the widget script
      if (!document.getElementById("li-demo-widget")) {
        const script = document.createElement("script");
        script.id = "li-demo-widget";
        script.src = "/widget/legal-intake.js";
        script.setAttribute("data-api-key", "lgl_demo_kryder_law_public");
        script.async = true;
        document.body.appendChild(script);
        setLoaded(true);
      }
    }
    init();

    return () => {
      // Cleanup on unmount
      const script = document.getElementById("li-demo-widget");
      if (script) script.remove();
      const widget = document.getElementById("li-widget-root");
      if (widget) widget.remove();
    };
  }, []);

  return null;
}
