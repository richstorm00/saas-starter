# 🚀 SaaS Starter Kit

A production-ready, modern SaaS starter kit built with Next.js 15, TypeScript, Clerk, Drizzle ORM, and Stripe. Clone this repository and launch your SaaS product in minutes.

## ✨ Features

- **🔐 Authentication**: Complete auth system with Clerk (social login, magic links, MFA)
- **💳 Billing**: Stripe integration with subscription management
- **🗄️ Database**: Type-safe database with Drizzle ORM + PostgreSQL
- **🎨 UI**: Modern UI with Tailwind CSS and Radix UI components
- **⚡ Performance**: Optimized for performance with Next.js 15 App Router
- **🌙 Theme**: Dark/light mode support
- **📱 Responsive**: Mobile-first responsive design
- **🔒 Security**: Built-in security best practices
- **🚀 Deployment**: Ready for Vercel, Docker, and self-hosting
- **📊 Multi-tenant**: Organization-based data isolation

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: Drizzle ORM + PostgreSQL (Neon)
- **Payments**: Stripe
- **UI Library**: Radix UI + Custom Components
- **Deployment**: Vercel (optimized)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/richstorm00/saas-starter.git
cd saas-starter

# Install dependencies
npm install

# Run the setup wizard
node setup.js
```

### 2. Environment Variables

The setup wizard will create your `.env.local` file. Make sure you have:

- **Database**: Neon PostgreSQL connection string
- **Clerk**: Publishable and secret keys
- **Stripe**: Publishable, secret, and webhook secret keys

### 3. Database Setup

```bash
# Generate database migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Open Drizzle Studio (optional)
npm run db:studio
```

### 4. Start Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Protected dashboard
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility functions and configurations
│   ├── db/               # Database schema and client
│   └── utils.ts          # Helper functions
├── middleware.ts         # Clerk middleware
└── types/                # TypeScript type definitions
```

## 🎯 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Drizzle Studio
npm run db:push      # Push schema changes to database
```

## 🔧 Configuration

### Authentication (Clerk)

1. Create an account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your keys to `.env.local`
4. Configure redirect URLs in Clerk Dashboard

### Database (Neon)

1. Create an account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to `.env.local`

### Payments (Stripe)

1. Create an account at [stripe.com](https://stripe.com)
2. Get your API keys from the dashboard
3. Set up webhook endpoints for production
4. Configure your pricing plans

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker

```bash
# Build and run with Docker
npm run build
docker build -t saas-starter .
docker run -p 3000:3000 saas-starter

# Or use Docker Compose
docker-compose up
```

### Manual Deployment

1. Build the application: `npm run build`
2. Set environment variables on your hosting platform
3. Deploy the `.next` folder and `package.json`
4. Run `npm ci --production` and `npm start`

## 📋 Features to Implement

### Phase 1: Core Features ✅
- [x] Authentication system
- [x] Database setup
- [x] Basic UI components
- [x] Environment configuration

### Phase 2: Advanced Features
- [ ] Organization management
- [ ] Team invitations
- [ ] Usage analytics
- [ ] Email notifications
- [ ] File uploads
- [ ] API rate limiting

### Phase 3: Enterprise Features
- [ ] Admin dashboard
- [ ] Feature flags
- [ ] Audit logs
- [ ] GDPR compliance
- [ ] Multi-language support

## 🎨 Customization

### Branding
1. Update `src/app/globals.css` with your brand colors
2. Modify `tailwind.config.ts` for custom design tokens
3. Replace images in `public/` folder

### Database Schema
1. Edit `src/lib/db/schema.ts` to add new tables
2. Run `npm run db:generate` to create migrations
3. Apply changes with `npm run db:migrate`

### Billing Plans
1. Create pricing plans in Stripe Dashboard
2. Update plan IDs in your billing configuration
3. Customize the billing UI in your components

## 🔐 Security

- **Authentication**: Clerk handles user sessions and security
- **Database**: Parameterized queries with Drizzle ORM
- **Environment**: Sensitive keys stored in environment variables
- **CORS**: Configured for production environments
- **Rate Limiting**: Ready for implementation with middleware

## 🧪 Testing

```bash
# Unit tests (when implemented)
npm run test

# E2E tests (when implemented)
npm run test:e2e
```

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Stripe Documentation](https://stripe.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

- 📧 Email: support@yourapp.com
- 💬 Discord: [Join our community](https://discord.gg/yourserver)
- 📖 Documentation: [docs.yourapp.com](https://docs.yourapp.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support the Project

If this starter kit helped you, please consider:
- ⭐ Starring the repository
- 🐦 Sharing on Twitter
- 💖 Sponsoring the project

---

Built with ❤️ by the SaaS Starter Kit team
