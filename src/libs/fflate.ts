// Tree shaking reduces bundle size
export { zlibSync, unzlibSync } from "fflate";

// This file likely contains the fflate library, which is a fast compression/decompression library.
// Since it's an external library, we'll create type definitions for its main functions.

declare module 'fflate' {
  export function deflate(data: Uint8Array): Uint8Array;
  export function inflate(data: Uint8Array): Uint8Array;
  export function gzip(data: Uint8Array): Uint8Array;
  export function gunzip(data: Uint8Array): Uint8Array;
  // Add more function signatures as needed
}

// If the file contains actual implementation, you might need to add type annotations to the existing code.
// For example:

// export function someFunction(input: SomeType): ReturnType {
//   // Implementation
// }

// If the file is just re-exporting from 'fflate', you can do:
export * from 'fflate';
