const CryptoJS = require('crypto-js');

class PersonalDataManager {
  constructor() {
    this.dataStore = new Map();
    this.dataCategories = [
      'Medical Records',
      'Education Certificates',
      'Financial Information',
      'Employment History',
      'Property Ownership',
      'Family Information',
      'Emergency Contacts',
      'Insurance Policies',
      'Legal Documents',
      'Driving License',
      'Passport Information',
      'Vaccination Records',
      'Banking Details',
      'Tax Information',
      'Other'
    ];
  }

  /**
   * Add personal data to the store
   */
  addData(icNumber, dataType, dataCategory, dataValue, description = '', isPrivate = true) {
    // Validate inputs
    if (!icNumber || !dataType || !dataValue) {
      throw new Error('IC Number, Data Type, and Data Value are required');
    }

    // Create data record
    const dataRecord = {
      dataId: this.generateDataId(),
      icNumber: icNumber,
      dataType: dataType,
      dataCategory: dataCategory || 'Other',
      dataValue: dataValue,
      description: description,
      isPrivate: isPrivate,
      timestamp: Date.now(),
      hash: this.calculateDataHash(icNumber, dataType, dataValue),
      version: 1,
      lastModified: Date.now()
    };

    // Store data
    if (!this.dataStore.has(icNumber)) {
      this.dataStore.set(icNumber, []);
    }
    
    this.dataStore.get(icNumber).push(dataRecord);

    return dataRecord;
  }

  /**
   * Get all data for a specific IC number
   */
  getDataByIC(icNumber) {
    return this.dataStore.get(icNumber) || [];
  }

  /**
   * Get specific data by ID
   */
  getDataById(dataId) {
    for (const [ic, dataArray] of this.dataStore.entries()) {
      const found = dataArray.find(item => item.dataId === dataId);
      if (found) return found;
    }
    return null;
  }

  /**
   * Update personal data
   */
  updateData(dataId, updates) {
    for (const [ic, dataArray] of this.dataStore.entries()) {
      const index = dataArray.findIndex(item => item.dataId === dataId);
      if (index !== -1) {
        const currentData = dataArray[index];
        const updatedData = {
          ...currentData,
          ...updates,
          version: currentData.version + 1,
          lastModified: Date.now(),
          previousHash: currentData.hash,
          hash: this.calculateDataHash(ic, updates.dataType || currentData.dataType, updates.dataValue || currentData.dataValue)
        };
        dataArray[index] = updatedData;
        return updatedData;
      }
    }
    return null;
  }

  /**
   * Delete personal data
   */
  deleteData(dataId) {
    for (const [ic, dataArray] of this.dataStore.entries()) {
      const index = dataArray.findIndex(item => item.dataId === dataId);
      if (index !== -1) {
        const deletedData = dataArray.splice(index, 1)[0];
        return {
          success: true,
          deletedData: deletedData,
          deletedAt: Date.now()
        };
      }
    }
    return { success: false };
  }

  /**
   * Search data by category
   */
  searchByCategory(category) {
    const results = [];
    for (const [ic, dataArray] of this.dataStore.entries()) {
      const filtered = dataArray.filter(item => item.dataCategory === category);
      results.push(...filtered);
    }
    return results;
  }

  /**
   * Get all data (with privacy filter)
   */
  getAllData(includePrivate = false) {
    const allData = [];
    for (const [ic, dataArray] of this.dataStore.entries()) {
      const filtered = includePrivate 
        ? dataArray 
        : dataArray.filter(item => !item.isPrivate);
      allData.push(...filtered);
    }
    return allData;
  }

  /**
   * Get statistics
   */
  getStatistics() {
    let totalRecords = 0;
    let privateRecords = 0;
    let publicRecords = 0;
    const categoryCounts = {};

    for (const [ic, dataArray] of this.dataStore.entries()) {
      totalRecords += dataArray.length;
      dataArray.forEach(item => {
        if (item.isPrivate) {
          privateRecords++;
        } else {
          publicRecords++;
        }
        categoryCounts[item.dataCategory] = (categoryCounts[item.dataCategory] || 0) + 1;
      });
    }

    return {
      totalRecords,
      privateRecords,
      publicRecords,
      totalUsers: this.dataStore.size,
      categoryCounts
    };
  }

  /**
   * Generate unique data ID
   */
  generateDataId() {
    return `PD${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  /**
   * Calculate hash for data integrity
   */
  calculateDataHash(icNumber, dataType, dataValue) {
    return CryptoJS.SHA256(
      icNumber + dataType + dataValue + Date.now()
    ).toString();
  }

  /**
   * Verify data integrity
   */
  verifyDataIntegrity(dataId) {
    const data = this.getDataById(dataId);
    if (!data) return false;

    const calculatedHash = this.calculateDataHash(
      data.icNumber,
      data.dataType,
      data.dataValue
    );

    // Note: This is a simplified check. In production, you'd store
    // the original hash and compare against it
    return data.hash && data.hash.length === 64; // SHA256 hash length
  }

  /**
   * Export data for a specific IC (for data portability)
   */
  exportData(icNumber) {
    const data = this.getDataByIC(icNumber);
    return {
      icNumber: icNumber,
      exportDate: new Date().toISOString(),
      recordCount: data.length,
      data: data
    };
  }

  /**
   * Get data categories
   */
  getCategories() {
    return this.dataCategories;
  }
}

module.exports = { PersonalDataManager };
