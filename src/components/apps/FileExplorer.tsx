import { useState } from 'react';
import { FileSystem, FileNode } from '../../types';
import { 
  Folder, FileText, ChevronRight, ArrowLeft, ArrowUp, 
  Search, Plus, Trash2, HardDrive, CornerDownRight, X, Eye, Save 
} from 'lucide-react';

interface FileExplorerProps {
  fileSystem: FileSystem;
  onUpdateFileSystem: (updatedFS: FileSystem) => void;
  onSetWallpaper?: (url: string) => void;
}

export default function FileExplorer({ fileSystem, onUpdateFileSystem, onSetWallpaper }: FileExplorerProps) {
  const [currentPath, setCurrentPath] = useState('/home');
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Text editor/creator states
  const [editingFile, setEditingFile] = useState<{ path: string; name: string; content: string } | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Helper to get items in the current directory
  const getItemsInPath = (path: string) => {
    return Object.values(fileSystem).filter((item) => {
      if (item.path === path) return false; // Don't list directory itself
      
      // Check if it's a direct child
      if (path === '/') {
        // Direct child of root cannot contain other slashes after the first one
        const relative = item.path.substring(1);
        return relative && !relative.includes('/');
      } else {
        if (item.path.startsWith(path + '/')) {
          const relative = item.path.substring(path.length + 1);
          return relative && !relative.includes('/');
        }
      }
      return false;
    });
  };

  const currentItems = getItemsInPath(currentPath).filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFolderDoubleClick = (path: string) => {
    setCurrentPath(path);
    setSelectedPath(null);
    setSearchQuery('');
  };

  const handleFileDoubleClick = (file: FileNode) => {
    setSelectedPath(file.path);
    if (file.type === 'file') {
      setEditingFile({
        path: file.path,
        name: file.name,
        content: file.content || '',
      });
    }
  };

  const handleBack = () => {
    if (currentPath === '/') return;
    const parts = currentPath.split('/');
    parts.pop();
    const parentPath = parts.join('/') || '/';
    setCurrentPath(parentPath);
    setSelectedPath(null);
  };

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;
    
    let sanitizedName = newFileName.trim();
    if (!sanitizedName.includes('.')) {
      sanitizedName += '.txt';
    }

    const fullPath = currentPath === '/' ? `/${sanitizedName}` : `${currentPath}/${sanitizedName}`;
    
    if (fileSystem[fullPath]) {
      alert('A file with that name already exists here!');
      return;
    }

    const updatedFS = { ...fileSystem };
    // Check if user is creating an image file, populate with placeholder/sample or let them edit URL
    const isImg = sanitizedName.endsWith('.jpg') || sanitizedName.endsWith('.png') || sanitizedName.endsWith('.jpeg');
    const defaultContent = isImg 
      ? 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000' 
      : `=== ${sanitizedName} ===\nCreated inside BlackholeOS Sandbox.\nType your notes here...`;

    updatedFS[fullPath] = {
      name: sanitizedName,
      type: 'file',
      path: fullPath,
      content: defaultContent,
    };

    onUpdateFileSystem(updatedFS);
    setNewFileName('');
    setIsCreatingFile(false);
    setSelectedPath(fullPath);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    
    const sanitizedName = newFolderName.trim();
    const fullPath = currentPath === '/' ? `/${sanitizedName}` : `${currentPath}/${sanitizedName}`;
    
    if (fileSystem[fullPath]) {
      alert('A folder with that name already exists here!');
      return;
    }

    const updatedFS = { ...fileSystem };
    updatedFS[fullPath] = {
      name: sanitizedName,
      type: 'directory',
      path: fullPath,
    };

    onUpdateFileSystem(updatedFS);
    setNewFolderName('');
    setIsCreatingFolder(false);
    setSelectedPath(fullPath);
  };

  const handleDeleteFile = (pathToDelete: string) => {
    if (pathToDelete === '/' || pathToDelete === '/home' || 
        pathToDelete === '/home/documents' || pathToDelete === '/home/downloads' || 
        pathToDelete === '/home/pictures') {
      alert('System directories cannot be deleted!');
      return;
    }

    const updatedFS = { ...fileSystem };
    delete updatedFS[pathToDelete];
    
    // Also delete any sub-files if directory
    Object.keys(updatedFS).forEach(key => {
      if (key.startsWith(pathToDelete + '/')) {
        delete updatedFS[key];
      }
    });

    onUpdateFileSystem(updatedFS);
    setSelectedPath(null);
  };

  const handleSaveEditedFile = () => {
    if (!editingFile) return;
    const updatedFS = { ...fileSystem };
    updatedFS[editingFile.path] = {
      ...updatedFS[editingFile.path],
      content: editingFile.content,
    };
    onUpdateFileSystem(updatedFS);
    setEditingFile(null);
  };

  const sidebarNodes = [
    { name: 'Root (/)', path: '/' },
    { name: 'Home (/home)', path: '/home' },
    { name: 'Documents', path: '/home/documents' },
    { name: 'Downloads', path: '/home/downloads' },
    { name: 'Pictures', path: '/home/pictures' },
  ];

  return (
    <div className="h-full w-full bg-slate-950 flex font-sans select-none overflow-hidden relative">
      {/* Sidebar navigation */}
      <div className="w-52 shrink-0 bg-slate-900 border-r border-slate-800/80 p-3 flex flex-col gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-2">
            System Volumes
          </span>
          <div className="space-y-1">
            <button 
              onClick={() => setCurrentPath('/')}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                currentPath === '/' ? 'bg-blue-600/15 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Singularity (S:)</span>
            </button>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-2">
            Quick Access
          </span>
          <div className="space-y-1">
            {sidebarNodes.map((node) => (
              <button
                key={node.path}
                onClick={() => handleFolderDoubleClick(node.path)}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  currentPath === node.path
                    ? 'bg-blue-600/15 text-blue-400 font-medium'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Folder className="w-3.5 h-3.5 text-blue-400/80" />
                <span className="truncate">{node.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Space Optimizations Diagnostics */}
        <div className="mt-auto bg-slate-950/60 rounded-xl p-3 border border-slate-800/40 text-[10px] space-y-2">
          <div className="flex justify-between items-center text-slate-500 font-medium">
            <span>DISK CAPACITY</span>
            <span className="text-emerald-400 font-mono">2.0 GB</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
            <div className="bg-emerald-500 h-1 rounded-full" style={{ width: '4.2%' }} />
          </div>
          <div className="text-slate-500 font-mono leading-tight">
            Allocated size: <span className="text-slate-300">4.2 KB</span><br />
            Sub-buffers: <span className="text-slate-300">Optimized</span>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#060810]">
        {/* Navigation Toolbar */}
        <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-2 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleBack}
              disabled={currentPath === '/'}
              className="p-1 rounded hover:bg-slate-800 disabled:opacity-40 text-slate-300"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleBack}
              disabled={currentPath === '/'}
              className="p-1 rounded hover:bg-slate-800 disabled:opacity-40 text-slate-300"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Path Display */}
          <div className="flex-1 flex items-center bg-slate-950 border border-slate-800/80 rounded-lg px-3 py-1 font-mono text-[11px] text-slate-400">
            <span className="text-emerald-400 mr-1.5">S:</span>
            <span>{currentPath}</span>
          </div>

          {/* Search bar */}
          <div className="w-40 flex items-center bg-slate-950 border border-slate-800/80 rounded-lg px-2.5 py-1 text-xs">
            <Search className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
            <input
              type="text"
              placeholder="Search directory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none w-full text-xs text-slate-300 placeholder-slate-600"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 border-l border-slate-800 pl-3">
            <button
              onClick={() => {
                setIsCreatingFile(true);
                setIsCreatingFolder(false);
              }}
              className="p-1 px-2 text-[10px] bg-blue-600/25 hover:bg-blue-600/35 border border-blue-500/30 text-blue-400 rounded flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>New File</span>
            </button>
            <button
              onClick={() => {
                setIsCreatingFolder(true);
                setIsCreatingFile(false);
              }}
              className="p-1 px-2 text-[10px] bg-teal-600/25 hover:bg-teal-600/35 border border-teal-500/30 text-teal-400 rounded flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>New Folder</span>
            </button>

            {/* Set as Wallpaper button if selected node contains an image URL */}
            {selectedPath && fileSystem[selectedPath] && fileSystem[selectedPath].type === 'file' && (
              (fileSystem[selectedPath].name.endsWith('.jpg') || 
               fileSystem[selectedPath].name.endsWith('.png') || 
               fileSystem[selectedPath].name.endsWith('.jpeg') || 
               fileSystem[selectedPath].content?.trim().startsWith('http'))
            ) && onSetWallpaper && (
              <button
                onClick={() => {
                  const url = fileSystem[selectedPath]?.content?.trim() || '';
                  onSetWallpaper(url);
                  alert('Desktop background successfully updated from ' + fileSystem[selectedPath]?.name);
                }}
                className="p-1 px-2 text-[10px] bg-emerald-600/25 hover:bg-emerald-600/35 border border-emerald-500/30 text-emerald-400 rounded flex items-center gap-1 font-medium transition-all cursor-pointer"
              >
                <Save className="w-3 h-3" />
                <span>Set Background</span>
              </button>
            )}

            <button
              onClick={() => selectedPath && handleDeleteFile(selectedPath)}
              disabled={!selectedPath}
              className="p-1 px-2 text-[10px] bg-red-600/25 hover:bg-red-600/35 border border-red-500/30 text-red-400 rounded disabled:opacity-40 flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Directory Listings */}
        <div className="flex-1 overflow-auto p-4 select-text">
          {isCreatingFile && (
            <div className="mb-4 p-3 bg-slate-900 border border-blue-500/40 rounded-xl max-w-sm flex gap-3 items-center">
              <input
                type="text"
                placeholder="filename.txt (e.g. log.txt)"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFile()}
                className="bg-slate-950 border border-slate-850 rounded px-2 py-1 text-xs text-slate-200 outline-none flex-1 font-mono"
                autoFocus
              />
              <button
                onClick={handleCreateFile}
                className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded font-medium hover:bg-blue-500 transition-colors cursor-pointer"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreatingFile(false);
                  setNewFileName('');
                }}
                className="p-1 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {isCreatingFolder && (
            <div className="mb-4 p-3 bg-slate-900 border border-teal-500/40 rounded-xl max-w-sm flex gap-3 items-center animate-fade-in">
              <input
                type="text"
                placeholder="folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                className="bg-slate-950 border border-slate-850 rounded px-2 py-1 text-xs text-slate-200 outline-none flex-1 font-mono"
                autoFocus
              />
              <button
                onClick={handleCreateFolder}
                className="px-2.5 py-1 text-xs bg-teal-600 text-white rounded font-medium hover:bg-teal-500 transition-colors cursor-pointer"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreatingFolder(false);
                  setNewFolderName('');
                }}
                className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {currentItems.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-slate-500 text-xs">
              <Folder className="w-8 h-8 text-slate-700 mb-2.5 stroke-1" />
              <span>This folder is empty.</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {currentItems.map((item) => {
                const isDir = item.type === 'directory';
                const isSelected = selectedPath === item.path;

                return (
                  <div
                    key={item.path}
                    onClick={() => setSelectedPath(item.path)}
                    onDoubleClick={() => 
                      isDir 
                        ? handleFolderDoubleClick(item.path) 
                        : handleFileDoubleClick(item)
                    }
                    className={`p-3 rounded-xl flex flex-col items-center text-center cursor-pointer border transition-all ${
                      isSelected 
                        ? 'bg-blue-600/15 border-blue-500/40 text-white' 
                        : 'bg-slate-900/20 border-slate-800/30 hover:bg-slate-900/40 hover:border-slate-800 text-slate-300'
                    }`}
                  >
                    {isDir ? (
                      <Folder className="w-10 h-10 text-blue-400 mb-2 fill-blue-500/5 drop-shadow-[0_2px_4px_rgba(59,130,246,0.15)]" />
                    ) : (
                      <FileText className="w-10 h-10 text-emerald-400 mb-2 fill-emerald-500/5 drop-shadow-[0_2px_4px_rgba(16,185,129,0.15)]" />
                    )}
                    <span className="text-xs font-medium truncate w-full px-1 select-none font-sans">
                      {item.name}
                    </span>
                    {!isDir && (
                      <span className="text-[9px] text-slate-500 font-mono mt-0.5">
                        {Math.ceil((item.content?.length || 0) / 100) * 100} B
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Code Editor Modal (for virtual text files) */}
      {editingFile && (
        <div className="absolute inset-0 bg-black/65 flex items-center justify-center p-6 z-30 backdrop-blur-sm select-text">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[85%]">
            {/* Header */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-slate-300">{editingFile.path}</span>
              </div>
              <button 
                onClick={() => setEditingFile(null)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 p-4 bg-[#03050a] overflow-auto">
              <textarea
                value={editingFile.content}
                onChange={(e) => setEditingFile({ ...editingFile, content: e.target.value })}
                className="w-full h-80 bg-transparent text-xs text-emerald-300 font-mono outline-none resize-none leading-relaxed"
                spellCheck="false"
              />
            </div>

            {/* Actions Footer */}
            <div className="bg-slate-950 px-4 py-3 border-t border-slate-800/80 flex justify-between items-center">
              <span className="text-[10px] text-slate-500 font-mono uppercase">
                Encrypted Sandbox Storage derived
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingFile(null)}
                  className="px-3 py-1.5 text-xs bg-slate-900 hover:bg-slate-850 text-slate-300 rounded font-medium border border-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditedFile}
                  className="px-3.5 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-black font-semibold rounded flex items-center gap-1 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
