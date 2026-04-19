// Google Apps Script for saving donation form data to Google Sheets
// Deploy this as a web app with "Execute as: Me" and "Who has access: Anyone"

function doPost(e) {
  try {
    // Open the Google Sheet by ID (replace with your actual sheet ID)
    const sheetId = '1bwD456sR_T_XkldIxyVWn6k5_q7p4aZkb4_Jv-uiNVY';
    const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();

    // Get the data from the POST request
    const data = e.parameter;

    // Prepare the row data in the same order as your form fields
    const rowData = [
      new Date(), // Timestamp
      data.name,
      data.company || '',
      data.email,
      data.phone || '',
      data.amount,
      data.method,
      data.txid,
      data.message || ''
    ];

    // Append the data to the sheet
    sheet.appendRow(rowData);

    // Return success response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({status: 'success', message: 'Data saved successfully'}))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type');

  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
}

function doOptions() {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Test function to verify the script works
function testScript() {
  const testData = {
    name: 'Test User',
    company: 'Test Company',
    email: 'test@example.com',
    phone: '1234567890',
    amount: '1000',
    method: 'upi',
    txid: 'TEST123',
    message: 'Test donation'
  };

  const e = {
    parameter: testData
  };

  const result = doPost(e);
  Logger.log(result.getContent());
}