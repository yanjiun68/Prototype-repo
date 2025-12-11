const { Blockchain } = require('../../../lib/blockchain');

let blockchainInstance = null;

const getBlockchain = () => {
  if (!blockchainInstance) {
    blockchainInstance = new Blockchain();
  }
  return blockchainInstance;
};

export default async function handler(req, res) {
  const { icNumber } = req.query;
  const blockchain = getBlockchain();

  if (req.method === 'GET') {
    // Get personal data for specific IC
    try {
      const data = blockchain.getPersonalData(icNumber);

      if (data.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No personal data found for this IC number'
        });
      }

      res.status(200).json({
        success: true,
        icNumber: icNumber,
        recordCount: data.length,
        data: data
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to retrieve data', 
        message: error.message 
      });
    }
  } 
  else if (req.method === 'DELETE') {
    // Delete all data for specific IC
    try {
      const data = blockchain.getPersonalData(icNumber);
      
      if (data.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No data found for this IC'
        });
      }

      const deletedCount = data.length;
      data.forEach(item => {
        blockchain.deletePersonalData(item.dataId);
      });

      res.status(200).json({
        success: true,
        message: `Deleted ${deletedCount} records for IC ${icNumber}`,
        deletedCount: deletedCount
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to delete data', 
        message: error.message 
      });
    }
  }
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
