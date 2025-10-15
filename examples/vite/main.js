import { jsPDF } from "jspdf";

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("generate-pdf");
  const status = document.getElementById("status");

  button.addEventListener("click", () => {
    try {
      // Test that jsPDF import works
      const doc = new jsPDF();

      doc.text(
        "Hello, this is a test PDF generated with jsPDF and Vite!",
        10,
        10
      );
      doc.text("If you can see this, the import issue has been fixed.", 10, 20);

      // Save the PDF
      doc.save("test-vite-jspdf.pdf");

      status.innerHTML =
        '<span style="color: green;">✅ Success! PDF generated successfully.</span>';
      status.innerHTML += "<br>jsPDF version: " + (doc.version || "unknown");
    } catch (error) {
      status.innerHTML =
        '<span style="color: red;">❌ Error: ' + error.message + "</span>";
      console.error("jsPDF Error:", error);
    }
  });

  // Test that the import worked
  try {
    const testDoc = new jsPDF();
    status.innerHTML =
      '<span style="color: blue;">📦 jsPDF imported successfully! Click the button to test PDF generation.</span>';
  } catch (error) {
    status.innerHTML =
      '<span style="color: red;">❌ Import Error: ' + error.message + "</span>";
  }
});
