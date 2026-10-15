# Instrucțiuni pentru agenți — Radovar

## IMPORTANT: păstrează conexiunile analytics la orice redesign

Radovar folosește analytics propriu și gestionarea consimțământului, cu rapoarte private în Company OS. La modificarea paginilor, secțiunilor, componentelor, meniurilor sau butoanelor, **păstrează ori reconectează instrumentarea elementelor modificate**. Un redesign trebuie să păstreze atât funcționarea paginii, cât și măsurarea corectă.

Implementarea poate fi încă în integrare pe branchul `codex/owned-analytics-radovar-20261015`. Dacă fișierele de mai jos lipsesc, verifică branchurile/worktree-urile și istoricul înainte de editare. Nu recrea analytics din presupuneri. Îmbină lucrările paralele și păstrează modificările celorlalți.

### Reguli pentru componente și navigare

- Păstrează ID-urile semantice pentru aceeași pagină/secțiune/acțiune, indiferent de aspect, text, poziție sau structură. Nu reutiliza un ID istoric pentru alt sens și nu elimina identificatori necesari rapoartelor.
- Păstrează în DOM `data-analytics-section`, `data-analytics-action`, `data-analytics-placement`, `data-analytics-target`, `data-analytics-section-id` și ceilalți markeri existenți care se aplică elementului. Un wrapper nou trebuie să transmită atributele către elementul interactiv real.
- ID-urile/acțiunile noi se înregistrează în SDK și validarea backend comune din repo-ul Codevalanche. Un tag arbitrar nu este suficient. Folosește evenimente explicite, fără captură după text, clase CSS sau conținutul formularelor.
- Păstrează `AnalyticsProvider` ca leaf global, fără să condiționeze conținutul paginii. Păstrează inițializarea unică, anularea importurilor/lucrărilor întârziate și cleanup-ul. Rerenderul/hash-ul nu sunt pageview nou; navigarea de rută/Back trebuie să corespundă paginii efectiv afișate.
- Păstrează comportamentul corect al ancorelor App Router și nu patch-ui global History. Nu amâna navigarea pentru analytics și nu opri acțiunea nativă doar pentru măsurare. Un click pe produs/tab trebuie înregistrat o singură dată.
- Păstrează `CookiePreferences` ca UI peste managerul comun, fără logică separată de cookie/receipt/coadă. Păstrează accesul din footer, inclusiv pointer-events, tastatura/focusul și poziția paginii la Accept/Decline. Refuzul/retragerea trebuie să funcționeze în timpul cererilor întârziate.
- Fără acord opțional valid nu crea identificatori/coadă și nu trimite evenimente. Contul A/P4 este separat de acordul de site W. Nu copia acorduri sau identificatori către Codevalanche prin linkuri și nu colecta URL/query brut, email, tokenuri, formular ori text DOM.
- Marchează schimbările materiale prin configurația existentă `pageVersion`; păstrează sensul metricilor și istoricul conform retenției/capabilităților. Versiunea paginii nu este versiunea definiției metricii.
- Păstrează configurația reală de mediu/activare și suportul BASE_PATH. Nu activa surse necalificate, nu folosi wildcard pentru preview și nu trimite teste în producție. Fără Google Analytics, al doilea tracker sau biblioteci externe de tracking.

### Zone de consultat înainte de editare

- `app/_components/AnalyticsProvider.tsx`, `CookiePreferences.tsx`.
- `app/analytics/config.ts`, `preferences.css`.
- `app/layout.tsx`, `SiteHeader.tsx`, `SiteFooter.tsx`, `ProductExplorer.tsx`, `DocPage.tsx` și markerii paginilor.
- `public/analytics/manifest.json`: proveniența distribuției comune.
- `scripts/analytics-browser-test.mjs`: comportamentele reale protejate de teste.

`public/analytics/owned-analytics.js` și manifestul sunt generate din `src/analytics/core` al repo-ului Codevalanche. Nu le modifica manual și nu crea un fork local. Orice schimbare a sursei comune necesită rebuild și verificarea identității celor două distribuții. Backendul, contractele și ID-urile noi se actualizează coordonat; o schimbare de design nu justifică resetarea datelor ori a proiectului Auth.

### Verificare proporțională cu schimbarea

Folosește runtime-ul pinuit (minimum Node 24.18.1), dependențele și lockfile-ul existente. Pentru markup/interacțiuni afectate verifică `npm run typecheck`, `npm run build` și `node scripts/analytics-browser-test.mjs`; pentru schimbări strict vizuale verifică suprafețele/markerii afectați fără suite fără legătură. Dacă atingi providerul/lifecycle-ul, verifică StrictMode real, navigare/hash/Back și eșecul încărcării SDK-ului; dacă schimbi rutarea/hostingul, verifică și exportul BASE_PATH.

Confirmă UI mobil/desktop, acțiune o singură dată, acord/refuz/retragere, focus și funcționarea normală fără analytics. Nu pretinde BFCache/hosted/activare publică dintr-un fixture ori doar din build. În raportul final spune ce legături ai păstrat/reconectat și ce probe ai executat. Păstrează commiturile și istoricul; nu înlocui proiectul cu un template care pierde integrarea.
