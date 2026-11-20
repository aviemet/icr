import { router } from "@inertiajs/react"
import { Loader } from "@mantine/core"
import { Spotlight, type SpotlightActionData } from "@mantine/spotlight"
import React, { useMemo, useState } from "react"

import { SearchIcon, DashboardIcon, ClientIcon, EmployeeIcon, SettingsIcon, ClockIcon, HelpingIcon, PeopleIcon } from "@/components/Icons"
import { Routes } from "@/lib"
import { useDebouncedValue, usePermissions } from "@/lib/hooks"
import { useGetSpotlights } from "@/queries"

export function SpotlightComponent() {
	const { can } = usePermissions()

	const [query, setQuery] = useState("")
	const [debouncedQuery] = useDebouncedValue(query, 400)

	const {
		data,
		isLoading,
		isFetching,
		isPending,
		isSuccess,
	} = useGetSpotlights({ q: debouncedQuery })

	const staticActions = useMemo<SpotlightActionData[]>(() => {
		const spotlightStaticActions: SpotlightActionData[] = [
			{
				id: "dashboard",
				label: "Dashboard",
				description: "Go to dashboard",
				onClick: () => router.visit(Routes.root()),
				leftSection: <DashboardIcon />,
			},
		]

		if(can("clients", "index")) {
			spotlightStaticActions.push({
				id: "clients",
				label: "Clients",
				description: "View clients",
				onClick: () => router.visit(Routes.clients()),
				leftSection: <ClientIcon />,
			})
		}

		if(can("employees", "index")) {
			spotlightStaticActions.push({
				id: "employees",
				label: "Employees",
				description: "View employees",
				onClick: () => router.visit(Routes.employees()),
				leftSection: <EmployeeIcon />,
			})
		}

		if(can("employees", "index")) {
			spotlightStaticActions.push({
				id: "applicants",
				label: "Applicants",
				description: "View applicants",
				onClick: () => router.visit(Routes.applicants()),
				leftSection: <EmployeeIcon />,
			})
		}

		if(can("employee/trainings", "index")) {
			spotlightStaticActions.push({
				id: "trainings",
				label: "Employee trainings",
				description: "View employee trainings",
				onClick: () => router.visit(Routes.trainings()),
			})
		}

		if(can("clients_managers", "index")) {
			spotlightStaticActions.push({
				id: "caseloads",
				label: "Caseloads",
				description: "View caseloads",
				onClick: () => router.visit(Routes.caseloads()),
				leftSection: <PeopleIcon />,
			})
		}

		if(can("timesheets", "index")) {
			spotlightStaticActions.push({
				id: "payroll",
				label: "Payroll",
				description: "View payroll",
				onClick: () => router.visit(Routes.payrollPeriods()),
				leftSection: <ClockIcon />,
			})
		}

		if(can("vendors", "index")) {
			spotlightStaticActions.push({
				id: "vendors",
				label: "Vendors",
				description: "View vendors",
				onClick: () => router.visit(Routes.vendors()),
				leftSection: <HelpingIcon />,
			})
		}

		if(can("settings", "index")) {
			spotlightStaticActions.push({
				id: "settings",
				label: "Settings",
				description: "Application settings",
				onClick: () => router.visit(Routes.settings()),
				leftSection: <SettingsIcon />,
			})
		}

		return spotlightStaticActions
	}, [can])

	const handleQueryChange = (value: string) => {
		setQuery(value)
	}

	const remoteActions = useMemo<SpotlightActionData[]>(() => {
		if(!debouncedQuery.trim()) return []
		if(!isSuccess || !data) return []

		return data.map((item): SpotlightActionData => {
			if("first_name" in item) {
				const label =
					item.name
					|| item.full_name
					|| [item.first_name, item.last_name].filter(Boolean).join(" ")
					|| "Unknown"

				const description = (item.type as string).charAt(0).toUpperCase() + (item.type as string).slice(1)

				const visit = () => {
					if("slug" in item && item.type === "employee") router.visit(Routes.employee(item.slug))
					if("slug" in item && item.type === "client") router.visit(Routes.client(item.slug))
					if("slug" in item && item.type === "doctor") router.visit(Routes.doctor(item.slug))
				}

				return {
					id: `${String(item.type)}-${"slug" in item ? item.slug : ""}`,
					label,
					description,
					onClick: visit,
				}
			}

			if("name" in item && "slug" in item && item.type === "household") {
				return {
					id: `household-${item.slug}`,
					label: item.name,
					description: "Household",
					onClick: () => router.visit(Routes.household(item.slug)),
				}
			}

			if("name" in item && "slug" in item && item.type === "vendor") {
				return {
					id: `vendor-${item.slug}`,
					label: item.name,
					description: "Vendor",
					onClick: () => router.visit(Routes.vendor(item.slug)),
				}
			}

			if("id" in item && item.type === "training") {
				return {
					id: `training-${item.id}`,
					label: item.name || "Training",
					description: "Training",
					onClick: () => router.visit(Routes.training(item.id)),
				}
			}

			return {
				id: "unknown",
				label: "Unknown",
				description: "",
				onClick: () => {},
			}
		})
	}, [debouncedQuery, isSuccess, data])

	const actions = useMemo<SpotlightActionData[]>(() => {
		if(!debouncedQuery.trim()) return staticActions
		return [...staticActions, ...remoteActions]
	}, [staticActions, remoteActions, debouncedQuery])

	const loadingWhileTyping = !!query.trim() && debouncedQuery !== query
	const loading = loadingWhileTyping || isLoading || isFetching || isPending

	return (
		<Spotlight
			query={ query }
			onQueryChange={ handleQueryChange }
			actions={ actions }
			nothingFound={ loading ? <Loader size="sm" /> : "No results" }
			highlightQuery
			searchProps={ {
				leftSection: <SearchIcon />,
				placeholder: "Search pages...",
			} }
		/>
	)
}
