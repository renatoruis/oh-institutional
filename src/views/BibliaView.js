/**
 * BibliaView – leitor bíblia: fluxo linear (Versão → Livros → Capítulos → Texto)
 * API: /api/bible/versions, /api/bible/{id}/books, /api/bible/{id}/books/{bookId}, /api/bible/{id}/chapter/{bookId}/{chapterId}
 */
import { fetchAPI } from '../api/client.js';
import { escapeHtml } from '../utils.js';
import { i18n } from '../i18n.js';

const FONT_SIZE_KEY = 'oh_bible_fs';
const DEFAULT_FONT_SIZE = 17;
const DEBUG = import.meta.env.DEV && import.meta.env.VITE_API_DEBUG;

/** Versão: prioridade label > name > title > abbreviation > id (fallback) */
function getVersionDisplayName(v) {
  return v?.label || v?.name || v?.title || v?.abbreviation || v?.id || '';
}

/** bible_id é usado nas APIs; id é UUID da tabela church_bible_version */
function getBibleId(v) {
  return v?.bible_id ?? v?.id ?? '';
}

/** Livro: prioridade title > name > longName > shortName > abbreviation > id */
function getBookDisplayName(b) {
  return b?.title || b?.name || b?.longName || b?.shortName || b?.abbreviation || b?.id || '';
}

/** ID do livro para API: id > bookId > book_id > dblId > abbreviation (códigos como GEN, EXO) */
function getBookId(b) {
  return String(b?.id ?? b?.bookId ?? b?.book_id ?? b?.dblId ?? b?.abbreviation ?? '');
}

export async function render() {
  const versions = await fetchAPI('/api/bible/versions');
  const items = versions?.items ?? versions?.data ?? (Array.isArray(versions) ? versions : []);
  const loadFailed = versions === null;

  const versionsGridHtml = items.length
    ? items.map(v => {
        const displayName = getVersionDisplayName(v);
        const bibleId = getBibleId(v);
        return `
      <button data-bible-id="${escapeHtml(String(bibleId))}" data-bible-name="${escapeHtml(displayName)}" class="bible-version-btn text-left rounded-xl bg-dark p-4 card-hover transition fade-in">
        <h3 class="text-base font-bold text-white">${escapeHtml(displayName)}</h3>
        ${(v.abbreviation || v.label) ? `<span class="badge badge-primary mt-1.5 text-xs">${escapeHtml(v.abbreviation || v.label || '')}</span>` : ''}
        ${(v.locale || v.language) ? `<p class="text-xs text-white/40 mt-1.5">${escapeHtml(v.locale || v.language || '')}</p>` : ''}
      </button>`;
    }).join('')
    : `<div class="empty-state col-span-full"><p>${loadFailed ? (i18n('load_error') || 'Erro ao carregar.') : i18n('no_versions')}</p></div>`;

  return {
    html: `
  <div class="pt-24 pb-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      <div id="bible-container" class="min-h-[40vh]">
        <!-- Etapa 1: Versões -->
        <div id="bible-step-versions">
          <div class="mb-6">
            <div class="section-header" data-bg="BIBLE">
              <h1 class="text-2xl sm:text-3xl font-extrabold text-dark" data-i18n="bible_title">${i18n('bible_title')}</h1>
            </div>
            <p class="text-gray-500 mt-1" data-i18n="bible_choose_version">${i18n('bible_choose_version')}</p>
          </div>
          <div id="versions-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">${versionsGridHtml}</div>
        </div>

        <!-- Etapa 2: Livros (mini cards) -->
        <div id="bible-step-books" class="hidden">
          <nav class="flex items-center gap-2 mb-6 text-sm text-gray-500">
            <button id="bc-back-versions" class="font-semibold text-primary hover:underline">${i18n('bible_title')}</button>
            <span>/</span>
            <span id="bc-version-name" class="font-semibold text-dark"></span>
          </nav>
          <h2 class="text-lg font-bold text-dark mb-4" data-i18n="bible_books_label">${i18n('bible_books_label')}</h2>
          <div id="bible-books-grid" class="grid grid-cols-4 sm:grid-cols-6 gap-2"></div>
        </div>

        <!-- Etapa 3: Capítulos -->
        <div id="bible-step-chapters" class="hidden">
          <nav class="flex items-center gap-2 mb-6 text-sm text-gray-500 flex-wrap">
            <button id="bc-back-books" class="font-semibold text-primary hover:underline">${i18n('bible_title')}</button>
            <span>/</span>
            <span id="bc-version-name-2" class="font-semibold text-dark"></span>
            <span>/</span>
            <button id="bc-back-to-books" class="font-semibold text-primary hover:underline"></button>
          </nav>
          <h2 class="text-lg font-bold text-dark mb-4" data-i18n="chapters_label">${i18n('chapters_label')}</h2>
          <div id="bible-chapters-grid" class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2"></div>
        </div>

        <!-- Etapa 4: Texto -->
        <div id="bible-step-text" class="hidden">
          <nav class="flex items-center gap-2 mb-4 text-sm text-gray-500 flex-wrap">
            <button id="bc-back-chapters" class="font-semibold text-primary hover:underline">${i18n('bible_title')}</button>
            <span>/</span>
            <span id="bc-version-name-3" class="font-semibold text-dark"></span>
            <span>/</span>
            <button id="bc-back-to-chapters" class="font-semibold text-primary hover:underline"></button>
            <span>/</span>
            <span id="bc-chapter-nav-text" class="font-semibold text-dark"></span>
          </nav>
          <div class="flex items-center justify-between mb-4 sticky top-16 z-10 bg-[#F5F5F5] py-3 -mt-1 rounded-xl">
            <h2 id="bible-reading-title" class="text-lg font-bold text-dark"></h2>
            <div class="flex items-center gap-2">
              <button id="bible-font-down" class="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm font-bold hover:border-primary transition">A-</button>
              <button id="bible-font-up" class="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm font-bold hover:border-primary transition">A+</button>
            </div>
          </div>
          <div id="bible-reading-content" class="bible-text rounded-2xl bg-white border border-gray-200 p-6 sm:p-8 leading-relaxed"></div>
          <div class="flex justify-between mt-6">
            <button id="bible-prev-chapter" class="btn-outline hidden">${i18n('previous_btn')}</button>
            <button id="bible-next-chapter" class="btn-outline ml-auto hidden">${i18n('next_btn')}</button>
          </div>
        </div>
      </div>
    </div>
  </div>`,
    mount: () => initBibleReader(),
  };
}

function initBibleReader() {
  let currentVersion = null;
  let currentVersionName = '';
  let currentBooks = [];
  let currentBookId = null;
  let currentBookName = '';
  let currentChapters = [];
  let currentChapterNum = 1;
  let fontSize = parseInt(localStorage.getItem(FONT_SIZE_KEY) || String(DEFAULT_FONT_SIZE), 10);

  const stepVersions = document.getElementById('bible-step-versions');
  const stepBooks = document.getElementById('bible-step-books');
  const stepChapters = document.getElementById('bible-step-chapters');
  const stepText = document.getElementById('bible-step-text');
  const booksGrid = document.getElementById('bible-books-grid');
  const chaptersGrid = document.getElementById('bible-chapters-grid');
  const readingTitle = document.getElementById('bible-reading-title');
  const readingContent = document.getElementById('bible-reading-content');

  function showStep(step) {
    [stepVersions, stepBooks, stepChapters, stepText].forEach(el => el?.classList.add('hidden'));
    step?.classList.remove('hidden');
  }

  function applyFontSize() {
    if (readingContent) readingContent.style.fontSize = fontSize + 'px';
  }

  document.getElementById('bible-font-down')?.addEventListener('click', () => {
    fontSize = Math.max(13, fontSize - 1);
    localStorage.setItem(FONT_SIZE_KEY, String(fontSize));
    applyFontSize();
  });
  document.getElementById('bible-font-up')?.addEventListener('click', () => {
    fontSize = Math.min(28, fontSize + 1);
    localStorage.setItem(FONT_SIZE_KEY, String(fontSize));
    applyFontSize();
  });

  // --- Navegação: Voltar ---
  document.getElementById('bc-back-versions')?.addEventListener('click', () => showStep(stepVersions));

  document.getElementById('bc-back-books')?.addEventListener('click', () => showStep(stepVersions));

  document.getElementById('bc-back-to-books')?.addEventListener('click', () => showStep(stepBooks));

  document.getElementById('bc-back-chapters')?.addEventListener('click', () => showStep(stepVersions));
  document.getElementById('bc-back-to-chapters')?.addEventListener('click', () => showStep(stepChapters));

  function setVersionNameInNav(name) {
    ['bc-version-name', 'bc-version-name-2', 'bc-version-name-3'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = name;
    });
  }

  // --- Etapa 1 → 2: Escolher versão ---
  document.querySelectorAll('.bible-version-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const bibleId = btn.dataset.bibleId;
      const name = btn.dataset.bibleName;
      if (!bibleId) return;
      currentVersion = String(bibleId);
      currentVersionName = name;
      setVersionNameInNav(name);

      booksGrid.innerHTML = '<div class="col-span-full grid grid-cols-4 sm:grid-cols-6 gap-2">'
        + Array.from({ length: 12 }, () => '<div class="skeleton h-14 rounded-lg"></div>').join('')
        + '</div>';

      showStep(stepBooks);

      const data = await fetchAPI(`/api/bible/${bibleId}/books`);
      if (data?.error) {
        booksGrid.innerHTML = `<p class="col-span-full text-sm text-amber-600">${escapeHtml(String(data.error))}</p>`;
        return;
      }
      currentBooks = data?.books ?? data?.items ?? data?.data?.books ?? data?.data ?? (Array.isArray(data) ? data : []);
      if (!Array.isArray(currentBooks)) currentBooks = [];
      if (!currentBooks.length) {
        booksGrid.innerHTML = `<p class="col-span-full text-sm text-gray-400">${i18n('no_books')}</p>`;
        return;
      }

      const tLower = (b) => String(b?.canon ?? b?.testament ?? b?.testamentId ?? '').toLowerCase();
      const isOT = (b) => { const t = tLower(b); return t === 'ot' || t.includes('old'); };
      const isNT = (b) => { const t = tLower(b); return t === 'nt' || t.includes('new'); };
      const ot = currentBooks.filter(isOT);
      const nt = currentBooks.filter(isNT);
      const other = currentBooks.filter(b => !isOT(b) && !isNT(b));

      function renderBookCard(b) {
        const bid = getBookId(b);
        const bname = getBookDisplayName(b) || bid;
        return `<button class="book-card-btn rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-dark hover:border-primary hover:bg-primary/5 transition text-center" data-id="${escapeHtml(bid)}" data-name="${escapeHtml(bname)}">${escapeHtml(bname)}</button>`;
      }

      let html = '';
      if (ot.length || other.length) {
        html += `<div class="col-span-full text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">${i18n('old_testament')}</div>`;
        (ot.length ? ot : other).forEach(b => { html += renderBookCard(b); });
      }
      if (nt.length) {
        html += `<div class="col-span-full text-xs font-bold text-gray-400 uppercase tracking-wider mt-4 mb-1">${i18n('new_testament')}</div>`;
        nt.forEach(b => { html += renderBookCard(b); });
      }
      booksGrid.innerHTML = html;

      booksGrid.querySelectorAll('.book-card-btn').forEach(b => {
        b.addEventListener('click', () => selectBook(b.dataset.id ?? '', b.dataset.name ?? ''));
      });
    });
  });

  async function selectBook(bookId, bookName) {
    if (!bookId) return;
    currentBookId = bookId;
    currentBookName = bookName;

    const backToBooksBtn = document.getElementById('bc-back-to-books');
    if (backToBooksBtn) backToBooksBtn.textContent = bookName;

    chaptersGrid.innerHTML = '<div class="col-span-full grid grid-cols-6 sm:grid-cols-8 gap-2">'
      + Array.from({ length: 12 }, () => '<div class="skeleton h-10 rounded-lg"></div>').join('')
      + '</div>';

    showStep(stepChapters);

    const url = `/api/bible/${currentVersion}/books/${bookId}`;
    const data = await fetchAPI(url);
    if (DEBUG) console.debug('[Biblia] books/' + bookId + ':', data ? 'OK' : 'null');

    if (!data) {
      chaptersGrid.innerHTML = `<p class="col-span-full text-sm text-amber-600">${i18n('load_error')}</p>`;
      return;
    }

    currentChapters = data?.chapters ?? data?.items ?? data?.data?.chapters ?? data?.data ?? (Array.isArray(data?.data) ? data.data : []);
    if (!Array.isArray(currentChapters)) currentChapters = [];
    const chapterCount = data?.chapterCount ?? data?.meta?.chapterCount ?? data?.data?.chapterCount;
    const numChapters = currentChapters.length > 0
      ? currentChapters.length
      : (typeof chapterCount === 'number' ? chapterCount : 0);

    if (numChapters === 0) {
      chaptersGrid.innerHTML = `<p class="col-span-full text-sm text-gray-400">${i18n('no_chapters')}</p>`;
      return;
    }
    const count = numChapters;
    chaptersGrid.innerHTML = Array.from({ length: count }, (_, i) => {
      const chId = Array.isArray(currentChapters) && currentChapters[i]?.id ? currentChapters[i].id : (i + 1);
      return `<button class="chapter-card-btn w-full aspect-square min-w-0 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-dark flex items-center justify-center hover:border-primary hover:bg-primary/5 transition" data-ch-id="${chId}" data-ch-num="${i + 1}">${i + 1}</button>`;
    }).join('');

    chaptersGrid.querySelectorAll('.chapter-card-btn').forEach(b => {
      b.addEventListener('click', () => {
        const chId = b.dataset.chId ?? '';
        const chNum = parseInt(b.dataset.chNum, 10) || 1;
        selectChapter(chId, chNum);
      });
    });
  }

  async function selectChapter(chapterId, chapterNum) {
    currentChapterNum = chapterNum;

    const backToChBtn = document.getElementById('bc-back-to-chapters');
    const chNavText = document.getElementById('bc-chapter-nav-text');
    if (backToChBtn) {
      backToChBtn.textContent = currentBookName;
      backToChBtn.replaceWith(backToChBtn.cloneNode(true));
      document.getElementById('bc-back-to-chapters')?.addEventListener('click', () => showStep(stepChapters));
    }
    if (chNavText) chNavText.textContent = `${i18n('chapter_label')} ${chapterNum}`;

    readingTitle.textContent = `${currentBookName} ${chapterNum}`;
    readingContent.innerHTML = '<div class="skeleton h-4 w-full rounded mb-3"></div>'.repeat(10);

    showStep(stepText);

    const chapterUrl = `/api/bible/${currentVersion}/chapter/${currentBookId}/${chapterId}`;
    const data = await fetchAPI(chapterUrl);
    if (DEBUG) console.debug('[Biblia] chapter:', data ? 'OK' : 'null');
    if (!data) {
      readingContent.innerHTML = `<p class="text-gray-400">${i18n('load_error')}</p>`;
      applyFontSize();
      setupChapterNav();
      return;
    }
    let verses = data?.verses ?? data?.items ?? data?.data?.verses ?? data?.data ?? (Array.isArray(data?.data) ? data.data : []);
    if (!Array.isArray(verses)) verses = [];
    if (verses.length) {
      readingContent.innerHTML = verses.map(v => {
        const num = v.verse ?? v.number ?? '';
        const text = escapeHtml(v.text ?? v.content ?? '');
        return `<p class="bible-verse"><span class="verse-num">${num}.</span> ${text}</p>`;
      }).join('');
    } else if (data?.content || data?.text) {
      readingContent.innerHTML = data.content || data.text;
    } else {
      readingContent.innerHTML = `<p class="text-gray-400">${i18n('content_unavailable')}</p>`;
    }
    applyFontSize();
    setupChapterNav();
  }

  function setupChapterNav() {
    const totalCh = Array.isArray(currentChapters) ? currentChapters.length : currentChapters;
    const prevBtn = document.getElementById('bible-prev-chapter');
    const nextBtn = document.getElementById('bible-next-chapter');
    if (prevBtn) prevBtn.classList.toggle('hidden', currentChapterNum <= 1);
    if (nextBtn) nextBtn.classList.toggle('hidden', currentChapterNum >= totalCh);

    prevBtn?.replaceWith(prevBtn.cloneNode(true));
    nextBtn?.replaceWith(nextBtn.cloneNode(true));
    document.getElementById('bible-prev-chapter')?.addEventListener('click', () => {
      if (currentChapterNum > 1) {
        const chId = Array.isArray(currentChapters) && currentChapters[currentChapterNum - 2]?.id
          ? currentChapters[currentChapterNum - 2].id
          : (currentChapterNum - 1);
        selectChapter(chId, currentChapterNum - 1);
      }
    });
    document.getElementById('bible-next-chapter')?.addEventListener('click', () => {
      const totalCh = Array.isArray(currentChapters) ? currentChapters.length : currentChapters;
      if (currentChapterNum < totalCh) {
        const chId = Array.isArray(currentChapters) && currentChapters[currentChapterNum]?.id
          ? currentChapters[currentChapterNum].id
          : (currentChapterNum + 1);
        selectChapter(chId, currentChapterNum + 1);
      }
    });
  }
}
