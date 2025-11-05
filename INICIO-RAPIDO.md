# 🚀 Guia de Início Rápido - LBot WhatsApp v3.5.0

## ⚡ Iniciar em 3 Passos

### 1️⃣ Instalar Dependências
```bash
yarn install
```

### 2️⃣ Buildar o Projeto
```bash
yarn build
```

### 3️⃣ Iniciar o Bot
```bash
yarn start
```

---

## 📱 Conectar ao WhatsApp

Quando o bot iniciar, você verá:

```
Escolha o método de conexão:
1 - QR Code
2 - Código de Pareamento
```

**Recomendado: Digite `1` para QR Code**

1. Um QR Code aparecerá no terminal
2. Abra WhatsApp no celular
3. Vá em: **Configurações** → **Aparelhos Conectados** → **Conectar Aparelho**
4. Escaneie o QR Code

✅ Pronto! Seu bot está conectado!

---

## 🎮 Primeiros Comandos

Envie para o bot no WhatsApp:

```
!menu     - Ver todos os comandos disponíveis
!admin    - Tornar-se admin do bot (primeira vez)
```

---

## 🔄 Comandos Úteis

```bash
# Apenas iniciar (sem rebuild)
yarn start

# Desenvolvimento (rebuild automático)
yarn dev

# Limpar build anterior
yarn clean

# Rebuild completo
yarn build
```

---

## ❓ Problemas?

### Bot não conecta?
```bash
rm -rf storage/session.db
yarn start
```

### Erro de módulos?
```bash
rm -rf node_modules yarn.lock
yarn install
yarn build
```

---

## ✨ Principais Recursos

- 🎨 **Figurinhas** - Criar stickers personalizados
- 📥 **Downloads** - Instagram, TikTok, YouTube
- 🎵 **Música** - Buscar e baixar músicas
- 👥 **Grupos** - Comandos de administração
- 🎮 **Jogos** - Entretenimento

---

**Versão**: 3.5.0 (Atualizada e Funcional)  
**Documentação Completa**: Veja `ATUALIZACOES.md`
