export const DraggableNode = ({ type, label }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <div
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        className="cursor-grab min-w-[80px] h-[60px] flex items-center justify-center flex-col rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors select-none"
        draggable
      >
        <span className="text-xs font-medium text-white">{label}</span>
      </div>
    );
  };
