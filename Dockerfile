# Étape 1 : Construire l'image de base Node.js pour l'API (backend)
FROM node:18 AS backend

# Définition du répertoire de travail pour l'API
WORKDIR /app

# Copier les fichiers package.json et package-lock.json de l'API
COPY API/package*.json ./

# Installer les dépendances du backend
RUN npm install --omit=dev

# Copier l'ensemble du code backend
COPY API/ ./

# Étape 2 : Préparer les fichiers frontend
FROM node:18 AS frontend

# Définir le répertoire de travail pour le frontend
WORKDIR /app

# Copier les fichiers frontend (index.html, assets) depuis le dossier FRONT
COPY FRONT /app/FRONT

# Étape 3 : Créer l'image finale pour le backend + frontend
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier le backend depuis l'étape 1
COPY --from=backend /app /app

# Copier les fichiers frontend depuis l'étape 2
COPY --from=frontend /app/FRONT /app/FRONT

# Installer les dépendances de production pour le backend
RUN npm install --only=production

# Installer path (au cas où il n'est pas installé)
RUN npm install path

# Exposer les ports
EXPOSE 3000

# Commande de démarrage
CMD ["node", "server.js"]
