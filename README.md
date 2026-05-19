# Ford Challenge v1 — Mobile App

> Projeto desenvolvido para o **Ford FIAP 2026**, programa que conecta estudantes de tecnologia a desafios reais de negócio da Ford Motor Company.

---

## Integrantes do Grupo

| Nome | RM |
|---|---|
| Léo Masago | RM557768 |
| Eduardo Tomazela | RM556807 |
| Luiz Henrique Silva | RM555235 |

---

## Sobre o Projeto

Este repositório contém a entrega da disciplina **Mobile Development and IoT** do Challenge Ford FIAP 2026.

O aplicativo foi desenvolvido em **React Native com Expo** e resolve o **Desafio 01 — Inteligência Competitiva Automotiva**: a partir de uma entrada simples (marca, modelo, versão e lista de atributos técnicos), o app consulta uma base de dados no Firebase Realtime Database e retorna uma lista padronizada de especificações técnicas, com campos explícitos para dados não disponíveis.

---

## Objetivo do Challenge

O programa **Ford & FIAP: Dados na Prática** une a excelência acadêmica da FIAP com a operação da Ford, trazendo líderes com cases focados em dados para otimizar decisões operacionais e melhorar a experiência do cliente.

### Desafio 01 — Inteligência Competitiva Automotiva

> Compreender o valor percebido pelo cliente em relação à concorrência exige dados precisos e extremamente organizados.

**Entradas obrigatórias:**
- Marca, Modelo e Versão do veículo
- Lista livre de atributos técnicos a pesquisar (27 atributos pré-definidos)

**Saída obrigatória:**
- Lista padronizada de especificações técnicas
- Formato sempre o mesmo, independente do veículo consultado
- Campos com dados ausentes exibidos explicitamente como "Não disponível"

**Validação:** o app entrega corretamente todas as especificações técnicas do **Ford Ranger Raptor 2024**.

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|---|---|---|
| [Expo](https://expo.dev/) | ~54.0.33 | Framework mobile multiplataforma |
| [React Native](https://reactnative.dev/) | 0.81.5 | Base do app mobile |
| [React](https://react.dev/) | 19.1.0 | Biblioteca de UI |
| [React Navigation](https://reactnavigation.org/) | ^7.x | Navegação entre telas |
| `@react-navigation/native-stack` | ^7.x | Stack Navigator (auth flow) |
| `@react-navigation/bottom-tabs` | ^7.x | Bottom Tab Navigator (home) |
| [Firebase](https://firebase.google.com/) | ^12.12.0 | Autenticação e Realtime Database |
| [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) | ^2.x | Histórico de buscas local |
| [expo-linear-gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) | SDK 54 | Gradientes visuais |
| [@expo/vector-icons](https://icons.expo.fyi/) | SDK 54 | Ícones (MaterialCommunityIcons) |
| [react-native-dotenv](https://github.com/goatandsheep/react-native-dotenv) | ^3.4.11 | Variáveis de ambiente via `.env` |
| react-native-safe-area-context | ~5.6.0 | Safe area para iOS/Android |
| react-native-screens | ~4.16.0 | Otimização de telas nativas |

---

## Estrutura do Projeto

```
ford-challenge-v1/
├── App.js                          # Ponto de entrada
├── app.json                        # Configuração Expo
├── babel.config.js                 # Configuração Babel + dotenv
├── .env                            # Credenciais Firebase (git-ignored)
├── assets/                         # Ícones e splash screen
└── src/
    ├── theme.js                    # Cores globais (FORD_BLUE e variações)
    ├── firebase/
    │   ├── config.js               # Inicialização Firebase
    │   ├── authService.js          # login, cadastro, reset de senha
    │   └── vehicleService.js       # seed e consulta de especificações
    ├── services/
    │   └── historyService.js       # Histórico de buscas (AsyncStorage)
    ├── data/
    │   ├── veiculosData.js         # Dataset com specs de 8 veículos
    │   └── atributosData.js        # Lista de 27 atributos técnicos
    ├── navigation/
    │   ├── AppNavigator.js         # Stack Navigator raiz
    │   └── HomeTabs.js             # Bottom Tab Navigator (4 abas)
    ├── components/
    │   ├── FordLogo.js             # Logo Ford (pure React Native)
    │   ├── HomeHeader.js           # Header com menu lateral animado
    │   ├── VehicleCard.js          # Card reutilizável de veículo
    │   └── CategoryScreen.js       # Tela de categoria compartilhada
    └── screens/
        ├── LoginScreen.js          # Login / Cadastro (pill tab)
        ├── ForgotPasswordScreen.js # Recuperação de senha
        ├── SedasScreen.js          # Tab — Sedãs
        ├── EsportivosScreen.js     # Tab — Esportivos
        ├── CaminhonetesScreen.js   # Tab — Caminhonetes
        ├── HistoricoScreen.js      # Tab — Histórico de buscas
        ├── BuscaScreen.js          # Formulário de busca personalizada
        └── ResultadosScreen.js     # Exibição das especificações
```

---

## Veículos na Base de Dados

| Categoria | Veículo |
|---|---|
| Caminhonete | Ford Ranger Raptor 2024 |
| Caminhonete | Toyota Hilux 2024 |
| Caminhonete | Chevrolet S10 2024 |
| Caminhonete | Mitsubishi L200 Triton 2024 |
| Caminhonete | Volkswagen Amarok 2024 |
| Sedã | Toyota Corolla 2024 |
| Sedã | Honda Civic 2024 |
| Esportivo | Ford Mustang 2024 |

---

## Como Rodar a Aplicação

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/) ou Expo Go no celular
- Conta no [Firebase](https://firebase.google.com/) com projeto configurado

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd ford-challenge-v1
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Firebase

Crie um projeto no [Firebase Console](https://console.firebase.google.com) e:
- Ative **Authentication → Email/Password**
- Ative **Realtime Database** (modo teste)
- Copie as credenciais da Web App

Crie o arquivo `.env` na raiz do projeto:

```env
FIREBASE_API_KEY=seu_api_key
FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
FIREBASE_DATABASE_URL=https://seu_projeto-default-rtdb.firebaseio.com
FIREBASE_PROJECT_ID=seu_projeto_id
FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
FIREBASE_APP_ID=seu_app_id
```

### 4. Inicie o servidor de desenvolvimento

```bash
npx expo start --clear
```

Escaneie o QR Code com o **Expo Go** (Android/iOS) ou pressione:
- `a` para abrir no emulador Android
- `i` para abrir no simulador iOS

---

## Fluxo de Navegação

```
LoginScreen
  ├── Pill "Login"     → autenticação → HomeTabs
  └── Pill "Cadastro"  → criação de conta → HomeTabs
       └── "Esqueceu a senha?" → ForgotPasswordScreen

HomeTabs (Bottom Tabs)
  ├── Sedãs            → lista de sedãs → toque no card → Resultados
  ├── Esportivos       → lista de esportivos → toque no card → Resultados
  ├── Caminhonetes     → lista de caminhonetes → toque no card → Resultados
  │    └── "Busca personalizada" → BuscaScreen → Resultados
  └── Histórico        → lista de buscas anteriores → toque → Resultados

BuscaScreen
  ├── Campos: Marca, Modelo, Versão/Ano
  ├── Seleção de atributos (27 pré-definidos + customizados)
  └── "Buscar Especificações" → ResultadosScreen

ResultadosScreen
  └── Lista padronizada de specs com status disponível / não disponível
```

---

## Funcionalidades

- **Autenticação** — login e cadastro via Firebase Authentication (email/senha), recuperação de senha
- **Base de dados** — especificações técnicas de 8 veículos armazenadas no Firebase Realtime Database, populadas automaticamente no primeiro acesso
- **Busca personalizada** — formulário com seleção livre de atributos técnicos (27 pré-definidos)
- **Navegação por categoria** — listagem de veículos por tipo (Sedãs, Esportivos, Caminhonetes) com acesso rápido às especificações completas
- **Saída padronizada** — formato de resultado sempre consistente, com "Não disponível" explícito para dados ausentes
- **Histórico de buscas** — últimas 10 pesquisas salvas localmente via AsyncStorage, com expiração automática após 30 dias
