async function downloadResult() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Example Data (Replace with real Firestore data variables)
  const studentName = "John Doe";
  const className = "JSS 2";
  const term = "First Term";

  doc.setFontSize(18);
  doc.text("SCHOOL RESULT SHEET", 60, 20);

  doc.setFontSize(12);
  doc.text(`Student Name: ${studentName}`, 20, 40);
  doc.text(`Class: ${className}`, 20, 50);
  doc.text(`Term: ${term}`, 20, 60);

  // Example subject table
  doc.text("Mathematics: 85", 20, 80);
  doc.text("English: 78", 20, 90);
  doc.text("Biology: 88", 20, 100);

  doc.text("Total: 251", 20, 120);
  doc.text("Average: 83.7", 20, 130);

  doc.save(`${studentName}_Result.pdf`);
}
