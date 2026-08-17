import type { LegalDoc, LegalDocId } from './types';

/**
 * The four legal documents, as editable Markdown.
 *
 * These are the same texts the site shipped as JSX, moved into the store so the
 * admin can edit them. `{{token}}` references resolve against the company and
 * contact records — so filling in the tax number once, in the admin, updates
 * every document that cites it, and an unfilled value still renders as a visible
 * pending marker instead of a blank.
 *
 * `draft: true` puts the "awaiting review" banner on the page. It stays true
 * until a qualified legal professional has signed the text off; the admin has a
 * switch for it, next to a warning that says exactly that.
 */
export function defaultLegalDocs(): Record<LegalDocId, LegalDoc> {
  return {
    impresszum: {
      title: 'Impresszum',
      lede: '',
      updated: '2026. augusztus 15.',
      draft: true,
      body: `## A szolgáltató adatai

- Étterem neve: {{restaurant.name}}
- Üzlet címe: {{contact.address}}
- Telefon: {{contact.phone}}
- Cégnév: {{company.legalName}}
- Székhely: {{company.seat}}
- Cégjegyzékszám: {{company.registrationNumber}}
- Adószám: {{company.taxNumber}}
- Nyilvántartó bíróság: {{company.registeringCourt}}
- Képviselő: {{company.representative}}
- E-mail: {{company.email}}

## Tárhelyszolgáltató

{{company.hostingProvider}}

## Panaszkezelés és jogorvoslat

Panaszával elsősorban közvetlenül az étteremhez fordulhat a fenti elérhetőségeken. Amennyiben a panasz kezelésével nem ért egyet, fogyasztóként a lakóhelye szerint illetékes békéltető testülethez, illetve a területileg illetékes kormányhivatal fogyasztóvédelmi feladatkörében eljáró szervéhez fordulhat.

Az étterem székhelye szerint illetékes békéltető testület: {{company.conciliationBoard}}

## Ételrendelés

Ez a weboldal nem fogad ételrendelést, és nem kezel fizetést. A házhozszállítást és az online rendelést a foodora (Delivery Hero) platformja biztosítja, saját szerződési feltételei szerint. A platformon leadott rendelésekre a foodora feltételei irányadóak.

## Szerzői jog

A weboldalon megjelenő szövegek, arculati elemek és fényképek szerzői jogi védelem alatt állnak. Felhasználásuk kizárólag az üzemeltető előzetes hozzájárulásával lehetséges.`,
    },

    adatkezeles: {
      title: 'Adatkezelési tájékoztató',
      lede: 'Ez a weboldal bemutató jellegű: nem fogad rendelést, nem kezel fizetést, és nem tart fenn felhasználói fiókokat.',
      updated: '2026. augusztus 15.',
      draft: true,
      body: `## 1. Az adatkezelő

- Az adatkezelő megnevezése: {{company.legalName}}
- Székhely: {{company.seat}}
- Üzlet: {{restaurant.name}} — {{contact.address}}
- Telefon: {{contact.phone}}
- E-mail: {{company.email}}

Az adatkezelő adatvédelmi tisztviselőt nem nevezett ki, mivel az adatkezelés jellege és mértéke ezt nem teszi kötelezővé.

## 2. Mire terjed ki ez a tájékoztató

Ez a tájékoztató a weboldal használatához kapcsolódó adatkezelésre vonatkozik. **Nem terjed ki** a foodora platformon leadott rendelésekre, a Google Térkép szolgáltatásra, illetve a közösségimédia-oldalainkra — ezek önálló adatkezelők, saját tájékoztatóval.

## 3. Milyen adatokat kezelünk

### 3.1. Adatvédelmi döntés

Az adatvédelmi választását és annak időpontját a böngészője helyi tárolójában (\`localStorage\`) őrizzük meg. Ez az adat nem kerül el a böngészőjéből, nem jut el hozzánk, és nem alkalmas az Ön azonosítására.

- **Jogalap:** jogos érdek (GDPR 6. cikk (1) f)), illetve az elektronikus hírközlési szabályok szerinti feltétlenül szükséges tárolás — a hozzájárulás nyilvántartása maga is kötelezettségünk.
- **Időtartam:** az Ön általi törlésig vagy visszavonásig.

### 3.2. Szervernaplók

A weboldalt kiszolgáló tárhelyszolgáltató a működés biztonsága érdekében technikai naplóállományokat vezethet (IP-cím, időbélyeg, lekért útvonal, böngészőazonosító).

- **Jogalap:** jogos érdek (GDPR 6. cikk (1) f)) — üzembiztonság és visszaélések megelőzése.
- **Időtartam:** {{company.hostingLogRetention}}

### 3.3. Beágyazott térkép

Ha hozzájárul a külső tartalom betöltéséhez, a Google Térkép beágyazása betöltődik, és a Google LLC megismerheti az IP-címét, valamint sütiket helyezhet el. Hozzájárulás nélkül a térkép nem töltődik be, és a Google felé semmilyen kérés nem indul.

- **Jogalap:** az Ön hozzájárulása (GDPR 6. cikk (1) a)), amely bármikor visszavonható.
- **Címzett:** Google Ireland Ltd. / Google LLC. Az adattovábbítás harmadik országba is irányulhat, a Google által alkalmazott garanciák mellett.

### 3.4. Telefonos megkeresés

Ha telefonon keres minket asztalfoglalás vagy kérdés céljából, a beszélgetés során közölt adatokat kizárólag a megkeresés teljesítéséhez használjuk fel. Hívásokat nem rögzítünk.

## 4. Amit nem teszünk

- Nem futtatunk analitikai vagy hirdetési nyomkövetőt.
- Nem készítünk profilt, és nem hozunk automatizált döntést.
- Nem kezelünk különleges személyes adatot.
- Nem értékesítjük és nem adjuk át adatait harmadik félnek marketing céljából.
- Ezen a weboldalon nincs regisztráció, hírlevél és fizetés.

## 5. Ételrendelés a foodorán

A weboldal rendelési gombjai a foodora platformjára vezetnek. A rendelés leadásakor Ön a foodora üzemeltetőjével kerül kapcsolatba, aki önálló adatkezelőként jár el; a megadott adatait a saját adatvédelmi tájékoztatója szerint kezeli. Az étterem a rendelés teljesítéséhez szükséges adatokat kapja meg a platformtól.

## 6. Adatfeldolgozók

Tárhelyszolgáltató: {{company.hostingProvider}}

## 7. Az Ön jogai

Az irányadó jogszabályok szerint Önt megilleti:

- a tájékoztatáshoz és a hozzáféréshez való jog,
- a helyesbítéshez való jog,
- a törléshez való jog,
- az adatkezelés korlátozásához való jog,
- az adathordozhatósághoz való jog,
- a tiltakozáshoz való jog a jogos érdeken alapuló adatkezelés ellen,
- a hozzájárulás bármikori visszavonásának joga.

Kérelmét a fenti elérhetőségeken juttathatja el hozzánk. A kérelmet legkésőbb egy hónapon belül megválaszoljuk.

## 8. Jogorvoslat

Ha úgy véli, hogy adatkezelésünk jogsértő, panaszt tehet a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH — 1055 Budapest, Falk Miksa utca 9–11., [naih.hu](https://naih.hu)), illetve bírósághoz fordulhat.

## 9. A tájékoztató módosítása

A tájékoztatót a szolgáltatás vagy a jogszabályi környezet változása esetén módosíthatjuk. A mindenkor hatályos változat ezen az oldalon érhető el, a frissítés dátumával.`,
    },

    cookie: {
      title: 'Cookie tájékoztató',
      lede: 'Ez az oldal a lehető legkevesebb tárolást használja, és semmilyen külső szolgáltatást nem tölt be az Ön hozzájárulása nélkül.',
      updated: '2026. augusztus 15.',
      draft: true,
      body: `## Röviden

Ez a weboldal **nem használ marketing- vagy nyomkövető sütiket**, és nem futtat analitikai szolgáltatást. Mindössze két dolgot érdemes tudni:

- A böngészője helyi tárolójában (\`localStorage\`) eltároljuk az adatvédelmi döntését, hogy ne kelljen minden látogatáskor újra megválaszolnia.
- A Megközelítés oldalon található Google Térkép külső szolgáltatás, amely saját sütiket helyezhet el. Ezt **csak akkor töltjük be, ha Ön ehhez hozzájárul**.

## Részletesen

### Szükséges tárolás

\`enzo-consent\` — Az Ön adatvédelmi döntését és annak időpontját tárolja. A böngészőjének helyi tárolójában marad, nem kerül elküldésre a szerverre, és nem alkalmas az Ön azonosítására vagy nyomon követésére. Törléséig, illetve a beállítások visszavonásáig marad meg.

### Külső tartalom — választható

Google Maps beágyazás — A Megközelítés oldalon és a főoldal térképblokkjában található beágyazott térképet a Google LLC szolgáltatja. Betöltésekor a Google sütiket helyezhet el, és megismerheti az Ön IP-címét. A térkép **alapértelmezetten nem töltődik be**: a helyén a cím, a koordináták és egy külső útvonaltervező hivatkozás jelenik meg, amely elhagyja ezt az oldalt. A Google adatkezeléséről a [Google adatvédelmi irányelveiben](https://policies.google.com/privacy) tájékozódhat.

### Amit nem használunk

A weboldal jelenleg nem futtat analitikai, hirdetési vagy közösségimédia-nyomkövető szolgáltatást. Amennyiben ez a jövőben megváltozik, a hozzájárulási felület új kategóriával bővül, és a korábbi döntéseket újra megkérdezzük.

## Hozzájárulás módosítása vagy visszavonása

Döntését bármikor megváltoztathatja. A visszavonás azonnal hatályba lép: a térkép beágyazása a következő megjelenítéskor már nem töltődik be. A lap alján található „Cookie beállítások” hivatkozással bármikor újra előhívhatja a kérdést.

A már elhelyezett sütiket a böngészője beállításaiban tudja törölni. Az adatkezelés részleteiről az [adatkezelési tájékoztatóban](/adatkezelesi-tajekoztato) olvashat.

## Kapcsolat

Sütikkel kapcsolatos kérdés esetén az üzemeltető elérhetősége: {{company.email}}`,
    },

    feltetelek: {
      title: 'Felhasználási feltételek',
      lede: 'Ez az oldal bemutató jellegű. Rendelést nem fogad, fizetést nem kezel, és szerződés nem jön létre rajta keresztül.',
      updated: '2026. augusztus 15.',
      draft: true,
      body: `## 1. Az oldal célja

Ez a(z) {{restaurant.name}} ({{contact.address}}) bemutatkozó weboldala. Célja, hogy tájékoztatást adjon az étteremről, az étlapról, a nyitvatartásról és a megközelítésről.

A weboldal **nem webáruház**: nem lehet rajta rendelést leadni, asztalt foglalni vagy fizetni, és a használatával az üzemeltető és a látogató között nem jön létre szerződés.

## 2. Rendelés és asztalfoglalás

A weboldal rendelési gombjai a foodora platformjára irányítanak. Az ott leadott rendelésekre a foodora mindenkori szerződési feltételei és adatkezelési tájékoztatója vonatkoznak; a rendelési folyamatra, a szállítási díjakra, a fizetésre és az elállási jogra az üzemeltetőnek ezen a weboldalon nincs ráhatása.

Asztalfoglalás telefonon lehetséges: {{contact.phone}}

## 3. Étlap és árak

Az étlapon szereplő tételek és árak tájékoztató jellegűek, és a foodorán közzétett aktuális kínálatot tükrözik a frissítés időpontjában. A pizzáknál feltüntetett árak **minimumárak**: feláras feltétekkel az ár magasabb lehet. Az étteremben és a foodorán érvényes mindenkori ár az irányadó.

Az árváltoztatás jogát fenntartjuk. A weboldalon szereplő ár nem minősül ajánlattételnek.

## 4. Allergének és ételérzékenység

A weboldal nem tartalmaz allergéninformációt. Ételallergia vagy -érzékenység esetén kérjük, rendelés vagy fogyasztás előtt egyeztessen munkatársainkkal telefonon vagy az étteremben.

## 5. Szellemi tulajdon

A weboldalon megjelenő szövegek, arculati elemek, logó és fényképek szerzői jogi védelem alatt állnak, és az üzemeltető, illetve a jogosultak tulajdonát képezik. Bármilyen felhasználásuk — másolás, többszörözés, közzététel, átdolgozás — kizárólag előzetes írásbeli hozzájárulással lehetséges.

## 6. Külső hivatkozások

A weboldal külső szolgáltatásokra mutató hivatkozásokat tartalmaz (foodora, Google Térkép, közösségi oldalak, Turul Gasztronómia). Ezek tartalmáért, elérhetőségéért és adatkezeléséért az üzemeltető nem felel.

## 7. Felelősség

Az üzemeltető törekszik a weboldalon közölt adatok pontosságára és naprakészségére, de nem vállal felelősséget az esetleges elírásokért, illetve azért, ha a nyitvatartás, a kínálat vagy az ár időközben megváltozik. Kérjük, hosszabb út előtt telefonon erősítse meg a nyitvatartást.

Az üzemeltető nem felel a weboldal esetleges üzemszüneteiből vagy hibáiból eredő károkért, a jogszabály által kötelezően előírt felelősség kivételével.

## 8. Adatkezelés

A weboldal adatkezelési gyakorlatáról az [adatkezelési tájékoztató](/adatkezelesi-tajekoztato), a sütikről és a külső tartalmakról a [cookie tájékoztató](/cookie-tajekoztato) ad felvilágosítást.

## 9. Módosítás és irányadó jog

A jelen feltételeket az üzemeltető bármikor módosíthatja; a mindenkor hatályos szöveg ezen az oldalon érhető el, a frissítés dátumával. A weboldal használatára a magyar jog az irányadó.

## 10. Üzemeltető

Az üzemeltető azonosító adatai és elérhetősége az [impresszumban](/impresszum) találhatók. Kapcsolat: {{company.email}}`,
    },
  };
}
