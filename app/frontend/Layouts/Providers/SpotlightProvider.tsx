import React, { useEffect, useState } from 'react'
import { SpotlightProvider as MantineSpotlightProvider } from '@mantine/spotlight'
import type { SpotlightAction } from '@mantine/spotlight'
import { router } from '@inertiajs/react'
import { Routes } from '@/lib'
import axios from 'axios'
import { Loader } from '@mantine/core'

const SpotlightProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			{ children }
		</>
	)
}

export default SpotlightProvider
