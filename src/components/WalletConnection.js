import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../utils/connectors';

const WalletConnection = () => {
  const { account, activate, deactivate, active, error } = useWeb3React();

  const connectWallet = async () => {
    try {
      await activate(injected);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const disconnectWallet = () => {
    try {
      deactivate();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (error) {
    return (
      <div className="wallet-info">
        <div className="error">
          连接钱包时出错: {error.message}
        </div>
        <button className="btn" onClick={connectWallet}>
          重新连接
        </button>
      </div>
    );
  }

  if (!active) {
    return (
      <div className="wallet-info">
        <h3>连接钱包</h3>
        <p>请连接MetaMask钱包以使用红包功能</p>
        <button className="btn" onClick={connectWallet}>
          连接 MetaMask
        </button>
      </div>
    );
  }

  return (
    <div className="wallet-info">
      <h3>钱包已连接</h3>
      <div className="wallet-address">
        {formatAddress(account)}
      </div>
      <button className="btn btn-secondary" onClick={disconnectWallet}>
        断开连接
      </button>
    </div>
  );
};

export default WalletConnection;
