#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m%s\x1b[0m',
    success: '\x1b[32m%s\x1b[0m',
    error: '\x1b[31m%s\x1b[0m',
    warning: '\x1b[33m%s\x1b[0m',
    bold: '\x1b[1m%s\x1b[0m'
  };
  
  console.log(colors[type] || colors.info, message);
}

async function checkGit() {
  try {
    execSync('git --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function initializeGit() {
  if (await checkGit()) {
    try {
      execSync('git init', { stdio: 'ignore' });
      execSync('git add .', { stdio: 'ignore' });
      execSync('git commit -m "Initial commit: SaaS Starter Kit"', { stdio: 'ignore' });
      log('✅ Git repository initialized', 'success');
    } catch (error) {
      log('⚠️  Git initialization failed', 'warning');
    }
  } else {
    log('⚠️  Git not found. Skipping git initialization', 'warning');
  }
}

async function setupEnvironment() {
  log('\n🚀 SaaS Starter Kit Setup Wizard\n', 'bold');
  log('Welcome! This wizard will help you configure your SaaS starter kit.\n');

  const config = {
    database: {},
    clerk: {},
    stripe: {},
    app: {}
  };

  // Database Configuration
  log('📊 Database Configuration', 'bold');
  config.database.url = await question('Enter your Neon PostgreSQL connection string (DATABASE_URL): ');
  
  // Clerk Configuration
  log('\n🔐 Clerk Authentication Configuration', 'bold');
  config.clerk.publishableKey = await question('Enter your Clerk Publishable Key: ');
  config.clerk.secretKey = await question('Enter your Clerk Secret Key: ');

  // Stripe Configuration
  log('\n💳 Stripe Configuration', 'bold');
  config.stripe.publishableKey = await question('Enter your Stripe Publishable Key: ');
  config.stripe.secretKey = await question('Enter your Stripe Secret Key: ');
  config.stripe.webhookSecret = await question('Enter your Stripe Webhook Secret: ');

  // App Configuration
  log('\n⚙️  App Configuration', 'bold');
  config.app.name = await question('Enter your app name (default: SaaS Starter): ') || 'SaaS Starter';
  config.app.url = await question('Enter your app URL (default: http://localhost:3000): ') || 'http://localhost:3000';

  // Feature Flags
  log('\n🎯 Feature Flags', 'bold');
  const waitlistMode = await question('Enable waitlist mode? (y/N): ');
  const maintenanceMode = await question('Enable maintenance mode? (y/N): ');

  // Generate .env.local
  const envContent = `# Database
DATABASE_URL=${config.database.url}

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${config.clerk.publishableKey}
CLERK_SECRET_KEY=${config.clerk.secretKey}
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${config.stripe.publishableKey}
STRIPE_SECRET_KEY=${config.stripe.secretKey}
STRIPE_WEBHOOK_SECRET=${config.stripe.webhookSecret}

# App Configuration
NEXT_PUBLIC_APP_URL=${config.app.url}
NEXT_PUBLIC_APP_NAME=${config.app.name}

# Feature Flags
NEXT_PUBLIC_WAITLIST_MODE=${waitlistMode.toLowerCase() === 'y' ? 'true' : 'false'}
NEXT_PUBLIC_MAINTENANCE_MODE=${maintenanceMode.toLowerCase() === 'y' ? 'true' : 'false'}
`;

  fs.writeFileSync('.env.local', envContent);
  log('\n✅ .env.local file created successfully!', 'success');

  return config;
}

async function setupDatabase() {
  log('\n🗄️  Setting up database...', 'bold');
  
  try {
    execSync('npx drizzle-kit generate', { stdio: 'ignore' });
    log('✅ Database migrations generated', 'success');
    
    // Note: Migration would require DATABASE_URL to be set
    log('ℹ️  Run "npm run db:migrate" after setting up your database', 'info');
  } catch (error) {
    log('⚠️  Database setup skipped (requires DATABASE_URL)', 'warning');
  }
}

async function displayNextSteps(config) {
  log('\n🎉 Setup Complete!', 'success');
  log('\n📋 Next Steps:', 'bold');
  log('1. Set up your database with the provided connection string');
  log('2. Run: npm run db:migrate');
  log('3. Start development server: npm run dev');
  log('4. Visit http://localhost:3000 to see your app');
  
  log('\n🔗 Useful URLs:', 'bold');
  log('• Dashboard: ' + config.app.url + '/dashboard');
  log('• Sign In: ' + config.app.url + '/sign-in');
  log('• Sign Up: ' + config.app.url + '/sign-up');
  
  log('\n📚 Documentation:', 'bold');
  log('• Customize your app in src/app');
  log('• Add components in src/components');
  log('• Modify database schema in src/lib/db/schema.ts');
  log('• Configure billing in src/lib/stripe');
}

async function main() {
  try {
    // Check if .env.local already exists
    if (fs.existsSync('.env.local')) {
      const overwrite = await question('.env.local already exists. Overwrite? (y/N): ');
      if (overwrite.toLowerCase() !== 'y') {
        log('Setup cancelled.', 'warning');
        rl.close();
        return;
      }
    }

    const config = await setupEnvironment();
    await setupDatabase();
    await initializeGit();
    await displayNextSteps(config);

  } catch (error) {
    log('❌ Error during setup: ' + error.message, 'error');
  } finally {
    rl.close();
  }
}

// Run setup
main();