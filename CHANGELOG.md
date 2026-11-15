# Changelog

All notable changes to **NexusOS** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-06-17

### Added
- **50 Automated Structural Engines** categorized across 5 distinct operational domains:
  1. *Omnichannel Order Engine* (9 engines: Auto-fetch, RTD detection, marketplace status sync, smart routing, bulk updates, courier auto-assignment, AWB allocation, manifest generator, customer alert dispatch).
  2. *Hyper-Local & Multi-Warehouse Logistics* (8 engines: Auto-print labels, pickup scheduler, cardboard tare auto-weight, region pickup slots, multi-account routing, warehouse workflow rules, separate pickup integrations, channel mapping).
  3. *Predictive Inventory & Procurement* (10 engines: Multi-marketplace sync, real-time stock ledger, delivery mismatch detector, scheduled stock-take reminders, low-stock PO triggers, stock reservations, vendor history linkage, automated dispatch, reorder PO cloning, smart inventory pooling).
  4. *Listing Matrix & Risk Mitigation* (10 engines: Auto-pull listings, SKU barcode mapping, live price sync, deactivated listing auto-flag, Myntra offer upload, COD zone toggling, 1-click migration, custom webhook integrations, AI-powered pre-fulfillment RTO probability scoring, automated WhatsApp COD verification loop).
  5. *Scaling Analytics & Profit Reconciliation* (13 engines: Real-time net margin ledger, payment gateway reconciliations, courier weight dispute automation, GST tax filing reports, SKU velocity indexing, markdown forecasting, dead stock liquidation, channel CAC vs LTV matrix, returns root-cause clustering, unified multi-channel analytics stream).
- **System Settings Control Center**:
  - Enterprise Sandbox mode toggle.
  - Global Webhook dispatcher.
  - Auto-retry sync engine.
  - Real-time interactive AI-RTO risk probability slider.
  - Marketplace polling interval slider (1–30 min).
  - Logistics carrier strategy algorithm selection (cheapest, fastest, weighted 50/50, carrier rating index).
  - Packaging dead weight tare and volumetric divisor configuration.
- **API & Webhooks Management Studio**:
  - Secret token manager with masked keys, copy-to-clipboard interactions, and revocation workflow.
  - Real-time token generator for custom ERP/WMS links.
  - Quota telemetry progress tracker (84,320 / 100,000 monthly usage).
  - Outgoing webhook subscriber with event triggers (`order.created`, `order.rtd_marked`, `inventory.low`, `shipment.status_change`, `recon.mismatch`).
- **Interactive Live Telemetry & Log Stack**:
  - Live clock (IST timezone).
  - Monospace fluctuating throughput telemetry (`4,850 actions/min`).
  - Terminal log feed with live background event injection, pause/resume controls, and CSV export.

---

## [1.0.0] - 2026-06-17

### Added
- Initial release of the NexusOS D2C Automation Operating System dashboard.
- Fixed-left navigation sidebar with D2C workspace profile.
- Top utility strip with status indicator and real-time sync rate metrics.
- 4-column responsive KPI metric grid (Total Integrated Actions, Hours Saved, Sync Success Rate, Prevented RTO Orders).
- Central execution split grid: Channel integration status panel (Amazon India, Flipkart Direct, Shopify, Myntra, Meesho) + Workflow Control Matrix.
- Real-time streaming log stack with custom dark-mode scrollbars.
