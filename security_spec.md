# RAHI Portfolio — Security Specification

## 1. Data Invariants

1. **Published-Only Public Visibility**: `gallery`, `projects`, `achievements`, and `services` only allow public `get` and `list` when `resource.data.published == true`. Unpublished drafts are strictly restricted to `isAdmin()`.
2. **Public Message Create / Zero Visitor Read**: `messages/{messageId}` allows public visitors to `create` a contact submission only when `incoming().status == 'unread'` and `incoming().submittedAt == request.time`. `get`, `list`, `update`, and `delete` on `messages` are strictly restricted to `isAdmin()` so visitors can never read other people's private messages.
3. **Authorized Admin Verification**: `isAdmin()` mandates `request.auth != null && request.auth.token.email_verified == true && (request.auth.token.email == 'rahihumaun369@gmail.com' || exists(/databases/$(database)/documents/admins/$(request.auth.uid)))`.
4. **Input & ID Poisoning Protection**: Every document ID matches `^[a-zA-Z0-9_-]+$` (`<= 128` chars), every string checks explicit `.size()` bounds, arrays enforce bounded `.size()`, and `hasAll` + `hasOnly` prevent shadow fields.

## 2. Adversarial Payloads Verified Denied

1. Public visitor runs `list` or `get` on `/messages` → `PERMISSION_DENIED`.
2. Public visitor submits `/messages/msg-1` with `status: 'read'` or backdated `submittedAt` → `PERMISSION_DENIED`.
3. Non-admin user attempts `create` or `update` on `/site_profile/main` or `/gallery/g-1` → `PERMISSION_DENIED`.
4. Unverified account matching admin email (`email_verified: false`) attempts write → `PERMISSION_DENIED`.
5. Public visitor queries `/gallery` for `published == false` → `PERMISSION_DENIED`.
6. Attacker injects an unknown shadow key (`isAdmin: true`) into `/messages/msg-1` → `PERMISSION_DENIED`.
7. Attacker injects 1MB string into `/messages/<id>` → `PERMISSION_DENIED`.
