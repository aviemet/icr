import { Routes } from '@/lib'
import { Table, Link } from '@/Components'
import { EditButton } from '@/Components/Button'
import { type TableProps } from '@/Components/Table/Table'

const SettingTable = (props: TableProps) => {
	return (
		<Table>
			<Table.Head>
				<Table.Row>
					<Table.HeadCell sort="singelton_guard">Singelton_guard</Table.HeadCell>
					<Table.HeadCell sort="data">Data</Table.HeadCell>
					<Table.HeadCell className="actions">Actions</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (setting: Schema.SettingsIndex) => (
					<Table.Row key={ setting.id }>
						<Table.Cell>
							<Link href={ Routes.setting(setting.id) }>{ setting.singelton_guard }</Link>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.setting(setting.id) }>{ setting.data }</Link>
						</Table.Cell>
						<Table.Cell>
							<EditButton href={ Routes.editSetting(setting.id) } />
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default SettingTable
