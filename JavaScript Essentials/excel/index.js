const exportButton = document.getElementById('btn-export');
const table = document.getElementById('my-table');


exportButton.addEventListener('click', () => {
  const wb = XLSX.utils.table_to_book(table, {sheet: 'sheet-1'});
  XLSX.writeFile(wb, 'MyTable.xlsx');
});
