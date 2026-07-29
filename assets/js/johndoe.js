/*!
=========================================================
* JohnDoe Landing page
=========================================================

* Copyright: 2019 DevCRUD (https://devcrud.com)
* Licensed: (https://devcrud.com/licenses)
* Coded by www.devcrud.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Smooth scroll with the sticky navigation height taken into account.
$(document).ready(function() {
    $(".navbar .nav-link").on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();

            var hash = this.hash;
            var target = $(hash);
            var navbarHeight = $(".navbar").outerHeight() || 0;

            if (!target.length) {
                return;
            }

            var targetPosition = hash === "#home"
                ? 0
                : Math.max(0, target.offset().top - navbarHeight + 1);

            $('html, body').stop().animate({
                scrollTop: targetPosition
            }, 620, function() {
                if (window.history && window.history.pushState) {
                    window.history.pushState(null, "", hash);
                }
            });
        }
    });
});

// Portfolio filters and a responsive masonry grid.
$(window).on("load", function() {
    var t = $(".portfolio-container");

    t.isotope({
        itemSelector: ".portfolio-card",
        filter: ".new",
        percentPosition: true,
        masonry: {
            columnWidth: ".portfolio-grid-sizer"
        },
        transitionDuration: "0.55s"
    });

    $(".filters a").click(function() {
        $(".filters .active").removeClass("active");
        $(this).addClass("active");

        var filter = $(this).attr("data-filter");

        t.isotope({
            filter: filter
        });

        return false;
    });

    var resizeTimer;

    $(window).on("resize", function() {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(function() {
            t.isotope("layout");
        }, 120);
    });
});
