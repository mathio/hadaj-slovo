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
          hádanom slove nachádza, ale na inej pozícii ako v tvojom slove (môže
          byť na už uhádnutej pozícii)
        </li>
        <li>
          <span style={highlightStyles[2]}>zelená</span> - písmeno sa v hádanom
          slove nachádza na tom istom mieste ako v tvojom slove (ale môže sa
          nachádzať aj viac krát - na iných miestach)
        </li>
      </ul>
      <p>
        Napríklad ak hádaš slovo <span className={styles.message}>ROBOT</span> a
        zadáš:
      </p>
      <ul>
        <li>
          <span style={highlightStyles[0]}>V</span>
          <span style={highlightStyles[0]}>Ý</span>
          <span style={highlightStyles[1]}>R</span>
          <span style={highlightStyles[0]}>U</span>
          <span style={highlightStyles[1]}>B</span>
          <ul>
            <li>R a B sa v hľadanom slove nachádzajú, ale na iných miestach</li>
            <li>V, Ý a U sa v hľadanom slove nenachádzajú</li>
          </ul>
        </li>
        <li>
          <span style={highlightStyles[0]}>H</span>
          <span style={highlightStyles[0]}>U</span>
          <span style={highlightStyles[0]}>M</span>
          <span style={highlightStyles[2]}>O</span>
          <span style={highlightStyles[1]}>R</span>
          <ul>
            <li>O sa v hľadanom slove nachádza, tiež na 4. mieste</li>
            <li>R sa v hľadanom slove nachádza, ale na 1. mieste, nie na 5.</li>
            <li>H, U a M sa v hľadanom slove nenachádzajú</li>
          </ul>
        </li>
        <li>
          <span style={highlightStyles[1]}>B</span>
          <span style={highlightStyles[2]}>O</span>
          <span style={highlightStyles[2]}>B</span>
          <span style={highlightStyles[2]}>O</span>
          <span style={highlightStyles[1]}>R</span>
          <ul>
            <li>
              O, B a O sa v hľadanom slove nachádzajú - na 2., 3., a 4. mieste
            </li>
            <li>B sa v hľadanom slove nachádza na inom mieste (na 3.)</li>
            <li>R sa v hľadanom slove nachádza na inom mieste (na 1.)</li>
          </ul>
        </li>
      </ul>
      <p>
        Inšpirované hrou{" "}
        <a href="https://www.powerlanguage.co.uk/wordle/" target="_blank">
          Wordle
        </a>
        . Naprogramované v{" "}
        <a href="https://nextjs.org/" target="_blank">
          NextJS
        </a>
        , zverejnené{" "}
        <a href="https://github.com/mathio/hadaj-slovo" target="_blank">
          na Githube
        </a>
        .
      </p>
      <p>
        <a href="https://hits.seeyoufarm.com/api/count/graph/dailyhits.svg?url=https://slovo.w2.sk">
          <img
            src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fslovo.w2.sk&count_bg=%23FF8C00&title_bg=%23007F00&icon=&icon_color=%23E7E7E7&title=po%C4%8Det+hr%C3%A1%C4%8Dov&edge_flat=false"
            alt="počet hráčov"
          />
        </a>
      </p>
    </div>
  </div>
);
