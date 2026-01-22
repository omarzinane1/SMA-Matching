# SMA Matching - Frontend

Système Multi-Agent pour le matching CV ↔ Offres d'emploi - Frontend Next.js 14

## Architecture

### Structure du projet

```
app/
├── page.tsx                 # Page d'accueil
├── login/page.tsx          # Page de connexion
├── register/page.tsx       # Page d'inscription (admin)
├── dashboard/page.tsx      # Dashboard avec liste offres
├── upload-cv/page.tsx      # Upload CV
├── results/page.tsx        # Résultats avec scores
├── create-offer/page.tsx   # Créer une offre (admin)
├── api/                    # Route handlers pour proxy vers Flask
│   ├── auth/
│   │   ├── login/route.ts
│   │   ├── register/route.ts
│   │   └── me/route.ts
│   ├── offers/route.ts
│   ├── cv/upload/route.ts
│   └── results/
│       ├── list/route.ts
│       └── delete/route.ts
├── context/
│   └── AuthContext.tsx     # Context d'authentification
└── globals.css             # Styles globaux Tailwind

components/
├── Header.tsx              # Navbar global
├── ProtectedRoute.tsx      # HOC pour protéger les pages
└── ui/                     # Composants shadcn/ui
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    └── spinner.tsx
```

### Pages et fonctionnalités

#### 1. **Page d'accueil** (`/`)
- Affiche une présentation de l'application
- Boutons pour login/register
- Accessible à tous (non-authentifiés redirigés vers dashboard si connectés)

#### 2. **Login** (`/login`)
- Formulaire email + mot de passe
- Appel `/api/auth/login` (proxy vers Flask)
- Stockage du token JWT en localStorage
- Redirection vers dashboard après succès

#### 3. **Register** (`/register`)
- Formulaire pour créer un compte admin
- Validation du mot de passe (min 6 caractères)
- Appel `/api/auth/register`

#### 4. **Dashboard** (`/dashboard`)
- Liste les offres d'emploi
- Affiche titre et description
- Bouton "Voir CVs" → redirige vers `/results?offerId=XX`
- Admin peut créer/éditer/supprimer des offres
- Protégé par `ProtectedRoute`

#### 5. **Upload CV** (`/upload-cv`)
- Formulaire pour uploader un CV (PDF/DOCX)
- Sélection de l'offre associée
- Appel `/api/cv/upload`
- Validation du type de fichier

#### 6. **Résultats** (`/results?offerId=XX`)
- Liste les CVs pour une offre
- Affiche score de compatibilité
- Top 3 surlignés avec badges
- Table complète de tous les CVs
- Boutons pour supprimer un CV
- Tri automatique par score décroissant

#### 7. **Créer Offre** (`/create-offer`)
- Formulaire titre + description
- Admin uniquement
- Appel `/api/offers` (POST)

### Authentification

**AuthContext** (`app/context/AuthContext.tsx`):
- Gère l'état de l'utilisateur
- `login(email, password)` - authentification
- `register(email, password)` - création compte
- `logout()` - déconnexion
- `useAuth()` hook pour accéder au contexte

**Token management**:
- JWT stocké en localStorage
- Envoyé dans chaque requête API via header `Authorization: Bearer <token>`
- Vérifié au chargement avec `/api/auth/me`

**Protected Routes**:
- Composant `ProtectedRoute` enveloppe les pages privées
- Redirige vers `/login` si non-authentifié
- Vérifie le rôle (admin/user) si nécessaire

## Configuration

### Variables d'environnement

Ajouter dans `.env.local`:

```
FLASK_API_URL=http://localhost:5000
```

Par défaut, l'URL est `http://localhost:5000` (backend Flask)

## Installation et démarrage

### Prérequis
- Node.js 18+
- Backend Flask en cours d'exécution sur `http://localhost:5000`

### Installation

```bash
# Installer les dépendances
npm install

# Ou avec yarn/pnpm
yarn install
pnpm install
```

### Développement

```bash
npm run dev
# L'application sera accessible sur http://localhost:3000
```

### Build pour production

```bash
npm run build
npm start
```

## Endpoints API consommés

Le frontend appelle ces endpoints via le backend Flask:

### Auth
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/auth/me` - Infos utilisateur actuels

### Offres
- `GET /api/offers` - Lister les offres
- `POST /api/offers` - Créer une offre (admin)
- `PUT /api/offers/{id}` - Éditer une offre (admin)
- `DELETE /api/offers/{id}` - Supprimer (admin)

### CV
- `POST /api/cv/upload` - Télécharger un CV
- `POST /api/cv/analyze` - Analyser un CV

### Résultats
- `GET /api/results/list?offerId=XX` - CVs pour une offre
- `GET /api/results/top?offerId=XX` - Top 3 CVs
- `DELETE /api/results?cvId=XX` - Supprimer un CV

## Composants réutilisables

### Button
```tsx
<Button>Text</Button>
<Button variant="outline">Outline</Button>
<Button variant="destructive">Delete</Button>
<Button size="sm">Small</Button>
<Button disabled>Disabled</Button>
```

### Card
```tsx
<Card>
  <div className="p-6">Content</div>
</Card>
```

### Input
```tsx
<Input type="email" placeholder="email@example.com" />
<Input type="password" placeholder="••••••••" />
```

### Spinner
```tsx
<Spinner />
<Spinner size="sm" />
<Spinner size="lg" />
```

## Styles et thème

- **Framework CSS**: Tailwind CSS v4
- **Composants**: shadcn/ui
- **Tokens de design**: Variables CSS dans `globals.css`
- **Responsive**: Mobile-first avec préfixes `md:` et `lg:`

## Flux utilisateur

### Admin
1. Inscription → Login
2. Dashboard (voir offres)
3. Créer offre → Description
4. Voir CVs → Analyser scores
5. Supprimer CVs non pertinents

### User
1. Login (compte créé par admin)
2. Upload CV
3. Sélectionner une offre
4. Voir résultats et score

## Points importants

1. **Token JWT**: Stocké en localStorage, vérifié à chaque requête
2. **Validation**: Frontend et backend
3. **Erreurs**: Affichées dans des cards rouges
4. **Succès**: Messages de confirmation
5. **Loading**: Spinners pendant les appels API
6. **Responsive**: Interface adaptée mobile/desktop

## Troubleshooting

### "Cannot connect to backend"
- Vérifier que le backend Flask tourne sur `http://localhost:5000`
- Vérifier la variable `FLASK_API_URL`

### "401 Unauthorized"
- Token expiré? Réconnecter
- Token invalide? Vérifier en backend

### Fichier upload échoue
- Vérifier le type: PDF ou DOCX uniquement
- Taille du fichier: vérifier limite backend
- Offre existe? Vérifier l'ID

## Déploiement

### Vercel
```bash
vercel deploy
```

### Autre
```bash
npm run build
# Servir le dossier .next
```

## Notes supplémentaires

- La page d'accueil redirige automatiquement vers `/dashboard` si connecté
- Les pages protégées redirigent vers `/login` si non-connecté
- Les images/assets de placeholder ne sont pas inclus
- CORS: À configurer côté Flask si domaine différent
