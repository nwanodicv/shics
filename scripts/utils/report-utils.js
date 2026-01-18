function calculateGrade(avg) {
  if (avg >= 70) return { grade: "A", remark: "Excellent" };
  if (avg >= 60) return { grade: "B", remark: "Very Good" };
  if (avg >= 50) return { grade: "C", remark: "Good" };
  if (avg >= 45) return { grade: "D", remark: "Fair" };
  return { grade: "F", remark: "Needs Improvement" };
}

function calculateSubjectTotal(ca, exam) {
  return ca + exam;
}
