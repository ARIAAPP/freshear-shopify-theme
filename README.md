# CleanEar Shopify Theme

Theme custom Shopify Liquid converti depuis Lovable React.

## 📂 Structure

```
cleanear-shopify-theme/
├── assets/                  # Images, vidéos, CSS, JS
├── config/
│   ├── settings_schema.json # Settings globaux (couleurs, fonts, tracking)
│   └── settings_data.json   # Valeurs par défaut
├── layout/
│   └── theme.liquid         # Shell HTML avec Pixel + Clarity
├── locales/
│   ├── fr.default.json      # Traductions FR
│   └── en.json              # Traductions EN
├── sections/                # Sections éditables
│   ├── announcement-bar.liquid
│   ├── header.liquid
│   ├── product-hero.liquid  # ⭐ Bundles + countdown + upsells + cart
│   ├── benefits.liquid
│   ├── facebook-community.liquid
│   ├── featured-on.liquid
│   ├── why.liquid
│   ├── reviews.liquid
│   ├── faq.liquid
│   ├── press.liquid
│   ├── newsletter.liquid
│   ├── footer.liquid
│   ├── announcement-group.json  # Groupe header (Shopify 2.0)
│   └── footer-group.json        # Groupe footer
├── snippets/
│   ├── payment-icons.liquid
│   ├── cart-drawer.liquid
│   ├── social-proof-toast.liquid
│   ├── sticky-bottom-bar.liquid
│   └── scroll-to-top.liquid
└── templates/
    ├── index.json           # Page d'accueil (assemble les sections)
    ├── product.liquid       # Redirige vers / (single-product)
    ├── cart.liquid          # Page panier (drawer principal)
    └── 404.liquid
```

## 🚀 Déploiement

### Option A — Upload zip (le plus simple)

1. Compresse tout le contenu de ce dossier en `.zip`
   (clic droit → Envoyer vers → Dossier compressé)
2. Va sur **Shopify Admin → Online Store → Themes**
3. Clique **"Add theme" → "Upload zip file"**
4. Sélectionne le .zip
5. Le thème apparaît en "Unpublished". Clique **"Customize"** pour prévisualiser
6. Quand tu es satisfait : **"Actions → Publish"**

### Option B — Connect via GitHub

1. Crée un repo GitHub `cleanear-shopify-theme`
2. Push ce dossier
3. **Shopify Admin → Themes → "Add theme" → "Connect from GitHub"**
4. Sélectionne le repo et la branche `main`

### Option C — Shopify CLI (dev local)

```bash
npm install -g @shopify/cli @shopify/theme
cd cleanear-shopify-theme
shopify theme dev --store=xjc614-vz.myshopify.com
```

## ⚙️ Configuration post-import

### 1. Vérifie le produit

Le thème utilise des **variant IDs hardcodés** :
- Produit principal : `57818495582553`
- Assurance colis : `57819501658457`
- Garantie 90 jours : `57819509293401`
- Traitement prioritaire : `57819516764505`

→ Vérifie dans **Products** que ces variants existent. Sinon mets-les à jour dans le Theme Editor (Section **Hero Produit** → Bundle blocks → Variant ID).

### 2. Upload la vidéo hero

1. **Settings → Files → Upload**
2. Upload `cleanear-hero.mp4`
3. Copie l'URL générée
4. Theme Editor → **Hero Produit** → "URL vidéo hero" → colle l'URL

### 3. Choisis les images

Pour chaque section avec un image_picker (avatars, gallery, etc.) :
1. Upload via **Settings → Files**
2. Theme Editor → sélectionne l'image dans le picker

### 4. Tracking

Pixel ID (`951036014003246`) et Clarity (`welcnptk5l`) sont déjà configurés
dans **Theme Settings → Tracking & Analytics**. Si tu veux changer, c'est ici.

### 5. DNS

Quand le thème est publié et testé :
1. **Settings → Domains → Connect existing domain**
2. Ajoute `cleanearco.com`
3. Suit les instructions DNS (CNAME `shops.myshopify.com` ou A records)
4. Tu peux retirer Lovable

## 🎨 Édition

Tout est éditable depuis **Online Store → Themes → Customize** :

- **Couleurs** : Theme Settings → Couleurs (changer primaire, accent, etc.)
- **Logo** : Theme Settings → Logo & Identité
- **Bundles & prix** : Section "Hero Produit" → blocks "Bundle"
  - Prix en **centimes** (4495 = 44,95€)
- **Reviews** : Section "Avis clients" → blocks
- **FAQ** : Section "FAQ" → blocks
- **Communauté Facebook** : Section "Communauté Facebook" → blocks (posts)
- **Newsletter** : Section "Newsletter"
- **Footer** : Section "Footer"

Tu peux **réorganiser** les sections par drag-drop dans le Theme Editor.

## 🔌 Tracking events

Le thème déclenche automatiquement :
- `PageView` (toutes pages)
- `ViewContent` (page produit)
- `AddToCart` (clic Ajouter au panier)
- `InitiateCheckout` (clic Finaliser commande / Shop Pay)

L'event `Purchase` est déclenché automatiquement par Shopify côté serveur via
**Conversions API** (configuré via le canal Facebook & Instagram dans Shopify).

## 🛠 Customisation avancée

### Ajouter une section

1. Crée `sections/ma-section.liquid` avec un schema
2. Refresh le Theme Editor → "Add section" → ta section apparaît

### Modifier les couleurs sans Theme Editor

Édite `config/settings_data.json` → `current.color_primary`, etc.

### Ajouter un événement Pixel custom

Dans le HTML de la section :
```html
<script>
  if (window.fbq) window.fbq('track', 'Lead', { value: 0, currency: 'EUR' });
</script>
```

## 📝 Notes techniques

- **Single product**: la home (`templates/index.json`) EST la page produit
- Le checkout utilise le **redirect direct** vers `xjc614-vz.myshopify.com/cart/...`
  (compatible avec le shop existant — aucun changement côté Shopify nécessaire)
- Shop Pay activé via `?payment=shop_pay` dans l'URL de checkout
- Mobile-first responsive
- Lazy loading sur toutes les images below-the-fold
- Pixel chargé après `window.load` pour LCP optimal

## 🆘 Si quelque chose casse

1. **Section ne s'affiche pas** → vérifie le schéma JSON (virgules, accolades)
2. **Image ne charge pas** → upload via Settings → Files puis re-sélectionne
3. **Cart ne s'ouvre pas** → check console pour erreurs JS
4. **Bouton acheter cassé** → vérifie variant_id dans les blocks Bundle

## 📦 Ce qui n'est PAS inclus (à ajouter en option)

- Page Blog
- Page Contact (utilise le template par défaut Shopify)
- Page Légal (CGV, mentions légales) — utilise les pages Shopify natives
- App reviews tierces (si tu veux remplacer les avis hardcodés par Loox, Judge.me, etc.)

---

**Conversion réalisée :** 27 avril 2026 depuis le code source Lovable
`clean-comm-code-main`.
