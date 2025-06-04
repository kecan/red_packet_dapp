#!/bin/bash

# 红包DApp开发环境启动脚本

echo "🚀 启动红包DApp开发环境..."

# 检查是否安装了Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 请先安装 Node.js"
    exit 1
fi

# 检查是否安装了npm
if ! command -v npm &> /dev/null; then
    echo "❌ 请先安装 npm"
    exit 1
fi

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 检查Ganache是否在运行
echo "🔍 检查Ganache状态..."
if ! curl -s http://localhost:8545 > /dev/null; then
    echo "⚠️  Ganache未运行，正在启动..."
    npx ganache-cli -h 0.0.0.0 &
    GANACHE_PID=$!
    echo "✅ Ganache已启动 (PID: $GANACHE_PID)"
    sleep 5
else
    echo "✅ Ganache已在运行"
fi

# 编译合约
echo "🔨 编译智能合约..."
npm run compile

# 部署合约
echo "🚀 部署智能合约到本地网络..."
npm run migrate

# 启动前端应用
echo "🌐 启动前端应用..."
npm start

echo "🎉 开发环境启动完成！"
echo "📱 前端地址: http://localhost:3000"
echo "🔗 Ganache RPC: http://localhost:8545"
echo ""
echo "💡 请配置MetaMask:"
echo "   - 网络名称: Localhost 8545"
echo "   - RPC URL: http://localhost:8545"
echo "   - 链ID: 1337"
echo "   - 货币符号: ETH"
