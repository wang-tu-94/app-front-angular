# --- ÉTAPE 1 : Build ---
FROM node:20-alpine AS build
WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm ci

# Copie du code et build
COPY . .
RUN npm run build -- --configuration production

# --- ÉTAPE 2 : Serveur de fichiers (Nginx) ---
FROM nginx:alpine

# On copie les fichiers compilés depuis l'étape de build
# Note : Angular 18 build par défaut dans dist/[nom-du-projet]/browser
COPY --from=build /app/dist /usr/share/nginx/html

# On copie une configuration Nginx personnalisée pour gérer le routage Angular
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
