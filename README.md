# Atmos Radionica

**Atmos Radionica** je web aplikacija (PWA) za auto servis: radni nalozi sa statusima, baza vozila, mehaničari, podsetnici na redovne servise, predračun i račun za štampu. Instalira se na telefon ili računar, radi i bez interneta, a sama se ažurira sa https sajta.

Svi podaci se čuvaju lokalno na uređaju — nema naloga, servera ni praćenja.

## Mogućnosti

- **Radni nalozi** — statusi **Uzet u rad → U obradi → Završen**, plaćeno / za naplatu, dodela mehaničara, opis kvara, stavke (rad i delovi) sa količinom i cenom, popust, automatski brojevi (`N-2026-0001`)
- **Štampa** — radni nalog (sa poljima za potpis), **predračun** i **račun** jednim klikom; štampa ili „Sačuvaj kao PDF“ iz pregledača
- **Baza vozila** — tablica, **VIN** (provera formata i prepoznavanje marke), marka, model, godina, **kubikaža (cm³)**, **snaga (kW / KS)**, gorivo, kilometraža, vlasnik, telefon, servisna istorija po vozilu
- **Skeniranje saobraćajne dozvole kamerom (OCR)** — popunjava tablicu, VIN, kubikažu, snagu, marku, model, gorivo, godinu i vlasnika; rezultat se uvek proverava u formi
- **Mehaničari** — evidencija, dodela naloga, izveštaj po mehaničaru
- **Podsetnici na servis** — po datumu i/ili kilometraži, ponavljanje (na X meseci / X km), predlozi (mali/veliki servis, kaiš, kočnice, gume, tehnički…); posle završenog naloga sledeći redovni servis se zakazuje sam; slanje SMS-a ili poruke klijentu jednim klikom
- **Izveštaji** — prihod za mesec, 3 meseca, 6 meseci i godinu; po mesecima i po mehaničarima; CSV izvoz
- **PDV** — opciono (20% / 10%), cene sa ili bez PDV-a
- **Automatski backup** — dnevne interne kopije, upis u izabrani folder posle svake izmene (Chrome / Edge na računaru), podsetnik za izvoz
- **Izvoz / uvoz baze** — JSON (spajanje ili zamena), CSV naloga i vozila, deljenje kopije (Drive, e-pošta, Viber)
- **Automatsko ažuriranje** — aplikacija pri svakom pokretanju i na svakih 30 minuta proverava novu verziju na sajtu i prikaže traku „Osveži“

## Prijava (korisničko ime + PIN)

Pri ulasku aplikacija traži korisničko ime i PIN; dok se ne prijaviš, sadržaj je skriven. PIN se proverava preko Google Apps Script-a koji čita privatnu Google tabelu (kolona A korisničko ime, B PIN, C datum isteka). Važeća licenca = normalan rad. Istekla licenca = **režim samo za pregled** (izmene su blokirane). Pogrešan PIN = nema ulaska.

- U podnožju se vidi preostalo vreme licence i taster **Aktivacija** (WhatsApp poruka za aktivaciju / produženje).
- Prijava se proverava na svakih 30 minuta kad ima interneta. Bez interneta aplikacija radi najviše 7 dana od poslednje uspešne provere; posle toga traži internet i novu prijavu.
- U `index.html` je `AUTH_URL` (adresa web aplikacije, završava na `/exec`). Kod za Apps Script (`Code.gs`) **ne postavljaj** na javni sajt ni u javni repozitorijum jer sadrži ID tabele.

## Tehnička podrška

U aplikaciji (Više / Podešavanja i prozor za prijavu) nalaze se linkovi za podršku: WhatsApp 060 661 1488 i e-pošta vasserviserbgd@gmail.com. Poruka se unapred popunjava verzijom aplikacije i korisničkim imenom. Kontakti se menjaju u konstantama `SUPPORT_MAIL`, `SUPPORT_WA` i `SUPPORT_TEL` u `index.html`.

## Instalacija

Aplikacija je statična — nema build koraka ni zavisnosti.

1. Postavi fajlove u isti folder na hosting sa **https** (npr. GitHub Pages, Netlify, Cloudflare Pages):
   `index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`
2. Otvori adresu u Chrome-u ili Edge-u.
3. Izaberi **Instaliraj aplikaciju** (računar) ili **Dodaj na početni ekran** (telefon).
4. U **Podešavanja → Podaci radionice** upiši naziv, adresu, PIB i tekući račun (prikazuju se na dokumentima).

### GitHub Pages

`Settings → Pages → Deploy from a branch → main / (root)`. Aplikacija je na `https://<korisnik>.github.io/<repozitorijum>/`.

### Lokalno testiranje

```bash
python3 -m http.server 8080
```

Zatim `http://localhost:8080`. Service worker i instalacija rade na `localhost`, ali ne preko `file://`.

## Kako radi automatsko ažuriranje

1. Izmeni aplikaciju i podigni verziju na **dva mesta**: `const VERSION` u `sw.js` i `const VER` u `index.html`.
2. Postavi nove fajlove na sajt (npr. `git push`).
3. Instalirane aplikacije same otkriju novi `sw.js`, preuzmu novu verziju u pozadini i prikažu traku **„Osveži“**. Podaci ostaju netaknuti.

## Backup — šta je moguće na kojoj platformi

| Način | Računar (Chrome / Edge) | Telefon |
|---|---|---|
| Dnevne interne kopije | da | da |
| Automatski upis u folder | da (jednom po sesiji traži dozvolu) | ne |
| Izvoz / podela fajla (JSON) | da | da (preko menija za deljenje) |

Pregledači ne dozvoljavaju tihi upis fajlova bez dozvole, pa na telefonu automatski backup van uređaja nije moguć — zato aplikacija podseća na izvoz u izabranom razmaku. Brisanje podataka pregledača briše i interne kopije, zato povremeno napravi izvoz ili uključi backup u folder.

## Skeniranje saobraćajne dozvole

OCR koristi [Tesseract.js](https://github.com/naptha/tesseract.js) učitan sa CDN-a; prvi put je potreban internet (jezički paket ~10 MB, posle se pamti). Slika se obrađuje u pregledaču i ne šalje se nigde. Preciznost zavisi od slike — fotografiši dozvolu ravno, na svetlu, bez odsjaja, i uvek proveri polja pre čuvanja.

## Napomena o računima

Račun iz aplikacije je pregled za štampu i nije fiskalni račun. Ako zakon za tvoju delatnost traži fiskalizaciju (fiskalna kasa / SEF), fiskalni isečak ili e-faktura se izdaju posebno; u Podešavanjima možeš da upišeš napomenu koja se štampa na računu.

## Tehnologije

HTML, CSS i JavaScript bez okvira, Service Worker, Web App Manifest, IndexedDB, File System Access API, Web Share API, Tesseract.js (OCR).

## Autor

**Gemb-Bit Željko Ilić**
