# Contributing to NexusOS

Thank you for your interest in contributing to **NexusOS — Enterprise D2C E-commerce Automation Operating System**!

## Code of Conduct
We are committed to providing a friendly, safe, and welcoming environment for all contributors. Please treat others with respect and professionalism.

## Getting Started
1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<your-username>/nexusos-ecommerce-automation.git
   cd nexusos-ecommerce-automation
   ```
3. **Launch the local preview server**:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Or using Node.js
   npx serve . -p 8000
   ```
4. Open `http://localhost:8000` in your browser.

## Architectural Guidelines
- **Zero-Dependency Philosophy**: The core interface runs entirely in modern browsers with pure HTML5, CSS3 variables/grid, and vanilla JavaScript. Avoid adding bulky UI frameworks or build pipelines unless necessary.
- **Design Tokens**: Adhere strictly to the design system tokens defined in the CSS root variables:
  - Background: Deep slates (`#080d18`, `#0d1424`, `#111827`)
  - Accent: Indigo (`#4f46e5`, `#6366f1`)
  - Status: Emerald green for success (`#10b981`), amber for warnings/pending (`#f59e0b`), rose/crimson for high risk/critical (`#f43f5e`).
- **Monospace Telemetry**: Keep technical badges, counters, and log trace strings formatted using `JetBrains Mono`.

## Submitting Pull Requests
1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Commit your changes with clear, descriptive commit messages:
   ```bash
   git commit -m "feat(telemetry): add latency graph to operational subheader"
   ```
3. Push to your branch and open a Pull Request against `main`.
