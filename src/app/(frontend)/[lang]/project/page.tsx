"use client"

import { SubPageHero } from "../../components/SubPageHero"
import PM from "../../components/PM"

export default function ProjectPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SubPageHero heroKey="projects" />
      <PM />
    </div>
  )
}
