import styles from "./index.module.css";
import { useEffect, useState } from "react";
import { highlightStyles, LANG_EN, LANG_SK } from "../utils/constants";
import { useRouter } from "next/router";
import { saveGameCookie } from "../utils/cookie";

const languages = [
  {
    title: "english",
    set: { lang: LANG_EN, dia: false },
  },
  {
    title: "slovensky",
    set: { lang: LANG_SK, dia: false },
  },
  {
    title: "slovensky (s diakritikou)",
    set: { lang: LANG_SK, dia: true },
  },
];

export default function IndexPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({ lang: LANG_EN, dia: false });

  const startGame = () => {
    saveGameCookie({}); // clear previous game

    const { lang, dia } = settings;
    router.push(`/play?lang=${lang}&dia=${dia}`);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Le Word</h1>
      </div>
      <ul className={styles.menu}>
        <li>
          <p>Select language</p>
        </li>
        {languages.map(({ title, set }) => (
          <li key={title}>
            <button
              onClick={() => setSettings(set)}
              style={{
                ...(settings.lang === set.lang && settings.dia === set.dia
                  ? highlightStyles[1]
                  : highlightStyles[0]),
              }}
            >
              {title}
            </button>
          </li>
        ))}
        <li>&nbsp;</li>
        <li>
          <button onClick={startGame} style={highlightStyles[2]}>
            start game &rarr;
          </button>
        </li>
      </ul>
    </div>
  );
}
