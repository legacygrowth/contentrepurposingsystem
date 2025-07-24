// components/ThemeCustomizer.tsx
import { useThemeStore } from "@/store/ThemeStore";
import React, { useState } from "react";

const ThemeCustomizer: React.FC = () => {
  const { theme, setTheme } = useThemeStore();
  const [bg, setBg] = useState(theme.background);
  const [text, setText] = useState(theme.text);

  const applyTheme = () => {
    setTheme({ background: bg, text });
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <label>
        Background Color:
        <input
          type="color"
          value={bg}
          onChange={(e) => setBg(e.target.value)}
        />
      </label>
      <br />
      <label>
        Text Color:
        <input
          type="color"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </label>
      <br />
      <button onClick={applyTheme} style={{ marginTop: "1rem" }}>
        Apply Theme
      </button>
    </div>
  );
};

export default ThemeCustomizer;
