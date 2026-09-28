
const fs = require('fs');
let content = fs.readFileSync('prisma/schema.prisma', 'utf8');

const fixModels = [
  'ExpenseVoucher', 'PettyCashAccount', 'JournalEntry', 
  'ControlledDrugRegister', 'BatchRecall', 'RetailAudit', 'DisplayRentalScheme'
];

for (const model of fixModels) {
  const regex = new RegExp('(model ' + model + ' \\{[^}]*\\})', 'g');
  content = content.replace(regex, (match) => {
    return match.replace(/(@relation\\(fields: \\[([^\\]]+)\\], references: \\[id\\], )onDelete: Cascade\\)/g, (fullMatch, p1, fieldName) => {
      if (fieldName === 'tenantId') return fullMatch;
      return p1 + 'onDelete: NoAction, onUpdate: NoAction)';
    });
  });
}
fs.writeFileSync('prisma/schema.prisma', content);

