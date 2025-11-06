# 🤖 BotFigurinha

> Bot de WhatsApp completo e otimizado para criação de stickers, moderação de grupos e muito mais!

[![Baileys](https://img.shields.io/badge/Baileys-7.0.0--rc.6-green.svg)](https://github.com/WhiskeySockets/Baileys)
[![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Sobre o Projeto

BotFigurinha é um bot de WhatsApp desenvolvido em TypeScript que oferece funcionalidades completas para criação de stickers, moderação de grupos, downloads de mídia e muito mais. Totalmente compatível com **Baileys 7.0.0-rc.6**, incluindo suporte a mensagens temporárias e autenticação LID.

### ✨ Principais Funcionalidades

- 🎨 **Criação de Stickers** - Converta imagens, vídeos e GIFs em stickers
- 👥 **Moderação de Grupos** - Sistema completo de administração
- 🔒 **Anti-Link, Anti-Fake, Anti-Flood** - Proteção automática
- 📥 **Downloads** - YouTube, Instagram, TikTok e mais
- 🤖 **Auto-resposta** - Configure respostas personalizadas
- 📊 **Sistema de Níveis** - Ranking de atividade nos grupos
- ⚙️ **Altamente Configurável** - Comandos podem ser ativados/desativados por grupo

## 🚀 Novidades (Baileys 7.0.0-rc.6)

Esta versão traz compatibilidade completa com Baileys 7, incluindo:

- ✅ **Suporte a LID (Link Device ID)** - Autenticação moderna do WhatsApp
- ✅ **Mensagens Temporárias** - Funciona em grupos com mensagens efêmeras ativadas
- ✅ **Verificação de Admin** - Sistema de permissões totalmente funcional
- ✅ **Sincronização Automática** - Participantes registrados corretamente
- ✅ **Comandos de Resposta** - Stickers e outros comandos que citam mensagens funcionando

## 📦 Requisitos

- Node.js 18 ou superior
- Yarn (recomendado) ou NPM
- Uma conta do WhatsApp para usar como bot

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/RafaelPonte/BotFigurinha.git
cd BotFigurinha
```

### 2. Instale as dependências

```bash
yarn install
# ou
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Configurações do Bot
BOT_NAME=BotFigurinha
BOT_PREFIX=!
BOT_OWNER_NUMBER=5599999999999

# APIs (opcional)
OPENAI_API_KEY=sua_chave_aqui
REMOVE_BG_API_KEY=sua_chave_aqui
```

### 4. Compile o projeto

```bash
yarn build
# ou
npm run build
```

### 5. Inicie o bot

```bash
yarn start
# ou
npm start
```

### 6. Escaneie o QR Code

Use o WhatsApp no seu celular para escanear o QR Code que aparecerá no terminal.

## 📱 Comandos Disponíveis

### 🎨 Stickers

| Comando | Descrição |
|---------|-----------|
| `!s` | Converte imagem/vídeo em sticker |
| `!s 1` | Sticker circular (apenas imagens) |
| `!s 2` | Sticker sem perder proporção |
| `!simg` | Converte sticker em imagem |
| `!ssf` | Remove fundo da imagem e cria sticker |
| `!emojimix` | Mistura dois emojis em um sticker |
| `!snome` | Renomeia pack e autor do sticker |

### 👥 Administração de Grupo

| Comando | Descrição |
|---------|-----------|
| `!ban` | Remove um membro do grupo |
| `!promover` | Promove membro a admin |
| `!rebaixar` | Remove admin de um membro |
| `!todos` | Marca todos os membros |
| `!add` | Adiciona membro ao grupo |
| `!grupo abrir/fechar` | Abre/fecha grupo |
| `!link` | Mostra link do grupo |
| `!resetlink` | Gera novo link do grupo |

### 🔒 Moderação Automática

| Comando | Descrição |
|---------|-----------|
| `!antilink on/off` | Ativa/desativa anti-link |
| `!antifake on/off` | Ativa/desativa anti-fake |
| `!antiflood on/off` | Ativa/desativa anti-flood |
| `!bemvindo on/off` | Ativa/desativa boas-vindas |
| `!autosticker on/off` | Converte imagens automaticamente |
| `!mutar` | Silencia o grupo (apenas admins) |

### 📥 Downloads

| Comando | Descrição |
|---------|-----------|
| `!play` | Baixa música do YouTube |
| `!video` | Baixa vídeo do YouTube |
| `!ytmp3` | Converte vídeo YouTube em áudio |
| `!ig` | Baixa foto/vídeo do Instagram |
| `!tt` | Baixa vídeo do TikTok |
| `!tw` | Baixa vídeo do Twitter |

### 📊 Informações

| Comando | Descrição |
|---------|-----------|
| `!menu` | Mostra menu completo |
| `!perfil` | Mostra seu perfil |
| `!gpinfo` | Informações do grupo |
| `!ranking` | Top membros ativos |
| `!inativos` | Lista membros inativos |
| `!ping` | Verifica latência do bot |

### 🎮 Diversão

| Comando | Descrição |
|---------|-----------|
| `!meme` | Gera meme aleatório |
| `!casal` | Verifica compatibilidade |
| `!emoji` | Informações sobre emoji |
| `!frase` | Frase motivacional |
| `!conselho` | Conselho aleatório |

### ⚙️ Bot Admin

| Comando | Descrição |
|---------|-----------|
| `!dono` | Define dono do bot |
| `!modoAdmin` | Ativa modo apenas donos |
| `!entrar` | Entra em grupo via link |
| `!sair` | Sai do grupo |
| `!limpar` | Limpa chat com bot |
| `!bloquear` | Bloqueia usuário |

## 🛠️ Configuração Avançada

### Personalização de Comandos

Você pode ativar/desativar comandos específicos por grupo:

```
!bloquear comando1 comando2 comando3
!desbloquear comando1 comando2
```

### Auto-Resposta

Configure respostas automáticas para palavras-chave:

```
!autoreply on
!addreply palavra > resposta
!delreply palavra
```

### Filtro de Palavras

Adicione palavras proibidas que serão automaticamente deletadas:

```
!filtro palavra1 palavra2
!delfiltro palavra1
```

## 🔄 Atualização para Baileys 7

Se você está atualizando de uma versão anterior:

### ⚠️ IMPORTANTE

Após atualizar para esta versão, você **DEVE**:

1. **Deletar o banco de participantes antigo:**
```bash
rm storage/participants.groups.db
```

2. **Reiniciar o bot:**
```bash
yarn start
```

O bot irá sincronizar todos os participantes automaticamente com os identificadores corretos.

### Por que isso é necessário?

O Baileys 7 mudou o sistema de identificação de participantes de grupos. Versões antigas usavam LID (`@lid`), mas agora precisamos usar números de telefone reais (`@s.whatsapp.net`). Deletar o banco força uma re-sincronização com os identificadores corretos.

## 🐛 Solução de Problemas

### Bot não responde em grupos

- Verifique se o grupo tem mensagens temporárias ativadas
- Confirme que o bot está como admin (se necessário para comandos específicos)
- Delete `storage/participants.groups.db` e reinicie

### Erro 401 ao conectar

- Delete a pasta `storage/auth`
- Reinicie o bot e escaneie o QR Code novamente

### Comandos de admin não funcionam

- Verifique se você está registrado como dono do bot
- Use `!dono` em privado para se registrar como dono

### Stickers não funcionam

- Certifique-se que FFmpeg está instalado no sistema
- Verifique se a imagem/vídeo não é muito grande
- Vídeos devem ter no máximo 8 segundos

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um Fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 📝 Changelog

Veja [CHANGELOG.md](CHANGELOG.md) para histórico de mudanças detalhado.

## 👨‍💻 Autor

**Rafael Ponte**

- GitHub: [@RafaelPonte](https://github.com/RafaelPonte)

## 🙏 Agradecimentos

- [Baileys](https://github.com/WhiskeySockets/Baileys) - Biblioteca WhatsApp Web API
- [Sharp](https://github.com/lovell/sharp) - Processamento de imagens
- [FFmpeg](https://ffmpeg.org/) - Processamento de vídeo/áudio
- Comunidade open source

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  Feito com ❤️ por <a href="https://github.com/RafaelPonte">Rafael Ponte</a>
</p>

<p align="center">
  ⭐ Deixe uma estrela se este projeto te ajudou!
</p>
