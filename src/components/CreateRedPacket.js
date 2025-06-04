import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useRedPacketContract } from '../hooks/useRedPacketContract';

const CreateRedPacket = ({ onRedPacketCreated }) => {
  const { active, account } = useWeb3React();
  const { createRedPacket } = useRedPacketContract();
  const [formData, setFormData] = useState({
    amount: '',
    count: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!active || !account) {
      setError('请先连接钱包');
      return;
    }

    if (!formData.amount || !formData.count || !formData.message) {
      setError('请填写所有字段');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('金额必须大于0');
      return;
    }

    if (parseInt(formData.count) <= 0 || parseInt(formData.count) > 100) {
      setError('红包数量必须在1-100之间');
      return;
    }

    setLoading(true);

    try {
      const tx = await createRedPacket(
        parseFloat(formData.amount),
        parseInt(formData.count),
        formData.message
      );

      // 从交易事件中获取红包ID
      const redPacketCreatedEvent = tx.events?.find(
        event => event.event === 'RedPacketCreated'
      );
      
      const redPacketId = redPacketCreatedEvent?.args?.redPacketId?.toNumber();

      setSuccess(`红包创建成功！红包ID: ${redPacketId}`);
      setFormData({ amount: '', count: '', message: '' });
      
      if (onRedPacketCreated) {
        onRedPacketCreated(redPacketId);
      }
    } catch (error) {
      console.error('创建红包失败:', error);
      setError(`创建失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!active) {
    return (
      <div className="card">
        <h2>创建红包</h2>
        <p>请先连接钱包以创建红包</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>🧧 创建红包</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="amount">红包总金额 (ETH)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="请输入红包总金额"
            step="0.001"
            min="0"
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <label htmlFor="count">红包数量</label>
          <input
            type="number"
            id="count"
            name="count"
            value={formData.count}
            onChange={handleInputChange}
            placeholder="请输入红包数量"
            min="1"
            max="100"
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <label htmlFor="message">祝福语</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="请输入祝福语"
            rows="3"
            disabled={loading}
          />
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <button 
          type="submit" 
          className="btn"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading"></span>
              创建中...
            </>
          ) : (
            '创建红包'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateRedPacket;
