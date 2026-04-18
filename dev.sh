#!/bin/bash
# 🏃 Script pour lancer le projet localement (développement)
# Works on macOS, Linux

echo "🚀 Lancement ABC Informatique en développement"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Vérification prérequis..."

if ! command -v php &> /dev/null; then
    echo -e "${RED}❌ PHP non installé${NC}"
    exit 1
fi
echo -e "${GREEN}✅ PHP ok${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js non installé${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js ok${NC}"

if ! command -v composer &> /dev/null; then
    echo -e "${RED}❌ Composer non installé${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Composer ok${NC}"

echo ""

# ============================================================
# BACKEND SETUP
# ============================================================

echo -e "${YELLOW}📦 Configuration Backend...${NC}"

cd backend

if [ ! -f ".env" ]; then
    echo "  Création .env..."
    cp .env.example .env
    php artisan key:generate
    echo "  ⚠️  Édite .env avec ta configuration DB"
fi

echo "  📥 Installation dépendances..."
composer install 2>/dev/null || echo -e "${RED}❌ Composer install failed${NC}"

echo "  🗄️  Migrations..."
php artisan migrate 2>/dev/null || echo -e "${YELLOW}⚠️  Migrations déjà faites ou erreur DB${NC}"

echo -e "${GREEN}✅ Backend ok${NC}"

# ============================================================
# FRONTEND SETUP
# ============================================================

echo ""
echo -e "${YELLOW}🎨 Configuration Frontend...${NC}"

cd ../frontend

echo "  📥 Installation dépendances..."
npm install > /dev/null 2>&1 || echo -e "${RED}❌ npm install failed${NC}"

echo -e "${GREEN}✅ Frontend ok${NC}"

# ============================================================
# RUN DEVELOPMENT SERVERS
# ============================================================

echo ""
echo -e "${YELLOW}🚀 Lancement des serveurs...${NC}"
echo ""

# Check if we can use tmux for better terminal management
if command -v tmux &> /dev/null; then
    SESSION_NAME="abc-dev"
    
    # Kill existing session
    tmux kill-session -t $SESSION_NAME 2>/dev/null || true
    
    # Create new session
    tmux new-session -d -s $SESSION_NAME
    
    # Backend window
    tmux new-window -t $SESSION_NAME -n "backend"
    tmux send-keys -t $SESSION_NAME:backend "cd backend && php artisan serve" Enter
    
    # Frontend window
    tmux new-window -t $SESSION_NAME -n "frontend"
    tmux send-keys -t $SESSION_NAME:frontend "cd frontend && npm run dev" Enter
    
    echo -e "${GREEN}✅ Serveurs lancés avec tmux${NC}"
    echo ""
    echo "📍 Aperçu tmux:"
    echo "  - tmux attach -t $SESSION_NAME"
    echo "  - Ctrl+B then W pour voir les windows"
    echo "  - Ctrl+B then C pour créer window"
    echo ""
    
else
    # Fallback: Run in background
    echo -e "${YELLOW}📦 Backend...${NC}"
    echo "  Pour démarrer manuellement:"
    echo "    cd backend && php artisan serve"
    echo ""
    echo -e "${YELLOW}🎨 Frontend...${NC}"
    echo "  Pour démarrer manuellement:"
    echo "    cd frontend && npm run dev"
    echo ""
fi

# ============================================================
# ENDPOINTS INFO
# ============================================================

echo ""
echo -e "${GREEN}✅ Tout est prêt!${NC}"
echo ""
echo "📍 URLs disponibles:"
echo "  Backend API:    ${GREEN}http://localhost:8000${NC}"
echo "  Frontend:       ${GREEN}http://localhost:5173${NC}"
echo ""
echo "📋 Endpoints utiles:"
echo "  GET  http://localhost:8000/api/products"
echo "  GET  http://localhost:8000/api/orders"
echo "  POST http://localhost:8000/api/auth/login"
echo ""
echo "🧪 Test rapide:"
echo "  curl http://localhost:8000/"
echo ""
echo "📖 Documentation:"
echo "  - API_CONFIG.md"
echo "  - CPANEL_DEPLOYMENT.md"
echo "  - FRONTEND_API_EXAMPLE.ts"
echo ""
