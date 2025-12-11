const { Blockchain } = require('../../lib/blockchain');

let blockchainInstance = null;

const getBlockchain = () => {
  if (!blockchainInstance) {
    blockchainInstance = new Blockchain();
  }
  return blockchainInstance;
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { qrData } = req.body;

      if (!qrData) {
        return res.status(400).json({ error: 'QR data required' });
      }

      const blockchain = getBlockchain();

      const found = blockchain.chain.find(block => 
        block.data.verificationHash === qrData
      );

      if (found && blockchain.isChainValid()) {
        res.status(200).json({
          valid: true,
          data: found.data,
          blockIndex: found.index,
          timestamp: new Date(found.timestamp).toLocaleString()
        });
      } else {
        res.status(404).json({
          valid: false,
          message: 'Invalid or tampered MyKad data'
        });
      }
    } catch (error) {
      res.status(500).json({ error: 'Verification failed', message: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
