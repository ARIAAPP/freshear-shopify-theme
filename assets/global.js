/* FreshEar — Global JS */
(function() {
  'use strict';

  // Smooth scroll for anchor links
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href === '#' || href.length < 2) return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Expose money formatter
  window.formatMoney = function(value) {
    if (typeof value !== 'number') value = parseFloat(value) || 0;
    return '$' + value.toFixed(2);
  };
})();
