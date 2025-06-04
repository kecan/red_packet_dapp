# 红包DApp

一个基于以太坊的抢红包去中心化应用，使用Web3-React + Ethers.js + Solidity开发。

## 技术栈

- **前端**: React + Web3-React + Ethers.js
- **智能合约**: Solidity + Truffle
- **本地开发**: Ganache CLI

## 功能特性

- 💰 创建红包
- 🧧 抢红包
- 💳 连接钱包（MetaMask）
- 📊 查看红包状态

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动本地区块链

```bash
npm run ganache
```

### 3. 编译和部署合约

```bash
npm run compile
npm run migrate
```

### 4. 启动前端应用

```bash
npm start
```

或者一键启动开发环境：

```bash
npm run dev
```

## 配置MetaMask

1. 添加本地网络：
   - 网络名称: Localhost 8545
   - RPC URL: http://localhost:8545
   - 链ID: 1337
   - 货币符号: ETH

2. 导入Ganache提供的私钥到MetaMask

## 项目结构

```
red-packet-dapp/
├── contracts/          # 智能合约
├── migrations/         # 部署脚本
├── src/               # React前端
│   ├── components/    # React组件
│   ├── hooks/         # 自定义Hook
│   ├── utils/         # 工具函数
│   └── contracts/     # 编译后的合约ABI
├── public/            # 静态资源
└── truffle-config.js  # Truffle配置
```

## 许可证

MIT License
