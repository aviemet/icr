/// <reference types="node" />
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vitest"

import { Routes } from "@/lib"

describe("PersonTable edit action", () => {
	it("targets the settings person edit route", () => {
		expect(Routes.editSettingsPerson("ada-lovelace")).toBe("/settings/people/ada-lovelace/edit")

		const source = readFileSync(
			resolve(dirname(fileURLToPath(import.meta.url)), "../../../../domains/Settings/People/Table.tsx"),
			"utf8",
		)

		expect(source).toContain("Routes.editSettingsPerson(person.slug)")
		expect(source).toContain("EditButton href={ Routes.editSettingsPerson(person.slug) }")
	})
})
