# CodeLithLabs Web Platform

![Build Status](https://img.shields.io/github/actions/workflow/status/codelithlabs/web/main.yml?style=flat-square&logo=github)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js&logoColor=white)

> **Architecting the Future of Digital Infrastructure.**

This repository contains the source code for the official [Code Lith Labs](https://codelithlabs.in) web platform. It serves as the central hub for our research initiatives, open-source projects (including *VectorDefense*), and engineering documentation.

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Technical Architecture](#-technical-architecture)
- [Directory Structure](#-directory-structure)
- [Getting Started](#-getting-started)
- [Development Protocols](#-development-protocols)
- [Deployment](#-deployment)
- [License](#-license)

---

## 🔭 About the Project

**Code Lith Labs** is a research and development collective focused on pushing the boundaries of backend engineering, game engine technology, and high-performance computing.

The `codelithlabs-web` repository is built to be:
* **Performant:** Leveraging Server-Side Rendering (SSR) and Edge Caching for sub-100ms load times.
* **Scalable:** Modular component architecture designed to grow with our research portfolio.
* **Accessible:** Strictly adhering to WCAG 2.1 AA standards.

---

## 🛠 Technical Architecture

We utilize a modern, type-safe stack to ensure reliability and maintainability.

| Category | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | [Next.js 14](https://nextjs.org/) | Hybrid static & server rendering for optimal SEO and speed. |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Strict type safety for enterprise-grade reliability. |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS for rapid, consistent UI development. |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) | Physics-based animations for a premium user feel. |
| **CI/CD** | GitHub Actions | Automated testing and deployment pipelines. |

---

## 📂 Directory Structure

```text
codelithlabs-web/
├── .github/              # CI/CD Workflows
├── public/               # Static Assets (Images, Fonts)
├── src/
│   ├── app/              # Next.js App Router (Pages & Layouts)
│   ├── components/       # Atomic UI Components
│   │   ├── ui/           # Primitives (Buttons, Cards)
│   │   └── features/     # Complex Modules (ProjectGrid, Hero)
│   ├── lib/              # Utility functions and API wrappers
│   ├── styles/           # Global styles and Tailwind config
│   └── types/            # Global TypeScript definitions
├── tests/                # E2E and Unit Tests
├── .eslintrc.json        # Linting Configuration
└── README.md             # Documentation
