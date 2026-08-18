# Graphisme — site vitrine (Astro)

Squelette de départ pour `graphisme.rachelleartsvisuels.fr` : galerie masonry
filtrable par catégorie, statique, léger, pensé pour rester dans l'esprit
identité graphique du site principal.

## Démarrage

```bash
npm install
npm run dev
```

## Ce qu'il y a dedans

- `src/content/creations/` — une fiche markdown par visuel (titre, catégorie,
  client, image, format). Duplique `identite-cave-du-terroir.md` pour chaque
  nouvelle création. Les images vont dans `public/images/`.
- `src/components/GalerieFiltree.astro` — galerie + boutons de filtre.
  Les catégories affichées sont déduites automatiquement des fiches
  existantes (pas besoin de les coder en dur).
- `src/styles/global.css` — **variables CSS `:root` en haut du fichier**
  à remplacer par les couleurs/polices exactes du site principal, pour
  garder la cohérence graphique entre les deux sites.
- Filtre géré en Alpine.js (quelques Ko, pas de build React) — cohérent avec
  l'approche "site statique léger" d'Astro.
- Galerie en CSS columns (masonry natif, pas de lib JS de layout).

## Identité graphique

Les variables dans `src/styles/global.css` reprennent directement
`tailwind.config.js` et `resources/sass/app.scss` du repo Laravel :

- Violet `#AA11DD`, Cyan `#13D4F5`, fond sombre `#1A1C20`
- Police de texte **Charm**, titres en **Charmonman** (cursive)
- Boutons pilule en dégradé violet → cyan, cartes de galerie bordées violet
- Filtres avec soulignement animé (même comportement que `.btn-filter-custom`)

Si l'identité évolue côté site principal, il suffit de mettre à jour ces
variables ici pour rester synchronisé.

## À personnaliser avant mise en ligne

1. **Catégories** dans `src/content/config.ts` (`categorie: z.enum([...])`)
   si les intitulés ne correspondent pas à ce que tu veux afficher.
2. **Logo** dans `src/layouts/Layout.astro` (actuellement juste du texte,
   à remplacer par le vrai logo si besoin).
3. Remplacer les deux fiches d'exemple par les vraies créations.

## Back-office Decap CMS (ajouter du contenu sans toucher au code)

Une interface d'administration est disponible sur `/admin` une fois
configurée. Elle permet d'ajouter une création (titre, catégorie, image,
etc.) directement depuis un formulaire — chaque publication crée un commit
sur le repo GitHub, donc **le site reste 100% statique**, pas de vraie base
de données à gérer.

**Point important sur les catégories/filtres** : le champ "Catégorie" est un
champ texte libre, pas une liste figée. Les filtres affichés sur le site
sont générés automatiquement à partir des catégories réellement utilisées
dans les créations publiées. Donc pour créer un nouveau filtre, il suffit de
taper un nouveau nom de catégorie dans Decap CMS — aucune intervention
technique nécessaire.

### Mise en place (une seule fois)

1. **Créer une GitHub OAuth App** : sur GitHub → Settings → Developer
   settings → OAuth Apps → New OAuth App.
   - Homepage URL : l'URL de ton site (ex. `https://graphisme-rachelleartsvisuels.vercel.app`)
   - Authorization callback URL : `<ton-url>/api/callback`
   - Récupère le **Client ID** et génère un **Client Secret**.

2. **Ajouter les variables d'environnement dans Vercel** (Project Settings →
   Environment Variables) :
   - `OAUTH_CLIENT_ID`
   - `OAUTH_CLIENT_SECRET`

3. **Vérifier `public/admin/config.yml`** : le champ `repo:` doit pointer
   vers `kurillos/graphisme-rachelleartsvisuels` (ou le nom exact du repo).

4. Redéployer, puis se rendre sur `<ton-url>/admin`, cliquer sur "Login with
   GitHub" — le compte GitHub utilisé doit avoir accès en écriture au repo.

Les fonctions `api/auth.js` et `api/callback.js` gèrent l'échange
d'autorisation avec GitHub (Vercel les déploie automatiquement comme
fonctions serverless, aucune config supplémentaire nécessaire).

## Déploiement (O2switch)

```bash
npm run build
```

Le dossier `dist/` généré est 100% statique : à envoyer par `scp`/FTP dans
le sous-domaine `graphisme.rachelleartsvisuels.fr`, comme pour le reste de
l'hébergement O2switch.

## Piste d'amélioration (optionnelle)

Pour une transition plus douce au clic sur un filtre (fondu au lieu d'un
masquage instantané), on peut envelopper le changement de `filtre` dans
`document.startViewTransition()` (API navigateur, supportée par les
navigateurs Chromium/Edge récents, avec repli silencieux ailleurs).
