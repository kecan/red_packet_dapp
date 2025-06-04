// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract RedPacket {
    struct RedPacketInfo {
        address creator;
        uint256 totalAmount;
        uint256 totalCount;
        uint256 remainingAmount;
        uint256 remainingCount;
        string message;
        bool isActive;
        mapping(address => bool) claimed;
        address[] claimers;
    }
    
    mapping(uint256 => RedPacketInfo) public redPackets;
    uint256 public nextRedPacketId;
    
    event RedPacketCreated(uint256 indexed redPacketId, address indexed creator, uint256 totalAmount, uint256 totalCount, string message);
    event RedPacketClaimed(uint256 indexed redPacketId, address indexed claimer, uint256 amount);
    event RedPacketExpired(uint256 indexed redPacketId);
    
    modifier redPacketExists(uint256 _redPacketId) {
        require(_redPacketId < nextRedPacketId, "Red packet does not exist");
        _;
    }
    
    modifier redPacketActive(uint256 _redPacketId) {
        require(redPackets[_redPacketId].isActive, "Red packet is not active");
        _;
    }
    
    /**
     * @dev 创建红包
     * @param _totalCount 红包总数量
     * @param _message 红包祝福语
     */
    function createRedPacket(uint256 _totalCount, string memory _message) 
        external 
        payable 
        returns (uint256) 
    {
        require(msg.value > 0, "Amount must be greater than 0");
        require(_totalCount > 0, "Count must be greater than 0");
        require(_totalCount <= 100, "Count must be less than or equal to 100");
        
        uint256 redPacketId = nextRedPacketId++;
        RedPacketInfo storage newRedPacket = redPackets[redPacketId];
        
        newRedPacket.creator = msg.sender;
        newRedPacket.totalAmount = msg.value;
        newRedPacket.totalCount = _totalCount;
        newRedPacket.remainingAmount = msg.value;
        newRedPacket.remainingCount = _totalCount;
        newRedPacket.message = _message;
        newRedPacket.isActive = true;
        
        emit RedPacketCreated(redPacketId, msg.sender, msg.value, _totalCount, _message);
        
        return redPacketId;
    }
    
    /**
     * @dev 抢红包
     * @param _redPacketId 红包ID
     */
    function claimRedPacket(uint256 _redPacketId) 
        external 
        redPacketExists(_redPacketId)
        redPacketActive(_redPacketId)
    {
        RedPacketInfo storage redPacket = redPackets[_redPacketId];
        
        require(!redPacket.claimed[msg.sender], "Already claimed");
        require(redPacket.remainingCount > 0, "No red packets left");
        require(redPacket.remainingAmount > 0, "No amount left");
        
        uint256 claimAmount;
        
        if (redPacket.remainingCount == 1) {
            // 最后一个红包，发送剩余所有金额
            claimAmount = redPacket.remainingAmount;
        } else {
            // 随机金额算法：剩余金额的1%-99%之间，但不超过平均值的2倍
            uint256 maxAmount = (redPacket.remainingAmount * 2) / redPacket.remainingCount;
            uint256 minAmount = redPacket.remainingAmount / (redPacket.remainingCount * 100);
            if (minAmount == 0) minAmount = 1;
            
            // 简单的伪随机数生成
            uint256 random = uint256(keccak256(abi.encodePacked(
                block.timestamp,
                block.prevrandao,
                msg.sender,
                _redPacketId
            ))) % 100;
            
            claimAmount = minAmount + (random * (maxAmount - minAmount)) / 100;
            
            if (claimAmount > redPacket.remainingAmount) {
                claimAmount = redPacket.remainingAmount;
            }
        }
        
        // 更新状态
        redPacket.claimed[msg.sender] = true;
        redPacket.claimers.push(msg.sender);
        redPacket.remainingAmount -= claimAmount;
        redPacket.remainingCount--;
        
        // 如果红包已经被全部领取，设为非活跃状态
        if (redPacket.remainingCount == 0) {
            redPacket.isActive = false;
        }
        
        // 转账
        payable(msg.sender).transfer(claimAmount);
        
        emit RedPacketClaimed(_redPacketId, msg.sender, claimAmount);
    }
    
    /**
     * @dev 获取红包信息
     * @param _redPacketId 红包ID
     */
    function getRedPacketInfo(uint256 _redPacketId) 
        external 
        view 
        redPacketExists(_redPacketId)
        returns (
            address creator,
            uint256 totalAmount,
            uint256 totalCount,
            uint256 remainingAmount,
            uint256 remainingCount,
            string memory message,
            bool isActive
        )
    {
        RedPacketInfo storage redPacket = redPackets[_redPacketId];
        return (
            redPacket.creator,
            redPacket.totalAmount,
            redPacket.totalCount,
            redPacket.remainingAmount,
            redPacket.remainingCount,
            redPacket.message,
            redPacket.isActive
        );
    }
    
    /**
     * @dev 检查用户是否已经领取过红包
     * @param _redPacketId 红包ID
     * @param _user 用户地址
     */
    function hasClaimed(uint256 _redPacketId, address _user) 
        external 
        view 
        redPacketExists(_redPacketId)
        returns (bool) 
    {
        return redPackets[_redPacketId].claimed[_user];
    }
    
    /**
     * @dev 获取红包的领取者列表
     * @param _redPacketId 红包ID
     */
    function getClaimers(uint256 _redPacketId) 
        external 
        view 
        redPacketExists(_redPacketId)
        returns (address[] memory) 
    {
        return redPackets[_redPacketId].claimers;
    }
    
    /**
     * @dev 创建者提取过期红包剩余金额
     * @param _redPacketId 红包ID
     */
    function withdrawExpiredRedPacket(uint256 _redPacketId) 
        external 
        redPacketExists(_redPacketId)
    {
        RedPacketInfo storage redPacket = redPackets[_redPacketId];
        
        require(msg.sender == redPacket.creator, "Only creator can withdraw");
        require(redPacket.remainingAmount > 0, "No amount left");
        require(!redPacket.isActive, "Red packet is still active");
        
        uint256 withdrawAmount = redPacket.remainingAmount;
        redPacket.remainingAmount = 0;
        
        payable(msg.sender).transfer(withdrawAmount);
        
        emit RedPacketExpired(_redPacketId);
    }
    
    /**
     * @dev 获取总红包数量
     */
    function getTotalRedPackets() external view returns (uint256) {
        return nextRedPacketId;
    }
}
