#!/usr/bin/env python3

with open('examples/temp/Beispiel_PDF-mit-Ueberschriften_barrierefrei_Rev1.0.1_decompressed.pdf', 'rb') as f:
    content = f.read().decode('latin-1', errors='ignore')

# Find the Catalog
print("=== CATALOG ===")
catalog_idx = content.find('/StructTreeRoot')
if catalog_idx != -1:
    print(content[max(0, catalog_idx-100):catalog_idx+200])

# Find StructTreeRoot reference
structtree_match = content.find('StructTreeRoot 15 0 R')
print(f"\n=== StructTreeRoot is object 15 ===")

# Find Object Stream 32 which contains the structure elements
objstm_idx = content.find('32 0 obj')
if objstm_idx != -1:
    objstm_end = content.find('endobj', objstm_idx)
    objstm_content = content[objstm_idx:objstm_end+6]

    # Extract the stream data (after 'stream')
    stream_start = objstm_content.find('stream\n') + 7
    stream_end = objstm_content.find('endstream')
    stream_data = objstm_content[stream_start:stream_end]

    print("\n=== OBJECT STREAM 32 DATA ===")
    print(stream_data[:2000])

# Find structure element definitions
print("\n\n=== STRUCTURE ELEMENTS ===")

# Look for H1 element
h1_idx = content.find('/S/H1/Type/StructElem')
if h1_idx != -1:
    print("\nH1 Element:")
    print(content[max(0, h1_idx-50):h1_idx+100])

# Look for H2
h2_idx = content.find('/S/H2/Type/StructElem')
if h2_idx != -1:
    print("\nH2 Element:")
    print(content[max(0, h2_idx-50):h2_idx+100])

# Look for Document
doc_idx = content.find('/S/Document/Type/StructElem')
if doc_idx != -1:
    print("\nDocument Element:")
    print(content[max(0, doc_idx-80):doc_idx+120])

# Extract all StructElem definitions
import re
structs = re.findall(r'<</K\[.*?\]/P.*?/Pg.*?/S/\w+/Type/StructElem>>', content)
print("\n\n=== ALL STRUCTURE ELEMENTS FOUND ===")
for i, struct in enumerate(structs):
    print(f"\n[{i}] {struct}")

# Also find the Document element
doc_structs = re.findall(r'<</K\[.*?\]/P.*?/S/Document/Type/StructElem>>', content)
print("\n\n=== DOCUMENT ELEMENT ===")
for doc in doc_structs:
    print(doc)

# Compare format with ours
print("\n\n=== COMPARISON ===")
print("\nREFERENCE H1 format: <</K[0]/P 26 0 R/Pg 31 0 R/S/H1/Type/StructElem>>")
print("OUR H1 format:       << /Type /StructElem\\n/S /H1\\n/P 20 0 R\\n/Pg 3 0 R\\n/K 0\\n>>")
print("\nKey observation: Order of entries is different but both are valid PDF")
print("REF uses: /K first, then /P, then /Pg, then /S, then /Type")
print("WE use:  /Type first, then /S, then /P, then /Pg, then /K")
