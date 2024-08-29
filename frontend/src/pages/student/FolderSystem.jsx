import React from 'react';

const FolderSystem = () => {
    // Simulate folder structure
    const folders = [
        { id: 1, name: 'Math' },
        { id: 2, name: 'Science' },
        { id: 3, name: 'History' },
    ];

    return (
        <div>
            <h1>Folder</h1>
            <ul>
                {folders.map(folder => (
                    <li key={folder.id}>{folder.name}
                        <input type="file" />
                        <button>Upload</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FolderSystem;
