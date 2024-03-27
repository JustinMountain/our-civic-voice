"use client"

import RepTable from "@/components/ui/rep-table/rep-table";
import { ALL_REPRESENTATIVE_ENDPOINT } from "@/config/constants";
import HeroComponent from "@/components/ui/hero/hero";
import FormUserflow from "@/components/ui/concern-form/form-userflow";
import Footer from "@/components/ui/chrome/footer";

export default async function Representatives() {
  return (
    <div className="mx-auto p-0">
      <HeroComponent title="Our Civic Voice">
        <FormUserflow />
      </HeroComponent>

      <RepTable path={ALL_REPRESENTATIVE_ENDPOINT} />

      <Footer />
    </div>
  )
}
