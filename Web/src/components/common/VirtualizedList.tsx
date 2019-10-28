import React from 'react';
import {
  List,
  Index,
  WindowScroller,
  ListRowRenderer,
  AutoSizer,
} from 'react-virtualized';

type VirtualizedListProps = {
  overscanRowCount?: number;
  noRowsRenderer?: () => JSX.Element;
  rowCount: number;
  rowHeight:
    | number
    | (number & ((info: Index) => number))
    | (((params: Index) => number) & number)
    | (((params: Index) => number) & ((info: Index) => number));
  rowRenderer: ListRowRenderer;
  scrollToIndex?: number;
};

const WindowScrollVirtualizedList: React.FC<VirtualizedListProps> = ({
  rowCount,
  rowHeight,
  rowRenderer,
  scrollToIndex,
}) => (
  <WindowScroller>
    {({ height, isScrolling, onChildScroll, scrollTop }) => (
      <AutoSizer disableHeight>
        {({ width }) => (
          <List
            autoHeight
            height={height}
            isScrolling={isScrolling}
            onScroll={onChildScroll}
            rowCount={rowCount}
            rowHeight={rowHeight}
            rowRenderer={rowRenderer}
            scrollTop={scrollTop}
            scrollToIndex={scrollToIndex}
            width={width}
          />
        )}
      </AutoSizer>
    )}
  </WindowScroller>
);

export { WindowScrollVirtualizedList };
