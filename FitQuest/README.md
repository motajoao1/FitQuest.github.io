# ⚔️ FitQuest — Gamificação de Treinos

Protótipo web de um aplicativo de fitness gamificado com mecânicas de RPG.
Cada treino concluído rende XP, evolui o personagem e avança a batalha contra o Chefão da Semana.

---

## 🗂️ Estrutura do projeto

```
fitquest/
├── index.html          # Estrutura HTML principal
├── css/
│   └── style.css       # Todos os estilos (tema dark RPG)
├── js/
│   ├── data.js         # Constantes: missões, chefões, prompts de IA
│   ├── state.js        # Estado global + persistência (localStorage)
│   ├── render.js       # Funções de renderização do DOM
│   ├── game.js         # Lógica do jogo: XP, batalha, GPS, pedômetro
│   ├── ai.js           # Integração com a API da Anthropic (Treinador IA)
│   └── app.js          # Inicialização, navegação, toast
└── README.md
```

---

## 🚀 Como rodar

### Opção 1 — Abrir direto no navegador
Basta abrir `index.html` em qualquer navegador moderno.
> O Treinador IA não funcionará sem uma chave de API válida.

### Opção 2 — Servidor local (recomendado para evitar CORS)
```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve .
```
Acesse: `http://localhost:8080`

---

## 🤖 Configurar o Treinador IA (Claude)

1. Obtenha sua chave em [console.anthropic.com](https://console.anthropic.com)
2. Abra `js/ai.js` e substitua:
   ```js
   const ANTHROPIC_API_KEY = 'SUA_CHAVE_AQUI';
   ```

> ⚠️ **Nunca exponha sua API key em produção!**
> Em produção, crie um backend e aponte `API_ENDPOINT` para ele:
> ```js
> const API_ENDPOINT = 'https://seu-backend.com/api/trainer';
> ```

---

## 🎮 Funcionalidades implementadas

| Feature | Descrição |
|---|---|
| **Sistema RPG** | Nível, XP, HP, Força, Resistência, Agilidade |
| **Level Up** | XP necessário aumenta ×1.4 por nível; cura completa ao subir |
| **Classes** | Guerreiro Iniciante → Guerreiro → Paladino → Campeão → Lendário |
| **Missões Diárias** | 5 missões fixas que melhoram atributos |
| **Missões Academia** | Desbloqueadas via check-in GPS |
| **Missões Semanais** | Metas com barra de progresso |
| **Chefão Semanal** | 3 fases (Preguiça, Procrastinação, Desânimo) com log de batalha |
| **Pedômetro** | XP passivo a cada 1.000 passos; meta de 10.000/dia |
| **GPS Check-in** | Simula geofencing na academia |
| **Treinador IA** | Chat com Claude: motivação, missões e dicas personalizadas |
| **Missões Procedurais** | Geradas dinamicamente pela IA |
| **Equipamentos** | Desbloqueados por nível (5+ e 10+) |
| **Série Semanal** | Tracking visual dos dias treinados |
| **Persistência** | Estado salvo no localStorage |
| **Toast** | Notificações de XP e conquistas |

---

## 📱 Roadmap — Flutter (versão nativa)

Para converter este protótipo em um app Flutter real:

### Persistência
```yaml
dependencies:
  hive: ^2.2.3        # ou sqflite: ^2.3.0
  hive_flutter: ^1.1.0
```

### GPS & Geofencing
```yaml
dependencies:
  geolocator: ^11.0.0
  # Verifique as coordenadas da academia e use geofencing
```

### Pedômetro
```yaml
dependencies:
  pedometer: ^4.0.0
```
```dart
Pedometer.stepCountStream.listen((StepCount event) {
  gainPassiveXP(event.steps);
});
```

### Biometria
```yaml
dependencies:
  local_auth: ^2.1.8
```

### IA (Anthropic)
Use um backend intermediário (Dart Shelf, Node.js, Python FastAPI) para
proteger sua API key e exponha um endpoint REST para o app Flutter consumir.

---

## 🖌️ Design

- **Tema:** Dark RPG com paleta dourada e superfícies escuras
- **Tipografia:** Cinzel (títulos) + Rajdhani (corpo)
- **Animações:** Float do chefão, barras de progresso, toast
- **Responsivo:** Máximo 540px, funciona em mobile

---

## 📄 Licença

MIT — use, modifique e distribua livremente.
