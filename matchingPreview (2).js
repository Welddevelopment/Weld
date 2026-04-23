(function () {
  let initialized = false;
  let bootAttempts = 0;

  function getCurrentAudience() {
    return typeof currentAudience === 'string' ? currentAudience : (window.currentAudience || 'dev');
  }

  function boot() {
    if (initialized) return;
    const fan = document.getElementById('hero-preview-fan');
    const modal = document.getElementById('modal');
    if (!window.MockData || !fan || !modal) {
      if (bootAttempts < 120) {
        bootAttempts += 1;
        window.setTimeout(boot, 50);
      }
      return;
    }
    initialized = true;
    initMatchingPreview();
  }

  function initMatchingPreview() {

  const profiles = {};
  const studioIds = [];
  const devIds = [];
  let cList = [];
  let cIdx = 0;
  let cSlots = [];
  let busy = false;
  const rejected = { studios: [], devs: [] };
  const liked = { studios: [], devs: [] };

  function statTriplet(seed) {
    const base = 6 + (seed % 18);
    return {
      plays: `${base + 2}M`,
      topCcu: `${base}K`,
      currentCcu: `${Math.max(1, Math.floor(base / 3))}.${seed % 9}K`
    };
  }

  function studioGames(studio, idx) {
    const tags = studio.tags && studio.tags.length ? studio.tags : ['Scripting', 'UI Design', 'Building'];
    return tags.slice(0, 3).map((tag, offset) => {
      const stats = statTriplet(idx + offset + 1);
      return {
        emoji: ['🎮', '🚀', '🏆', '🌍', '⚔️', '🎯'][(idx + offset) % 6],
        title: `${tag} showcase`,
        desc: studio.preview || studio.bio,
        bg: studio.bg,
        plays: stats.plays,
        topCcu: stats.topCcu,
        currentCcu: stats.currentCcu
      };
    });
  }

  function devWork(dev, idx) {
    const tags = dev.tags && dev.tags.length ? dev.tags : ['Scripting', 'UI Design', 'VFX'];
    return tags.slice(0, 3).map((tag, offset) => ({
      emoji: ['⚔️', '🛠️', '✨', '🎯', '🚀', '🎨'][(idx + offset) % 6],
      title: `${tag} commission`,
      desc: dev.preview || dev.bio,
      bg: dev.bg,
      tools: `${tag}, Roblox Studio, Luau`,
      time: `${2 + ((idx + offset) % 5)} weeks`,
      amount: `$${700 + ((idx + offset) * 250)}`
    }));
  }

  function ensureProfiles() {
    if (studioIds.length || devIds.length) return;

    window.MockData.studios.forEach((studio, idx) => {
      const id = idx < 8 ? `studio${idx + 1}` : `gen_studio${idx}`;
      studioIds.push(id);
      profiles[id] = {
        type: 'studio',
        emoji: studio.emoji,
        bg: studio.bg,
        badge: 'Studio',
        name: studio.name,
        role: `Roblox Game Studio · ${studio.team} members`,
        bio: studio.bio,
        tags: studio.tags,
        meta: `${studio.status} · Budget: ${studio.budget} · Remote`,
        btn: 'View Studio Profile',
        topGames: studioGames(studio, idx)
      };
    });

    window.MockData.developers.forEach((dev, idx) => {
      const id = idx < 8 ? `dev${idx + 1}` : `gen_dev${idx}`;
      devIds.push(id);
      profiles[id] = {
        type: 'dev',
        emoji: dev.emoji,
        bg: dev.bg,
        badge: 'Pro Developer',
        name: dev.name,
        role: `Developer · ${dev.expDisplay} experience`,
        bio: dev.bio,
        tags: dev.tags,
        meta: `${dev.status} · Rate: ${dev.rate}`,
        btn: 'View Developer Profile',
        portfolio: {
          links: [
            { name: 'Roblox Profile', url: `${dev.name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.roblox.com` },
            { name: 'GitHub', url: `github.com/${dev.name.toLowerCase().replace(/[^a-z0-9]+/g, '')}` },
            { name: 'Portfolio Site', url: `${dev.name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.dev` }
          ]
        },
        bestWork: devWork(dev, idx),
        socials: [
          { icon: '🎮', label: 'Roblox', url: '#' },
          { icon: '💬', label: 'Discord', url: '#' },
          { icon: '𝕏', label: 'Twitter', url: '#' }
        ]
      };
    });
  }

  function previewTypeForAudience(aud) {
    return aud === 'studio' ? 'developer' : 'studio';
  }

  function renderHeroPreview(aud) {
    ensureProfiles();
    const fan = document.getElementById('hero-preview-fan');
    if (!fan) return;

    const type = previewTypeForAudience(aud);
    const items = type === 'studio' ? window.MockData.studios : window.MockData.developers;
    const renderer = type === 'studio' ? window.MockData.renderStudioCard : window.MockData.renderDevCard;
    fan.innerHTML = items.slice(0, 8).map(renderer).join('');
  }

  function cWrap(i) {
    return (i % cList.length + cList.length) % cList.length;
  }

  function cId(offset) {
    return cList[cWrap(cIdx + offset)];
  }

  function buildCardHTML(id) {
    const p = profiles[id];
    const items = p.bestWork || p.topGames || [];
    const isDev = p.type === 'dev';
    const showcaseLabel = isDev ? 'Best Work' : 'Top Games';
    const showcaseBtnLabel = isDev ? 'See best work →' : 'See top games →';

    const showcaseRows = items.map(function (w) {
      let details = '<div class="showcase-details">';
      if (isDev) {
        if (w.tools) details += `<span class="showcase-detail"><span class="showcase-detail-label">Tools:</span> ${w.tools}</span>`;
        if (w.time) details += `<span class="showcase-detail"><span class="showcase-detail-label">Time:</span> ${w.time}</span>`;
        if (w.amount) details += `<span class="showcase-detail"><span class="showcase-detail-label">Paid:</span> ${w.amount}</span>`;
      } else {
        if (w.plays) details += `<span class="showcase-detail"><span class="showcase-detail-label">Plays:</span> ${w.plays}</span>`;
        if (w.topCcu) details += `<span class="showcase-detail"><span class="showcase-detail-label">Top CCU:</span> ${w.topCcu}</span>`;
        if (w.currentCcu) details += `<span class="showcase-detail"><span class="showcase-detail-label">Current CCU:</span> ${w.currentCcu}</span>`;
      }
      details += '</div>';
      return `<div class="showcase-row"><div class="showcase-icon" style="background:${w.bg}">${w.emoji}</div><div class="showcase-text"><div class="showcase-text-title">${w.title}</div><div class="showcase-text-desc">${w.desc}</div>${details}</div></div>`;
    }).join('');

    let extras = '';
    if (isDev && p.portfolio) {
      const links = p.portfolio.links.map(function (link) {
        return `<a href="https://${link.url}" target="_blank" class="modal-portfolio-link"><span class="modal-portfolio-link-name">${link.name}</span><span class="modal-portfolio-link-url">${link.url}</span></a>`;
      }).join('');
      extras += `<div class="modal-divider"></div><div class="modal-section-title">Portfolio</div><div class="modal-portfolio"><div class="modal-portfolio-links">${links}</div></div>`;
    }

    if (p.socials && p.socials.length) {
      extras += `<div class="modal-section-title" style="margin-top:14px;">Socials</div><div class="modal-socials">${p.socials.map(function (social) {
        return `<a href="${social.url}" class="modal-social-btn"><span class="modal-social-icon">${social.icon}</span>${social.label}</a>`;
      }).join('')}</div>`;
    }

    const buttons = items.length
      ? `<div class="modal-btn-group"><button class="modal-btn-secondary" onclick="showShowcase(this)">${showcaseBtnLabel}</button></div>`
      : '';

    const actionBar = '<div class="action-bar">' +
      '<button class="action-btn btn-pass" title="Pass" onclick="passCard(this)"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
      '<button class="action-btn btn-chat" title="Chat" onclick="window.location.href=\'chat.html\'"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></button>' +
      '<button class="action-btn btn-like" title="Like" onclick="likeCard(this)"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>' +
      '</div>';

    const passReasonOptions = isDev
      ? '<option value="" disabled selected>Select a reason…</option>' +
        '<option value="not-enough-exp">Not enough experience</option>' +
        '<option value="wrong-skills">Skills don\'t match what I need</option>' +
        '<option value="portfolio-quality">Portfolio doesn\'t meet my standard</option>' +
        '<option value="aesthetic-mismatch">Don\'t like the aesthetic of past work</option>' +
        '<option value="rate-too-high">Charging too much for my budget</option>' +
        '<option value="wrong-payment">Can\'t accept their payment method</option>' +
        '<option value="availability">Availability doesn\'t match my timeline</option>' +
        '<option value="communication">Prefer a different communication style</option>' +
        '<option value="too-niche">Specialisation is too niche for my project</option>' +
        '<option value="just-browsing">Just browsing, not ready to commit</option>'
      : '<option value="" disabled selected>Select a reason…</option>' +
        '<option value="team-too-small">Team is too small for my needs</option>' +
        '<option value="team-too-large">Team is too large, looking for smaller studios</option>' +
        '<option value="wrong-genre">Their games aren\'t in my genre</option>' +
        '<option value="budget-mismatch">Budget type doesn\'t work for me</option>' +
        '<option value="game-quality">Game quality doesn\'t meet my standard</option>' +
        '<option value="low-ccu">Player numbers are too low</option>' +
        '<option value="wrong-roles">They\'re not hiring for my skillset</option>' +
        '<option value="culture-fit">Doesn\'t seem like a good culture fit</option>' +
        '<option value="no-track-record">Not enough track record or shipped games</option>' +
        '<option value="just-browsing">Just browsing, not ready to commit</option>';

    const matchOverlay = '<div class="match-overlay">' +
      '<div class="match-overlay-text">💚 You swiped right!</div>' +
      '<div class="match-overlay-sub">We\'ll let you know when it\'s a match.</div>' +
      '<div class="match-chat-icon" title="Start chatting" onclick="window.location.href=\'chat.html\'"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>' +
      '<button class="match-keep-btn" onclick="advanceAfterLike(this)">Keep matching →</button>' +
      '</div>';

    const passOverlay = '<div class="pass-overlay">' +
      `<div class="pass-overlay-icon">👋</div><div class="pass-overlay-text">You passed on ${p.name}</div>` +
      '<div class="pass-overlay-sub">Help us improve — why wasn\'t it a fit?</div>' +
      `<select class="pass-reason-select">${passReasonOptions}</select>` +
      '<button class="pass-continue-btn" onclick="advanceAfterPass(this)">Continue matching →</button>' +
      '<button class="pass-skip-btn" onclick="advanceAfterPass(this)">Skip feedback</button>' +
      '</div>';

    return '<div class="modal-card-inner" data-pid="' + id + '">' +
      '<div class="modal-face"><button class="modal-close" onclick="closeModalBtn()">✕</button><div class="modal-hero" style="background:' + p.bg + '">' + p.emoji + '</div><div class="modal-body"><div class="modal-badge">' + p.badge + '</div><div class="modal-name">' + p.name + '</div><div class="modal-role">' + p.role + '</div><div class="modal-bio">' + p.bio + '</div><div class="modal-tags">' + p.tags.map(function (tag) { return '<span class="modal-tag">' + tag + '</span>'; }).join('') + '</div><div class="modal-meta"><div class="modal-dot"></div>' + p.meta + '</div>' + extras + buttons + '</div>' + actionBar + '</div>' +
      '<div class="modal-face-back"><button class="modal-close" onclick="closeModalBtn()">✕</button><div class="modal-hero" style="background:' + p.bg + '">' + p.emoji + '</div><div class="showcase-header"><div class="showcase-title">' + p.name + ' — ' + showcaseLabel + '</div></div><div class="showcase-rows">' + showcaseRows + '</div><div class="showcase-footer"><button class="showcase-back-btn" onclick="hideShowcase(this)">← Back to profile</button></div></div>' +
      matchOverlay + passOverlay +
      '</div>';
  }

  function fillCard(el, id) {
    el.innerHTML = buildCardHTML(id);
    el.dataset.pid = id;
    el.onclick = (e) => e.stopPropagation();
  }

  function openModal(id) {
    const profile = profiles[id];
    const isStudio = profile.type === 'studio';
    const rej = isStudio ? rejected.studios : rejected.devs;
    const lkd = isStudio ? liked.studios : liked.devs;
    const allIds = isStudio ? studioIds : devIds;

    cList = allIds.filter(function (item) {
      return rej.indexOf(item) === -1 && lkd.indexOf(item) === -1;
    });
    if (!cList.length) {
      closeModalBtn();
      return;
    }
    if (cList.indexOf(id) === -1) id = cList[0];
    cIdx = cList.indexOf(id);
    cSlots = [document.getElementById('cc-0'), document.getElementById('cc-1'), document.getElementById('cc-2')];
    cSlots.forEach(function (slot) {
      slot.className = 'carousel-card no-anim';
      slot.style.opacity = '';
      slot.innerHTML = '';
      slot.style.display = 'none';
    });
    fillCard(cSlots[1], cId(0));
    cSlots[1].style.display = '';
    cSlots[1].className = 'carousel-card no-anim pos-center';
    if (cList.length >= 2) {
      fillCard(cSlots[0], cId(-1));
      cSlots[0].style.display = '';
      cSlots[0].className = 'carousel-card no-anim pos-left';
    }
    if (cList.length >= 3) {
      fillCard(cSlots[2], cId(1));
      cSlots[2].style.display = '';
      cSlots[2].className = 'carousel-card no-anim pos-right';
    }
    cSlots[1].offsetHeight;
    if (cList.length >= 2) cSlots[0].className = 'carousel-card pos-left';
    cSlots[1].className = 'carousel-card pos-center';
    if (cList.length >= 3) cSlots[2].className = 'carousel-card pos-right';
    window._currentModalId = id;
    document.getElementById('modal').classList.add('open');
    document.body.classList.add('modal-open');
  }

  function shuffleAndOpen(type) {
    const fan = document.getElementById('hero-preview-fan');
    const isStudio = type === 'studio';
    const rej = isStudio ? rejected.studios : rejected.devs;
    const lkd = isStudio ? liked.studios : liked.devs;
    const allIds = isStudio ? studioIds : devIds;
    const available = allIds.filter(function (id) {
      return rej.indexOf(id) === -1 && lkd.indexOf(id) === -1;
    });
    if (!available.length || !fan) return;

    const randomId = available[Math.floor(Math.random() * available.length)];
    const cards = fan.querySelectorAll('.fc');
    const chosenIdx = available.indexOf(randomId) % cards.length;
    const targetCard = cards[chosenIdx];
    if (targetCard) fan.appendChild(targetCard);

    fan.classList.add('shuffling');
    const lastCard = fan.querySelector('.fc:last-child');
    let opened = false;

    function finish() {
      if (opened) return;
      opened = true;
      fan.classList.remove('shuffling');
      fan.querySelectorAll('.fc').forEach(function (card) {
        card.style.animation = 'none';
      });
      setTimeout(function () {
        fan.querySelectorAll('.fc').forEach(function (card) {
          card.style.animation = '';
        });
      }, 50);
      openModal(randomId);
    }

    if (lastCard) {
      lastCard.addEventListener('animationend', finish, { once: true });
      const fallbackTimer = setTimeout(finish, 3200);
      lastCard.addEventListener('animationend', function () {
        clearTimeout(fallbackTimer);
      }, { once: true });
    } else {
      finish();
    }
  }

  function navModal(dir) {
    if (busy || cList.length <= 1) return;
    busy = true;
    const inner = cSlots[1].querySelector('.modal-card-inner');
    if (inner) inner.classList.remove('showing-showcase');
    cIdx = cWrap(cIdx + dir);
    cSlots.forEach(function (slot) {
      slot.style.display = 'none';
      slot.className = 'carousel-card no-anim';
    });
    fillCard(cSlots[1], cId(0));
    cSlots[1].style.display = '';
    cSlots[1].className = 'carousel-card no-anim pos-center';
    if (cList.length >= 2) {
      fillCard(cSlots[0], cId(-1));
      cSlots[0].style.display = '';
      cSlots[0].className = 'carousel-card no-anim pos-left';
    }
    if (cList.length >= 3) {
      fillCard(cSlots[2], cId(1));
      cSlots[2].style.display = '';
      cSlots[2].className = 'carousel-card no-anim pos-right';
    }
    cSlots[1].offsetHeight;
    if (cList.length >= 2) cSlots[0].className = 'carousel-card sliding pos-left';
    cSlots[1].className = 'carousel-card sliding pos-center';
    if (cList.length >= 3) cSlots[2].className = 'carousel-card sliding pos-right';
    setTimeout(function () {
      window._currentModalId = cId(0);
      cSlots.forEach(function (slot) {
        slot.classList.remove('sliding');
      });
      busy = false;
    }, 700);
  }

  function onPeekClick(i) {
    if (i === 0) navModal(-1);
    if (i === 2) navModal(1);
  }

  function passCard(btn) {
    if (busy) return;
    busy = true;
    const card = btn.closest('.carousel-card');
    const inner = card.querySelector('.modal-card-inner');
    if (inner) inner.classList.remove('showing-showcase');
    card.classList.add('pass-glow');
    setTimeout(function () {
      const overlay = card.querySelector('.pass-overlay');
      if (overlay) overlay.classList.add('visible');
      card.style.pointerEvents = 'auto';
      busy = false;
    }, 1750);
  }

  function advanceAfterPass(btn) {
    if (busy) return;
    busy = true;
    const card = btn.closest('.carousel-card');
    const currentId = window._currentModalId;
    const isStudio = profiles[currentId].type === 'studio';
    const rej = isStudio ? rejected.studios : rejected.devs;
    if (rej.indexOf(currentId) === -1) rej.push(currentId);
    const idx = cList.indexOf(currentId);
    if (idx > -1) cList.splice(idx, 1);
    const overlay = card.querySelector('.pass-overlay');
    if (overlay) overlay.classList.remove('visible');
    renderHeroPreview(getCurrentAudience());
    if (!cList.length) {
      card.classList.remove('pass-glow');
      closeModalBtn();
      busy = false;
      return;
    }
    cIdx = cIdx % cList.length;
    cSlots.forEach(function (slot) {
      slot.classList.add('no-anim');
      slot.innerHTML = '';
      slot.style.display = 'none';
    });
    fillCard(cSlots[1], cId(0));
    cSlots[1].style.display = '';
    cSlots[1].className = 'carousel-card no-anim pos-center';
    if (cList.length >= 2) {
      fillCard(cSlots[0], cId(-1));
      cSlots[0].style.display = '';
      cSlots[0].className = 'carousel-card no-anim pos-left';
    }
    if (cList.length >= 3) {
      fillCard(cSlots[2], cId(1));
      cSlots[2].style.display = '';
      cSlots[2].className = 'carousel-card no-anim pos-right';
    }
    window._currentModalId = cId(0);
    card.classList.remove('pass-glow');
    card.style.opacity = '';
    card.style.transform = '';
    cSlots[1].offsetHeight;
    if (cList.length >= 2) cSlots[0].className = 'carousel-card pos-left';
    cSlots[1].className = 'carousel-card pos-center';
    if (cList.length >= 3) cSlots[2].className = 'carousel-card pos-right';
    busy = false;
  }

  function likeCard(btn) {
    if (busy) return;
    busy = true;
    const card = btn.closest('.carousel-card');
    const inner = card.querySelector('.modal-card-inner');
    if (inner) inner.classList.remove('showing-showcase');
    card.classList.add('like-glow');
    setTimeout(function () {
      const overlay = card.querySelector('.match-overlay');
      if (overlay) overlay.classList.add('visible');
      card.style.pointerEvents = 'auto';
      busy = false;
    }, 460);
  }

  function advanceAfterLike(el) {
    if (busy) return;
    busy = true;
    const card = el.closest('.carousel-card');
    const currentId = window._currentModalId;
    const isStudio = profiles[currentId].type === 'studio';
    const lkd = isStudio ? liked.studios : liked.devs;
    if (lkd.indexOf(currentId) === -1) lkd.push(currentId);
    const idx = cList.indexOf(currentId);
    if (idx > -1) cList.splice(idx, 1);
    renderHeroPreview(getCurrentAudience());
    if (!cList.length) {
      card.classList.remove('like-glow');
      closeModalBtn();
      busy = false;
      return;
    }
    cIdx = cIdx % cList.length;
    cSlots.forEach(function (slot) {
      slot.classList.add('no-anim');
      slot.innerHTML = '';
      slot.style.display = 'none';
    });
    fillCard(cSlots[1], cId(0));
    cSlots[1].style.display = '';
    cSlots[1].className = 'carousel-card no-anim pos-center';
    if (cList.length >= 2) {
      fillCard(cSlots[0], cId(-1));
      cSlots[0].style.display = '';
      cSlots[0].className = 'carousel-card no-anim pos-left';
    }
    if (cList.length >= 3) {
      fillCard(cSlots[2], cId(1));
      cSlots[2].style.display = '';
      cSlots[2].className = 'carousel-card no-anim pos-right';
    }
    window._currentModalId = cId(0);
    card.classList.remove('like-glow');
    card.style.pointerEvents = '';
    card.style.opacity = '';
    card.style.transform = '';
    cSlots[1].offsetHeight;
    if (cList.length >= 2) cSlots[0].className = 'carousel-card pos-left';
    cSlots[1].className = 'carousel-card pos-center';
    if (cList.length >= 3) cSlots[2].className = 'carousel-card pos-right';
    busy = false;
  }

  function closeModal(event) {
    if (event && event.target.closest('.carousel-card')) return;
    closeModalBtn();
  }

  function closeModalBtn() {
    const modal = document.getElementById('modal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
  }

  function showShowcase(btn) {
    const card = btn.closest('.carousel-card');
    const inner = card && card.querySelector('.modal-card-inner');
    if (inner) inner.classList.add('showing-showcase');
  }

  function hideShowcase(btn) {
    const card = btn.closest('.carousel-card');
    const inner = card && card.querySelector('.modal-card-inner');
    if (inner) inner.classList.remove('showing-showcase');
  }

  function openMatchingPreview() {
    ensureProfiles();
    shuffleAndOpen(previewTypeForAudience(getCurrentAudience()));
  }

  window.initializeHeroStack = renderHeroPreview;
  window.openMatchingPreview = openMatchingPreview;
  window.closeModal = closeModal;
  window.closeModalBtn = closeModalBtn;
  window.showShowcase = showShowcase;
  window.hideShowcase = hideShowcase;
  window.onPeekClick = onPeekClick;
  window.navModal = navModal;
  window.passCard = passCard;
  window.likeCard = likeCard;
  window.advanceAfterPass = advanceAfterPass;
  window.advanceAfterLike = advanceAfterLike;

  window.closeMatchModal = closeModalBtn;
  window.navigateMatchModal = navModal;
  window.shuffleAndOpenHero = openMatchingPreview;
  window.resetHeroBrowser = function () {
    rejected.studios.length = 0;
    rejected.devs.length = 0;
    liked.studios.length = 0;
    liked.devs.length = 0;
    renderHeroPreview(getCurrentAudience());
    closeModalBtn();
  };

  document.addEventListener('keydown', function (event) {
    const modal = document.getElementById('modal');
    if (!modal || !modal.classList.contains('open')) return;
    if (event.key === 'Escape') closeModalBtn();
    if (event.key === 'ArrowRight') navModal(1);
    if (event.key === 'ArrowLeft') navModal(-1);
  });

    ensureProfiles();
    renderHeroPreview(getCurrentAudience());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  }
  boot();
})();
