import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateProductPDF = (products) => {
  const doc = new jsPDF();

  // ----------- HEADER -----------

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("RAMESH AGENCY", 105, 15, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(
    "No.73 Godown Street, J.R.C Complex, Chennai - 600001 | +91 8939670701",
    105,
    22,
    { align: "center" }
  );

  // Line separator
  doc.line(14, 26, 196, 26);

  // ----------- TABLE -----------

  autoTable(doc, {
    startY: 30,
    head: [["Name", "Size", "Unit", "Rate"]],
    body: products.map((p) => [
      p.productName,
      p.size,
      p.perUnit,
      ` ${p.rate}`,
    ]),
    styles: {
      fontSize: 10,
      halign: "center",
    },
    headStyles: {
      fillColor: [15, 23, 42], // dark slate
      textColor: 255,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { halign: "left" },
    },
  });

  doc.save("products.pdf");
};
