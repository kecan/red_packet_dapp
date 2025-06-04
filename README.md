# 红包DApp

一个基于以太坊的抢红包去中心化应用，使用Web3-React + Ethers.js + Solidity开发。

## 🎯 功能特性

- 💰 创建红包（支持设置金额、数量、祝福语）
- 🧧 抢红包（随机金额分配算法）
- 💳 连接钱包（MetaMask）
- 📊 查看红包状态（剩余数量、已领取记录）
- 🚫 防重复领取机制
- 🔒 创建者无法领取自己的红包

## 🛠 技术栈

- **前端**: React 18 + Web3-React + Ethers.js
- **智能合约**: Solidity 0.8.19 + Truffle
- **本地开发**: Ganache CLI
- **样式**: 自定义CSS（渐变色主题）

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0
- MetaMask浏览器插件

### 1. 克隆项目

```bash
git clone https://github.com/kecan/red_packet_dapp.git
cd red_packet_dapp
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动本地区块链

```bash
npm run ganache
```

### 4. 编译和部署合约

```bash
# 编译合约
npm run compile

# 部署合约到本地网络
npm run migrate
```

### 5. 启动前端应用

```bash
npm start
```

### 🚀 一键启动（推荐）

```bash
# 给启动脚本执行权限
chmod +x start-dev.sh

# 一键启动开发环境
./start-dev.sh
```

## ⚙️ MetaMask配置

### 添加本地网络

1. 打开MetaMask
2. 点击网络下拉菜单
3. 选择"添加网络"
4. 填写以下信息：
   - **网络名称**: Localhost 8545
   - **RPC URL**: http://localhost:8545
   - **链ID**: 1337
   - **货币符号**: ETH

### 导入测试账户

Ganache启动后会提供10个测试账户，复制私钥导入到MetaMask：

```bash
# Ganache会显示类似以下的账户信息
Available Accounts
==================
(0) 0x627306090abaB3A6e1400e9345bC60c78a8BEf57 (100 ETH)
(1) 0xf17f52151EbEF6C7334FAD080c5704D77216b732 (100 ETH)
...

Private Keys
==================
(0) 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3
(1) 0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f
...
```

## 📖 使用说明

### 创建红包

1. 连接MetaMask钱包
2. 在"创建红包"卡片中填写：
   - **红包总金额**: 要发放的ETH总量
   - **红包数量**: 可领取的红包个数（1-100）
   - **祝福语**: 红包的祝福信息
3. 点击"创建红包"按钮
4. 在MetaMask中确认交易

### 抢红包

1. 在"红包列表"中查看可用的红包
2. 点击红包卡片上的"🧧 抢红包"按钮
3. 在MetaMask中确认交易
4. 成功后会显示领取的金额

### 红包规则

- 每个用户只能领取一次同一个红包
- 创建者无法领取自己创建的红包
- 红包金额采用随机分配算法（最后一个领取剩余所有金额）
- 红包领完后状态变为"已完成"

## 📁 项目结构

```
red-packet-dapp/
├── contracts/              # 智能合约
│   ├── RedPacket.sol       # 红包主合约
│   └── Migrations.sol      # Truffle迁移合约
├── migrations/             # 部署脚本
│   ├── 1_initial_migration.js
│   └── 2_deploy_red_packet.js
├── src/                    # React前端
│   ├── components/         # React组件
│   │   ├── WalletConnection.js    # 钱包连接
│   │   ├── CreateRedPacket.js     # 创建红包
│   │   └── RedPacketList.js       # 红包列表
│   ├── hooks/              # 自定义Hook
│   │   └── useRedPacketContract.js # 合约交互
│   ├── utils/              # 工具函数
│   │   └── connectors.js   # Web3连接器
│   ├── contracts/          # 编译后的合约ABI
│   ├── App.js             # 主应用组件
│   ├── index.js           # React入口
│   └── index.css          # 样式文件
├── public/                 # 静态资源
├── truffle-config.js       # Truffle配置
├── package.json           # 项目配置
└── start-dev.sh          # 开发环境启动脚本
```

## 🔧 开发命令

```bash
# 安装依赖
npm install

# 启动Ganache
npm run ganache

# 编译合约
npm run compile

# 部署合约
npm run migrate

# 启动前端开发服务器
npm start

# 构建生产版本
npm run build

# 运行测试
npm test

# 一键启动开发环境
npm run dev
```

## 🧪 智能合约功能

### 主要方法

- `createRedPacket(uint256 _totalCount, string memory _message)`: 创建红包
- `claimRedPacket(uint256 _redPacketId)`: 领取红包
- `getRedPacketInfo(uint256 _redPacketId)`: 获取红包信息
- `hasClaimed(uint256 _redPacketId, address _user)`: 检查是否已领取
- `getClaimers(uint256 _redPacketId)`: 获取领取者列表
- `getTotalRedPackets()`: 获取红包总数

### 事件

- `RedPacketCreated`: 红包创建事件
- `RedPacketClaimed`: 红包领取事件
- `RedPacketExpired`: 红包过期事件

## ⚠️ 注意事项

- 本项目仅用于学习和演示，请勿在主网使用
- 确保有足够的ETH余额进行交易
- 智能合约未经审计，生产环境请谨慎使用
- Ganache重启后需要重新部署合约

## 🐛 常见问题

### 1. MetaMask连接失败
- 确保MetaMask已安装并解锁
- 检查网络配置是否正确
- 尝试刷新页面

### 2. 合约交互失败
- 确保Ganache正在运行
- 检查合约是否已正确部署
- 验证账户是否有足够的ETH

### 3. 交易失败
- 检查Gas费用设置
- 确认交易参数是否正确
- 查看控制台错误信息

## 🎨 界面预览

项目采用现代化的渐变色设计：
- 主色调：紫色到蓝色渐变
- 红包卡片：粉色渐变带闪光动效
- 响应式设计，支持移动端

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📮 联系方式

如有问题，请通过GitHub Issues联系。
