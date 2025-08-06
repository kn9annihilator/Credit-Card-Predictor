[![Last Commit](https://img.shields.io/github/last-commit/kn9annihilator/Credit-Card-Predictor?style=flat-square)](https://github.com/kn9annihilator/Credit-Card-Predictor/commits/main)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
![Sleep is for the weak](https://img.shields.io/badge/Code%20Written%20At-2AM-red?style=flat-square)

# CardWise: Credit Card Advisor

**CardWise** is a sophisticated web application designed to help users make smarter financial decisions. It provides intelligent recommendations on which credit card to use for a purchase to maximize the interest-free period and helps users maintain a healthy credit score by monitoring credit utilization.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation on macOS](#installation-on-macos)
  - [Installation on Windows](#installation-on-windows)
  - [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Author](#author)

---

## Features

- **Multi-Page Interface:** Dashboard, Reports, and Profile pages in a clean layout.
- **Intelligent Card Recommendation:** Suggests the best card for maximum interest-free days.
- **Dynamic Infographics:**
  - Real-time animated gauge for credit utilization.
  - Bar chart for usage vs. limit per card.
  - Detailed pie chart for spending breakdown.
- **Transaction Logging:** Log purchases with card selection and category tagging.
- **Persistent Local Storage:** Data is stored securely in the browser.
- **Premium UI/UX:**
  - Dark theme
  - High-contrast typography
  - Smooth transitions and animations
- **Interactive Metallic Cards:** Brushed metal texture, engraved text, and 3D hover effects.

---

## Tech Stack

- **Frontend:** React.js
- **Styling:** CSS-in-JS (no external libraries)
- **Animations:** Framer Motion
- **Charts:** Recharts
- **State Management:** React Hooks (`useState`, `useEffect`, `useMemo`)

---

## Getting Started

Follow the steps below to get a local copy up and running for development and testing.

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)

---

### Installation on macOS

1. **Install Homebrew (if not installed):**

    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```

2. **Install Git & Node.js:**

    ```bash
    brew install git
    brew install node
    ```

3. **Clone the Repository:**

    ```bash
    git clone https://github.com/kn9annihilator/Credit-Card-Predictor.git
    cd Credit-Card-Predictor
    ```

4. **Install Dependencies:**

    ```bash
    npm install
    ```

---

### Installation on Windows

1. **Install Git & Node.js:**
   - Download and install from:
     - [Node.js](https://nodejs.org/)
     - [Git](https://git-scm.com/)

2. **Clone the Repository:**

    ```bash
    git clone https://github.com/kn9annihilator/Credit-Card-Predictor.git
    cd Credit-Card-Predictor
    ```

3. **Install Dependencies:**

    ```bash
    npm install
    ```

---

### ▶Running the Project

Once installation is complete:

```bash
npm start
```

```bash
Visit http://localhost:3000 to view the app. It supports hot-reloading.
```

## Project Structure
```js
Credit-Card-Predictor/
├── public/
│   └── index.html         # HTML Shell
├── src/
│   ├── App.js             # Main App Component (UI + Logic)
│   └── index.js           # Entry point
└── package.json           # Project metadata & dependencies
```

# Author
Rehan Shamir | Krishna Narula
[LinkedIn: Rehan](https://www.linkedin.com/in/rehan-shamir-b9a59a320/)
[LinkedIn: Krishna](https://www.linkedin.com/in/krishnanarula/)
