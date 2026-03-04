const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

async function generateExecutionPdf(data) {

  const reportsDir = path.join(__dirname, "../reports");

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir);
  }

  const filePath = path.join(
    reportsDir,
    `report-${Date.now()}.pdf`
  );

  const doc = new PDFDocument();

  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  doc.fontSize(18).text("Test Execution Report", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Total Executed: ${data.total}`);
  doc.text(`Passed: ${data.passed}`);
  doc.text(`Failed: ${data.failed}`);
  doc.text(`Pass Rate: ${data.passRate}%`);

  doc.moveDown();
  doc.text("Execution Details:");
  doc.moveDown();
doc.text("Step Results");

doc.text(`Pass: ${data.stepPass}`);
doc.text(`Fail: ${data.stepFail}`);
doc.text(`Blocked: ${data.stepBlocked}`);
doc.text(`Skipped: ${data.stepSkipped}`);

doc.moveDown();
doc.text("Execution By Tester");

Object.entries(data.testerStats).forEach(([tester,count])=>{
  doc.text(`${tester}: ${count}`);
});

doc.moveDown();
doc.text("Execution By Test Run");

Object.entries(data.runStats).forEach(([run,count])=>{
  doc.text(`${run}: ${count}`);
});

  if (data.executions && data.executions.length > 0) {

    data.executions.forEach(exec => {

      doc.text(
        `Status: ${exec.status} | Run: ${exec.testRun?.name || "N/A"}`
      );

    });

  } else {

    doc.text("No executions found.");

  }

  doc.end();

  return new Promise(resolve => {
    stream.on("finish", () => resolve(filePath));
  });

}

module.exports = { generateExecutionPdf };