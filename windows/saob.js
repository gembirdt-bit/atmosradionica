/* Atmos Radionica — čitanje saobraćajne dozvole sa čitača kartica (Windows, PC/SC preko winscard.dll)
 *
 * Postupak čitanja kartice (komande za izbor aplikacije, fajlovi D001–D031, BER oznake polja)
 * preuzet je iz programa Baš Čelik (https://github.com/ubavic/bas-celik):
 *
 *   MIT License — Copyright (c) 2023 - 2026 Nikola Ubavić
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 *   and associated documentation files (the "Software"), to deal in the Software without restriction,
 *   including without limitation the rights to use, copy, modify, merge, publish, distribute,
 *   sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions: The above copyright notice and this
 *   permission notice shall be included in all copies or substantial portions of the Software.
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.
 *
 * Vraća SAMO podatke o vozilu (tablica, marka, model, godina, boja, VIN, zapremina, snaga, gorivo).
 * Podaci o vlasniku i korisniku se ne čitaju iz rezultata i ne šalju aplikaciji.
 */
'use strict';

let api = null;
function lib() {
  if (api) return api;
  const koffi = require('koffi');
  const w = koffi.load('winscard.dll');
  koffi.struct('SCARD_IO_REQUEST', { dwProtocol: 'uint32', cbPciLength: 'uint32' });
  api = {
    establish: w.func('int32 __stdcall SCardEstablishContext(uint32 dwScope, void *pv1, void *pv2, _Out_ uintptr_t *phContext)'),
    release: w.func('int32 __stdcall SCardReleaseContext(uintptr_t hContext)'),
    list: w.func('int32 __stdcall SCardListReadersW(uintptr_t hContext, str16 mszGroups, void *mszReaders, _Inout_ uint32_t *pcchReaders)'),
    connect: w.func('int32 __stdcall SCardConnectW(uintptr_t hContext, str16 szReader, uint32 dwShareMode, uint32 dwPreferredProtocols, _Out_ uintptr_t *phCard, _Out_ uint32_t *pdwActiveProtocol)'),
    disconnect: w.func('int32 __stdcall SCardDisconnect(uintptr_t hCard, uint32 dwDisposition)'),
    transmit: w.func('int32 __stdcall SCardTransmit(uintptr_t hCard, const SCARD_IO_REQUEST *pioSendPci, void *pbSendBuffer, uint32 cbSendLength, void *pioRecvPci, void *pbRecvBuffer, _Inout_ uint32_t *pcbRecvLength)')
  };
  return api;
}

const SCOPE_SYSTEM = 2, SHARE_SHARED = 2, PROTO_T0 = 1, PROTO_T1 = 2, LEAVE_CARD = 0;
const E = {
  NO_SERVICE: 0x8010001D, NO_READERS: 0x8010002E, NO_SMARTCARD: 0x8010000C,
  REMOVED: 0x80100069, UNRESPONSIVE: 0x80100066, UNPOWERED: 0x80100067, SHARING: 0x8010000B
};
const u32 = v => (Number(v) >>> 0);
const sleep = ms => new Promise(r => setTimeout(r, ms));

class Fail extends Error {}

/* ---------- APDU ---------- */
function apdu(cla, ins, p1, p2, data, ne) {
  const a = [cla, ins, p1, p2];
  if (data && data.length) { a.push(data.length, ...data); if (ne) a.push(ne === 256 ? 0 : ne); }
  else if (ne) a.push(ne === 256 ? 0 : ne);
  return Buffer.from(a);
}

function makeCard(hCard, proto) {
  const L = lib();
  const raw = cmd => {
    const rb = Buffer.alloc(260 + 2);
    const len = [rb.length];
    const rc = u32(L.transmit(hCard, { dwProtocol: proto, cbPciLength: 8 }, cmd, cmd.length, null, rb, len));
    if (rc !== 0) throw new Fail('transmit ' + rc.toString(16));
    return rb.subarray(0, len[0]);
  };
  /* T=0: 61xx → GET RESPONSE, 6Cxx → ponovi sa tačnim Le */
  const transmit = cmd => {
    let r = raw(cmd), out = Buffer.alloc(0);
    for (let guard = 0; guard < 32 && r.length >= 2; guard++) {
      const sw1 = r[r.length - 2], sw2 = r[r.length - 1];
      if (sw1 === 0x6C && cmd.length <= 5) {
        let c;
        if (cmd.length === 4) c = Buffer.concat([cmd, Buffer.from([sw2])]);
        else { c = Buffer.from(cmd); c[c.length - 1] = sw2; }
        r = raw(c); continue;
      }
      if (sw1 === 0x61) { out = Buffer.concat([out, r.subarray(0, r.length - 2)]); r = raw(Buffer.from([0x00, 0xC0, 0x00, 0x00, sw2 || 0])); continue; }
      break;
    }
    return Buffer.concat([out, r]);
  };
  return { transmit };
}

const ok = r => r.length >= 2 && r[r.length - 2] === 0x90 && r[r.length - 1] === 0x00;

/* ---------- BER-TLV (ISO/IEC 7816-4) ---------- */
function parseTag(d, i) {
  if (i >= d.length) throw new Fail('ber');
  const prim = (d[i] & 0x20) === 0;
  if ((d[i] & 0x1F) !== 0x1F) return { tag: d[i], prim, n: 1 };
  if (i + 1 < d.length && (d[i + 1] & 0x80) === 0) return { tag: (d[i] << 8) | d[i + 1], prim, n: 2 };
  if (i + 2 < d.length) return { tag: ((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]) >>> 0, prim, n: 3 };
  throw new Fail('ber');
}
function parseLen(d, i) {
  if (i >= d.length) throw new Fail('ber');
  const b = d[i];
  if (b < 0x80) return { len: b, n: 1 };
  const k = b & 0x7F;
  if (k === 0 || k > 4 || i + k >= d.length) throw new Fail('ber');
  let len = 0; for (let j = 1; j <= k; j++) len = len * 256 + d[i + j];
  return { len, n: k + 1 };
}
function parseBER(d) {
  const node = new Map();
  let i = 0;
  while (i < d.length) {
    const t = parseTag(d, i); i += t.n;
    const l = parseLen(d, i); i += l.n;
    if (i + l.len > d.length) throw new Fail('ber');
    const v = d.subarray(i, i + l.len); i += l.len;
    if (t.prim) node.set(t.tag, v);
    else { const sub = parseBER(v); const prev = node.get(t.tag); node.set(t.tag, prev instanceof Map ? merge(prev, sub) : sub); }
  }
  return node;
}
function merge(a, b) {
  for (const [k, v] of b) { const p = a.get(k); a.set(k, p instanceof Map && v instanceof Map ? merge(p, v) : v); }
  return a;
}
function pick(tree, ...path) {
  let n = tree;
  for (const t of path) { if (!(n instanceof Map) || !n.has(t)) return ''; n = n.get(t); }
  return Buffer.isBuffer(n) ? n.toString('utf8').replace(/\0+$/, '').trim() : '';
}

/* ---------- saobraćajna ---------- */
const SELECTS = [
  [[0xA0, 0x00, 0x00, 0x01, 0x51, 0x00, 0x00],
   [0xA0, 0x00, 0x00, 0x00, 0x77, 0x01, 0x08, 0x00, 0x07, 0x00, 0x00, 0xFE, 0x00, 0x00, 0x01, 0x00],
   [0xA0, 0x00, 0x00, 0x00, 0x77, 0x01, 0x08, 0x00, 0x07, 0x00, 0x00, 0xFE, 0x00, 0x00, 0xAD, 0xF2]],
  [[0xA0, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00],
   [0xF3, 0x81, 0x00, 0x00, 0x02, 0x53, 0x45, 0x52, 0x56, 0x4C, 0x04, 0x02, 0x01],
   [0xA0, 0x00, 0x00, 0x00, 0x77, 0x01, 0x08, 0x00, 0x07, 0x00, 0x00, 0xFE, 0x00, 0x00, 0xAD, 0xF2]],
  [[0xA0, 0x00, 0x00, 0x00, 0x18, 0x43, 0x4D, 0x00],
   [0xA0, 0x00, 0x00, 0x00, 0x18, 0x34, 0x14, 0x01, 0x00, 0x65, 0x56, 0x4C, 0x2D, 0x30, 0x30, 0x31],
   [0xA0, 0x00, 0x00, 0x00, 0x18, 0x65, 0x56, 0x4C, 0x2D, 0x30, 0x30, 0x31]]
];

function initCard(c) {
  for (const [a, b, d] of SELECTS) {
    try {
      if (!ok(c.transmit(apdu(0x00, 0xA4, 0x04, 0x00, a)))) continue;
      c.transmit(apdu(0x00, 0xA4, 0x04, 0x00, b));
      c.transmit(apdu(0x00, 0xA4, 0x04, 0x0C, d));
      return true;
    } catch (e) { /* sledeći skup komandi */ }
  }
  return false;
}

function readBinary(c, off, len) {
  const r = c.transmit(apdu(0x00, 0xB0, (off >> 8) & 0xFF, off & 0xFF, null, Math.min(len, 0xFF)));
  if (r.length < 2) throw new Fail('read');
  return r.subarray(0, r.length - 2);
}

function readFile(c, id) {
  if (!ok(c.transmit(apdu(0x00, 0xA4, 0x02, 0x04, id)))) throw new Fail('select');
  const h = readBinary(c, 0, 0x20);
  if (h.length < 2) throw new Fail('header');
  const off = h[1] + 2;
  if (off >= h.length) throw new Fail('header');
  const t = parseTag(h, off), l = parseLen(h, off + t.n);
  let left = l.len + t.n + l.n, pos = off;
  const parts = [];
  while (left > 0) {
    const d = readBinary(c, pos, Math.min(left, 0x64));
    if (!d.length) break;
    parts.push(d); pos += d.length; left -= d.length;
  }
  return Buffer.concat(parts);
}

function readVehicle(c) {
  if (!initCard(c)) throw new Fail('notvehicle');
  let tree = new Map();
  for (let i = 0; i <= 3; i++) tree = merge(tree, parseBER(readFile(c, [0xD0, i * 0x10 + 0x01])));
  return {
    plate: pick(tree, 0x71, 0x81),
    vin: pick(tree, 0x71, 0x8A),
    make: pick(tree, 0x71, 0xA3, 0x87),
    model: pick(tree, 0x71, 0xA3, 0x89) || pick(tree, 0x71, 0xA3, 0x88),
    ccm: pick(tree, 0x71, 0xA5, 0x90),
    kw: pick(tree, 0x71, 0xA5, 0x91),
    fuel: pick(tree, 0x71, 0xA5, 0x92),
    year: pick(tree, 0x72, 0xC5),
    color: pick(tree, 0x72, 0x9F24)
  };
}

function listReaders(L, ctx) {
  const n = [0];
  let rc = u32(L.list(ctx, null, null, n));
  if (rc !== 0) return { rc, readers: [] };
  const buf = Buffer.alloc(n[0] * 2);
  rc = u32(L.list(ctx, null, buf, n));
  if (rc !== 0) return { rc, readers: [] };
  return { rc: 0, readers: buf.toString('utf16le').split('\0').filter(Boolean) };
}

/* Čeka karticu do 20 s. Vraća { ok:true, data } ili { ok:false, msg }. */
async function read() {
  let L;
  try { L = lib(); } catch (e) { return { ok: false, msg: 'Podrška za čitač kartica nije dostupna na ovom računaru.' }; }
  const out = [0];
  let rc = u32(L.establish(SCOPE_SYSTEM, null, null, out));
  if (rc !== 0) return { ok: false, msg: rc === E.NO_SERVICE ? 'Windows servis „Smart Card“ nije pokrenut. Priključi čitač kartica i pokušaj ponovo.' : 'Čitač kartica nije dostupan (' + rc.toString(16) + ').' };
  const ctx = out[0];
  try {
    const deadline = Date.now() + 20000;
    let lastMsg = 'U čitaču nema kartice. Ubaci saobraćajnu dozvolu i pokušaj ponovo.';
    while (Date.now() < deadline) {
      const { rc: lr, readers } = listReaders(L, ctx);
      if (lr === E.NO_READERS || (lr === 0 && !readers.length)) return { ok: false, msg: 'Čitač kartica nije pronađen. Priključi čitač i pokušaj ponovo.' };
      if (lr === E.NO_SERVICE) return { ok: false, msg: 'Čitač kartica nije pronađen. Priključi čitač i pokušaj ponovo.' };
      for (const name of readers) {
        const h = [0], p = [0];
        const cr = u32(L.connect(ctx, name, SHARE_SHARED, PROTO_T0 | PROTO_T1, h, p));
        if (cr !== 0) { if (cr === E.SHARING) lastMsg = 'Čitač trenutno koristi drugi program. Zatvori ga i pokušaj ponovo.'; continue; }
        try {
          const data = readVehicle(makeCard(h[0], p[0]));
          if (!data.plate && !data.vin && !data.make) return { ok: false, msg: 'Kartica je pročitana, ali na njoj nema podataka o vozilu.' };
          return { ok: true, data };
        } catch (e) {
          lastMsg = e && e.message === 'notvehicle'
            ? 'Kartica u čitaču nije saobraćajna dozvola (ili je čitač ne prepoznaje).'
            : 'Kartica nije pročitana do kraja. Ne vadi je dok čitanje traje i pokušaj ponovo.';
          if (e && e.message === 'notvehicle') continue;
        } finally {
          try { L.disconnect(h[0], LEAVE_CARD); } catch (e) {}
        }
      }
      if (!/nema kartice/.test(lastMsg)) return { ok: false, msg: lastMsg };
      await sleep(700);
    }
    return { ok: false, msg: lastMsg };
  } finally {
    try { L.release(ctx); } catch (e) {}
  }
}

module.exports = { read, _test: { parseBER, merge, pick, apdu } };
