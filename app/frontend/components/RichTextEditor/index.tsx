import { RichTextEditor as MantineRTE, Link, type RichTextEditorProps as MantineRTEProps } from "@mantine/tiptap"
import Highlight from "@tiptap/extension-highlight"
import SubScript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import { useEditor } from "@tiptap/react"
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus"
import StarterKit from "@tiptap/starter-kit"
import React from "react"

import { DEFAULT_LABELS } from "./tiptapLabels"

export interface RichTextEditorProps extends Omit<MantineRTEProps, "children" | "editor" | "onChange"> {
	ref?: React.Ref<HTMLDivElement>
	children?: string
	onChange?: (value: string) => void
}

export function RichTextEditor({ children, onChange, ref }: RichTextEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			Link,
			Superscript,
			SubScript,
			Highlight,
			TextAlign.configure({ types: ["heading", "paragraph"] }),
		],
		content: children,
		onUpdate: ({ editor }) => {
			onChange?.(editor.getHTML())
		},
	})

	return (
		<MantineRTE
			ref={ ref }
			editor={ editor }
			labels={ DEFAULT_LABELS }
		>
			<MantineRTE.Toolbar sticky stickyOffset={ 60 }>
				<MantineRTE.ControlsGroup>
					<MantineRTE.Bold />
					<MantineRTE.Italic />
					<MantineRTE.Underline />
					<MantineRTE.Strikethrough />
					<MantineRTE.ClearFormatting />
					<MantineRTE.Highlight />
					<MantineRTE.Code />
				</MantineRTE.ControlsGroup>

				<MantineRTE.ControlsGroup>
					<MantineRTE.H1 />
					<MantineRTE.H2 />
					<MantineRTE.H3 />
					<MantineRTE.H4 />
				</MantineRTE.ControlsGroup>

				<MantineRTE.ControlsGroup>
					<MantineRTE.Blockquote />
					<MantineRTE.Hr />
					<MantineRTE.BulletList />
					<MantineRTE.OrderedList />
					<MantineRTE.Subscript />
					<MantineRTE.Superscript />
				</MantineRTE.ControlsGroup>

				<MantineRTE.ControlsGroup>
					<MantineRTE.Link />
					<MantineRTE.Unlink />
				</MantineRTE.ControlsGroup>

				<MantineRTE.ControlsGroup>
					<MantineRTE.AlignLeft />
					<MantineRTE.AlignCenter />
					<MantineRTE.AlignJustify />
					<MantineRTE.AlignRight />
				</MantineRTE.ControlsGroup>
			</MantineRTE.Toolbar>

			{ editor && (
				<BubbleMenu editor={ editor }>
					<MantineRTE.ControlsGroup>
						<MantineRTE.Bold />
						<MantineRTE.Italic />
						<MantineRTE.Link />
					</MantineRTE.ControlsGroup>
				</BubbleMenu>
			) }

			{ editor && (
				<FloatingMenu editor={ editor }>
					<MantineRTE.ControlsGroup>
						<MantineRTE.H1 />
						<MantineRTE.H2 />
						<MantineRTE.BulletList />
					</MantineRTE.ControlsGroup>
				</FloatingMenu>
			) }
			<MantineRTE.Content />
		</MantineRTE>
	)
}
