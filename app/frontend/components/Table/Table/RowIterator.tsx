import { Cell } from "./Cell"
import { Row } from "./Row"
import { useTableDataContext } from "./TableDataContext"

interface RowIteratorProps<T> {
	children: (item: T, index: number) => React.ReactNode
}

export function RowIterator<T = unknown>({ children }: RowIteratorProps<T>) {
	const { data, emptyMessage, headCellCount } = useTableDataContext()

	if(data.length === 0) {
		return (
			<Row>
				<Cell colSpan={ Math.max(1, headCellCount) } align="center">
					{ emptyMessage }
				</Cell>
			</Row>
		)
	}

	return <>{ data.map((item, index) => children(item as T, index)) }</>
}
