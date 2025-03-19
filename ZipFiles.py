import os
import zipfile

# Set the directory to scan
directory = "./"


import os
import zipfile

# Set the directory to scan
directory = "./"

# Loop through each folder in the directory
for folder in os.listdir(directory):
    print(f"Processing {folder}")
    folder_path = os.path.join(directory, folder)
    if os.path.isdir(folder_path):
        # Get the folder name
        folder_name = os.path.basename(folder_path)
        
        # Remove existing zip files in the folder
        for file in os.listdir(folder_path):
            if file.endswith(".zip"):
                zip_file_path = os.path.join(folder_path, file)
                print(f"Removing existing zip file {zip_file_path}")
                os.remove(zip_file_path)
        
        # Create a zip file with the folder name inside the folder
        zip_file = os.path.join(folder_path, f"{folder_name}.zip")
        with zipfile.ZipFile(zip_file, "w") as zipf:
            print(f"Creating {zip_file}")
            for root, dirs, files in os.walk(folder_path):
                for file in files:
                    if file != f"{folder_name}.zip":  # Exclude the zip file from being added
                        print(f"Adding {file}")
                        file_path = os.path.join(root, file)
                        zipf.write(file_path, os.path.relpath(file_path, folder_path))
    print(f"Finished processing {folder}")