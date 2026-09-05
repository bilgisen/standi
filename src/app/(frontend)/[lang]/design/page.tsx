"use client"

import { SubPageHero } from "../../components/SubPageHero"
import DS from "../../components/DS"

export default function DesignPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SubPageHero heroKey="design" />
      <DS />
    </div>
  )
}
