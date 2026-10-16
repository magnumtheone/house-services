/* ============================================================
   HOUSE SERVICE S.A.S — Comportements communs à toutes les pages
   (menu mobile, menus déroulants, en-tête au défilement, année)
   ------------------------------------------------------------
   Les écouteurs sont posés sur `document` (phase de bouillonnement) :
   ils s'exécutent après d'anciens scripts de page éventuels et fixent
   l'état final de manière explicite, ce qui évite tout double basculement.
   ============================================================ */
(function () {
    'use strict';

    var MOBILE_BP = 1080;
    var header = document.getElementById('siteHeader');
    if (!header) return;

    var menu = document.getElementById('navMenu');
    var overlay = document.getElementById('navOverlay');
    var burger = document.getElementById('hamburgerBtn');
    var menuOpen = false;

    function isMobile() { return window.innerWidth <= MOBILE_BP; }

    function setMenu(open) {
        menuOpen = open;
        if (menu) menu.classList.toggle('active', open);
        if (overlay) overlay.classList.toggle('active', open);
        document.body.classList.toggle('nav-open', open);
        if (burger) {
            burger.setAttribute('aria-expanded', String(open));
            burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
            var icon = burger.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars', !open);
                icon.classList.toggle('fa-times', open);
            }
        }
        if (!open) closeDropdowns();
    }

    function closeDropdowns(except) {
        header.querySelectorAll('.dropdown').forEach(function (d) {
            if (d === except) return;
            d.classList.remove('active');
            d.dataset.open = 'false';
            var t = d.querySelector(':scope > .nav-link');
            if (t) t.setAttribute('aria-expanded', 'false');
        });
    }

    document.addEventListener('click', function (e) {
        var target = e.target;

        if (burger && burger.contains(target)) {
            setMenu(!menuOpen);
            return;
        }
        if (overlay && target === overlay) {
            setMenu(false);
            return;
        }

        var trigger = target.closest('#siteHeader .dropdown > .nav-link');
        if (trigger) {
            if (isMobile()) {
                e.preventDefault();
                var dd = trigger.parentElement;
                var willOpen = dd.dataset.open !== 'true';
                closeDropdowns(dd);
                dd.dataset.open = String(willOpen);
                dd.classList.toggle('active', willOpen);
                trigger.setAttribute('aria-expanded', String(willOpen));
            }
            return;
        }

        if (target.closest('#siteHeader .drop-item, #siteHeader .nav-menu > a')) {
            if (isMobile()) setMenu(false);
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        if (menuOpen) {
            setMenu(false);
            if (burger) burger.focus();
        } else {
            var active = document.activeElement;
            if (active && header.contains(active)) active.blur();
        }
    });

    window.addEventListener('resize', function () {
        if (!isMobile() && menuOpen) setMenu(false);
    });

    // En-tête : ombre au défilement
    function onScroll() { header.classList.toggle('scrolled', window.scrollY > 10); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Lien actif dans la navigation
    var path = window.location.pathname.replace(/index\.html$/, '');
    header.querySelectorAll('.nav-menu a[href]').forEach(function (a) {
        var href = a.getAttribute('href');
        if (!href || href.charAt(0) === '#' || href.indexOf('#') > -1) return;
        if (href.replace(/index\.html$/, '') === path) {
            var top = a.classList.contains('drop-item') ? a.closest('.dropdown').querySelector('.nav-link') : a;
            if (top && top.classList.contains('nav-link')) top.setAttribute('aria-current', 'page');
        }
    });

    // Cible du lien d'évitement
    if (!document.getElementById('main')) {
        var main = document.querySelector('main') || header.nextElementSibling;
        if (main) main.id = main.id || 'main';
        var skip = document.querySelector('.skip-link');
        if (skip && main) skip.setAttribute('href', '#' + main.id);
    }

    // Année du pied de page
    var year = String(new Date().getFullYear());
    document.querySelectorAll('#footer-year, .js-year').forEach(function (el) { el.textContent = year; });
})();
