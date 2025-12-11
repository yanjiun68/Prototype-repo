const CryptoJS = require('crypto-js');
const { MyKadSmartContracts } = require('./smartContracts');
const { PersonalDataManager } = require('./personalData');

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
    this.smartContractExecutions = [];
  }

  calculateHash() {
    return CryptoJS.SHA256(
      this.index +
      this.previousHash +
      this.timestamp +
      JSON.stringify(this.data) +
      this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`Block mined: ${this.hash}`);
  }

  addContractExecution(execution) {
    this.smartContractExecutions.push(execution);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.smartContracts = MyKadSmartContracts.getAllDefaultContracts();
    this.personalDataManager = new PersonalDataManager();
    this.pendingTransactions = [];
  }

  createGenesisBlock() {
    return new Block(
      0, 
      Date.now(), 
      { 
        type: 'genesis', 
        message: 'MyKad Blockchain Genesis Block - Personal Data Storage Enabled' 
      }, 
      '0'
    );
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    
    // Execute smart contracts on new block data (only for MyKad registration)
    if (newBlock.data.type !== 'personal_data' && newBlock.data.type !== 'data_deletion') {
      this.smartContracts.forEach(contract => {
        if (contract.status === 'active') {
          const execution = contract.execute(newBlock.data, this);
          if (execution.success) {
            newBlock.addContractExecution(execution);
            console.log(`Contract ${contract.name} executed successfully`);
          }
        }
      });
    }

    this.chain.push(newBlock);
    return newBlock;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  // Personal Data Methods
  addPersonalData(icNumber, dataType, dataCategory, dataValue, description = '', isPrivate = true) {
    try {
      // Add to personal data manager
      const dataRecord = this.personalDataManager.addData(
        icNumber, 
        dataType, 
        dataCategory, 
        dataValue, 
        description, 
        isPrivate
      );

      // Create blockchain block for this data
      const newBlock = new Block(
        this.chain.length,
        Date.now(),
        {
          type: 'personal_data',
          ...dataRecord
        },
        this.getLatestBlock().hash
      );

      this.addBlock(newBlock);

      return {
        success: true,
        dataRecord: dataRecord,
        blockIndex: newBlock.index,
        blockHash: newBlock.hash
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  getPersonalData(icNumber) {
    return this.personalDataManager.getDataByIC(icNumber);
  }

  getAllPersonalData(includePrivate = true) {
    return this.personalDataManager.getAllData(includePrivate);
  }

  updatePersonalData(dataId, updates) {
    const updated = this.personalDataManager.updateData(dataId, updates);
    
    if (updated) {
      // Record update in blockchain
      const updateBlock = new Block(
        this.chain.length,
        Date.now(),
        {
          type: 'data_update',
          dataId: dataId,
          updates: updates,
          previousVersion: updated.version - 1,
          newVersion: updated.version,
          updatedAt: Date.now()
        },
        this.getLatestBlock().hash
      );

      this.addBlock(updateBlock);
    }

    return updated;
  }

  deletePersonalData(dataId) {
    const result = this.personalDataManager.deleteData(dataId);
    
    if (result.success) {
      // Record deletion in blockchain
      const deleteBlock = new Block(
        this.chain.length,
        Date.now(),
        {
          type: 'data_deletion',
          dataId: dataId,
          deletedAt: Date.now(),
          deletedData: result.deletedData
        },
        this.getLatestBlock().hash
      );

      this.addBlock(deleteBlock);
    }

    return result;
  }

  getPersonalDataStatistics() {
    return this.personalDataManager.getStatistics();
  }

  searchByIC(icNumber) {
    return this.chain.find(block => 
      block.data && block.data.icNumber === icNumber
    );
  }

  getAllContractExecutions() {
    const executions = [];
    this.chain.forEach(block => {
      if (block.smartContractExecutions && block.smartContractExecutions.length > 0) {
        block.smartContractExecutions.forEach(exec => {
          executions.push({
            ...exec,
            blockIndex: block.index,
            blockHash: block.hash
          });
        });
      }
    });
    return executions;
  }

  getContractStats() {
    return this.smartContracts.map(contract => ({
      id: contract.id,
      name: contract.name,
      type: contract.type,
      status: contract.status,
      executionCount: contract.executionCount
    }));
  }

  exportUserData(icNumber) {
    return this.personalDataManager.exportData(icNumber);
  }
}

module.exports = { Block, Blockchain };
