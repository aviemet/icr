import { router } from "@inertiajs/react"
import { ActionIcon, Checkbox, Menu, Tooltip } from "@mantine/core"
import { useTranslation } from "react-i18next"

import { DownArrowIcon } from "@/components/Icons"
import { Routes } from "@/lib"

import * as classes from "./EmployeeIndexScopeMenu.css"
import { employeeServerFilterOnly } from "./employeeTableFilters"

export type WorkforceView = "employed" | "terminated" | "all"

export interface EmployeeIndexScopeMenuProps {
	value: WorkforceView
}

export function EmployeeIndexScopeMenu({ value }: EmployeeIndexScopeMenuProps) {
	const { t } = useTranslation()
	const showTerminated = value === "terminated"
	const showAll = value === "all"

	const visit = (nextView: WorkforceView) => {
		const params = new URLSearchParams(window.location.search)
		params.delete("page")
		params.delete("workforce_view")
		if(nextView !== "employed") {
			params.set("workforce_view", nextView)
		}

		const query = params.toString()
		router.get(query === "" ? Routes.employees() : `${Routes.employees()}?${query}`, {}, {
			preserveState: true,
			preserveScroll: true,
			replace: true,
			only: employeeServerFilterOnly,
		})
	}

	const toggleTerminated = () => {
		visit(showTerminated ? "employed" : "terminated")
	}

	const toggleAll = () => {
		visit(showAll ? "employed" : "all")
	}

	return (
		<Menu shadow="md" width={ 240 } position="bottom-start" withinPortal>
			<Menu.Target>
				<Tooltip label={ t("views.employees.index.scope_menu") } withArrow position="bottom">
					<ActionIcon
						size={ 36 }
						variant="default"
						className={ classes.scopeMenuButton }
						aria-label={ t("views.employees.index.scope_menu") }
					>
						<DownArrowIcon size={ 18 } />
					</ActionIcon>
				</Tooltip>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Item
					closeMenuOnClick={ false }
					onClick={ toggleTerminated }
					leftSection={ (
						<Checkbox
							checked={ showTerminated }
							readOnly
							tabIndex={ -1 }
							aria-hidden
						/>
					) }
				>
					{ t("views.employees.index.show_terminated") }
				</Menu.Item>
				<Menu.Item
					closeMenuOnClick={ false }
					onClick={ toggleAll }
					leftSection={ (
						<Checkbox
							checked={ showAll }
							readOnly
							tabIndex={ -1 }
							aria-hidden
						/>
					) }
				>
					{ t("views.employees.index.show_all_statuses") }
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	)
}
