@echo off
:: ============================================================
::  paideia. — One-click Setup Script
::  Run this ONCE after you have:
::    1. Installed Node.js  (https://nodejs.org — LTS version)
::    2. Created a Stripe account  (https://dashboard.stripe.com/register)
::    3. Filled in your Stripe keys below (STRIPE_SECRET and STRIPE_WEBHOOK)
:: ============================================================

:: ── EDIT THESE THREE LINES BEFORE RUNNING ──────────────────
set STRIPE_SECRET=sk_test_PASTE_YOUR_SECRET_KEY_HERE
set STRIPE_WEBHOOK=whsec_PASTE_YOUR_WEBHOOK_SECRET_HERE
set APP_URL=https://educational-site-b57e6.web.app
:: ───────────────────────────────────────────────────────────

echo.
echo  paideia. Setup Script
echo  =====================
echo.

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
  echo  [ERROR] Node.js is not installed.
  echo  Please download and install it from: https://nodejs.org
  echo  Then re-run this script.
  pause
  exit /b 1
)
echo  [OK] Node.js found:
node --version

:: Install Firebase CLI globally (if not present)
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
  echo  [INFO] Installing Firebase CLI...
  npm install -g firebase-tools
) else (
  echo  [OK] Firebase CLI found:
  firebase --version
)

:: Install Cloud Functions dependencies
echo.
echo  [INFO] Installing Cloud Functions dependencies...
cd /d "%~dp0functions"
npm install
if %errorlevel% neq 0 (
  echo  [ERROR] npm install failed. Check your internet connection.
  pause
  exit /b 1
)
cd /d "%~dp0"

:: Check Stripe key placeholders
if "%STRIPE_SECRET%"=="sk_test_PASTE_YOUR_SECRET_KEY_HERE" (
  echo.
  echo  [WARNING] You have not filled in your Stripe keys.
  echo  Open SETUP.bat in a text editor and replace:
  echo    STRIPE_SECRET  with your key from https://dashboard.stripe.com/apikeys
  echo    STRIPE_WEBHOOK with your secret from https://dashboard.stripe.com/webhooks
  echo.
  echo  Skipping Firebase config — deploy will fail until keys are set.
  goto :deploy_prompt
)

:: Set Firebase Functions config
echo.
echo  [INFO] Setting Firebase Functions config...
firebase functions:config:set ^
  stripe.secret_key="%STRIPE_SECRET%" ^
  stripe.webhook_secret="%STRIPE_WEBHOOK%" ^
  app.url="%APP_URL%"
if %errorlevel% neq 0 (
  echo  [ERROR] Firebase config failed. Run: firebase login
  pause
  exit /b 1
)
echo  [OK] Firebase config saved.

:deploy_prompt
:: Log in if needed
echo.
echo  [INFO] Checking Firebase login...
firebase projects:list >nul 2>&1
if %errorlevel% neq 0 (
  echo  [INFO] You need to log in to Firebase:
  firebase login
)

:: Deploy
echo.
echo  [INFO] Deploying Firestore rules + Cloud Functions + Hosting...
firebase deploy --project educational-site-b57e6
if %errorlevel% neq 0 (
  echo  [ERROR] Deploy failed. Check the output above.
  pause
  exit /b 1
)

echo.
echo  ============================================================
echo   Setup complete!
echo.
echo   Next steps for Stripe webhooks:
echo   1. Go to https://dashboard.stripe.com/webhooks
echo   2. Click "Add endpoint"
echo   3. URL: https://educational-site-b57e6.web.app/stripeWebhook
echo   4. Event: checkout.session.completed
echo   5. Copy the "Signing secret" (whsec_...)
echo   6. Re-run this script with that secret in STRIPE_WEBHOOK
echo  ============================================================
echo.
pause
