# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [2.0.0] - 2025-11-06

### 🚀 MAJOR UPDATE - Baileys 7.0.0-rc.6

Esta é uma atualização MAJOR que traz compatibilidade completa com Baileys 7, incluindo várias correções críticas.

### ✨ Adicionado

#### Suporte Completo a Baileys 7.0.0-rc.6
- Atualização da biblioteca Baileys de 6.7.20 para 7.0.0-rc.6
- Compatibilidade total com as mudanças de API do Baileys 7
- Suporte a novo sistema de autenticação LID (Link Device ID)

#### Suporte a Mensagens Temporárias (Efêmeras)
- Bot agora funciona corretamente em grupos com mensagens temporárias ativadas
- Desencapsulamento automático de `ephemeralMessage` wrappers
- Processamento correto de mensagens citadas efêmeras
- Comandos de resposta (!s, !simg, etc.) funcionando em mensagens temporárias

#### Extração Correta de Identificadores
- Uso de `participantAlt` para obter números reais em mensagens
- Uso de `phoneNumber` para obter números reais em eventos de participantes
- Conversão automática de LID para números de telefone reais
- Sincronização correta de participantes com identificadores válidos

### 🐛 Corrigido

#### Problemas de Conexão
- ✅ Erro 401 (device_removed) ao conectar
- ✅ Desconexões frequentes com Baileys 6
- ✅ Problemas de autenticação com WhatsApp

#### Problemas em Grupos
- ✅ "Usuário não foi encontrado no banco de dados" em grupos
- ✅ Bot não respondendo em grupos com mensagens temporárias
- ✅ Comandos não funcionando para administradores reais
- ✅ Verificação incorreta de permissões de admin
- ✅ Participantes sendo registrados com IDs incorretos (LID)

#### Comandos de Sticker
- ✅ !s não funcionando ao responder imagens
- ✅ !simg falhando ao converter stickers
- ✅ !s 2 não processando imagens citadas
- ✅ Comandos de resposta falhando em grupos com mensagens temporárias

#### Sincronização de Participantes
- ✅ Participantes novos sendo registrados com LID em vez de telefone
- ✅ Admin checks falhando por incompatibilidade de identificadores
- ✅ Eventos de grupo usando identificadores errados
- ✅ Remoção de participantes não funcionando corretamente

### 🔄 Modificado

#### Arquivos Core

**src/socket.ts**
- Atualizado processamento de eventos `group-participants.update`
- Extração de `phoneNumber` de objetos GroupParticipant
- Mapeamento de participantes array para strings com identificadores corretos

**src/services/participant.service.ts**
- Função `syncParticipants()` agora usa `participant.phoneNumber`
- Verificação de remoção de participantes corrigida
- Fallback para `participant.id` se phoneNumber não disponível

**src/utils/whatsapp.util.ts**
- Função `formatWAMessage()` reescrita para suportar ephemeral messages
- Desencapsulamento de mensagens efêmeras principais
- Desencapsulamento de mensagens citadas efêmeras
- Uso de `participantAlt` para extração de sender em grupos
- Comentários detalhados explicando fixes do Baileys 7

**src/events/message-received.event.ts**
- Sincronização automática de grupos faltantes
- Fluxo de processamento de mensagens otimizado
- Tratamento melhorado de casos extremos

**package.json**
- Baileys atualizado: `6.7.20` → `7.0.0-rc.6`
- Dependências de tipos atualizadas para compatibilidade

### 🔧 Técnico

#### Mudanças de Tipo (TypeScript)
- `participants: string[]` → `participants: GroupParticipant[]` em eventos
- Adicionado tratamento para campos nullable do Baileys 7
- Type assertions para `participantAlt` (campo não tipado ainda)

#### Estrutura de Dados
- Mensagens em grupos com temp messages: `m.message.ephemeralMessage.message`
- Remetentes em grupos: `m.key.participantAlt` (número real) vs `m.key.participant` (LID)
- Participantes de grupo: `participant.phoneNumber` (número real) vs `participant.id` (LID)

### ⚠️ BREAKING CHANGES

#### Migração de Banco de Dados Necessária

**IMPORTANTE**: Usuários atualizando de versões anteriores DEVEM:

1. Deletar `storage/participants.groups.db`:
```bash
rm storage/participants.groups.db
```

2. Reiniciar o bot para re-sincronização automática

**Por quê?**
- Versões antigas salvavam participantes com LID (`@lid`)
- Nova versão usa números de telefone reais (`@s.whatsapp.net`)
- Banco antigo causa falhas de verificação de admin e comandos
- Re-sincronização cria registros corretos automaticamente

### 📊 Melhorias de Performance

- Remoção de todos os logs de debug desnecessários
- Código de processamento de mensagens otimizado
- Menos verificações redundantes em formatação de mensagens

### 📝 Documentação

- README.md completo adicionado
- CHANGELOG.md criado
- Comentários inline explicando todos os fixes do Baileys 7
- Seção de troubleshooting expandida

### ✅ Testado

Todas as funcionalidades testadas e verificadas:
- ✅ Conexão com WhatsApp (sem erros 401)
- ✅ Comandos em chat privado
- ✅ Comandos em grupos (com/sem mensagens temporárias)
- ✅ Comandos exclusivos de admin
- ✅ Criação de stickers (todos os tipos)
- ✅ Comandos baseados em resposta
- ✅ Processamento de mídia
- ✅ Sincronização de participantes
- ✅ Verificações de permissão de admin
- ✅ Auto-resposta e filtros
- ✅ Downloads de mídia
- ✅ Sistema de ranking

---

## [1.0.0] - Data Anterior

### Primeira Versão

- Implementação inicial com Baileys 6.7.20
- Sistema completo de comandos
- Criação de stickers
- Moderação de grupos
- Downloads de mídia
- Sistema de níveis

---

## Legendas

- `✨ Adicionado` para novas funcionalidades
- `🐛 Corrigido` para correções de bugs
- `🔄 Modificado` para mudanças em funcionalidades existentes
- `🗑️ Removido` para funcionalidades removidas
- `🔒 Segurança` para correções de vulnerabilidades
- `⚠️ Descontinuado` para funcionalidades que serão removidas
- `🚀 MAJOR UPDATE` para mudanças significativas de versão
