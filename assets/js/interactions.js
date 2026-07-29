(function () {
    "use strict";

    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var scrollProgress = document.querySelector(".scroll-progress");
    var navbar = document.querySelector(".navbar");
    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".navbar .nav-link"));
    var trackedSections = navLinks.map(function (link) {
        return {
            link: link,
            section: document.querySelector(link.getAttribute("href"))
        };
    }).filter(function (item) {
        return item.section;
    });
    var scrollTicking = false;

    function syncNavigation() {
        if (!trackedSections.length) {
            return;
        }

        var navbarHeight = navbar ? navbar.offsetHeight : 0;
        var readingLine = window.scrollY + navbarHeight + 32;
        var activeItem = trackedSections[0];

        trackedSections.forEach(function (item) {
            var sectionTop = item.section.getBoundingClientRect().top + window.scrollY;

            if (sectionTop <= readingLine) {
                activeItem = item;
            }
        });

        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
            activeItem = trackedSections[trackedSections.length - 1];
        }

        trackedSections.forEach(function (item) {
            var isActive = item === activeItem;
            item.link.classList.toggle("active", isActive);

            if (isActive) {
                item.link.setAttribute("aria-current", "page");
            } else {
                item.link.removeAttribute("aria-current");
            }
        });
    }

    function updateScrollProgress() {
        if (scrollProgress) {
            var scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            var progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
            scrollProgress.style.transform = "scaleX(" + Math.min(Math.max(progress, 0), 1) + ")";
        }

        syncNavigation();
        scrollTicking = false;
    }

    function requestScrollUpdate() {
        if (!scrollTicking) {
            window.requestAnimationFrame(updateScrollProgress);
            scrollTicking = true;
        }
    }

    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate);
    updateScrollProgress();

    var heroTitle = document.querySelector(".header-title");
    var heroNameLine = document.querySelector(".hero-name-first");
    var heroSurnameLine = document.querySelector(".hero-name-last");
    var nameAlignmentTicking = false;
    var nameMetricsCanvas = document.createElement("canvas");
    var nameMetricsContext = nameMetricsCanvas.getContext("2d");
    var nameStemMetricsCache = {};

    function measureStemCenter(glyph, stemRegion, titleStyle) {
        if (!nameMetricsContext) {
            return null;
        }

        var fontSize = parseFloat(titleStyle.fontSize);
        var scale = 3;
        var cacheKey = [
            glyph,
            stemRegion,
            titleStyle.fontStyle,
            titleStyle.fontWeight,
            titleStyle.fontFamily,
            fontSize
        ].join("|");

        if (Object.prototype.hasOwnProperty.call(nameStemMetricsCache, cacheKey)) {
            return nameStemMetricsCache[cacheKey];
        }

        var renderedFontSize = fontSize * scale;
        var padding = Math.ceil(renderedFontSize * 0.55);
        var canvasWidth = Math.ceil(renderedFontSize * 2.5);
        var canvasHeight = Math.ceil(renderedFontSize * 2.5);

        nameMetricsCanvas.width = canvasWidth;
        nameMetricsCanvas.height = canvasHeight;
        nameMetricsContext.clearRect(0, 0, canvasWidth, canvasHeight);
        nameMetricsContext.font = [
            titleStyle.fontStyle,
            titleStyle.fontWeight,
            renderedFontSize + "px",
            titleStyle.fontFamily
        ].join(" ");
        nameMetricsContext.textBaseline = "alphabetic";
        nameMetricsContext.fillStyle = "#000";

        var glyphMetrics = nameMetricsContext.measureText(glyph);
        var glyphAscent = Number.isFinite(glyphMetrics.actualBoundingBoxAscent)
            ? glyphMetrics.actualBoundingBoxAscent
            : renderedFontSize * 0.8;
        var glyphDescent = Number.isFinite(glyphMetrics.actualBoundingBoxDescent)
            ? glyphMetrics.actualBoundingBoxDescent
            : renderedFontSize * 0.2;
        var glyphOriginX = padding;
        var baseline = padding + Math.ceil(glyphAscent);
        nameMetricsContext.fillText(glyph, glyphOriginX, baseline);

        var regionTop;
        var regionBottom;

        if (stemRegion === "descender") {
            regionTop = Math.max(0, Math.floor(baseline));
            regionBottom = Math.min(
                canvasHeight,
                Math.ceil(baseline + glyphDescent) + 1
            );
        } else {
            var glyphTop = baseline - glyphAscent;
            regionTop = Math.max(0, Math.floor(glyphTop));
            regionBottom = Math.min(
                canvasHeight,
                Math.ceil(glyphTop + glyphAscent * 0.3)
            );
        }

        if (regionBottom <= regionTop) {
            return null;
        }

        var pixelData = nameMetricsContext.getImageData(
            0,
            regionTop,
            canvasWidth,
            regionBottom - regionTop
        ).data;
        var minimumX = canvasWidth;
        var maximumX = -1;
        var regionHeight = regionBottom - regionTop;

        for (var y = 0; y < regionHeight; y += 1) {
            for (var x = 0; x < canvasWidth; x += 1) {
                var alpha = pixelData[(y * canvasWidth + x) * 4 + 3];

                if (alpha > 48) {
                    minimumX = Math.min(minimumX, x);
                    maximumX = Math.max(maximumX, x);
                }
            }
        }

        if (maximumX < minimumX) {
            return null;
        }

        var stemCenter = ((minimumX + maximumX) / 2 - glyphOriginX) / scale;
        nameStemMetricsCache[cacheKey] = stemCenter;

        return stemCenter;
    }

    function getCharacterBounds(element, characterIndex) {
        if (!element || !element.firstChild || element.firstChild.nodeType !== Node.TEXT_NODE) {
            return null;
        }

        var textNode = element.firstChild;
        var range = document.createRange();
        range.setStart(textNode, characterIndex);
        range.setEnd(textNode, characterIndex + 1);

        return range.getBoundingClientRect();
    }

    function alignSurname() {
        if (!heroTitle || !heroNameLine || !heroSurnameLine) {
            nameAlignmentTicking = false;
            return;
        }

        heroTitle.style.setProperty("--surname-offset", "0em");

        var anchorBounds = getCharacterBounds(heroNameLine, 4);
        var surnameAnchorBounds = getCharacterBounds(heroSurnameLine, 3);

        if (!anchorBounds || !surnameAnchorBounds) {
            nameAlignmentTicking = false;
            return;
        }

        var titleStyle = window.getComputedStyle(heroTitle);
        var qStyle = window.getComputedStyle(heroNameLine);
        var bStyle = window.getComputedStyle(heroSurnameLine);
        var qStemCenter = measureStemCenter("q", "descender", qStyle);
        var bStemCenter = measureStemCenter("b", "ascender", bStyle);
        var qTailPosition = anchorBounds.left + (
            qStemCenter === null ? anchorBounds.width * 0.62 : qStemCenter
        );
        var bStemPosition = surnameAnchorBounds.left + (
            bStemCenter === null ? surnameAnchorBounds.width * 0.14 : bStemCenter
        );

        var titleFontSize = parseFloat(titleStyle.fontSize);
        var stemOffset = (qTailPosition - bStemPosition) / titleFontSize;
        var opticalNudge = 0.0997;
        var surnameOffset = stemOffset + opticalNudge;

        heroTitle.style.setProperty("--surname-offset", surnameOffset + "em");
        nameAlignmentTicking = false;
    }

    function requestNameAlignment() {
        if (!nameAlignmentTicking) {
            window.requestAnimationFrame(alignSurname);
            nameAlignmentTicking = true;
        }
    }

    alignSurname();
    window.addEventListener("resize", requestNameAlignment);

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
            nameStemMetricsCache = {};
            requestNameAlignment();
        });
    }

    var filterLinks = document.querySelectorAll(".portfolio .filters a");
    filterLinks.forEach(function (link) {
        link.setAttribute("aria-pressed", link.classList.contains("active") ? "true" : "false");
        link.addEventListener("click", function () {
            filterLinks.forEach(function (filterLink) {
                filterLink.setAttribute("aria-pressed", filterLink === link ? "true" : "false");
            });

            window.setTimeout(requestScrollUpdate, prefersReducedMotion ? 0 : 600);
        });
    });

    if (!prefersReducedMotion && "IntersectionObserver" in window) {
        var revealTargets = document.querySelectorAll(
            ".about-intro, .personal-card, .strength-item, .portfolio-item, #resume .card, .contact-info-card"
        );

        revealTargets.forEach(function (element, index) {
            element.classList.add("reveal-on-scroll");
            element.style.setProperty("--reveal-delay", (index % 3) * 70 + "ms");
        });

        var revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: "0px 0px -8% 0px",
            threshold: 0.08
        });

        revealTargets.forEach(function (element) {
            revealObserver.observe(element);
        });
    }

    if (!prefersReducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        document.querySelectorAll(".portfolio-featured .portfolio-item").forEach(function (card) {
            var tiltFrame;

            card.addEventListener("mousemove", function (event) {
                var bounds = card.getBoundingClientRect();
                var rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 4;
                var rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -4;

                window.cancelAnimationFrame(tiltFrame);
                tiltFrame = window.requestAnimationFrame(function () {
                    card.style.transform =
                        "perspective(900px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-7px)";
                });
            });

            card.addEventListener("mouseleave", function () {
                window.cancelAnimationFrame(tiltFrame);
                card.style.removeProperty("transform");
            });
        });
    }

    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            var openMenu = document.querySelector(".navbar-collapse.show");
            if (openMenu && window.jQuery) {
                window.jQuery(openMenu).collapse("hide");
            }

            window.setTimeout(requestScrollUpdate, prefersReducedMotion ? 0 : 650);
        });
    });
})();
