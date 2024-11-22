# AI Chat Assistant

A modern chat interface built with SvelteKit that provides AI assistance, database querying capabilities, and interactive features.

## 🌟 Features

- AI chat interface
- Database querying and analytics capabilities
- Memory for storing and recalling information
- Other general tool calling capabilities like weather, time zone conversions, temperature conversions, etc.

## 🚀 Prerequisites

- [Bun](https://bun.sh) (v1.0 or higher)
- Docker for PostgreSQL database
- Git

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your values:
DATABASE_URL="postgresql://user:password@localhost:5432/your_database"
OPENAI_API_KEY="your-openai-api-key"
```

## 🗄 Development

1. Start the PostgreSQL database:
```bash
# Start PostgreSQL container
docker compose up -d
```

2. Setup the database:
```bash
# Run database migrations
bun db:migrate

# Seed the database with sample data
bun db:seed
```

3. Start the development server:
```bash
bun dev
```

The application will be available at `http://localhost:5173`




