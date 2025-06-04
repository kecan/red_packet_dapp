import React, { useState } from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import WalletConnection from './components/WalletConnection';
import CreateRedPacket from './components/CreateRedPacket';
import RedPacketList from './components/RedPacketList';

// Web3Provider函数
function getLibrary(provider) {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRedPacketCreated = (redPacketId) => {
    // 刷新红包列表
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="App">
        <div className="header">
          <h1>🧧 红包DApp</h1>
          <p>基于以太坊的去中心化抢红包应用</p>
        </div>
        
        <div className="container">
          <WalletConnection />
          
          <div className="grid">
            <CreateRedPacket onRedPacketCreated={handleRedPacketCreated} />
            <RedPacketList refreshTrigger={refreshTrigger} />
          </div>
          
          <div className="card">
            <h2>📖 使用说明</h2>
            <ol>
              <li><strong>连接钱包:</strong> 点击"连接MetaMask"按钮连接您的钱包</li>
              <li><strong>配置网络:</strong> 确保MetaMask连接到本地网络 (localhost:8545)</li>
              <li><strong>创建红包:</strong> 填写金额、数量和祝福语，点击"创建红包"</li>
              <li><strong>抢红包:</strong> 在红包列表中点击"抢红包"按钮领取红包</li>
              <li><strong>查看状态:</strong> 可以查看红包剩余数量和已领取状态</li>
            </ol>
            
            <h3>⚠️ 注意事项</h3>
            <ul>
              <li>确保Ganache正在运行 (npm run ganache)</li>
              <li>确保智能合约已部署 (npm run migrate)</li>
              <li>每个用户只能领取一次同一个红包</li>
              <li>创建者不能领取自己创建的红包</li>
              <li>请确保钱包有足够的ETH余额</li>
            </ul>
          </div>
        </div>
      </div>
    </Web3ReactProvider>
  );
}

export default App;
