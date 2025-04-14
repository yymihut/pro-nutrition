// src/services/playIntegrity.service.ts
//npm install @capacitor/app
//npm install @capacitor-community/play-integrity
//npm run buid
//npm install express node-fetch jose
//npx cap sync
import { PlayIntegrity } from '@capacitor-community/play-integrity';
import { App } from '@capacitor/app';

/**
 * Apelează Play Integrity și iese din aplicație dacă verdictul e invalid.
 */
export async function checkIntegrityAndBlockIfInvalid() {
  try {
    // 1) Obținem nonce-ul de la server
    const nonceResponse = await fetch('https://playintegrity-jki3iqjjdq-ew.a.run.app/getNonce');
    if (!nonceResponse.ok) {
      throw new Error('Eroare la obținerea nonce-ului de pe server');
    }
    const { nonce } = await nonceResponse.json();

    // 2) Obținem tokenul de integritate de la pluginul Play Integrity
    const result = await PlayIntegrity.requestIntegrityToken({
      nonce: nonce,
      googleCloudProjectNumber: 1060811050620, // Înlocuiește cu ID-ul tău GCP dacă e nevoie
    });

    // 3) Trimitem token-ul la server pentru validare
    const verifyResponse = await fetch('https://playintegrity-jki3iqjjdq-ew.a.run.app/verifyIntegrity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: result.token }),
    });

    if (!verifyResponse.ok) {
      // Dacă serverul nu răspunde cu 200, tratăm ca eșec
      throw new Error('Eroare la verificarea token-ului pe server');
    }

    // 4) Interpretăm răspunsul de la server
    const verificationData = await verifyResponse.json();
    if (!verificationData.isValid) {
      // Blocăm accesul: ieșim din aplicație
      console.log('Play Integrity INVALID - blocăm accesul și închidem aplicația');
      alert('Aplicația a detectat un mediu neconform. Se va închide.');
      // Închidere aplicație
      await App.exitApp();
      return;
    }

    // Dacă totul e OK
    console.log('Play Integrity check PASSED');
  } catch (err) {
    console.error('Eroare Play Integrity:', err);
    alert('Nu s-a putut verifica integritatea aplicației. Se va închide.');
    // Poți decide să închizi aplicația sau să lași utilizatorul să continue.
    // Aici, de exemplu, o închidem:
    await App.exitApp();
  }
}
