"use client"

import { RepColumns } from "@/components/ui/rep-table/columns"
import { getDataForRepTable } from "@/components/ui/rep-table/rep-table";
import RepTable from "@/components/ui/rep-table/rep-table";
import { FEDERAL_REPRESENTATIVE_ENDPOINT } from "@/config/constants";
import HeroComponent from "@/components/ui/hero/hero";
import MainForm from "@/components/ui/hero/main-form";
import Footer from "@/components/ui/chrome/footer";

export default async function FederalRepresentatives() {
  const data: RepColumns[] = await getDataForRepTable(FEDERAL_REPRESENTATIVE_ENDPOINT)

  return (
    <div className="mx-auto p-0">
      <HeroComponent title="Browse Federal Reps">
        <MainForm />
      </HeroComponent>

      <RepTable data={data} />
      
      <Footer />
    </div>
  )
}
