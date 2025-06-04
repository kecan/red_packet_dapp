import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useRedPacketContract } from '../hooks/useRedPacketContract';

const RedPacketItem = ({ redPacketId, onClaim }) => {
  const { account } = useWeb3React();
  const { getRedPacketInfo, hasClaimed, claimRedPacket } = useRedPacketContract();
  const [redPacketInfo, setRedPacketInfo] = useState(null);
  const [hasUserClaimed, setHasUserClaimed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRedPacketInfo();
  }, [redPacketId]);

  useEffect(() => {
    if (account) {
      checkIfClaimed();
    }
  }, [account, redPacketId]);

  const loadRedPacketInfo = async () => {
    try {
      setLoading(true);
      const info = await getRedPacketInfo(redPacketId);
      setRedPacketInfo(info);
    } catch (error) {
      console.error('获取红包信息失败:', error);
      setError('获取红包信息失败');
    } finally {
      setLoading(false);
    }
  };

  const checkIfClaimed = async () => {
    try {
      const claimed = await hasClaimed(redPacketId, account);
      setHasUserClaimed(claimed);
    } catch (error) {
      console.error('检查领取状态失败:', error);
    }
  };

  const handleClaim = async () => {
    setError('');
    setClaiming(true);

    try {
      const tx = await claimRedPacket(redPacketId);
      
      // 获取领取的金额
      const claimEvent = tx.events?.find(event => event.event === 'RedPacketClaimed');
      const claimedAmount = claimEvent?.args?.amount;

      setHasUserClaimed(true);
      await loadRedPacketInfo(); // 重新加载红包信息
      
      if (onClaim) {
        onClaim(redPacketId, claimedAmount);
      }
    } catch (error) {
      console.error('领取红包失败:', error);
      setError(`领取失败: ${error.message}`);
    } finally {
      setClaiming(false);
    }
  };

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (loading) {
    return (
      <div className="red-packet">
        <div className="loading"></div>
        <p>加载中...</p>
      </div>
    );
  }

  if (!redPacketInfo) {
    return (
      <div className="red-packet">
        <p>红包信息加载失败</p>
      </div>
    );
  }

  const canClaim = redPacketInfo.isActive && 
                   redPacketInfo.remainingCount > 0 && 
                   !hasUserClaimed && 
                   account && 
                   account.toLowerCase() !== redPacketInfo.creator.toLowerCase();

  return (
    <div className="red-packet">
      <h3>红包 #{redPacketId}</h3>
      <div className="amount">
        {redPacketInfo.remainingAmount} ETH
      </div>
      <div className="count">
        剩余 {redPacketInfo.remainingCount} / {redPacketInfo.totalCount} 个
      </div>
      <p>"{redPacketInfo.message}"</p>
      <p><small>创建者: {formatAddress(redPacketInfo.creator)}</small></p>
      
      {error && <div className="error">{error}</div>}
      
      {hasUserClaimed && (
        <div className="success">✅ 您已领取过此红包</div>
      )}
      
      {!redPacketInfo.isActive && (
        <div className="error">❌ 红包已过期</div>
      )}
      
      {redPacketInfo.remainingCount === 0 && (
        <div className="error">❌ 红包已被抢完</div>
      )}
      
      {canClaim && (
        <button 
          className="btn" 
          onClick={handleClaim}
          disabled={claiming}
        >
          {claiming ? (
            <>
              <span className="loading"></span>
              抢红包中...
            </>
          ) : (
            '🧧 抢红包'
          )}
        </button>
      )}
    </div>
  );
};

const RedPacketList = ({ refreshTrigger }) => {
  const { active } = useWeb3React();
  const { getTotalRedPackets } = useRedPacketContract();
  const [totalRedPackets, setTotalRedPackets] = useState(0);
  const [loading, setLoading] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState('');

  useEffect(() => {
    if (active) {
      loadTotalRedPackets();
    }
  }, [active, refreshTrigger]);

  const loadTotalRedPackets = async () => {
    try {
      setLoading(true);
      const total = await getTotalRedPackets();
      setTotalRedPackets(total);
    } catch (error) {
      console.error('获取红包总数失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSuccess = (redPacketId, amount) => {
    setClaimSuccess(`成功领取红包 #${redPacketId}！`);
    setTimeout(() => setClaimSuccess(''), 5000);
  };

  if (!active) {
    return (
      <div className="card">
        <h2>红包列表</h2>
        <p>请先连接钱包以查看红包</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>🎉 红包列表</h2>
      
      {claimSuccess && <div className="success">{claimSuccess}</div>}
      
      {loading ? (
        <div>
          <span className="loading"></span>
          加载中...
        </div>
      ) : (
        <>
          <p>总共有 {totalRedPackets} 个红包</p>
          
          {totalRedPackets === 0 ? (
            <p>暂无红包，快去创建第一个红包吧！</p>
          ) : (
            <div className="grid">
              {Array.from({ length: totalRedPackets }, (_, index) => (
                <RedPacketItem
                  key={index}
                  redPacketId={index}
                  onClaim={handleClaimSuccess}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RedPacketList;
