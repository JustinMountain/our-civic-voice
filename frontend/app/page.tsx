"use client"

import RepTable from "@/components/ui/rep-table/rep-table";
import { ALL_REPRESENTATIVE_ENDPOINT } from "@/config/constants";
import HeroComponent from "@/components/ui/hero/hero";
import MainForm from "@/components/ui/hero/main-form";
import Footer from "@/components/ui/chrome/footer";

export default async function Representatives() {
  return (
    <div className="mx-auto p-0">
      <HeroComponent title="Our Civic Voice">
        <MainForm />
      </HeroComponent>

      <RepTable path={ALL_REPRESENTATIVE_ENDPOINT} />

      <Footer />
    </div>
  )
}
