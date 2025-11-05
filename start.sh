#!/bin/bash

# Script de inicialização do LBot WhatsApp v3.5.0
# Este script automatiza o processo de inicialização do bot

echo "================================================"
echo "🤖 LBot WhatsApp - Iniciando Bot v3.5.0"
echo "================================================"
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado!"
    echo "Por favor, instale Node.js v18 ou superior"
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Aviso: Node.js v18+ é recomendado"
    echo "Versão atual: $(node -v)"
fi

# Verificar se Yarn está instalado
if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn não está instalado!"
    echo "Instalando Yarn..."
    npm install -g yarn
fi

echo "✅ Node.js $(node -v)"
echo "✅ Yarn $(yarn -v)"
echo ""

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências pela primeira vez..."
    echo "Isso pode demorar alguns minutos..."
    yarn install
    echo ""
fi

# Verificar se o build existe
if [ ! -d "dist" ]; then
    echo "🔨 Construindo o projeto pela primeira vez..."
    yarn build
    echo ""
fi

echo "🚀 Iniciando o bot..."
echo ""
echo "ℹ️  Dicas:"
echo "   - Escolha '1' para conectar com QR Code (recomendado)"
echo "   - Escolha '2' para conectar com Código de Pareamento"
echo ""
echo "================================================"
echo ""

# Iniciar o bot
yarn start
