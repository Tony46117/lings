 
(function () {
  "use strict";

   
  var dundoriCoords = [-0.2519, 36.23641];
  var mapEl = document.getElementById("nurseryMap");
  if (mapEl && typeof L !== "undefined") {
    var nurseryMap = L.map(mapEl, {
      center: dundoriCoords,
      zoom: 14,
      scrollWheelZoom: false,
      attributionControl: true
    });

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 19,
        attribution:
          'Satellite imagery &copy; <a href="https://www.arcgis.com/">Esri</a> — Source: Esri, Maxar, Earthstar Geographics',
      }
    ).addTo(nurseryMap);

    L.marker(dundoriCoords, {
      icon: L.divIcon({
        className: "nursery-pin",
        html: '<span class="nursery-pin-dot"></span>',
        iconSize: [32, 42],
        iconAnchor: [16, 42],
      }),
    })
      .addTo(nurseryMap)
      .bindPopup(
        '<strong>Seedling Kenya Nursery</strong><br>Dundori Town, Nakuru County'
      )
      .openPopup();

    var mapElRef = mapEl;
    mapElRef.addEventListener("pointerdown", function () {
      setTimeout(function () {
        if (nurseryMap.scrollWheelZoom) nurseryMap.scrollWheelZoom.enable();
      }, 200);
    });
    mapElRef.addEventListener("pointerleave", function () {
      if (nurseryMap.scrollWheelZoom) nurseryMap.scrollWheelZoom.disable();
    });
  }

   
  var heroVideo = document.querySelector(".hero-video");
  if (heroVideo) {
    heroVideo.muted = true;
    var gestureBound = false;
    var startOnGesture = function () {
      tryPlay();
      window.removeEventListener("pointerdown", startOnGesture);
      window.removeEventListener("keydown", startOnGesture);
      gestureBound = false;
    };
    var tryPlay = function () {
      var p = heroVideo.play();
      if (p && typeof p.catch === "function") {
        p.catch(function () {
          
          if (!gestureBound) {
            gestureBound = true;
            window.addEventListener("pointerdown", startOnGesture);
            window.addEventListener("keydown", startOnGesture);
          }
        });
      }
    };
    tryPlay();
  }

   
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  function showReveals() {
    revealEls.forEach(function (el) {
      if (!el.classList.contains("visible")) el.classList.add("visible");
    });
  }

  var revealObserver;
  if ("IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    showReveals();
  }

  
  window.setTimeout(function () {
    revealEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) el.classList.add("visible");
    });
  }, 500);

   
  var header = document.getElementById("siteHeader");
  var sections = Array.prototype.slice
    .call(document.querySelectorAll("main section[id], main section"))
    .filter(function (s) { return s.id; });
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));

  function highlightNav() {
    var pos = window.scrollY + 120;
    var currentId = "";
    sections.forEach(function (s) {
      if (pos >= s.offsetTop) currentId = s.id;
    });
    navLinks.forEach(function (l) {
      var match = l.getAttribute("href") === "#" + currentId;
      l.classList.toggle("active", match);
    });
  }

   
  function onScroll() {
    if (window.scrollY > 10) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
    highlightNav();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

   
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("siteNav");

  function closeNav() {
    nav.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    
    navLinks.forEach(function (l) {
      l.addEventListener("click", closeNav);
    });
    
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("open") && !nav.contains(e.target) && e.target !== toggle) {
        closeNav();
      }
    });
  }

   
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
