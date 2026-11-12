# Atmos Radionica

**Atmos Radionica** je aplikacija za auto servis: radni nalozi sa statusima, baza vozila, mehaničari, delovi, podsetnici na redovne servise, predračun i račun za štampu. Radi na **Android** telefonima i tabletima i na **Windows** računarima, i bez interneta. Sama se ažurira.

Svi podaci se čuvaju lokalno na uređaju.

## Mogućnosti

- **Radni nalozi** — statusi **Uzet u rad → U obradi → Završen**, plaćeno / za naplatu, dodela mehaničara, opis kvara, stavke (rad i delovi) sa količinom i cenom, popust, automatski brojevi (`N-2026-0001`), dogovoren rok isporuke, gorivo i stanje vozila pri prijemu
- **Štampa i PDF** — radni nalog, **predračun** i **račun** jednim klikom, sa **logom radionice** i poljima za **potpis mehaničara i mušterije**; A4 sa marginama; **Podeli PDF** u Viber, WhatsApp, e-poštu, Drive…
- **Obaveštenje klijentu** — kad je vozilo završeno, poruka na **Viber** / WhatsApp / SMS (tekst se podešava)
- **Delovi** — poručivanje: Poručiti → Poručeno → Stiglo → U radionici, sa količinom, dobavljačem i vozilom; deljenje liste za poručivanje
- **Baza vozila** — tablica, **VIN** (provera i prepoznavanje marke), marka, model, godina, kubikaža, snaga (kW / KS), gorivo, kilometraža, vlasnik, telefon, servisna istorija
- **Skeniranje saobraćajne dozvole kamerom** — automatski popunjava podatke o vozilu i vlasniku (uvek proveri pre čuvanja)
- **Mehaničari** — evidencija, dodela naloga, izveštaj po mehaničaru
- **Podsetnici na servis** — po datumu i/ili kilometraži, sa ponavljanjem; sledeći redovni servis se zakazuje sam; poruka klijentu jednim klikom
- **Izveštaji** — prihod po mesecu, godini, 3 i 6 meseci, po mehaničarima; grafikon; štampa / PDF; CSV izvoz
- **PDV** — opciono (20% / 10%), cene sa ili bez PDV-a
- **Garancija** — broj dana se štampa na računu
- **Backup** — dnevne interne kopije, automatski upis u folder (Windows), izvoz / uvoz baze (JSON), CSV naloga i vozila
- **Automatsko ažuriranje** — nova verzija stiže sama, bez ponovne instalacije

## Instalacija

Preuzmi aplikaciju sa stranice **[Releases](../../releases/latest)**.

### Android

1. Preuzmi **`AtmosRadionica.apk`** na telefon.
2. Otvori preuzeti fajl. Ako telefon pita, dozvoli instalaciju iz ovog izvora.
3. Pokreni **Atmos Radionica** i prijavi se korisničkim imenom i PIN-om.

Potreban je Google Chrome (na većini telefona je već instaliran).

### Windows

1. Preuzmi **`AtmosRadionica-Setup.exe`** i pokreni ga. Za rad bez instalacije postoji **`AtmosRadionica-Portable.exe`**.
2. Ako se pojavi „Windows je zaštitio računar“, klikni **Više informacija → Ipak pokreni**.
3. Pokreni **Atmos Radionica** sa radne površine i prijavi se korisničkim imenom i PIN-om.

### Prvo pokretanje

- Prvo pokretanje traži internet, posle aplikacija radi i bez njega.
- U **Podešavanja → Podaci radionice** upiši naziv, adresu, PIB i tekući račun — prikazuju se na dokumentima.
- Ako prelaziš sa ranije verzije u pregledaču: tamo klikni **Izvezi podatke (JSON)**, pa u aplikaciji **Podešavanja → ⬆ Uvezi bazu**.

## Verzije

### 1.6.2
- Bezbednija prijava

### 1.6.1
- Android aplikacija i Windows program

### 1.6.0
- **Podeli PDF** — nalog, predračun i račun kao PDF u bilo koju aplikaciju
- Štampa A4 sa marginama; štampa / PDF izveštaja
- Početni ekran: klik na „Uzeto u rad“, „U obradi“, „Završeno“, „Za naplatu“ otvara listu tih naloga
- Na nalogu: dogovoren rok isporuke (oznaka „kasni“), gorivo i stanje pri prijemu, broj dana u radionici, dugme **📞 Pozovi**
- Garancija na računu

### 1.5.0
- Popravljen mobilni prikaz
- Potpisi mehaničara i mušterije na dokumentima
- Obaveštenje klijentu preko Viber-a / WhatsApp-a / SMS-a
- Nova sekcija **Delovi**
- Mesečni i godišnji izveštaji
- Logo radionice na dokumentima

## Napomena o računima

Račun iz aplikacije nije fiskalni račun. Ako zakon za tvoju delatnost traži fiskalizaciju, fiskalni isečak ili e-faktura se izdaju posebno.

## Tehnička podrška

E-pošta: **vasserviserbgd@gmail.com**

## Autor

**Gemb-Bit Željko Ilić**
