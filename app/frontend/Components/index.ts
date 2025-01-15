export { default as AddressDisplay } from './AddressDisplay'
export { default as Button } from './Button'
export * from './Button'
export { default as Calendar } from './Calendar'
export { default as ConditionalWrapper } from './ConditionalWrapper'
export { default as DangerousHtml } from './DangerousHtml'
export { default as DateTimeDisplay } from './DateTimeDisplay'
export { default as EmailDisplay } from './EmailDisplay'
export { default as Flash } from './Flash'
export { default as Heading } from './Heading'
export { default as Link, NavLink, type NavLinkProps } from './Link'
export { default as Menu } from './Menu'
export { default as Money } from './Money'
export { default as Modal } from './Modal'
export { default as Page, type PageProps } from './Page'
export { default as PhoneNumber } from './PhoneNumber'
export { default as RichTextEditor } from './RichTextEditor'
export { default as Section } from './Section'
export { default as Table } from './Table'
export { default as Label } from './Label'
export { default as Tabs } from './Tabs'

// Export UI library components as a proxy to allow easy refactoring
export {
	ActionIcon, type ActionIconProps,
	Anchor, type AnchorProps,
	AppShell, type AppShellProps,
	Avatar, type AvatarProps,
	Badge, type BadgeProps,
	Box, type BoxProps,
	Burger, type BurgerProps,
	Card, type CardProps,
	Center, type CenterProps,
	Container, type ContainerProps,
	Divider, type DividerProps,
	Flex, type FlexProps,
	Grid, type GridProps,
	Group, type GroupProps,
	Image, type ImageProps,
	List, type ListProps,
	Paper, type PaperProps,
	Popover, type PopoverProps,
	SimpleGrid, type SimpleGridProps,
	Slider, type SliderProps,
	Skeleton, type SkeletonProps,
	Stack, type StackProps,
	Text, type TextProps,
	Title, type TitleProps,
	Tooltip, type TooltipProps,
	ThemeIcon, type ThemeIconProps,
	Transition, type TransitionProps,
} from '@mantine/core'

export * as Flags from 'mantine-flagpack'
