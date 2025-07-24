import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const themes = {
  blue: {
    name: "blue",
    isTailwind: true,
    buttonColor: "bg-blue-500",
    textColor: "text-blue-500",
    navbarHover: "hover:text-blue-500"
  },
  green: {
    name: "green",
    isTailwind: true,
    buttonColor: "bg-green-500",
    textColor: "text-green-500",
    navbarHover: "hover:text-green-500"
  },
  red: {
    name: "red",
    isTailwind: true,
    buttonColor: "bg-red-500",
    textColor: "text-red-500",
    navbarHover: "hover:text-red-500"
  },
  purple: {
    name: "purple",
    isTailwind: true,
    buttonColor: "bg-purple-500",
    textColor: "text-purple-500",
    navbarHover: "hover:text-purple-500"
  },
  yellow: {
    name: "yellow",
    isTailwind: true,
    buttonColor: "bg-yellow-500",
    textColor: "text-yellow-500",
    navbarHover: "hover:text-yellow-500"
  },
  pink: {
    name: "pink",
    isTailwind: true,
    buttonColor: "bg-pink-500",
    textColor: "text-pink-500",
    navbarHover: "hover:text-pink-500"
  }
};

export const ThemeProvider = ({ children }) => {
  const getInitialTheme = () => {
    const saved = localStorage.getItem("theme");
    if (!saved) return themes.blue;

    try {
      const parsed = JSON.parse(saved);
      return parsed.name && themes[parsed.name]
        ? themes[parsed.name]
        : { ...parsed, isTailwind: false };
    } catch {
      return themes.blue;
    }
  };

  const [theme, setTheme] = useState(getInitialTheme);

  const changeTheme = (colorNameOrHex) => {
    let newTheme;

    if (themes[colorNameOrHex]) {
      newTheme = themes[colorNameOrHex];
    } else if (/^#[0-9A-Fa-f]{6}$/.test(colorNameOrHex)) {
      newTheme = {
        name: "custom",
        isTailwind: false,
        buttonColor: colorNameOrHex,
        textColor: colorNameOrHex,
        navbarHover: colorNameOrHex
      };
    } else {
      return;
    }

    setTheme(newTheme);
    localStorage.setItem("theme", JSON.stringify(newTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
