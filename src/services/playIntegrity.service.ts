// src/services/playIntegrity.service.ts
//npm install @capacitor/app
//npm install @capacitor-community/play-integrity
//npm run buid
//npm install express node-fetch jose
//npx cap sync
import { PlayIntegrity } from '@capacitor-community/play-integrity';
import { App } from '@capacitor/app';
import axios from 'axios';

const BACKEND = 'https://playintegrity-jki3iqjjdq-ew.a.run.app';


/**
 * Apelează Play Integrity și iese din aplicație dacă verdictul e invalid.
 */
export async function checkIntegrityAndBlockIfInvalid(): Promise<void> {
  try {
    const { data: { nonce } } = await axios.get(`${BACKEND}/getNonce`);
    console.log('[FE] Nonce:', nonce);

    const { token } = await PlayIntegrity.requestIntegrityToken({
      nonce,
      googleCloudProjectNumber: 1060811050620
    });
    console.log('[FE] Token:', token);

    const { data } = await axios.post(`${BACKEND}/verifyIntegrity`, { token, nonce });
    if (!data.isValid) {
      console.error('[FE] Verificare invalidă:', data.error);
      blockApp();
    } else {
      console.log('[FE] Verificare validă');
    }
  } catch (err) {
    // dacă e AxiosError, îi extragem răspunsul
    if (axios.isAxiosError(err)) {
      // afișăm răspunsul JSON complet din backend, dacă există
    console.error('[FE] AxiosError: ', JSON.stringify(err.response?.data, null, 2));
    } else {
      console.error('[FE] Error:', err);
    }
    blockApp();
  }
}

function blockApp() {
  alert('Eroare critică de integritate. Aplicația va fi închisă.');
  navigator['app']?.exitApp?.(); // sau altă metodă de blocare
  App.exitApp();
}
