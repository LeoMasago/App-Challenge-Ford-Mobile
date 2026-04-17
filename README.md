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

O aplicativo foi desenvolvido em **React Native com Expo** e serve como interface mobile para a solução proposta ao desafio da Ford. O app oferece autenticação de usuários, navegação por categorias de veículos e estrutura base para integração com APIs externas e serviços de dados.

---

## Objetivo do Challenge

O programa **Ford & FIAP: Dados na Prática** une a excelência acadêmica da FIAP com a operação da Ford, trazendo líderes com cases focados em dados para otimizar decisões operacionais e melhorar a experiência do cliente.

### Desafio 01 — Inteligência Competitiva Automotiva

> Compreender o valor percebido pelo cliente em relação à concorrência exige dados precisos e extremamente organizados.

Desenvolver uma ferramenta que permita receber dados técnicos de veículos concorrentes a partir de uma entrada simples e gerar uma **lista padronizada de especificações técnicas**, com os seguintes requisitos:

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
    ├── firebase/
    │   ├── config.js               # Inicialização Firebase
    │   └── authService.js          # login, cadastro, reset de senha
    ├── navigation/
    │   ├── AppNavigator.js         # Stack Navigator raiz
    │   └── HomeTabs.js             # Bottom Tab Navigator
    ├── components/
    │   ├── FordLogo.js             # Logo Ford (pure React Native)
    │   └── HomeHeader.js           # Header com menu lateral animado
    └── screens/
        ├── LoginScreen.js          # Login / Cadastro (pill tab)
        ├── RegisterScreen.js       # Cadastro standalone
        ├── ForgotPasswordScreen.js # Recuperação de senha
        ├── SedasScreen.js          # Tab — Sedãs
        ├── EsportivosScreen.js     # Tab — Esportivos
        └── CaminhonetesScreen.js   # Tab — Caminhonetes
```

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
- `w` para abrir no navegador

---

## Fluxo de Navegação

```
LoginScreen
  ├── Pill "Login"    → autenticação → HomeTabs
  ├── Pill "Cadastro" → criação de conta
  └── "Esqueceu a senha?" → ForgotPasswordScreen

HomeTabs (Bottom Tabs)
  ├── Sedãs
  ├── Esportivos
  └── Caminhonetes
       └── Menu lateral (≡) → navegação entre tabs + Sair
```


