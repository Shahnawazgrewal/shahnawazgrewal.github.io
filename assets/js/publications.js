/* ------------------------------------------------------------------ *
 *  publications.js — renders publications.bib into the page.
 *
 *  Adding a paper means editing publications.bib. Nothing here needs
 *  to change: the parser reads whatever entries are in the file and
 *  the renderer sorts them by year, newest first.
 *
 *  Usage:
 *    <div data-publications data-mode="selected" data-limit="5"></div>
 *    <div data-publications data-mode="full"></div>
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  var ME = 'Shah Nawaz';
  var BIB_URL = 'publications.bib';

  /* ---------------- BibTeX parsing ---------------- */

  // LaTeX escapes that actually appear in academic name/title fields.
  var LATEX = [
    [/\\"\{?([aouAOUeis])\}?/g, function (_, c) {
      return ({ a: 'ä', o: 'ö', u: 'ü', A: 'Ä', O: 'Ö', U: 'Ü', e: 'ë', i: 'ï', s: 's' })[c] || c;
    }],
    [/\\'\{?([aeiouncAEIOUNC])\}?/g, function (_, c) {
      return ({ a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú', n: 'ń', c: 'ć',
                A: 'Á', E: 'É', I: 'Í', O: 'Ó', U: 'Ú', N: 'Ń', C: 'Ć' })[c] || c;
    }],
    [/\\`\{?([aeiouAEIOU])\}?/g, function (_, c) {
      return ({ a: 'à', e: 'è', i: 'ì', o: 'ò', u: 'ù', A: 'À', E: 'È', I: 'Ì', O: 'Ò', U: 'Ù' })[c] || c;
    }],
    [/\\\^\{?([aeiouAEIOU])\}?/g, function (_, c) {
      return ({ a: 'â', e: 'ê', i: 'î', o: 'ô', u: 'û', A: 'Â', E: 'Ê', I: 'Î', O: 'Ô', U: 'Û' })[c] || c;
    }],
    [/\\~\{?([naoNAO])\}?/g, function (_, c) {
      return ({ n: 'ñ', a: 'ã', o: 'õ', N: 'Ñ', A: 'Ã', O: 'Õ' })[c] || c;
    }],
    [/\\ss\{?\}?/g, 'ß'],
    [/\\&/g, '&'],
    [/--/g, '–'],
    [/[{}]/g, ''],
    [/\\[a-zA-Z]+/g, ''],
    [/\s+/g, ' ']
  ];

  function clean(v) {
    if (!v) return '';
    var s = String(v);
    LATEX.forEach(function (rule) { s = s.replace(rule[0], rule[1]); });
    return s.trim();
  }

  // Returns [entries]. Each entry keeps its raw source text so the page
  // can offer a "BibTeX" button without re-serialising anything.
  function parseBib(text) {
    var entries = [];
    var i = 0;

    while (i < text.length) {
      var at = text.indexOf('@', i);
      if (at === -1) break;

      // Skip comment lines (a '%' before the '@' on the same line).
      var lineStart = text.lastIndexOf('\n', at) + 1;
      if (text.slice(lineStart, at).indexOf('%') !== -1) { i = at + 1; continue; }

      var open = text.indexOf('{', at);
      if (open === -1) break;
      var type = text.slice(at + 1, open).trim().toLowerCase();

      // Walk to the matching close brace.
      var depth = 0, j = open, close = -1;
      for (; j < text.length; j++) {
        var ch = text[j];
        if (ch === '{') depth++;
        else if (ch === '}') { depth--; if (depth === 0) { close = j; break; } }
      }
      if (close === -1) break;

      var raw = text.slice(at, close + 1);
      var body = text.slice(open + 1, close);
      var comma = body.indexOf(',');
      var key = (comma === -1 ? body : body.slice(0, comma)).trim();

      entries.push(Object.assign(
        { _type: type, _key: key, _raw: raw },
        parseFields(comma === -1 ? '' : body.slice(comma + 1))
      ));
      i = close + 1;
    }
    return entries;
  }

  function parseFields(body) {
    var out = {}, i = 0, n = body.length;
    while (i < n) {
      while (i < n && /[\s,]/.test(body[i])) i++;
      var eq = body.indexOf('=', i);
      if (eq === -1) break;
      var name = body.slice(i, eq).trim().toLowerCase();
      var k = eq + 1;
      while (k < n && /\s/.test(body[k])) k++;

      var value = '';
      if (body[k] === '{') {
        var d = 0, s = k;
        for (; k < n; k++) {
          if (body[k] === '{') d++;
          else if (body[k] === '}') { d--; if (d === 0) { k++; break; } }
        }
        value = body.slice(s + 1, k - 1);
      } else if (body[k] === '"') {
        var s2 = ++k;
        while (k < n && body[k] !== '"') k++;
        value = body.slice(s2, k++);
      } else {
        var s3 = k;
        while (k < n && body[k] !== ',') k++;
        value = body.slice(s3, k);
      }
      if (name) out[name] = value.trim();
      i = k;
    }
    return out;
  }

  /* ---------------- formatting ---------------- */

  function splitAuthors(field) {
    return clean(field).split(/\s+and\s+/i).map(function (a) {
      a = a.trim();
      if (a.indexOf(',') !== -1) {               // "Nawaz, Shah" -> "Shah Nawaz"
        var p = a.split(',');
        a = (p[1] || '').trim() + ' ' + p[0].trim();
      }
      return a.trim();
    }).filter(Boolean);
  }

  function authorsHTML(list) {
    return list.map(function (a) {
      var m = a === ME ? ' class="me"' : '';
      return '<span' + m + '>' + esc(a) + '</span>';
    }).join(', ');
  }

  function venueOf(e) {
    return clean(e.venue || e.booktitle || e.journal || e.school || e.publisher || '');
  }

  function typeOf(e) {
    if (e.type) return clean(e.type).toLowerCase();
    if (/workshop/i.test(e.booktitle || '')) return 'workshop';
    if (e._type === 'article') return 'journal';
    return 'conference';
  }

  function detail(e) {
    var bits = [];
    if (e.volume) bits.push(clean(e.volume) + (e.number ? '(' + clean(e.number) + ')' : ''));
    if (e.pages) bits.push('pp. ' + clean(e.pages));
    return bits.join(', ');
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  var LINK_FIELDS = [
    ['pdf', 'PDF', function (v) { return v; }],
    ['url', 'Link', function (v) { return v; }],
    ['doi', 'DOI', function (v) { return /^https?:/.test(v) ? v : 'https://doi.org/' + v; }],
    ['arxiv', 'arXiv', function (v) { return /^https?:/.test(v) ? v : 'https://arxiv.org/abs/' + v; }],
    ['code', 'Code', function (v) { return v; }],
    ['project', 'Project', function (v) { return v; }],
    ['video', 'Video', function (v) { return v; }],
    ['slides', 'Slides', function (v) { return v; }],
    ['data', 'Data', function (v) { return v; }]
  ];

  // The figure slot: a paper teaser when `figure` is set, otherwise a venue plate.
  function figureHTML(e) {
    if (e.figure) {
      return '<div class="fig"><img src="' + esc(clean(e.figure)) + '" alt="' +
        esc(clean(e.title)) + ' teaser" loading="lazy"></div>';
    }
    return '<div class="fig"><div class="fig-plate">' +
      '<span class="v">' + esc(venueOf(e) || typeOf(e)) + '</span>' +
      '<span class="y">' + esc(clean(e.year)) + '</span>' +
      '</div></div>';
  }

  function pubHTML(e, opts) {
    var t = typeOf(e);
    var teaser = opts.layout === 'teaser';
    var links = LINK_FIELDS.filter(function (f) { return e[f[0]]; }).map(function (f) {
      return '<a href="' + esc(f[2](clean(e[f[0]]))) + '" target="_blank" rel="noopener">' + f[1] + '</a>';
    });
    links.push('<button type="button" class="bib-btn" aria-expanded="false">BibTeX</button>');

    var d = detail(e);
    return '<li class="pub' + (teaser ? ' teaser' : '') + '" id="' + esc(e._key) +
      '" data-type="' + esc(t) + '" data-year="' + esc(clean(e.year)) + '">' +
      (teaser ? figureHTML(e)
              : '<div class="badge-col"><span class="badge ' + esc(t) + '">' + esc(venueOf(e) || t) + '</span></div>') +
      '<div>' +
        '<span class="title">' + esc(clean(e.title)) + '</span>' +
        '<span class="authors">' + authorsHTML(splitAuthors(e.author)) + '</span>' +
        '<div class="meta">' + esc(venueOf(e)) + (d ? ', ' + esc(d) : '') + ', ' + esc(clean(e.year)) + '</div>' +
        (e.award ? '<span class="award-tag">★ ' + esc(clean(e.award)) + '</span>' : '') +
        ((opts.showNote || teaser) && e.note ? '<div class="contrib">' + esc(clean(e.note)) + '</div>' : '') +
        '<div class="pub-links">' + links.join('') + '</div>' +
        '<pre class="bibtex" hidden>' + esc(e._raw) + '</pre>' +
      '</div>' +
    '</li>';
  }

  /* ---------------- rendering ---------------- */

  function render(host, entries) {
    var mode = host.dataset.mode || 'full';
    var layout = host.dataset.layout || 'badge';   // 'badge' | 'teaser'
    var list = entries.slice();

    if (mode === 'selected') {
      list = list.filter(function (e) { return /true|yes/i.test(e.selected || ''); });
      var limit = parseInt(host.dataset.limit || '0', 10);
      if (limit > 0) list = list.slice(0, limit);
      // data-notes="true" adds the italic contribution line under each paper.
      var withNotes = host.dataset.notes === 'true';
      host.innerHTML = '<ol class="pub-list">' +
        list.map(function (e) {
          return pubHTML(e, { showNote: withNotes, layout: layout });
        }).join('') + '</ol>';
      wireBibButtons(host);
      return;
    }

    // Full mode: toolbar + year-grouped list.
    var types = ['all'].concat(uniq(list.map(typeOf)));
    host.innerHTML =
      '<div class="pub-toolbar">' +
        '<input type="search" placeholder="Filter by title, author, venue or year…" aria-label="Filter publications">' +
        '<div class="chips">' + types.map(function (t, i) {
          return '<button class="chip" type="button" data-filter="' + esc(t) + '" aria-pressed="' +
            (i === 0) + '">' + esc(t === 'all' ? 'All' : t[0].toUpperCase() + t.slice(1)) + '</button>';
        }).join('') + '</div>' +
      '</div>' +
      '<div class="pub-count"></div>' +
      '<div class="pub-body"></div>';

    var body = host.querySelector('.pub-body');
    var count = host.querySelector('.pub-count');
    var search = host.querySelector('input[type="search"]');
    var chips = Array.prototype.slice.call(host.querySelectorAll('.chip'));
    var activeType = 'all';

    function draw() {
      var q = search.value.trim().toLowerCase();
      var shown = list.filter(function (e) {
        if (activeType !== 'all' && typeOf(e) !== activeType) return false;
        if (!q) return true;
        return (clean(e.title) + ' ' + clean(e.author) + ' ' + venueOf(e) + ' ' + clean(e.year) +
                ' ' + clean(e.booktitle || '') + ' ' + clean(e.journal || '')).toLowerCase().indexOf(q) !== -1;
      });

      var byYear = {};
      shown.forEach(function (e) { (byYear[clean(e.year)] = byYear[clean(e.year)] || []).push(e); });
      var years = Object.keys(byYear).sort(function (a, b) { return b - a; });

      body.innerHTML = years.length
        ? years.map(function (y) {
            return '<div class="year-head">' + esc(y) + '</div><ol class="pub-list">' +
              byYear[y].map(function (e) {
                return pubHTML(e, { showNote: false, layout: layout });
              }).join('') + '</ol>';
          }).join('')
        : '<p class="pub-count">No publications match that filter.</p>';

      count.textContent = shown.length + ' of ' + list.length + ' publications';
      wireBibButtons(body);
    }

    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        activeType = c.dataset.filter;
        chips.forEach(function (o) { o.setAttribute('aria-pressed', String(o === c)); });
        draw();
      });
    });
    search.addEventListener('input', draw);
    draw();
  }

  function wireBibButtons(scope) {
    scope.querySelectorAll('.bib-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        var pre = b.closest('.pub').querySelector('pre.bibtex');
        var open = pre.hasAttribute('hidden');
        if (open) pre.removeAttribute('hidden'); else pre.setAttribute('hidden', '');
        b.setAttribute('aria-expanded', String(open));
      });
    });
  }

  function uniq(a) { return a.filter(function (v, i) { return a.indexOf(v) === i; }); }

  /* ---------------- boot ---------------- */

  document.addEventListener('DOMContentLoaded', function () {
    var hosts = Array.prototype.slice.call(document.querySelectorAll('[data-publications]'));
    if (!hosts.length) return;

    fetch(BIB_URL, { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .then(function (text) {
        var entries = parseBib(text).sort(function (a, b) {
          var d = (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0);
          return d !== 0 ? d : clean(a.title).localeCompare(clean(b.title));
        });
        hosts.forEach(function (h) { render(h, entries); });

        // Deep link: /publications.html#moscati2026inductivebias, used by the
        // supervision list to point at the paper a project produced.
        if (location.hash.length > 1) {
          var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
          if (target) {
            // Deferred: the browser does its own scroll restoration after a
            // hash load, which would undo an immediate scrollIntoView.
            var jump = function () {
              // Offset for the sticky header, which scrollIntoView ignores.
              var y = target.getBoundingClientRect().top + window.pageYOffset - 96;
              window.scrollTo({ top: Math.max(y, 0) });
            };
            // Deferred and repeated: the browser restores its own scroll after a
            // hash load, and lazy figures can settle the layout a beat later.
            setTimeout(jump, 60);
            window.addEventListener('load', function () { setTimeout(jump, 40); });
            target.classList.add('pub-flash');
            setTimeout(function () { target.classList.remove('pub-flash'); }, 2600);
          }
        }

        // Fill any <span data-pub-count> with the total.
        document.querySelectorAll('[data-pub-count]').forEach(function (s) {
          s.textContent = entries.length;
        });
      })
      .catch(function (err) {
        hosts.forEach(function (h) {
          h.innerHTML = '<p class="callout">Could not load <code>publications.bib</code> (' +
            esc(err.message) + '). If you are previewing locally, serve the folder over HTTP ' +
            '(<code>python3 -m http.server</code>) rather than opening the file directly.</p>';
        });
      });
  });
})();
