/* FreshEar — Cart Drawer Logic */
(function() {
  'use strict';

  const SHOP_DOMAIN = (window.freshearTheme && window.freshearTheme.shopDomain) || (window.Shopify && window.Shopify.shop) || window.location.hostname;
  const fmt = (n) => '$' + (parseFloat(n) || 0).toFixed(2);

  const state = {
    isOpen: false,
    items: [],
    addons: [
      /* Upsell addons disabled until FreshEar upsell products are created */
    ]
  };

  const $drawer = document.querySelector('[data-cart-drawer]');
  const $overlay = document.querySelector('[data-cart-overlay]');
  const $items = document.querySelector('[data-cart-items]');
  const $empty = document.querySelector('[data-cart-empty]');
  const $footer = document.querySelector('[data-cart-footer]');
  const $count = document.querySelector('[data-cart-item-count]');
  const $headerBadge = document.querySelector('[data-cart-count]');
  const $subtotal = document.querySelector('[data-cart-subtotal]');
  const $upsells = document.querySelector('[data-cart-upsells]');
  const $upsellsList = document.querySelector('[data-cart-upsells-list]');
  const $checkout = document.querySelector('[data-checkout]');
  const $shopPay = document.querySelector('[data-shop-pay]');

  function buildCheckoutUrl(items, opts) {
    opts = opts || {};
    const parts = items.map(i => i.variantId + ':' + i.quantity);
    let url = 'https://' + SHOP_DOMAIN + '/cart/' + parts.join(',');
    var sep = '?';
    if (opts.shopPay) { url += '?payment=shop_pay'; sep = '&'; }
    url += sep + 'attributes[domaine]=' + encodeURIComponent(window.location.hostname);
    return url;
  }

  function totalPrice() {
    return state.items.reduce((s, i) => s + (i.price * i.quantity), 0);
  }
  function totalQty() {
    return state.items.reduce((s, i) => s + i.quantity, 0);
  }

  function render() {
    if (!$drawer) return;
    const qty = totalQty();
    if ($count) $count.textContent = qty;
    if ($headerBadge) {
      if (qty > 0) {
        $headerBadge.textContent = qty;
        $headerBadge.style.display = 'flex';
      } else {
        $headerBadge.style.display = 'none';
      }
    }

    if (state.items.length === 0) {
      if ($empty) $empty.style.display = '';
      if ($items) $items.innerHTML = '';
      if ($footer) $footer.setAttribute('hidden', '');
      if ($upsells) $upsells.style.display = 'none';
    } else {
      if ($empty) $empty.style.display = 'none';
      if ($footer) $footer.removeAttribute('hidden');
      if ($items) $items.innerHTML = state.items.map(itemHtml).join('');
      if ($subtotal) $subtotal.textContent = fmt(totalPrice());

      // Render upsells (those not in cart)
      const missing = state.addons.filter(a => !state.items.some(i => i.id === a.id));
      if (missing.length > 0 && $upsells && $upsellsList) {
        $upsells.style.display = '';
        $upsellsList.innerHTML = missing.map(a => `
          <button type="button" class="cart-addon-btn" data-add-addon="${a.id}" style="width:100%; display:flex; align-items:center; justify-content:space-between; gap:0.75rem; border-radius:8px; border:1px solid var(--color-border); background:var(--color-bg); padding:0.5rem 0.75rem; text-align:left;">
            <div style="display:flex; align-items:center; gap:0.5rem; min-width:0;">
              <span>${a.icon}</span>
              <span style="font-size:0.875rem; font-weight:500;">+ ${a.title}</span>
            </div>
            <span style="font-size:0.875rem; font-weight:700; color:var(--color-primary); white-space:nowrap;">+${fmt(a.price)}</span>
          </button>
        `).join('');
      } else if ($upsells) {
        $upsells.style.display = 'none';
      }
    }

    // Drawer state
    if (state.isOpen) {
      $drawer.setAttribute('data-open', 'true');
      $drawer.setAttribute('aria-hidden', 'false');
      if ($overlay) $overlay.setAttribute('data-open', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      $drawer.setAttribute('data-open', 'false');
      $drawer.setAttribute('aria-hidden', 'true');
      if ($overlay) $overlay.setAttribute('data-open', 'false');
      document.body.style.overflow = '';
    }

    document.dispatchEvent(new CustomEvent('freshear:cart-state', { detail: { isOpen: state.isOpen, items: state.items } }));
  }

  function itemHtml(item) {
    const img = item.image
      ? `<img src="${item.image}" alt="${item.title}" width="80" height="80" loading="lazy" decoding="async" style="height:5rem; width:5rem; border-radius:8px; background:var(--color-muted); object-fit:contain; padding:4px;">`
      : `<div style="height:5rem; width:5rem; border-radius:8px; background:var(--color-muted); display:flex; align-items:center; justify-content:center;"><span style="font-size:1.5rem;">📦</span></div>`;
    return `
      <div class="cart-line-item" style="display:flex; gap:0.75rem; border-bottom:1px solid var(--color-border); padding-bottom:1rem;">
        ${img}
        <div style="flex:1; min-width:0;">
          <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:0.5rem;">
            <p style="font-size:0.875rem; font-weight:600; line-height:1.25; margin:0;">${item.title}</p>
            <button type="button" data-remove="${item.id}" aria-label="Remove" style="color:var(--color-muted-fg);">×</button>
          </div>
          <p style="margin-top:0.25rem; font-size:0.875rem; font-weight:700; color:var(--color-primary);">${fmt(item.price)}</p>
          <div style="margin-top:0.5rem; display:flex; align-items:center; justify-content:space-between;">
            <div style="display:inline-flex; align-items:center; border-radius:9999px; border:1px solid var(--color-border);">
              <button type="button" data-qty="dec" data-id="${item.id}" aria-label="Decrease" style="padding:0.25rem 0.5rem; color:var(--color-muted-fg);">−</button>
              <span style="padding:0 0.5rem; font-size:0.875rem; font-weight:600;">${item.quantity}</span>
              <button type="button" data-qty="inc" data-id="${item.id}" aria-label="Increase" style="padding:0.25rem 0.5rem; color:var(--color-muted-fg);">+</button>
            </div>
            <p style="font-size:0.875rem; font-weight:600;">${fmt(item.price * item.quantity)}</p>
          </div>
        </div>
      </div>
    `;
  }

  // Public API
  window.FreshEarCart = {
    open() { state.isOpen = true; render(); },
    close() { state.isOpen = false; render(); },
    toggle() { state.isOpen = !state.isOpen; render(); },
    addItem(item) {
      if (state.items.some(i => i.id === item.id)) return;
      state.items.push(item);
      render();
    },
    removeItem(id) {
      state.items = state.items.filter(i => i.id !== id);
      render();
    },
    setQuantity(id, qty) {
      state.items = state.items
        .map(i => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)
        .filter(i => i.quantity > 0);
      render();
    },
    openWith(items) {
      // Preserve existing items not in the new set, add new ones
      state.items = items;
      state.isOpen = true;
      render();
    },
    getItems() { return state.items.slice(); }
  };

  // Event listeners
  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('[data-cart-toggle]');
    if (toggle) { e.preventDefault(); window.FreshEarCart.toggle(); return; }
    const close = e.target.closest('[data-cart-close]');
    if (close) { e.preventDefault(); window.FreshEarCart.close(); return; }
    const overlay = e.target.closest('[data-cart-overlay]');
    if (overlay) { window.FreshEarCart.close(); return; }
    const remove = e.target.closest('[data-remove]');
    if (remove) { window.FreshEarCart.removeItem(remove.dataset.remove); return; }
    const qtyBtn = e.target.closest('[data-qty]');
    if (qtyBtn) {
      const id = qtyBtn.dataset.id;
      const item = state.items.find(i => i.id === id);
      if (!item) return;
      const newQty = qtyBtn.dataset.qty === 'inc' ? item.quantity + 1 : item.quantity - 1;
      window.FreshEarCart.setQuantity(id, newQty);
      return;
    }
    const addAddon = e.target.closest('[data-add-addon]');
    if (addAddon) {
      const addon = state.addons.find(a => a.id === addAddon.dataset.addAddon);
      if (addon) {
        window.FreshEarCart.addItem({
          id: addon.id,
          variantId: addon.variantId,
          title: addon.title,
          price: addon.price,
          quantity: 1
        });
        if (window.fbq) {
          window.fbq('track', 'AddToCart', {
            value: addon.price,
            currency: 'USD',
            content_ids: [addon.variantId],
            content_type: 'product',
            num_items: 1
          });
        }
      }
      return;
    }
  });

  if ($checkout) {
    $checkout.addEventListener('click', () => {
      if (state.items.length === 0) return;
      const url = buildCheckoutUrl(state.items);
      if (window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
          value: +totalPrice().toFixed(2),
          currency: 'USD',
          content_ids: state.items.map(i => i.variantId),
          content_type: 'product',
          num_items: totalQty()
        });
      }
      setTimeout(() => { window.location.href = url; }, 200);
    });
  }
  if ($shopPay) {
    $shopPay.addEventListener('click', () => {
      if (state.items.length === 0) return;
      const url = buildCheckoutUrl(state.items, { shopPay: true });
      if (window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
          value: +totalPrice().toFixed(2),
          currency: 'USD',
          content_ids: state.items.map(i => i.variantId),
          content_type: 'product',
          num_items: totalQty()
        });
      }
      setTimeout(() => { window.location.href = url; }, 150);
    });
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.isOpen) window.FreshEarCart.close();
  });

  // Initial render
  render();
})();
