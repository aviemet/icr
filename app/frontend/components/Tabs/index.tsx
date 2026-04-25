import { Tabs as MantineTabs, type TabsProps } from "@mantine/core"
import clsx from "clsx"

import { TabLink } from "./TabLink"
import * as classes from "./Tabs.css"
import { UrlTabs } from "./UrlTabs"

export interface ITabsComponentProps extends TabsProps {
	urlControlled?: boolean
	dependencies?: Record<string, string | string[]>
}

export function Tabs({ children, urlControlled = false, className, ...props }: ITabsComponentProps) {
	return urlControlled ?
		<UrlTabs className={ clsx(className, classes.tabs) } { ...props }>{ children }</UrlTabs>
		:
		<MantineTabs className={ clsx(className, classes.tabs) } { ...props }>{ children }</MantineTabs>
}

Tabs.List = MantineTabs.List
Tabs.Tab = MantineTabs.Tab
Tabs.Link = TabLink
Tabs.Panel = MantineTabs.Panel
