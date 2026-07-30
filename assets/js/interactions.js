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

    var portfolioVideos = document.querySelectorAll(".portfolio-video");

    function loadPortfolioVideo(video) {
        if (video.getAttribute("data-loaded") === "true") {
            return;
        }

        video.querySelectorAll("source[data-src]").forEach(function (source) {
            source.src = source.getAttribute("data-src");
            source.removeAttribute("data-src");
        });

        video.setAttribute("data-loaded", "true");
        video.load();

        var playRequest = video.play();

        if (playRequest && typeof playRequest.catch === "function") {
            playRequest.catch(function () {
                // The autoplay attribute will retry when browser policy allows it.
            });
        }
    }

    if ("IntersectionObserver" in window) {
        var videoObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    loadPortfolioVideo(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: "600px 0px",
            threshold: 0
        });

        portfolioVideos.forEach(function (video) {
            videoObserver.observe(video);
        });
    } else {
        portfolioVideos.forEach(loadPortfolioVideo);
    }

    var parallaxStates = [];
    var parallaxFrame = null;
    var parallaxMetricsFrame = null;
    var hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var heroDepth = document.querySelector(".hero-depth");

    function clampParallax(value, minimum, maximum) {
        return Math.min(Math.max(value, minimum), maximum);
    }

    if (heroDepth && !prefersReducedMotion) {
        var hero = heroDepth.closest(".header");
        var heroDepthFrame = null;
        var heroMetricsFrame = null;
        var heroDepthState = {
            visible: true,
            pointerX: 0,
            pointerY: 0,
            scrollProgress: 0,
            bgX: 0,
            bgY: 0,
            subjectX: 0,
            subjectY: 0,
            targetBgX: 0,
            targetBgY: 0,
            targetSubjectX: 0,
            targetSubjectY: 0,
            velocityBgX: 0,
            velocityBgY: 0,
            velocitySubjectX: 0,
            velocitySubjectY: 0
        };

        function syncHeroDepthTargets() {
            heroDepthState.targetBgX = heroDepthState.pointerX * -3.5;
            heroDepthState.targetBgY =
                heroDepthState.scrollProgress * 10 +
                heroDepthState.pointerY * -2.5;
            heroDepthState.targetSubjectX = heroDepthState.pointerX * -12;
            heroDepthState.targetSubjectY =
                heroDepthState.scrollProgress * 34 +
                heroDepthState.pointerY * -9;
        }

        function advanceHeroDepthAxis(valueKey, targetKey, velocityKey) {
            var delta = heroDepthState[targetKey] - heroDepthState[valueKey];

            heroDepthState[velocityKey] =
                (heroDepthState[velocityKey] + delta * 0.082) * 0.78;
            heroDepthState[valueKey] += heroDepthState[velocityKey];

            var isMoving =
                Math.abs(delta) > 0.01 ||
                Math.abs(heroDepthState[velocityKey]) > 0.01;

            if (!isMoving) {
                heroDepthState[valueKey] = heroDepthState[targetKey];
                heroDepthState[velocityKey] = 0;
            }

            return isMoving;
        }

        function animateHeroDepth() {
            var isMoving = false;

            isMoving =
                advanceHeroDepthAxis("bgX", "targetBgX", "velocityBgX") ||
                isMoving;
            isMoving =
                advanceHeroDepthAxis("bgY", "targetBgY", "velocityBgY") ||
                isMoving;
            isMoving =
                advanceHeroDepthAxis("subjectX", "targetSubjectX", "velocitySubjectX") ||
                isMoving;
            isMoving =
                advanceHeroDepthAxis("subjectY", "targetSubjectY", "velocitySubjectY") ||
                isMoving;

            heroDepth.style.setProperty(
                "--hero-bg-x",
                heroDepthState.bgX.toFixed(3) + "px"
            );
            heroDepth.style.setProperty(
                "--hero-bg-y",
                heroDepthState.bgY.toFixed(3) + "px"
            );
            heroDepth.style.setProperty(
                "--hero-subject-x",
                heroDepthState.subjectX.toFixed(3) + "px"
            );
            heroDepth.style.setProperty(
                "--hero-subject-y",
                heroDepthState.subjectY.toFixed(3) + "px"
            );

            heroDepthFrame = isMoving
                ? window.requestAnimationFrame(animateHeroDepth)
                : null;
        }

        function requestHeroDepthAnimation() {
            if (heroDepthFrame === null && heroDepthState.visible) {
                heroDepthFrame = window.requestAnimationFrame(animateHeroDepth);
            }
        }

        function updateHeroDepthMetrics() {
            heroMetricsFrame = null;

            if (!hero || !heroDepthState.visible) {
                return;
            }

            var bounds = hero.getBoundingClientRect();
            heroDepthState.scrollProgress = bounds.height > 0
                ? clampParallax(-bounds.top / bounds.height, 0, 1)
                : 0;

            syncHeroDepthTargets();
            requestHeroDepthAnimation();
        }

        function requestHeroDepthMetrics() {
            if (heroMetricsFrame === null && heroDepthState.visible) {
                heroMetricsFrame = window.requestAnimationFrame(updateHeroDepthMetrics);
            }
        }

        heroDepth.classList.add("is-animated", "is-active");

        if (hasFinePointer && hero) {
            hero.addEventListener("pointermove", function (event) {
                var bounds = hero.getBoundingClientRect();

                heroDepthState.pointerX = bounds.width > 0
                    ? clampParallax(
                        ((event.clientX - bounds.left) / bounds.width - 0.5) * 2,
                        -1,
                        1
                    )
                    : 0;
                heroDepthState.pointerY = bounds.height > 0
                    ? clampParallax(
                        ((event.clientY - bounds.top) / bounds.height - 0.5) * 2,
                        -1,
                        1
                    )
                    : 0;

                syncHeroDepthTargets();
                requestHeroDepthAnimation();
            });

            hero.addEventListener("pointerleave", function () {
                heroDepthState.pointerX = 0;
                heroDepthState.pointerY = 0;
                syncHeroDepthTargets();
                requestHeroDepthAnimation();
            });
        }

        if ("IntersectionObserver" in window && hero) {
            var heroDepthObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    heroDepthState.visible = entry.isIntersecting;
                    heroDepth.classList.toggle("is-active", entry.isIntersecting);

                    if (entry.isIntersecting) {
                        requestHeroDepthMetrics();
                    } else {
                        heroDepthState.pointerX = 0;
                        heroDepthState.pointerY = 0;
                    }
                });
            }, {
                rootMargin: "8% 0px",
                threshold: 0
            });

            heroDepthObserver.observe(hero);
        }

        window.addEventListener("scroll", requestHeroDepthMetrics, { passive: true });
        window.addEventListener("resize", requestHeroDepthMetrics);
        window.addEventListener("load", requestHeroDepthMetrics);
        requestHeroDepthMetrics();
    }

    function syncParallaxTarget(state) {
        state.targetX = state.visible ? state.pointerX : 0;
        state.targetY = state.visible ? state.scrollY + state.pointerY : 0;
        state.targetScale = state.visible ? (state.hovered ? 1.026 : 1.018) : 1;
    }

    function animateParallax() {
        var isMoving = false;

        parallaxStates.forEach(function (state) {
            var deltaX = state.targetX - state.x;
            var deltaY = state.targetY - state.y;
            var deltaScale = state.targetScale - state.scale;

            state.velocityX = (state.velocityX + deltaX * 0.095) * 0.76;
            state.velocityY = (state.velocityY + deltaY * 0.095) * 0.76;
            state.velocityScale = (state.velocityScale + deltaScale * 0.095) * 0.76;

            state.x += state.velocityX;
            state.y += state.velocityY;
            state.scale += state.velocityScale;

            var stateIsMoving =
                Math.abs(deltaX) > 0.01 ||
                Math.abs(deltaY) > 0.01 ||
                Math.abs(deltaScale) > 0.0001 ||
                Math.abs(state.velocityX) > 0.01 ||
                Math.abs(state.velocityY) > 0.01 ||
                Math.abs(state.velocityScale) > 0.0001;

            if (!stateIsMoving) {
                state.x = state.targetX;
                state.y = state.targetY;
                state.scale = state.targetScale;
                state.velocityX = 0;
                state.velocityY = 0;
                state.velocityScale = 0;
            }

            state.element.style.transform =
                "translate3d(" +
                state.x.toFixed(3) +
                "px, " +
                state.y.toFixed(3) +
                "px, 0) scale(" +
                state.scale.toFixed(5) +
                ")";

            isMoving = isMoving || stateIsMoving;
        });

        parallaxFrame = isMoving
            ? window.requestAnimationFrame(animateParallax)
            : null;
    }

    function requestParallaxAnimation() {
        if (parallaxFrame === null) {
            parallaxFrame = window.requestAnimationFrame(animateParallax);
        }
    }

    function updateParallaxMetrics() {
        parallaxMetricsFrame = null;
        var viewportCenter = window.innerHeight / 2;

        parallaxStates.forEach(function (state) {
            if (!state.visible) {
                return;
            }

            var bounds = state.card.getBoundingClientRect();
            var travel = (window.innerHeight + bounds.height) / 2;
            var progress = travel > 0
                ? (viewportCenter - (bounds.top + bounds.height / 2)) / travel
                : 0;

            state.scrollY = clampParallax(progress, -1, 1) * 8;
            syncParallaxTarget(state);
        });

        requestParallaxAnimation();
    }

    function requestParallaxMetrics() {
        if (parallaxMetricsFrame === null) {
            parallaxMetricsFrame = window.requestAnimationFrame(updateParallaxMetrics);
        }
    }

    if (!prefersReducedMotion) {
        document.querySelectorAll(".portfolio-item picture").forEach(function (picture) {
            var card = picture.closest(".portfolio-item");

            if (!card) {
                return;
            }

            var state = {
                element: picture,
                card: card,
                visible: !("IntersectionObserver" in window),
                hovered: false,
                pointerX: 0,
                pointerY: 0,
                scrollY: 0,
                targetX: 0,
                targetY: 0,
                targetScale: 1,
                x: 0,
                y: 0,
                scale: 1,
                velocityX: 0,
                velocityY: 0,
                velocityScale: 0
            };

            picture.classList.add("portfolio-parallax");
            parallaxStates.push(state);

            if (hasFinePointer) {
                card.addEventListener("pointermove", function (event) {
                    var bounds = card.getBoundingClientRect();
                    var relativeX = bounds.width > 0
                        ? (event.clientX - bounds.left) / bounds.width - 0.5
                        : 0;
                    var relativeY = bounds.height > 0
                        ? (event.clientY - bounds.top) / bounds.height - 0.5
                        : 0;

                    state.hovered = true;
                    state.pointerX = clampParallax(relativeX, -0.5, 0.5) * -10;
                    state.pointerY = clampParallax(relativeY, -0.5, 0.5) * -8;
                    syncParallaxTarget(state);
                    requestParallaxAnimation();
                });

                card.addEventListener("pointerleave", function () {
                    state.hovered = false;
                    state.pointerX = 0;
                    state.pointerY = 0;
                    syncParallaxTarget(state);
                    requestParallaxAnimation();
                });
            }
        });

        if ("IntersectionObserver" in window) {
            var parallaxObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    var state = parallaxStates.find(function (candidate) {
                        return candidate.element === entry.target;
                    });

                    if (!state) {
                        return;
                    }

                    state.visible = entry.isIntersecting;
                    state.element.classList.toggle("is-parallax-active", state.visible);

                    if (!state.visible) {
                        state.hovered = false;
                        state.pointerX = 0;
                        state.pointerY = 0;
                        state.scrollY = 0;
                    }

                    syncParallaxTarget(state);
                });

                requestParallaxMetrics();
                requestParallaxAnimation();
            }, {
                rootMargin: "12% 0px",
                threshold: 0
            });

            parallaxStates.forEach(function (state) {
                parallaxObserver.observe(state.element);
            });
        } else {
            parallaxStates.forEach(function (state) {
                state.element.classList.add("is-parallax-active");
            });
        }

        window.addEventListener("scroll", requestParallaxMetrics, { passive: true });
        window.addEventListener("resize", requestParallaxMetrics);
        window.addEventListener("load", requestParallaxMetrics);
        requestParallaxMetrics();
    }

    var heroTitle = document.querySelector(".header-title");
    var heroNameLine = document.querySelector(".hero-name-first");
    var heroSurnameLine = document.querySelector(".hero-name-last");
    var nameAlignmentTicking = false;
    var nameMetricsCanvas = document.createElement("canvas");
    var nameMetricsContext = nameMetricsCanvas.getContext("2d", {
        willReadFrequently: true
    });
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

            window.setTimeout(function () {
                requestScrollUpdate();
                requestParallaxMetrics();
            }, prefersReducedMotion ? 0 : 600);
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
