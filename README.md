# 🎀 Joyeux Anniversaire Nada

Site web d'anniversaire pour Nada avec un système de réservation de cadeaux partagé.

Les réservations sont visibles par **tous les visiteurs** grâce à une base de données SQLite locale.

## Prérequis

- Node.js 18+
- npm

## Installation

```bash
npm install
```

## Développement local

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

La base de données SQLite est créée automatiquement dans `data/gifts.db`.

## Déploiement sur VPS

### 1. Prépare ton VPS (Ubuntu/Debian)

```bash
# Installe Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Installe les build tools (pour better-sqlite3)
sudo apt install -y build-essential python3
```

### 2. Clone et installe

```bash
git clone https://github.com/ton-username/nada-birthday.git
cd nada-birthday
npm install
npm run build
```

### 3. Lance le serveur

```bash
# Lancement simple
npm run start

# Ou avec un port personnalisé
PORT=3000 npm run start
```

### 4. Garde le serveur actif avec PM2 (recommandé)

```bash
# Installe PM2
sudo npm install -g pm2

# Lance l'app
pm2 start npm --name "nada-birthday" -- start

# Sauvegarde pour redémarrage auto
pm2 save
pm2 startup
```

### 5. Configure Nginx (optionnel, pour un domaine)

```nginx
server {
    listen 80;
    server_name ton-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Architecture

```
src/
├── app/
│   ├── api/claims/route.ts   ← API REST (GET/POST/DELETE)
│   ├── globals.css            ← Styles + responsive
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Hero.tsx               ← Section d'accueil
│   ├── GiftsSection.tsx       ← Grille + polling (refresh auto 5s)
│   ├── GiftCard.tsx           ← Carte individuelle
│   ├── FloatingDecorations.tsx
│   ├── Confetti.tsx
│   └── Toast.tsx
└── lib/
    ├── gifts.ts               ← Données des cadeaux
    └── db.ts                  ← SQLite (better-sqlite3)
```

## Comment ça marche

- L'API `/api/claims` gère les réservations (GET, POST, DELETE)
- La base SQLite est stockée dans `data/gifts.db` (créée automatiquement)
- Le frontend fait un **polling toutes les 5 secondes** pour synchroniser les réservations entre tous les visiteurs
- Les mises à jour sont **optimistes** (l'UI se met à jour immédiatement, puis corrige si erreur)
