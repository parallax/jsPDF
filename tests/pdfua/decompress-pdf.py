#!/usr/bin/env python3
import re
import zlib
import sys

def decompress_pdf(filepath):
    with open(filepath, 'rb') as f:
        content = f.read()

    # Find all stream objects
    stream_pattern = rb'stream\r?\n(.*?)\r?\nendstream'

    decompressed = content

    # Find all FlateDecode streams and decompress them
    obj_pattern = rb'(\d+ 0 obj.*?endobj)'

    for obj_match in re.finditer(obj_pattern, content, re.DOTALL):
        obj_content = obj_match.group(1)

        # Check if this object uses FlateDecode
        if b'/FlateDecode' in obj_content or b'/Filter/FlateDecode' in obj_content:
            stream_match = re.search(stream_pattern, obj_content, re.DOTALL)
            if stream_match:
                compressed_data = stream_match.group(1)
                try:
                    # Try to decompress
                    decompressed_data = zlib.decompress(compressed_data)
                    # Replace in the object
                    new_obj = obj_content.replace(compressed_data, decompressed_data)
                    # Remove FlateDecode filter
                    new_obj = re.sub(rb'/Filter\s*/FlateDecode\s*', b'', new_obj)
                    new_obj = re.sub(rb'/Filter/FlateDecode', b'', new_obj)
                    # Replace in full content
                    decompressed = decompressed.replace(obj_content, new_obj)
                except:
                    pass

    # Write decompressed version
    output_path = filepath.replace('.pdf', '_decompressed.pdf')
    with open(output_path, 'wb') as f:
        f.write(decompressed)

    print(f"Decompressed PDF written to: {output_path}")

    # Now extract structure elements
    text_content = decompressed.decode('latin-1', errors='ignore')

    print("\n=== STRUCTURE TREE ROOT ===")
    root_match = re.search(r'(\d+ 0 obj\s*<<[^>]*?/Type\s*/StructTreeRoot.*?>>.*?endobj)', text_content, re.DOTALL)
    if root_match:
        print(root_match.group(1))

    print("\n=== STRUCTURE ELEMENTS ===")
    elem_matches = re.finditer(r'(\d+ 0 obj\s*<<[^>]*?/Type\s*/StructElem.*?>>.*?endobj)', text_content, re.DOTALL)
    for i, elem_match in enumerate(elem_matches):
        print(f"\n[{i}] {elem_match.group(1)}")

    return output_path

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 decompress-pdf.py <pdf-file>")
        sys.exit(1)

    decompress_pdf(sys.argv[1])
