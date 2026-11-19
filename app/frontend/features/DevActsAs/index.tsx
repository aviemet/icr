import { router } from "@inertiajs/react"
import { Drawer, Stack, Text, Button, Group, UnstyledButton } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import clsx from "clsx"

import { UserSettingsIcon } from "@/components/Icons"
import { Routes } from "@/lib"
import { usePageProps } from "@/lib/hooks"

import * as classes from "./DevActsAs.css"

type ActsAsCandidate = {
	id: string
	email: string
	name: string | null
	agency_role: string | null
	job_title: string | null
}

function candidateLabel(candidate: ActsAsCandidate) {
	const roleParts = [candidate.agency_role, candidate.job_title].filter(Boolean)
	return roleParts.length > 0 ? roleParts.join(" / ") : "User"
}

export function DevActsAs() {
	const { auth } = usePageProps()
	const actsAs = auth.acts_as
	const [opened, { open, close }] = useDisclosure(false)

	if(!actsAs) return null

	const actingUser = actsAs.acting_user
	const activeCandidateId = actingUser?.id

	const startActsAs = (userId: string) => {
		router.post(Routes.devActsAs(), { user_id: userId }, {
			preserveScroll: true,
			onSuccess: () => close(),
		})
	}

	const stopActsAs = () => {
		router.delete(Routes.devActsAs(), {
			preserveScroll: true,
			onSuccess: () => close(),
		})
	}

	return (
		<>
			{ actsAs.active && actingUser && (
				<div className={ classes.banner }>
					<Text size="sm">
						Acting as { actingUser.name || actingUser.email }
						{ actingUser.agency_role ? ` (${candidateLabel(actingUser)})` : "" }
					</Text>
					<Button size="compact-sm" variant="light" color="yellow" onClick={ stopActsAs }>
						Stop
					</Button>
				</div>
			) }

			<button
				type="button"
				className={ clsx(classes.fab, actsAs.active && classes.fabActive) }
				onClick={ open }
				aria-label="Dev acts as"
			>
				<UserSettingsIcon size={ 20 } />
			</button>

			<Drawer
				opened={ opened }
				onClose={ close }
				position="right"
				title="Act as user"
				padding="md"
			>
				<Stack gap="sm">
					{ actsAs.active && (
						<Group justify="space-between">
							<Text size="sm" c="dimmed">
								Signed in as { actsAs.true_user.name || actsAs.true_user.email }
							</Text>
							<Button size="compact-sm" variant="default" onClick={ stopActsAs }>
								Stop acting as
							</Button>
						</Group>
					) }

					{ actsAs.candidates.map(candidate => (
						<UnstyledButton
							key={ candidate.id }
							className={ clsx(
								classes.candidateRow,
								candidate.id === activeCandidateId && classes.candidateRowActive,
							) }
							onClick={ () => {
								if(candidate.id === actsAs.true_user.id) {
									stopActsAs()
								} else {
									startActsAs(candidate.id)
								}
							} }
						>
							<div>
								<Text size="sm" fw={ 600 }>
									{ candidate.name || candidate.email }
								</Text>
								<Text size="xs" c="dimmed">
									{ candidate.email }
								</Text>
								<Text size="xs" c="dimmed">
									{ candidateLabel(candidate) }
								</Text>
							</div>
							<Text size="xs" c="dimmed">
								{ candidate.id === activeCandidateId ? "Active" : "Act as" }
							</Text>
						</UnstyledButton>
					)) }
				</Stack>
			</Drawer>
		</>
	)
}
