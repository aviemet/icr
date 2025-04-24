import { Tabs, type TabsProps } from "@mantine/core"
import clsx from "clsx"

import TabLink from "./TabLink"
import * as classes from "./Tabs.css"
import UrlTabs from "./UrlTabs"

export interface ITabsComponentProps extends TabsProps {
	urlControlled?: boolean
	dependencies?: Record<string, string | string[]>
}

const TabsComponent = ({ children, urlControlled = false, className, ...props }: ITabsComponentProps) => {
	return urlControlled ?
		<UrlTabs className={ clsx(className, classes.tabs) } { ...props }>{ children }</UrlTabs>
		:
		<Tabs className={ clsx(className, classes.tabs) } { ...props }>{ children }</Tabs>
}

TabsComponent.List = Tabs.List
TabsComponent.Tab = Tabs.Tab
TabsComponent.Link = TabLink
TabsComponent.Panel = Tabs.Panel

export default TabsComponent
