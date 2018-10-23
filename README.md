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
