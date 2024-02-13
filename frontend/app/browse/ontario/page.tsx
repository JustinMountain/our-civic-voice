"use client"

import { RepColumns } from "@/components/ui/rep-table/columns"
import { getDataForRepTable } from "@/components/ui/rep-table/rep-table";
import RepTable from "@/components/ui/rep-table/rep-table";
import { ONTARIO_REPRESENTATIVE_ENDPOINT } from "@/config/constants";
import HeroComponent from "@/components/ui/hero/hero";
import MainForm from "@/components/ui/hero/main-form";
import Footer from "@/components/ui/chrome/footer";

export default async function OntarioRepresentatives() {
  const data: RepColumns[] = await getDataForRepTable(ONTARIO_REPRESENTATIVE_ENDPOINT)

  return (
    <div className="mx-auto p-0">
      <HeroComponent title="Browse Ontario Reps">
        <MainForm />
      </HeroComponent>

      <RepTable data={data} />

      <Footer />
    </div>
  )
}
