import styles from "./help.module.css";
import { maxGuesses, highlightStyles } from "../utils/constants";

export const Help = ({ close }) => (
  <div className={styles.wrapper}>
    <a className={styles.close} onClick={close}>
      Zatvoriť
    </a>
    <div className={styles.help}>
      <h1>Ako hrať?</h1>
      <p>Máš {maxGuesses} pokusov uhádnuť slovo.</p>
      <p>
        Na každý pokus musíš hádať 5 písmenové slovo -{" "}
        <em>zadaj slovo a stlač enter</em>.
      </p>
      <p>Hádať môžeš iba platné slová. Databáza obsahuje takmer 3500 slov.</p>
      <p>Po každom pokuse ti ukážeme ako blízko bol tvoj tip:</p>
      <ul>
        <li>
          <span style={highlightStyles[0]}>šedá</span> - písmeno sa v hľadanom
          slove nenachádza
        </li>
        <li>
          <span style={highlightStyles[1]}>oranžová</span> - písmeno sa v
          hádanom slove nachádza, ale na inej pozícii ako v tvojom slove
        </li>
        <li>
          <span style={highlightStyles[2]}>zelená</span> - písmeno sa v hádanom
          slove nachádza na tom istom mieste ako v tvojom slove
        </li>
      </ul>
      <p>
        Inšpirované hrou{" "}
        <a href="https://www.powerlanguage.co.uk/wordle/" target="_blank">
          Wordle
        </a>
        .
      </p>
    </div>
  </div>
);
