# Pro usuario:

## Como habilitar o ban no canal

No console, digita:
```
window.localStorage.banForeigners = true
```

# Pros devs
## Rodando o build da extensão
```
npm run build
```

## Rodando o build da extensão em modo watch
```
npm run watch
```

## Como funciona o carregamento
* inject.js - Injeta o JavaScript da extensão no contexto da página do WhatsApp
* background.js - Desativa Content-Security-Policy e remove service workers a
  cada reload
* zapzap-app.js - Tenta carregar os modulos do WhatsApp a cada 1s; quando for
  detectado que os módulos foram carregados, injeta a biblioteca `wapi` e
  carrega o App React.js em `src/App.js`
* src/App.js - Carrega o app React.js e o app jQuery

## Scripts
* background.js - Habilita requisicões para domínios externos
* inject.js - Faz a injecao de código no dom da página do whatsapp
* src/App.js - Entry-point para interface React.js
* src/Worker.js - Fila inspecionável de execução de tarefas, integrada no App
  React.js
* src/logic - Lógica diversa do app, incluindo a interface jQuery implementada
* src/logic/old-dispatcher.js - Outra forma de fila de execução de tarefas

# Funcionalidades

## Módulo Defesa

* Bloqueio de númerzos internacionais, deve ser ativo no console
* Bloqueio de números que enviam mais de 10 mensagens em um curto espaco de tempo
* No caso de um número bloqueado for engano, é salvo e não é mais bloqueado mesmo se mandar muitas mensagens
* 

## Módulo Envio Mensagem

* Banco de memes(imagem, videos, arquivos) Pró-Haddad
* Envio para múltiplos contatos do meme selecionado

## Qual produto queremos ter para viralizar?

* Filtros avanćados por tag, emoćão, público-alvo, tema, tipo(video,image,etc)
* Listar canais públicos por categoria de forma randomica
* Entrar em canais/grupos facilmente
* Automatizar o envio de mensagens com novos memes a partir de um filtro avancado para um canal/grupo com possibilidade de configurar frequencia - 20 min