import { jsPDF } from "./jspdf.js";

// Add any additional imports here

// Define types for the jsPDF constructor options
interface jsPDFOptions {
  orientation?: 'portrait' | 'landscape';
  unit?: 'pt' | 'mm' | 'cm' | 'in';
  format?: string | number[];
  // Add other options as needed
}

// Define the main jsPDF function type
type jsPDFConstructor = {
  (options?: jsPDFOptions): jsPDF;
  new (options?: jsPDFOptions): jsPDF;
};

// Cast the imported jsPDF to the constructor type
const jsPDFConstructor = jsPDF as jsPDFConstructor;

// Export the main jsPDF constructor
export default jsPDFConstructor;

// Export other modules or functions
export { /* other exports */ };

// If there are any global augmentations, you can declare them here
declare global {
  interface Window {
    jsPDF: typeof jsPDFConstructor;
  }
}
