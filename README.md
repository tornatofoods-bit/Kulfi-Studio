# Kulfi Studio — Artisanal Software & Web Development (100% Free Flat-File Setup)

> "We Serve Software, Cold & Fresh."

Award-winning digital development agency platform with a 3D WebGL kulfi centerpiece, liquid milk shaders, tactile dessert cursor, and a comprehensive **Admin Panel** at `/admin`.

**Zero Database & Zero External Services**: All content is managed as pure flat-file JSON (`content.json`) with zero hosting cost, no Firebase, and complete freedom to host on **Netlify**, **GitHub Pages**, **Vercel**, or **Standard PHP Hosting / cPanel**.

---

## 1. Hosting & Deployment Modes

### Mode A: Static Export (Netlify / GitHub Pages / Vercel / Cloudflare Pages)
- **100% Free Static Hosting**:
  1. Open `/admin` in your browser.
  2. Log in with:
     - **Username**: `admin` (or `shaikhrehan921@gmail.com`)
     - **Password**: `kulfi2026!` (configurable via `.env` `VITE_ADMIN_PASSWORD`)
  3. Edit any section (Hero, 3D parameters, Services, Case Studies, Pricing, About, Testimonials, Blog).
  4. Click **"Download content.json"** in the sidebar.
  5. Replace `/public/data/content.json` in your repository and commit!
  6. Your website updates instantly on every static host with zero monthly bills.

### Mode B: PHP Hosting (cPanel / Apache / Nginx / Hostinger / GoDaddy)
- Production-ready PHP endpoints are included out of the box in `/public/api/`:
  - `api/content.php`: GET reads `content.json`, POST writes updates with file-locking (`flock`).
  - `api/login.php`: Validates session credentials.
  - `api/leads.php`: Appends contact form briefs into flat-file storage.
- Just upload the `dist` build to your `public_html` directory and your admin panel saves changes directly to the server on every click!

---

## 2. Flat-File Structure

```
├── public/
│   ├── data/
│   │   └── content.json      # Single source of truth for all public content
│   └── api/
│       ├── content.php       # PHP flat-file save endpoint
│       ├── login.php         # PHP auth endpoint
│       └── leads.php         # PHP leads endpoint
├── src/
│   ├── lib/
│   │   └── contentStore.ts   # Flat-file client store with Export & Import
│   ├── context/
│   │   └── AdminAuthContext  # Session management, 30m timeout, lockout guard
│   └── pages/admin/          # Complete suite of dessert editors
```

---

## 3. Admin Panel Features (`/admin`)

- **Login Credentials**: `admin` / `kulfi2026!`
- **Dashboard**: Stats, recent client leads feed, activity logs, and quick jumps.
- **Section Editors**:
  - Global Settings & SEO
  - Hero & 3D WebGL Physics (rotation speed, tilt sensitivity, sprinkles density)
  - About Section & 4 Metric Counters
  - Services (Flavour Menu) with pricing, turnarounds, deliverables
  - 5-Stage Culinary Process Pipeline
  - Case Studies Showcase
  - Tech Sprinkles with hex color pickers
  - Stale Agency vs. Kulfi Studio Comparison Slider
  - Pricing Scoops (Flat Project & Monthly Retainer)
  - Testimonial Receipts
  - Blog & Recipes Journal
  - Leads Inbox (with CSV Export and status management)
  - Activity Audit Trail
  - User Whitelist
- **One-Click Export**: Click **"Download content.json"** anytime to download your updated database file.
- **One-Click Import**: Click **"Import"** to restore any JSON backup.

---

## 4. Google Authentication & Free Google Identity Services Setup

Kulfi Studio features 100% free Google Sign-In and Client Registration using Google Identity Services (GIS). It uses zero paid external services and zero third-party auth platforms.

### Step 1: Create a Free Google OAuth 2.0 Client ID
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new free project (e.g. `kulfi-studio-auth`) or select an existing one.
3. In the sidebar, navigate to **APIs & Services** &rarr; **OAuth consent screen**:
   - User Type: **External**
   - App name: **Kulfi Studio**
   - User support email & Developer contact info: your email.
   - Scopes: standard email, profile, openid (default).
4. Go to **APIs & Services** &rarr; **Credentials** &rarr; **Create Credentials** &rarr; **OAuth Client ID**:
   - Application type: **Web application**
   - Name: `Kulfi Studio Web Client`
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (Vite dev server)
     - `http://localhost:8000` (Local PHP built-in server)
     - `https://your-production-domain.com` (Your live domain)
   - Click **Create**. Copy your **Client ID** (e.g. `123456789-abcdef.apps.googleusercontent.com`).

### Step 2: Configure Client ID in Kulfi Studio
Choose either option:
- **Option A (Environment Variable)**: Add `VITE_GOOGLE_CLIENT_ID="your_client_id.apps.googleusercontent.com"` in your `.env` file.
- **Option B (Admin Console UI)**: Log into `/admin` &rarr; **Operators** &rarr; paste the Client ID into the **Google OAuth Client & Role Isolation** card &rarr; click **Save Client ID**.

### Step 3: Server-Side Cryptographic Token Verification
- When a client clicks **Sign in with Google** or **Sign up with Google**, the Google ID token (JWT) is sent directly to `/api/google.php`.
- The server cryptographically validates:
  1. **Signature & Certs**: Verified via Google's public keys / tokeninfo endpoint.
  2. **Audience (`aud`)**: Must match your configured Google Client ID.
  3. **Issuer (`iss`)**: Must be `accounts.google.com` or `https://accounts.google.com`.
  4. **Expiration (`exp`)**: Ensures token is not expired.
  5. **Email verification**: Requires `email_verified: true`.
- **Zero-Privilege Escalation Rule**: Google sign-in strictly creates or logs into **Client** accounts (`/account`). It **NEVER** grants administrator access unless the user's email is explicitly added to the **Allowed Admin Google Emails** list in `/admin`.

### Step 4: Local Testing with PHP Built-In Server
To test full server-side PHP authentication locally:
```bash
# Build the frontend
npm run build

# Start the PHP server on port 8000
php -S localhost:8000 -t dist
```
Open `http://localhost:8000/login` to test Google and Email/Password authentication.

### Step 5: Deploying to Free/Shared PHP Hosting
1. Run `npm run build`.
2. Upload all files from the `dist` directory to your web server (`public_html`).
3. Ensure Apache allows `.htaccess` overrides (`AllowOverride All`) so sensitive flat-files in `public/data/` remain strictly protected.

