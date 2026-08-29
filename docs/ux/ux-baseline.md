# Gate 1 UX baseline

## Design principles

- Human-first but policy-driven.
- Built for Arabic and English with correct RTL/LTR behavior.
- Accessible and keyboard-operable by default.
- Clear empty, loading, error, and success states for every core journey.
- Responsive across desktop, tablet, and mobile widths.

## Portal map

### Staff portal
- Dashboard and work queue
- Tender request intake
- Approval matrix and decision record
- Tender publication and publication review
- Audit and operational monitoring

### Vendor portal
- Registration and document upload
- Grade history and upgrade request
- Subscription reminder and status
- Tender catalogue and purchase history
- Receipt download and document access

### Tenant admin portal
- Branding and localization settings
- Workflow definition and role matrix
- Grade rules and exemption policy
- Notification templates and reminder rules

### Platform operator portal
- Tenant health, platform configuration, limits, and alerts
- Marketplace activation and entitlements
- Audit export and support review

## UX requirements for the first slice

- Use consistent spacing, color hierarchy, and tenant branding.
- Ensure Arabic labels are visually supported in RTL layouts.
- Prefer clear action labels: approve, reject, request correction, cancel.
- Show date/time and decision history in a visible workflow panel.
- Provide idempotent payment confirmation and receipt view after purchase.
- Show secure document preview and watermarking status.

## Core journey states

### Registration journey
- Start
- Documents uploaded
- Review
- Approved/Rejected
- Subscription reminder

### Tender request journey
- Create request
- Attach GM letter and supporting evidence
- Route through configured approval flow
- Record decision and note
- Create tender

### Tender purchase journey
- Eligible vendor sees tender
- Purchase confirmation
- Payment callback verification
- Printable receipt
- Access record in audit log

## Accessibility targets

- Contrast and focus states for all interactive controls
- Keyboard navigation for primary flows
- Semantic HTML for forms and dialogs
- Clear error messaging with validation guidance
- Support for screen readers and text scaling

## Open UX questions

- Which tenant-specific branding tokens are required for the first release?
- Should the staff portal and vendor portal share one visual system or use separate patterns?
- Which Arabic terminology set is accepted by the client for tenders, actions, and approval states?
- Are print/download restrictions for purchased tenders approved by legal/compliance?
