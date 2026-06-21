(function ($) {
    // ── Sync dark-mode from html element (set by FOUC-prevention script) ──
    if (document.documentElement.classList.contains('dark-mode')) {
        document.body.classList.add('dark-mode');
    }

    // ── Dark mode toggle button ────────────────────────────────────────────
    var darkModeBtn = document.querySelector('.btn-dark-mode');
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            var setToDark = !document.body.classList.contains('dark-mode');
            localStorage.setItem('dark-mode', setToDark ? 'true' : 'false');
            document.body.classList.toggle('dark-mode');
            document.documentElement.classList.toggle('dark-mode');
        });
    }

    // ── Mobile navbar burger ───────────────────────────────────────────────
    $('.navbar-burger').click(function () {
        $(this).toggleClass('is-active');
        $('.navbar-main .navbar-start').toggleClass('is-active');
        $('.navbar-main .navbar-end').toggleClass('is-active');
    });

    // ── Hide navbar on scroll down, show on scroll up ─────────────────────
    var didScroll;
    var lastScrollTop = 0;
    var delta = 5;
    var navbarHeight = $('.navbar-main').outerHeight();

    $(window).scroll(function(event){
        didScroll = true;
    });

    setInterval(function() {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    function hasScrolled() {
        var st = $(window).scrollTop();

        if(Math.abs(lastScrollTop - st) <= delta) {
            return;
        }

        if (st > lastScrollTop && st > navbarHeight) {
            var posY = Math.min(st, navbarHeight);
            // Scroll Down — hide navbar
            $('.navbar-main').css({
                '-webkit-transform' : 'translateY(-' + posY + 'px)',
                '-moz-transform'    : 'translateY(-' + posY + 'px)',
                '-ms-transform'     : 'translateY(-' + posY + 'px)',
                '-o-transform'      : 'translateY(-' + posY + 'px)',
                'transform'         : 'translateY(-' + posY + 'px)'
            });
        } else {
            // Scroll Up — show navbar
            if(st + $(window).height() < $(document).height()) {
                $('.navbar-main').css({
                    '-webkit-transform' : 'translateY(0px)',
                    '-moz-transform'    : 'translateY(0px)',
                    '-ms-transform'     : 'translateY(0px)',
                    '-o-transform'      : 'translateY(0px)',
                    'transform'         : 'translateY(0px)'
                });
            }
        }

        lastScrollTop = st;
    }

    // ── Gallery image wrapping ────────────────────────────────────────────
    $('.article.gallery img:not(".not-gallery-item")').each(function () {
        if ($(this).parent('a').length === 0) {
            $(this).wrap('<a class="gallery-item" href="' + $(this).attr('src') + '"></a>');
            if (this.alt) {
                $(this).after('<div class="caption">' + this.alt + '</div>');
            }
        }
    });

    // ── Heading anchor click → update URL hash ────────────────────────────
    $('.article-entry').find('h1, h2, h3, h4, h5, h6').on('click', function () {
        var span = $($(this).get(0)).find('span');
        if (span && span.attr('id')) {
            window.location.hash = span.attr('id');
        } else if ($(this).get(0).id) {
            window.location.hash = $(this).get(0).id;
        }
    });

})(jQuery);