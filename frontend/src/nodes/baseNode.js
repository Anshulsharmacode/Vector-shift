import { Handle } from 'reactflow';

export const BaseNode = ({ id, label, handles = [], children, style = {} }) => {
  return (
    <div
      className="bg-white rounded-lg border border-gray-200 shadow-sm min-w-[200px] overflow-hidden"
      style={style}
    >
      <div className="bg-gray-800 px-4 h-8 flex items-center select-none">
        <span className="text-xs font-semibold text-white uppercase tracking-widest">{label}</span>
      </div>
      <div className="px-4 py-3 space-y-2">
        {children}
      </div>
      {handles.map(({ type, position, id: handleId, style: handleStyle }) => (
        <Handle
          key={handleId}
          type={type}
          position={position}
          id={`${id}-${handleId}`}
          style={handleStyle}
        />
      ))}
    </div>
  );
};
