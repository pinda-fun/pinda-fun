import React from 'react';
import {
  List,
  WindowScroller,
  AutoSizer,
  ListProps,
} from 'react-virtualized';

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
