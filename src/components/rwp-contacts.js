export function RWPContacts(element) {}

export const template = `
  <template>
    <h2>Rubic's web platform</h2>
    <rwp-color-scheme></rwp-color-scheme>
    <details id="contacts">
      <summary>Contacts</summary>
      <section id="content">
        <a href="mailto:niza@outlook.sk">niza@outlook.sk</a>
        <a href="tel:+421950265147">+421 950 265 147</a>
        <address>B1 32/2, Staré Grunty 53, Bratislava, Slovakia</address>
        <p>Nizomiddin Toshpulatov © 2020</p>
      </section>
    </details>
    <style>
      @import './styles/main.css';

      #contacts {
        overflow-y: auto;
        overflow-x: hidden;
      }

      #contacts summary {
        margin: 1.5rem 0;
      }

      #contacts *:not(summary) {
        font-size: .9em;
        opacity: .86;
      }

      #content {
        display: grid;
        gap: 1rem;
      }
    </style>
  </template>
`;
