import { useEffect, useCallback, useState } from "react";
import styles from "./keyboard.module.css";
import { highlightStyles } from "../utils/constants";

const compose = (key, accent) => {
  if (accent === "makcen") {
    switch (key) {
      case "l":
        return "ľ";
      case "s":
        return "š";
      case "c":
        return "č";
      case "t":
        return "ť";
      case "z":
        return "ž";
      case "d":
        return "ď";
      case "n":
        return "ň";
      default:
    }
  }
  if (accent === "dlzen") {
    switch (key) {
      case "l":
        return "ĺ";
      case "r":
        return "ŕ";
      case "y":
        return "ý";
      case "a":
        return "á";
      case "i":
        return "í";
      case "e":
        return "é";
      case "o":
        return "ó";
      case "u":
        return "ú";
      default:
    }
  }
  return key;
};

export const Keyboard = ({ onClick, results }) => {
  const [composing, setComposing] = useState(null);
  const style = { color: "white", background: "black", fontWeight: "bold" };
  const backspaceKey = { key: "←", code: "backspace", style };
  const enterKey = { key: "⏎", code: "enter", style };
  const rows = [
    ["ľ", "š", "č", "ť", "ž", "ĺ", "ŕ", "ď", "ň"],
    ["ý", "á", "í", "é", "ó", "ú", "ô", "ä"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    [enterKey, "Z", "X", "C", "V", "B", "N", "M", backspaceKey]
  ];

  const handleKey = useCallback(
    (code) => {
      onClick && onClick(code.toLowerCase());
    },
    [onClick]
  );

  const keyboardDown = useCallback(
    (e) => {
      if (e.key === "Dead" && e.code === "Equal") {
        setComposing(e.shiftKey ? "makcen" : "dlzen");
      }
      if (e.key.length === 1 || e.key === "Enter" || e.key === "Backspace") {
        handleKey(compose(e.key, composing));
        setComposing(false);
      }
    },
    [handleKey, composing]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyboardDown);

    return () => {
      document.removeEventListener("keydown", keyboardDown);
    };
  }, [keyboardDown]);

  const getStyle = (key) => {
    let styleIndex = -1;
    if (results) {
      Object.entries(results).forEach(([word, result]) => {
        if (word.includes(key.toLowerCase())) {
          styleIndex = Math.max(
            parseInt(result[word.indexOf(key.toLowerCase())], 10),
            styleIndex
          );
        }
      });
    }
    return highlightStyles[styleIndex];
  };

  return (
    <ul className={styles.wrapper}>
      {rows.map((keys, index) => (
        <li key={index}>
          <ul className={styles.row}>
            {keys.map((key) => (
              <li
                key={key.code || key}
                style={key.style || getStyle(key.code || key)}
                onClick={(e) => handleKey(key.code || key)}
              >
                {key.key || key}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};
