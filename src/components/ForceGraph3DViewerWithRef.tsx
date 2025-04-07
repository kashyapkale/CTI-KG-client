'use client';
import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import type { GraphViewerRef, Props as ForceGraph3DViewerProps } from '@/components/ForceGraph3DViewer';

const DynamicForceGraph3DViewer = dynamic(
    () => import('@/components/ForceGraph3DViewer'),
    { ssr: false }
) as React.ForwardRefExoticComponent<
    ForceGraph3DViewerProps & React.RefAttributes<GraphViewerRef>
>;

const ForceGraph3DViewerWithRef = forwardRef<GraphViewerRef, ForceGraph3DViewerProps>(
    function ForceGraph3DViewerWithRef(props, ref) {
        return <DynamicForceGraph3DViewer {...props} ref={ref} />;
    }
);

ForceGraph3DViewerWithRef.displayName = 'ForceGraph3DViewerWithRef';

export default ForceGraph3DViewerWithRef;
