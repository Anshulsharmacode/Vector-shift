import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
    return (
        <div className="bg-gray-900 border-b border-gray-700 px-4 py-2">
            <div className="flex items-center gap-2">
                <DraggableNode type='customInput' label='Input' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='customOutput' label='Output' />
                <DraggableNode type='text' label='Text' />
                <DraggableNode type='parseJson' label='Parse JSON' />
            </div>
        </div>
    );
};
