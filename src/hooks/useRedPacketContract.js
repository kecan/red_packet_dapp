import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

// 合约ABI和地址将在编译后自动生成
// 这里先定义一个简化的ABI
const RED_PACKET_ABI = [
  "function createRedPacket(uint256 _totalCount, string memory _message) external payable returns (uint256)",
  "function claimRedPacket(uint256 _redPacketId) external",
  "function getRedPacketInfo(uint256 _redPacketId) external view returns (address, uint256, uint256, uint256, uint256, string, bool)",
  "function hasClaimed(uint256 _redPacketId, address _user) external view returns (bool)",
  "function getClaimers(uint256 _redPacketId) external view returns (address[])",
  "function getTotalRedPackets() external view returns (uint256)",
  "event RedPacketCreated(uint256 indexed redPacketId, address indexed creator, uint256 totalAmount, uint256 totalCount, string message)",
  "event RedPacketClaimed(uint256 indexed redPacketId, address indexed claimer, uint256 amount)"
];

export const useRedPacketContract = () => {
  const { library, account, active } = useWeb3React();
  const [contract, setContract] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);

  useEffect(() => {
    const loadContract = async () => {
      if (library && active) {
        try {
          // 尝试从编译后的合约文件中获取地址
          const RedPacketContract = await import('../contracts/RedPacket.json');
          const networkId = await library.getNetwork().then(n => n.chainId);
          const deployedNetwork = RedPacketContract.networks[networkId];
          
          if (deployedNetwork) {
            const contractInstance = new ethers.Contract(
              deployedNetwork.address,
              RED_PACKET_ABI,
              library.getSigner()
            );
            setContract(contractInstance);
            setContractAddress(deployedNetwork.address);
          }
        } catch (error) {
          console.error('Error loading contract:', error);
        }
      }
    };

    loadContract();
  }, [library, active]);

  const createRedPacket = async (amount, count, message) => {
    if (!contract || !account) throw new Error('Contract not loaded or wallet not connected');
    
    const tx = await contract.createRedPacket(count, message, {
      value: ethers.utils.parseEther(amount.toString())
    });
    
    return await tx.wait();
  };

  const claimRedPacket = async (redPacketId) => {
    if (!contract || !account) throw new Error('Contract not loaded or wallet not connected');
    
    const tx = await contract.claimRedPacket(redPacketId);
    return await tx.wait();
  };

  const getRedPacketInfo = async (redPacketId) => {
    if (!contract) throw new Error('Contract not loaded');
    
    const info = await contract.getRedPacketInfo(redPacketId);
    return {
      creator: info[0],
      totalAmount: ethers.utils.formatEther(info[1]),
      totalCount: info[2].toNumber(),
      remainingAmount: ethers.utils.formatEther(info[3]),
      remainingCount: info[4].toNumber(),
      message: info[5],
      isActive: info[6]
    };
  };

  const hasClaimed = async (redPacketId, userAddress = account) => {
    if (!contract) throw new Error('Contract not loaded');
    return await contract.hasClaimed(redPacketId, userAddress);
  };

  const getClaimers = async (redPacketId) => {
    if (!contract) throw new Error('Contract not loaded');
    return await contract.getClaimers(redPacketId);
  };

  const getTotalRedPackets = async () => {
    if (!contract) throw new Error('Contract not loaded');
    const total = await contract.getTotalRedPackets();
    return total.toNumber();
  };

  return {
    contract,
    contractAddress,
    createRedPacket,
    claimRedPacket,
    getRedPacketInfo,
    hasClaimed,
    getClaimers,
    getTotalRedPackets
  };
};
