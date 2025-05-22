import React, { useState } from 'react';
import { Download, FileText, Filter, Users, Church, Plus, X, Eye } from 'lucide-react';

const ReportGenerator = () => {
  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedFields, setSelectedFields] = useState({});
  const [filters, setFilters] = useState([]);
  const [reportTitle, setReportTitle] = useState('Parish Report');
  const [reportType, setReportType] = useState('detailed');
  const [showPreview, setShowPreview] = useState(false);

  // Your actual database schema
  const databaseSchema = {
    waumini: {
      label: 'Parish Members (Waumini)',
      fields: {
        member_id: 'Member ID',
        name: 'Name',
        household: 'Household',
        gender: 'Gender',
        household_position: 'Household Position',
        birth_date: 'Birth Date',
        phone_no: 'Phone Number',
        occupation: 'Occupation',
        residence: 'Residence'
      }
    },
    community: {
      label: 'Community Information',
      fields: {
        member_id: 'Member ID',
        community: 'Community',
        zone: 'Zone',
        end_of_parish_membership: 'End of Parish Membership',
        date_of_death: 'Date of Death'
      }
    },
    baptized: {
      label: 'Baptism Records',
      fields: {
        member_id: 'Member ID',
        baptized: 'Baptized Status',
        date_baptized: 'Date Baptized',
        church_baptized: 'Church Baptized',
        baptism_no: 'Baptism Number'
      }
    },
    confirmation: {
      label: 'Confirmation Records',
      fields: {
        member_id: 'Member ID',
        confirmed: 'Confirmed Status',
        confirmation_date: 'Confirmation Date',
        church_confirmed: 'Church Confirmed',
        confirmation_no: 'Confirmation Number'
      }
    },
    married: {
      label: 'Marriage Records',
      fields: {
        member_id: 'Member ID',
        marriage_status: 'Marriage Status',
        marriage_date: 'Marriage Date',
        church_married: 'Church Married',
        marriage_no: 'Marriage Number'
      }
    }
  };

  const handleTableSelection = (tableName) => {
    if (selectedTables.includes(tableName)) {
      setSelectedTables(selectedTables.filter(t => t !== tableName));
      const newFields = { ...selectedFields };
      delete newFields[tableName];
      setSelectedFields(newFields);
    } else {
      setSelectedTables([...selectedTables, tableName]);
    }
  };

  const handleFieldSelection = (tableName, fieldName) => {
    const tableFields = selectedFields[tableName] || [];
    if (tableFields.includes(fieldName)) {
      setSelectedFields({
        ...selectedFields,
        [tableName]: tableFields.filter(f => f !== fieldName)
      });
    } else {
      setSelectedFields({
        ...selectedFields,
        [tableName]: [...tableFields, fieldName]
      });
    }
  };

  const addFilter = () => {
    setFilters([...filters, { table: '', field: '', operator: 'equals', value: '' }]);
  };

  const updateFilter = (index, key, value) => {
    const newFilters = [...filters];
    newFilters[index][key] = value;
    setFilters(newFilters);
  };

  const removeFilter = (index) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const generateReport = async () => {
    // Mock report data - replace with actual API call
    const reportData = {
      title: reportTitle,
      generatedDate: new Date().toLocaleDateString(),
      tables: selectedTables,
      fields: selectedFields,
      filters,
      data: generateMockData()
    };

    if (showPreview) {
      displayPreview(reportData);
    } else {
      downloadPDF(reportData);
    }
  };

  const generateMockData = () => {
    // This would be replaced with actual database query results
    const mockData = {};
    
    if (selectedTables.includes('waumini')) {
      mockData.waumini = [
        { 
          member_id: 1, 
          name: 'John Mwangi', 
          household: 'Mwangi Family', 
          gender: 'Male', 
          household_position: 'Head', 
          birth_date: '1980-05-15', 
          phone_no: '0712345678', 
          occupation: 'Teacher', 
          residence: 'Nairobi' 
        },
        { 
          member_id: 2, 
          name: 'Mary Wanjiku', 
          household: 'Wanjiku Family', 
          gender: 'Female', 
          household_position: 'Head', 
          birth_date: '1985-08-22', 
          phone_no: '0723456789', 
          occupation: 'Nurse', 
          residence: 'Kiambu' 
        }
      ];
    }
    
    if (selectedTables.includes('community')) {
      mockData.community = [
        { member_id: 1, community: 'St. Peter', zone: 'Zone A', end_of_parish_membership: null, date_of_death: null },
        { member_id: 2, community: 'St. Mary', zone: 'Zone B', end_of_parish_membership: null, date_of_death: null }
      ];
    }
    
    if (selectedTables.includes('baptized')) {
      mockData.baptized = [
        { member_id: 1, baptized: 'Yes', date_baptized: '1980-06-15', church_baptized: 'Mt. Padre Pio', baptism_no: 'BP001' },
        { member_id: 2, baptized: 'Yes', date_baptized: '1985-09-10', church_baptized: 'St. Francis', baptism_no: 'BP002' }
      ];
    }
    
    if (selectedTables.includes('confirmation')) {
      mockData.confirmation = [
        { member_id: 1, confirmed: 'Yes', confirmation_date: '1995-05-20', church_confirmed: 'Mt. Padre Pio', confirmation_no: 'CF001' },
        { member_id: 2, confirmed: 'Yes', confirmation_date: '2000-04-15', church_confirmed: 'St. Francis', confirmation_no: 'CF002' }
      ];
    }
    
    if (selectedTables.includes('married')) {
      mockData.married = [
        { member_id: 1, marriage_status: 'Married', marriage_date: '2005-12-10', church_married: 'Mt. Padre Pio', marriage_no: 'MR001' },
        { member_id: 2, marriage_status: 'Single', marriage_date: null, church_married: null, marriage_no: null }
      ];
    }
    
    return mockData;
  };

  const downloadPDF = (reportData) => {
    // Create HTML content for PDF generation
    const htmlContent = generateHTMLReport(reportData);
    
    // Create a temporary iframe for PDF generation
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentDocument;
    doc.open();
    doc.write(htmlContent);
    doc.close();
    
    // Print the iframe content
    iframe.contentWindow.print();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };

  const generateHTMLReport = (reportData) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${reportData.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .parish-info { text-align: center; color: #666; margin-bottom: 10px; }
          .report-meta { background: #f5f5f5; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
          .section { margin-bottom: 30px; }
          .section h3 { background: #333; color: white; padding: 10px; margin: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .summary { background: #e8f4f8; padding: 15px; border-radius: 5px; }
          .sacrament-section { background: #f9f9f9; }
          @media print { 
            body { margin: 0; } 
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="parish-info">Mt. Padre Pio Parish</div>
          <h1>${reportData.title}</h1>
          <p>Generated on: ${reportData.generatedDate}</p>
        </div>
        
        <div class="report-meta">
          <strong>Report Configuration:</strong><br>
          Tables: ${reportData.tables.map(t => databaseSchema[t].label).join(', ')}<br>
          Filters Applied: ${reportData.filters.length}
        </div>

        ${Object.entries(reportData.data).map(([tableName, data]) => `
          <div class="section ${['baptized', 'confirmation', 'married'].includes(tableName) ? 'sacrament-section' : ''}">
            <h3>${databaseSchema[tableName]?.label || tableName}</h3>
            <table>
              <thead>
                <tr>
                  ${(selectedFields[tableName] || []).map(field => 
                    `<th>${databaseSchema[tableName]?.fields[field] || field}</th>`
                  ).join('')}
                </tr>
              </thead>
              <tbody>
                ${data.map(row => `
                  <tr>
                    ${(selectedFields[tableName] || []).map(field => 
                      `<td>${row[field] || 'N/A'}</td>`
                    ).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <p style="margin-top: 10px; font-size: 12px; color: #666;">
              Total Records: ${data.length}
            </p>
          </div>
        `).join('')}
        
        <div class="summary">
          <strong>Report Summary:</strong><br>
          Total records processed: ${Object.values(reportData.data).reduce((sum, data) => sum + data.length, 0)}<br>
          Tables included: ${reportData.tables.length}<br>
          Generated by: Mt. Padre Pio Parish Management System
        </div>
      </body>
      </html>
    `;
  };

  const displayPreview = (reportData) => {
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(generateHTMLReport(reportData));
    previewWindow.document.close();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Parish Report Generator</h1>
        </div>
        <p className="text-gray-600">Create custom reports from Mt. Padre Pio Parish database</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Settings */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Report Settings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Title
                </label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                  placeholder="Enter report title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                >
                  <option value="detailed">Detailed Report</option>
                  <option value="summary">Summary Report</option>
                  <option value="sacraments">Sacraments Report</option>
                  <option value="membership">Membership Report</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Selection */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Select Data Sources
            </h2>
            
            <div className="space-y-4">
              {Object.entries(databaseSchema).map(([tableName, tableInfo]) => (
                <div key={tableName} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="checkbox"
                      id={tableName}
                      checked={selectedTables.includes(tableName)}
                      onChange={() => handleTableSelection(tableName)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={tableName} className="font-medium text-gray-800">
                      {tableInfo.label}
                    </label>
                    {['baptized', 'confirmation', 'married'].includes(tableName) && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Sacrament
                      </span>
                    )}
                  </div>
                  
                  {selectedTables.includes(tableName) && (
                    <div className="ml-7 grid grid-cols-2 md:grid-cols-3 gap-2">
                      {Object.entries(tableInfo.fields).map(([fieldName, fieldLabel]) => (
                        <label key={fieldName} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={(selectedFields[tableName] || []).includes(fieldName)}
                            onChange={() => handleFieldSelection(tableName, fieldName)}
                            className="w-3 h-3 text-blue-600 rounded"
                          />
                          <span className="text-gray-700">{fieldLabel}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h2>
              <button
                onClick={addFilter}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Filter
              </button>
            </div>
            
            <div className="space-y-3">
              {filters.map((filter, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-md border">
                  <select
                    value={filter.table}
                    onChange={(e) => updateFilter(index, 'table', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-800"
                  >
                    <option value="">Select Table</option>
                    {selectedTables.map(table => (
                      <option key={table} value={table}>{databaseSchema[table].label}</option>
                    ))}
                  </select>
                  
                  <select
                    value={filter.field}
                    onChange={(e) => updateFilter(index, 'field', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-800"
                    disabled={!filter.table}
                  >
                    <option value="">Select Field</option>
                    {filter.table && Object.entries(databaseSchema[filter.table].fields).map(([field, label]) => (
                      <option key={field} value={field}>{label}</option>
                    ))}
                  </select>
                  
                  <select
                    value={filter.operator}
                    onChange={(e) => updateFilter(index, 'operator', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-800"
                  >
                    <option value="equals">Equals</option>
                    <option value="contains">Contains</option>
                    <option value="greater">Greater than</option>
                    <option value="less">Less than</option>
                    <option value="not_null">Is not empty</option>
                    <option value="is_null">Is empty</option>
                  </select>
                  
                  <input
                    type="text"
                    value={filter.value}
                    onChange={(e) => updateFilter(index, 'value', e.target.value)}
                    placeholder="Filter value"
                    className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
                    disabled={filter.operator === 'not_null' || filter.operator === 'is_null'}
                  />
                  
                  <button
                    onClick={() => removeFilter(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {filters.length === 0 && (
                <p className="text-gray-500 text-sm italic">No filters applied. Click "Add Filter" to add conditions.</p>
              )}
            </div>
          </div>
        </div>

        {/* Report Actions */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Generate Report</h2>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowPreview(true);
                  generateReport();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <Eye className="w-5 h-5" />
                Preview Report
              </button>
              
              <button
                onClick={() => {
                  setShowPreview(false);
                  generateReport();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={selectedTables.length === 0}
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>
            </div>
            
            {selectedTables.length === 0 && (
              <p className="text-red-600 text-sm mt-2">
                Please select at least one data source to generate a report.
              </p>
            )}
          </div>

          {/* Report Summary */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-blue-800">Report Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tables Selected:</span>
                <span className="font-medium">{selectedTables.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Fields:</span>
                <span className="font-medium">
                  {Object.values(selectedFields).reduce((sum, fields) => sum + fields.length, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Filters Applied:</span>
                <span className="font-medium">{filters.length}</span>
              </div>
              {selectedTables.some(table => ['baptized', 'confirmation', 'married'].includes(table)) && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Sacraments:</span>
                  <span className="font-medium">
                    {selectedTables.filter(table => ['baptized', 'confirmation', 'married'].includes(table)).length}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Templates */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-green-800">Quick Templates</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setSelectedTables(['waumini']);
                  setSelectedFields({ waumini: ['name', 'household', 'gender', 'phone_no', 'residence'] });
                  setReportTitle('Parish Members Directory');
                }}
                className="w-full text-left px-3 py-2 text-sm bg-white rounded border hover:bg-gray-50"
              >
                👥 Members Directory
              </button>
              <button
                onClick={() => {
                  setSelectedTables(['waumini', 'community']);
                  setSelectedFields({ 
                    waumini: ['name', 'household'], 
                    community: ['community', 'zone'] 
                  });
                  setReportTitle('Community Membership');
                }}
                className="w-full text-left px-3 py-2 text-sm bg-white rounded border hover:bg-gray-50"
              >
                🏘️ Community Report
              </button>
              <button
                onClick={() => {
                  setSelectedTables(['waumini', 'baptized', 'confirmation', 'married']);
                  setSelectedFields({ 
                    waumini: ['name', 'gender'], 
                    baptized: ['baptized', 'date_baptized'],
                    confirmation: ['confirmed', 'confirmation_date'],
                    married: ['marriage_status', 'marriage_date']
                  });
                  setReportTitle('Sacraments Report');
                }}
                className="w-full text-left px-3 py-2 text-sm bg-white rounded border hover:bg-gray-50"
              >
                ⛪ Sacraments Summary
              </button>
              <button
                onClick={() => {
                  setSelectedTables(['waumini']);
                  setSelectedFields({ waumini: ['name', 'birth_date', 'gender', 'occupation'] });
                  setReportTitle('Demographics Report');
                }}
                className="w-full text-left px-3 py-2 text-sm bg-white rounded border hover:bg-gray-50"
              >
                📊 Demographics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;