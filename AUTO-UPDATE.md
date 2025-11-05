# 🔄 Sistema de Auto-Atualização

Este bot possui um sistema de **auto-atualização automática** que busca atualizações do GitHub toda vez que é reiniciado.

## 📋 Como Funciona

### 1️⃣ **Verificação Automática no Startup**
Toda vez que o bot é iniciado, ele:
- ✅ Verifica se há commits novos no GitHub
- ✅ Compara o branch atual com o remoto
- ✅ Se houver atualizações disponíveis, inicia o processo de update

### 2️⃣ **Processo de Atualização**
Quando uma atualização é encontrada:
1. **Git Pull** - Baixa as últimas mudanças do GitHub
2. **Yarn Install** - Instala/atualiza dependências (se necessário)
3. **Yarn Build** - Recompila o projeto TypeScript
4. **Restart** - Reinicia o bot automaticamente

### 3️⃣ **Preservação de Dados**
✅ **Todos os dados são preservados:**
- Sessão do WhatsApp (`storage/session.db`)
- Banco de dados de usuários
- Banco de dados de grupos
- Configurações do bot
- Histórico de mensagens

## 🚀 Como Usar

### Atualização Manual (Forçar Update)
Se quiser forçar uma atualização, basta **reiniciar o bot**:

```bash
# Se estiver rodando direto no terminal
# Ctrl+C para parar
yarn start

# Se estiver usando PM2
pm2 restart bot-figurinha

# Se estiver usando systemd
sudo systemctl restart bot-figurinha
```

### Atualização Automática
O bot verifica atualizações **automaticamente** toda vez que inicia. Não precisa fazer nada!

## 📦 Repositório

O bot busca atualizações de:
```
https://github.com/RafaelPonte/BotFigurinha
```

## 🔧 Gerenciadores de Processo Recomendados

Para que o bot reinicie automaticamente após updates, recomendamos usar um gerenciador de processos:

### **PM2** (Recomendado)
```bash
# Instalar PM2
npm install -g pm2

# Iniciar bot com PM2
pm2 start dist/app.js --name bot-figurinha

# Ver logs
pm2 logs bot-figurinha

# Reiniciar
pm2 restart bot-figurinha

# Auto-start no boot
pm2 startup
pm2 save
```

### **Nodemon** (Desenvolvimento)
```bash
# Instalar nodemon
npm install -g nodemon

# Iniciar com nodemon
nodemon dist/app.js
```

### **Systemd** (Linux - Produção)
Criar arquivo `/etc/systemd/system/bot-figurinha.service`:
```ini
[Unit]
Description=Bot Figurinha WhatsApp
After=network.target

[Service]
Type=simple
User=seu-usuario
WorkingDirectory=/caminho/para/BotFigurinha
ExecStart=/usr/bin/node dist/app.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Ativar:
```bash
sudo systemctl daemon-reload
sudo systemctl enable bot-figurinha
sudo systemctl start bot-figurinha
```

## 📊 Logs de Atualização

Durante o startup, você verá mensagens como:

### ✅ **Sem atualizações:**
```
🔍 Checking for updates from GitHub...
✅ Bot is up to date! No updates available.
```

### 📦 **Atualização disponível:**
```
🔍 Checking for updates from GitHub...
📦 New update available! (3 commits ahead)
🚀 Starting auto-update process...
🔄 Pulling latest changes from GitHub...
📦 Installing dependencies...
🔨 Building project...
✅ Update completed successfully!
🔄 Restarting bot to apply updates...
```

## ⚠️ Troubleshooting

### Problema: "Update failed"
**Solução:** Verifique se há conflitos no git
```bash
git status
git stash  # Salva mudanças locais
yarn start  # Tenta novamente
```

### Problema: Bot não reinicia após update
**Solução:** Use um gerenciador de processos (PM2, systemd)

### Problema: Mudanças locais são perdidas
**Solução:** Faça commit das suas mudanças antes de reiniciar
```bash
git add .
git commit -m "Suas mudanças"
git push origin seu-branch
```

## 🎯 Melhores Práticas

1. ✅ **Use um gerenciador de processos** (PM2 ou systemd)
2. ✅ **Commit suas mudanças** antes de fazer updates manuais
3. ✅ **Monitore os logs** para ver se updates foram aplicados
4. ✅ **Teste em ambiente de desenvolvimento** antes de produção
5. ✅ **Faça backup do storage/** regularmente

## 📝 Observações

- O sistema **não atualiza** se houver mudanças locais não commitadas
- Updates são feitos no **branch atual** (ex: main, master, develop)
- O bot **reinicia automaticamente** após update bem-sucedido
- **Dados do WhatsApp são preservados** durante o processo

---

**Desenvolvido por:** RafaelPonte
**Versão:** 3.5.0
