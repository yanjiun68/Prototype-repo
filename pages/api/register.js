const { Block, Blockchain } = require('../../lib/blockchain');

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
      const { name, icNumber, dob, address, phone } = req.body;

      if (!name || !icNumber || !dob) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const blockchain = getBlockchain();

      const myKadData = {
        name,
        icNumber,
        dob,
        address,
        phone,
        registrationDate: new Date().toISOString(),
        status: 'active',
        verificationHash: `MYKAD:${icNumber}:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`
      };

      const newBlock = new Block(
        blockchain.chain.length,
        Date.now(),
        myKadData,
        blockchain.getLatestBlock().hash
      );

      blockchain.addBlock(newBlock);

      res.status(200).json({
        success: true,
        block: newBlock,
        qrData: myKadData.verificationHash
      });
    } catch (error) {
      res.status(500).json({ error: 'Registration failed', message: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
