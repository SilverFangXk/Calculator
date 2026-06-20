export function WindowControls() {
  const handleClose = () => {
    if (window.electronAPI?.closeWindow) {
      window.electronAPI.closeWindow();
      return;
    }

    window.close();
  };

  const handleMinimize = () => {
    if (window.electronAPI?.minimizeWindow) {
      window.electronAPI.minimizeWindow();
    }
  };

  return (
    <div className="h-10 flex items-center px-4" style={{ WebkitAppRegion: 'drag' }}>
      <div className="flex gap-2" style={{ WebkitAppRegion: 'no-drag' }}>
        <button
          type="button"
          onClick={handleClose}
          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer"
          aria-label="Close"
        />
        <button
          type="button"
          onClick={handleMinimize}
          className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer"
          aria-label="Minimize"
        />
      </div>
    </div>
  );
}