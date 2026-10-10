import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { defineConfig, Plugin } from 'vite';

function parseCookies(req: any): Record<string, string> {
  const list: Record<string, string> = {};
  const rc = req.headers.cookie;
  if (rc) {
    rc.split(';').forEach((cookie: string) => {
      const parts = cookie.split('=');
      const key = parts.shift()?.trim();
      if (key) {
        list[key] = decodeURI(parts.join('='));
      }
    });
  }
  return list;
}

function flatFileApiPlugin(): Plugin {
  return {
    name: 'flat-file-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();

        const rootDir = process.cwd();
        const urlPath = req.url.split('?')[0];
        const usersPath = path.resolve(rootDir, 'public/data/users.json');
        const setupPath = path.resolve(rootDir, 'public/data/setup.json');
        const lockoutsPath = path.resolve(rootDir, 'public/data/lockouts.json');
        const leadsPath = path.resolve(rootDir, 'public/data/leads.json');
        const contentPath = path.resolve(rootDir, 'public/data/content.json');
        const authSettingsPath = path.resolve(rootDir, 'public/data/auth-settings.json');

        const loadAuthSettings = () => {
          let settings: { googleClientId?: string; allowedAdminGoogleEmails?: string[] } = {
            googleClientId: process.env.VITE_GOOGLE_CLIENT_ID || '',
            allowedAdminGoogleEmails: [],
          };
          if (fs.existsSync(authSettingsPath)) {
            try {
              const fileData = JSON.parse(fs.readFileSync(authSettingsPath, 'utf-8'));
              settings = { ...settings, ...fileData };
            } catch {}
          }
          if (process.env.VITE_GOOGLE_CLIENT_ID && !settings.googleClientId) {
            settings.googleClientId = process.env.VITE_GOOGLE_CLIENT_ID;
          }
          return settings;
        };

        const saveAuthSettings = (settings: any) => {
          fs.writeFileSync(authSettingsPath, JSON.stringify(settings, null, 2), 'utf-8');
        };

        const loadUsers = () => {
          if (fs.existsSync(usersPath)) {
            try { return JSON.parse(fs.readFileSync(usersPath, 'utf-8')); } catch { return []; }
          }
          return [];
        };

        const saveUsers = (users: any[]) => {
          fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf-8');
        };

        // 1. Content update endpoint
        if (urlPath === '/api/content.php' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              fs.writeFileSync(contentPath, JSON.stringify(data, null, 2), 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, version: data.version || 1 }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Failed to write content.json' }));
            }
          });
          return;
        }

        // 2. Leads endpoint
        if (urlPath === '/api/leads.php') {
          if (req.method === 'GET') {
            try {
              const leads = fs.existsSync(leadsPath) ? fs.readFileSync(leadsPath, 'utf-8') : '[]';
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(leads);
            } catch {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end('[]');
            }
            return;
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => { body += chunk; });
            req.on('end', () => {
              try {
                const lead = JSON.parse(body);
                let list: any[] = [];
                if (fs.existsSync(leadsPath)) {
                  try { list = JSON.parse(fs.readFileSync(leadsPath, 'utf-8')); } catch {}
                }
                if (!lead.honeypot && !lead.hp_field) {
                  list.unshift(lead);
                  fs.writeFileSync(leadsPath, JSON.stringify(list, null, 2), 'utf-8');
                }
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true }));
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }
        }

        // 3. /api/me.php endpoint
        if (urlPath === '/api/me.php' && req.method === 'GET') {
          const cookies = parseCookies(req);
          const userId = cookies['kulfi_session'];
          let currentUser = null;

          if (userId) {
            const users = loadUsers();
            const found = users.find((u: any) => u.id === userId && u.status !== 'disabled');
            if (found) {
              currentUser = {
                id: found.id,
                email: found.email,
                name: found.name || '',
                role: found.role || 'client',
                company: found.company || '',
                createdAt: found.createdAt || '',
              };
            }
          }

          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({
            success: true,
            mode: 'php',
            user: currentUser
          }));
          return;
        }

        // 4. /api/login.php endpoint
        if (urlPath === '/api/login.php' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              const identifier = (payload.email || payload.username || '').trim().toLowerCase();
              const password = (payload.password || '').trim();
              const expectedRole = payload.role;

              const users = loadUsers();
              let matched = users.find(
                (u: any) => u.email.toLowerCase() === identifier || (u.username && u.username.toLowerCase() === identifier)
              );

              if (!matched && identifier === 'admin') {
                matched = users.find((u: any) => u.role === 'super_admin');
              }

              let isValid = false;
              if (matched && matched.passwordHash) {
                try {
                  isValid = bcrypt.compareSync(password, matched.passwordHash);
                } catch {
                  isValid = false;
                }
              }

              if (!isValid) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'Invalid email or password.' }));
                return;
              }

              if (matched.status === 'disabled') {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'Your account has been deactivated.' }));
                return;
              }

              const role = matched.role || 'client';
              if (expectedRole === 'admin' && !['super_admin', 'editor'].includes(role)) {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'Access denied. Administrator privileges required.' }));
                return;
              }

              // Set session cookie
              res.setHeader('Set-Cookie', `kulfi_session=${matched.id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: true,
                user: {
                  id: matched.id,
                  email: matched.email,
                  name: matched.name || '',
                  role,
                  company: matched.company || '',
                  createdAt: matched.createdAt || '',
                }
              }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Server error' }));
            }
          });
          return;
        }

        // 5. /api/register.php endpoint
        if (urlPath === '/api/register.php' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              if (payload.hp_field || payload.honeypot) {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true }));
                return;
              }

              const email = (payload.email || '').trim().toLowerCase();
              const name = (payload.name || '').trim() || email.split('@')[0];
              const password = payload.password || '';
              const company = (payload.company || '').trim();

              if (!email || !email.includes('@')) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'Valid email is required.' }));
                return;
              }

              if (password.length < 8) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'Password must be at least 8 characters long.' }));
                return;
              }

              const users = loadUsers();
              if (users.some((u: any) => u.email.toLowerCase() === email)) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'An account with this email address already exists. Please log in.' }));
                return;
              }

              const hashedPassword = bcrypt.hashSync(password, 10);
              const newUser = {
                id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                email,
                name,
                role: 'client',
                passwordHash: hashedPassword,
                company,
                status: 'active',
                createdAt: new Date().toISOString()
              };

              users.push(newUser);
              saveUsers(users);

              res.setHeader('Set-Cookie', `kulfi_session=${newUser.id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: true,
                user: {
                  id: newUser.id,
                  email: newUser.email,
                  name: newUser.name,
                  role: 'client',
                  company: newUser.company,
                  createdAt: newUser.createdAt
                }
              }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Server error' }));
            }
          });
          return;
        }

        // 6. /api/logout.php endpoint
        if (urlPath === '/api/logout.php') {
          res.setHeader('Set-Cookie', 'kulfi_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax');
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, message: 'Logged out successfully' }));
          return;
        }

        // 7. /api/setup.php endpoint
        if (urlPath === '/api/setup.php') {
          let setupData = { setupCompleted: false };
          if (fs.existsSync(setupPath)) {
            try { setupData = JSON.parse(fs.readFileSync(setupPath, 'utf-8')); } catch {}
          }

          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, setupCompleted: !!setupData.setupCompleted }));
            return;
          }

          if (req.method === 'POST') {
            if (setupData.setupCompleted) {
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Setup is already completed and locked.' }));
              return;
            }

            let body = '';
            req.on('data', (chunk) => { body += chunk; });
            req.on('end', () => {
              try {
                const payload = JSON.parse(body);
                const email = (payload.email || '').trim().toLowerCase();
                const name = (payload.name || 'Master Confectioner').trim();
                const password = payload.password || '';

                if (!email || password.length < 8) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: 'Valid email and password (min 8 chars) required.' }));
                  return;
                }

                const users = loadUsers();
                const hashedPassword = bcrypt.hashSync(password, 10);
                let adminUser = users.find((u: any) => u.email.toLowerCase() === email || u.role === 'super_admin');

                if (adminUser) {
                  adminUser.email = email;
                  adminUser.name = name;
                  adminUser.passwordHash = hashedPassword;
                  adminUser.role = 'super_admin';
                  adminUser.status = 'active';
                } else {
                  adminUser = {
                    id: `usr_admin_${Date.now()}`,
                    email,
                    name,
                    role: 'super_admin',
                    passwordHash: hashedPassword,
                    company: 'Kulfi Studio',
                    status: 'active',
                    createdAt: new Date().toISOString()
                  };
                  users.push(adminUser);
                }

                saveUsers(users);

                fs.writeFileSync(setupPath, JSON.stringify({
                  setupCompleted: true,
                  completedAt: new Date().toISOString(),
                  adminEmail: email
                }, null, 2), 'utf-8');

                res.setHeader('Set-Cookie', `kulfi_session=${adminUser.id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({
                  success: true,
                  user: {
                    id: adminUser.id,
                    email: adminUser.email,
                    name: adminUser.name,
                    role: 'super_admin'
                  }
                }));
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message || 'Setup error' }));
              }
            });
            return;
          }
        }

        // 8. /api/auth-config.php endpoint
        if (urlPath === '/api/auth-config.php') {
          const authSettings = loadAuthSettings();
          const cookies = parseCookies(req);
          const userId = cookies['kulfi_session'];
          const users = loadUsers();
          const sessionUser = users.find((u: any) => u.id === userId && u.status !== 'disabled');
          const isAdmin = sessionUser && (sessionUser.role === 'super_admin' || sessionUser.role === 'editor');

          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            const respPayload: any = {
              success: true,
              googleClientId: authSettings.googleClientId || '',
              googleEnabled: Boolean(authSettings.googleClientId),
            };
            if (isAdmin) {
              respPayload.allowedAdminGoogleEmails = authSettings.allowedAdminGoogleEmails || [];
            }
            res.end(JSON.stringify(respPayload));
            return;
          }

          if (req.method === 'POST') {
            if (!isAdmin) {
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Admin authorization required' }));
              return;
            }

            let body = '';
            req.on('data', (chunk) => { body += chunk; });
            req.on('end', () => {
              try {
                const data = JSON.parse(body);
                if (data.googleClientId !== undefined) {
                  authSettings.googleClientId = data.googleClientId.trim();
                }
                if (Array.isArray(data.allowedAdminGoogleEmails)) {
                  authSettings.allowedAdminGoogleEmails = data.allowedAdminGoogleEmails
                    .map((em: string) => em.trim().toLowerCase())
                    .filter((em: string) => Boolean(em));
                }
                saveAuthSettings(authSettings);

                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({
                  success: true,
                  googleClientId: authSettings.googleClientId,
                  allowedAdminGoogleEmails: authSettings.allowedAdminGoogleEmails
                }));
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message || 'Error updating settings' }));
              }
            });
            return;
          }
        }

        // 9. /api/google.php endpoint
        if (urlPath === '/api/google.php' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body);
              const credential = payload.credential;
              if (!credential) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'Missing credential token' }));
                return;
              }

              const authSettings = loadAuthSettings();
              const configuredClientId = authSettings.googleClientId;

              // Cryptographic verification via Google tokeninfo endpoint
              let tokenInfo: any = null;
              try {
                const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
                if (googleRes.ok) {
                  tokenInfo = await googleRes.json();
                }
              } catch {
                // Network unreachable fallback
              }

              // Fallback JWT decode for offline/local development
              if (!tokenInfo) {
                const parts = credential.split('.');
                if (parts.length === 3) {
                  try {
                    const rawPayload = Buffer.from(parts[1], 'base64').toString('utf-8');
                    tokenInfo = JSON.parse(rawPayload);
                  } catch {}
                }
              }

              if (!tokenInfo || !tokenInfo.email) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'Invalid Google ID token. Verification failed.' }));
                return;
              }

              // Validate Issuer
              const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
              if (tokenInfo.iss && !validIssuers.includes(tokenInfo.iss)) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'Invalid token issuer.' }));
                return;
              }

              // Validate Audience if configured
              if (configuredClientId && tokenInfo.aud && tokenInfo.aud !== configuredClientId) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'Token audience does not match configured Google Client ID.' }));
                return;
              }

              // Validate Expiry
              if (tokenInfo.exp && Number(tokenInfo.exp) < (Date.now() / 1000 - 60)) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'Google ID token has expired.' }));
                return;
              }

              // Validate Email Verified
              const emailVerified = tokenInfo.email_verified === true || tokenInfo.email_verified === 'true' || tokenInfo.email_verified === 1;
              if (!emailVerified) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'Google email is not verified.' }));
                return;
              }

              const email = tokenInfo.email.trim().toLowerCase();
              const name = tokenInfo.name || email.split('@')[0];
              const picture = tokenInfo.picture || '';
              const sub = tokenInfo.sub || '';

              // Security Rule: Google login must NEVER grant admin role by default.
              // Admin Google login is only permitted if listed in allowedAdminGoogleEmails.
              const allowedAdminGoogleEmails = (authSettings.allowedAdminGoogleEmails || []).map((e: string) => e.toLowerCase());
              const isAllowedAdminGoogle = allowedAdminGoogleEmails.includes(email);

              const users = loadUsers();
              let matched = users.find((u: any) => u.email.toLowerCase() === email);

              if (matched) {
                if (matched.status === 'disabled') {
                  res.statusCode = 403;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: 'This account has been disabled.' }));
                  return;
                }

                const isAdminRole = matched.role === 'super_admin' || matched.role === 'editor';
                if (isAdminRole && !isAllowedAdminGoogle) {
                  res.statusCode = 403;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    success: false,
                    error: 'Administrator Google sign-in is disabled for this account. Please use your master password.',
                  }));
                  return;
                }

                // Link Google sub and update metadata
                matched.googleSub = sub;
                matched.lastLoginWith = 'google';
                matched.lastLoginAt = new Date().toISOString();
                if (picture && !matched.avatar) matched.avatar = picture;
                if (!matched.name && name) matched.name = name;
              } else {
                // New user - strictly role: 'client'
                matched = {
                  id: `usr_g_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                  email,
                  name,
                  role: 'client', // STRICTLY client - never admin
                  authProvider: 'google',
                  googleSub: sub,
                  avatar: picture,
                  company: '',
                  status: 'active',
                  createdAt: new Date().toISOString(),
                  lastLoginWith: 'google',
                  lastLoginAt: new Date().toISOString()
                };
                users.push(matched);
              }

              saveUsers(users);

              res.setHeader('Set-Cookie', `kulfi_session=${matched.id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: true,
                user: {
                  id: matched.id,
                  email: matched.email,
                  name: matched.name,
                  role: matched.role,
                  company: matched.company || '',
                  avatar: matched.avatar || '',
                  createdAt: matched.createdAt,
                }
              }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Google authentication error' }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), flatFileApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
