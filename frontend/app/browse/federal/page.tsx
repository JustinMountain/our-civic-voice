"use client"

import RepTable from "@/components/ui/rep-table/rep-table";
import { FEDERAL_REPRESENTATIVE_ENDPOINT } from "@/config/constants";
import HeroComponent from "@/components/ui/hero/hero";
import MainForm from "@/components/ui/hero/main-form";
import Footer from "@/components/ui/chrome/footer";

export default async function FederalRepresentatives() {
  return (
    <div className="mx-auto p-0">
      <HeroComponent title="Browse Federal Reps">
        <MainForm />
      </HeroComponent>

      <RepTable path={FEDERAL_REPRESENTATIVE_ENDPOINT} />
      
      <Footer />
    </div>
  )
}
