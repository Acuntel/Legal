# Legal Intake Platform - Setup

## Environment Variables

Create a `.env.local` file with:

```
DATABASE_URL="postgresql://user:password@localhost:5432/legal_intake"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
ANTHROPIC_API_KEY="sk-ant-..."
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
RESEND_API_KEY=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_S3_BUCKET=""
AWS_REGION="us-east-2"
```

## Getting Started

```bash
npm install
npx prisma migrate dev
npm run dev
```

## Widget Embed

Add this to any law firm website:

```html
<script
  src="https://yourdomain.com/widget/legal-intake.js"
  data-api-key="FIRM_API_KEY"
></script>
```
