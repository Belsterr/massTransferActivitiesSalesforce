# Mass Transfer Activities for Salesforce

<div align="center">

[![Salesforce](https://img.shields.io/badge/Salesforce-00A1E0?style=flat&logo=salesforce&logoColor=white)](https://www.salesforce.com)
[![Apex](https://img.shields.io/badge/Language-Apex-00A1E0?style=flat&logo=salesforce&logoColor=white)](https://developer.salesforce.com/docs/apex/latest)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A powerful Salesforce solution for bulk transferring Activities (Tasks and Events) between users while maintaining data integrity and related records relationships.

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Configuration](#configuration) • [Contributing](#contributing)

</div>

---

## 📋 Overview

**Mass Transfer Activities** is a Salesforce customization designed to streamline the process of transferring multiple activities across your organization. Whether you're handling employee turnover, organizational restructuring, or routine workload balancing, this solution provides a robust, declarative approach to manage activity ownership transfers at scale.

### Why Use This Solution?

- ✨ **Bulk Operations**: Transfer thousands of activities in a single operation
- 🔗 **Relationship Preservation**: Maintains connections between activities and their related records
- 🛡️ **Data Integrity**: Protects data consistency during transfers
- 📊 **Queue-Based Support**: Works seamlessly with Salesforce queues (Certidões, Diretoria, Financeiro, Licenciamento, Societário, etc.)
- ⚡ **Performance Optimized**: Handles large datasets efficiently
- 🎯 **Flexible Filtering**: Transfer by department, queue, date range, or custom criteria

---

## ✨ Features

- **Bulk Activity Transfer**: Move multiple tasks and events in a single operation
- **Queue Management**: Transfer activities assigned to specific queues
- **Criteria-Based Selection**: Filter activities by:
  - Activity type (Task/Event)
  - Created/Modified date range
  - Related object (Account, Lead, Opportunity, Case)
  - Activity status (Open/Closed)
  - Custom fields and custom metadata
- **Related Records Handling**: Optionally transfer or maintain related object ownership
- **Audit Trail**: Comprehensive logging of all transfers for compliance and troubleshooting
- **User-Friendly Interface**: Intuitive Lightning component for easy operation
- **Error Handling**: Detailed error reporting with rollback capabilities

---

## 🚀 Quick Start

### Prerequisites

- Salesforce org with Apex and Lightning Components enabled
- Admin or equivalent permissions to deploy code
- Basic understanding of Salesforce administration

### Installation

1. **Clone the Repository**

```bash
git clone https://github.com/Belsterr/massTransferActivitiesSalesforce.git
cd massTransferActivitiesSalesforce
```

2. **Deploy to Your Salesforce Org**

Using SFDX CLI:

```bash
sfdx force:source:deploy -p src --targetusername your-org-alias
```

Or using Salesforce Metadata API:

```bash
sfdx force:mdapi:deploy -d mdapi --targetusername your-org-alias -w 30
```

3. **Verify Installation**

- Navigate to Setup → Custom Applications
- Look for "Mass Transfer Activities" tab
- Verify all Apex classes and Lightning components are deployed

---

## 📖 Usage

### Basic Workflow

1. **Access the Application**

   Go to the Lightning App and select "Mass Transfer Activities"

2. **Configure Transfer Criteria**

   - **From User/Queue**: Select the source user or queue
   - **To User/Queue**: Select the destination user or queue
   - **Activity Type**: Choose Tasks, Events, or Both
   - **Date Range**: Optionally filter by creation date
   - **Status**: Filter open or closed activities

3. **Preview & Execute**

   - Review the activities that will be transferred
   - Click "Transfer" to execute
   - Monitor the progress and review the results

4. **Review Results**

   - Check the transfer summary
   - Review the audit log for detailed information
   - Verify activities in the destination user's queue

### Advanced Scenarios

**Transfer Activities for Department Restructuring**

```
From User: Old Department Manager
To User: New Department Manager
Criteria: Created Date >= 01/01/2025
Activity Type: All
Include Related Records: Yes
```

**Queue-Based Transfer**

```
From Queue: Financeiro (Finance)
To Queue: Diretoria (Board)
Activity Type: Tasks only
Status: Open Activities
```

---

## ⚙️ Configuration

### Customize Transfer Behavior

Edit `ActivityTransferConfig.cls` to adjust:

- Batch size for processing
- Number of retries on failure
- Logging level and verbosity
- Related record handling logic

### Custom Metadata Types

Configure custom metadata for department-specific transfer rules:

- **Department**: Certidões, Diretoria, Financeiro, Licenciamento, Societário
- **Activity Types**: Task, Event
- **Validation Rules**: Custom business logic per queue

### Security & Permissions

Create a custom permission set for users who can perform transfers:

1. Setup → Permission Sets
2. Create new set: "Mass Transfer Activities User"
3. Assign custom permissions:
   - Execute Apex
   - Modify activities
   - View users and queues

---

## 🏗️ Architecture

### Component Structure

```
src/
├── classes/
│   ├── ActivityTransferService.cls      # Core transfer logic
│   ├── ActivityTransferService_Test.cls # Test class
│   ├── ActivityTransferBatch.cls        # Batch processing
│   └── ActivityTransferConfig.cls       # Configuration
├── lwc/
│   ├── activityTransferComponent/
│   │   ├── activityTransferComponent.js
│   │   ├── activityTransferComponent.html
│   │   └── activityTransferComponent.css
│   └── transferSummary/
│       ├── transferSummary.js
│       ├── transferSummary.html
│       └── transferSummary.css
└── metadata/
    └── CustomMetadata__mdt/
```

### Key Classes

**ActivityTransferService**: Orchestrates the transfer process, handles validation and execution

**ActivityTransferBatch**: Implements `Database.Batchable` for bulk processing of large datasets

**ActivityTransferConfig**: Manages configuration parameters and business rules

---

## 🧪 Testing

Run the included test suite to verify functionality:

```bash
sfdx force:apex:test:run -n ActivityTransferService_Test -u your-org-alias
```

**Code Coverage**: > 85%

**Test Scenarios**:
- ✅ Single activity transfer
- ✅ Bulk activity transfer (1000+ records)
- ✅ Queue-based transfers
- ✅ Date range filtering
- ✅ Related record handling
- ✅ Error scenarios and rollbacks

---

## 📝 API Reference

### ActivityTransferService

#### `transferActivities(TransferRequest request)`

Executes a mass transfer operation.

**Parameters**:
- `fromUserId` (String): Source user ID
- `toUserId` (String): Destination user ID
- `activityTypes` (List<String>): Types of activities to transfer
- `criteria` (ActivityCriteria): Additional filtering criteria

**Returns**: `TransferResult`

```apex
ActivityTransferService.TransferRequest request = new ActivityTransferService.TransferRequest();
request.fromUserId = userIdFrom;
request.toUserId = userIdTo;
request.activityTypes = new List<String>{'Task', 'Event'};

ActivityTransferService.TransferResult result = ActivityTransferService.transferActivities(request);
System.debug('Transferred: ' + result.transferredCount + ' activities');
```

---

## 🐛 Troubleshooting

### Common Issues

**"Insufficient Privileges"**

- Ensure your user has the "Mass Transfer Activities User" permission set
- Verify that the user has access to both source and destination users

**"Batch Job Failed"**

- Check debug logs for detailed error information
- Verify that activities are not locked by other processes
- Check for custom validation rules that might block the update

**"No Activities Found"**

- Verify the date range and filtering criteria
- Ensure activities exist for the selected user/queue
- Check that activities meet the specified status criteria

---

## 📚 Resources

- [Salesforce Apex Documentation](https://developer.salesforce.com/docs/apex/latest)
- [Lightning Web Components Guide](https://lwc.dev/)
- [Salesforce Data Migration Best Practices](https://help.salesforce.com/s/articleView?id=sf.data_migration.htm)
- [Batch Processing in Salesforce](https://developer.salesforce.com/docs/atlas.en-us.232.0.api_asyc.meta/api_asyc/async_batch_api.htm)

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. **Fork the repository**

```bash
git clone https://github.com/YOUR-USERNAME/massTransferActivitiesSalesforce.git
cd massTransferActivitiesSalesforce
```

2. **Create a feature branch**

```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes and commit**

```bash
git add .
git commit -m "Add your descriptive commit message"
```

4. **Push to your fork**

```bash
git push origin feature/your-feature-name
```

5. **Open a Pull Request**

Please include:
- Clear description of changes
- Test cases demonstrating the fix
- Updated documentation if applicable

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋 Support & Questions

- **Issues**: [GitHub Issues](https://github.com/Belsterr/massTransferActivitiesSalesforce/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Belsterr/massTransferActivitiesSalesforce/discussions)
- **Documentation**: [Wiki](https://github.com/Belsterr/massTransferActivitiesSalesforce/wiki)

---

## 👨‍💻 Author

**Belsterr**

- GitHub: [@Belsterr](https://github.com/Belsterr)
- LinkedIn: [Belsterr](https://linkedin.com/in/belsterr)

---

## 🙏 Acknowledgments

- Inspired by Salesforce best practices for bulk data operations
- Built with the Salesforce developer community in mind
- Special thanks to the Salesforce ecosystem

---

<div align="center">

**⭐ If this project helped you, consider giving it a star!**

Made with ❤️ for the Salesforce Community

</div>