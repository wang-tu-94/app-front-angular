# 💻 Product Trial - Frontend App

<div align="center">
  <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white" alt="Sass" />
  <img src="https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</div>

<br />

Ce dépôt contient le code source de l'interface utilisateur (Frontend) de l'écosystème **Product Trial**. Développée avec **Angular**, cette application Single Page Application (SPA) offre une expérience fluide, moderne et réactive pour consulter le catalogue de produits, gérer son panier et s'authentifier.

## 📋 Table des matières
- [Fonctionnalités](#-fonctionnalités)
- [Architecture du projet](#-architecture-du-projet)
- [Prérequis](#-prérequis)
- [Installation et Lancement (Local)](#-installation-et-lancement-local)
- [Lancement avec Docker](#-lancement-avec-docker)
- [Tests](#-tests)

---

## ✨ Fonctionnalités
- **Catalogue de Produits** : Affichage, filtrage et création de produits.
- **Gestion du Panier** : Ajout d'articles, modification des quantités et calcul du total en temps réel.
- **Authentification** : Pages de connexion et d'inscription avec gestion du token JWT via des Interceptors HTTP.
- **PWA (Progressive Web App)** : Support hors-ligne partiel et installable sur mobile/desktop grâce aux Service Workers (`ngsw-config.json`).
- **Thèmes Dynamiques** : Support des modes clair et sombre (`light.css` / `dark.css`).
- **CI/CD** : Déploiement automatisé avec GitHub Actions pour builder et pousser l'image Docker.

---

## 🏗 Architecture du projet

Le code source suit l'architecture modulaire recommandée par Angular (basée sur les features) :

```text
src/app/
├── auth/         # Composants de connexion, inscription et services JWT
├── carts/        # Gestion du panier et icônes dynamiques
├── contacts/     # Form
