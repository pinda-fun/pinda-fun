import React from 'react';
import { List, ListProps } from 'react-virtualized/dist/es/List';
import { WindowScroller } from 'react-virtualized/dist/es/WindowScroller';
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';

type WindowScrollVirtualizedListProps = Omit<ListProps, 'width' | 'height'>;

const WindowScrollVirtualizedList: React.FC<WindowScrollVirtualizedListProps> = ({
  rowCount,
  rowHeight,
  rowRenderer,
  scrollToIndex,
}) => (
  <WindowScroller>
    {({
      height, isScrolling, onChildScroll, scrollTop,
    }) => (
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
