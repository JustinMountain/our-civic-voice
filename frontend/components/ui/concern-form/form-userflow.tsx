"use client"
import * as React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import SubmitForm from "@/components/ui/concern-form/submit-form"
import { RepTableColumns } from "@/components/ui/rep-table/columns"
import { RepInfo, Concern } from "@/components/data-layer/interfaces"
import { getRepInfo } from "@/components/data-layer/get-representatives"
import { ALL_REPRESENTATIVE_ENDPOINT } from "@/config/constants";

const concerns: Concern[] = [
  { label: "Climate Change and Environmental Protection", level: "all", concern_id: 1},
  { label: "Healthcare Access and Affordability", level: "provterr", concern_id: 2},
  { label: "Education Reform", level: "provterr", concern_id: 3},
  { label: "Economic Inequality", level: "all", concern_id: 4},
  { label: "Women's Rights and Reproductive Health", level: "provterr", concern_id: 5},
  { label: "LGBTQ+ Rights", level: "fedprov", concern_id: 6},
  { label: "Racial Justice and Equality", level: "provterr", concern_id: 7},
  { label: "Housing", level: "all", concern_id: 8},
  { label: "Infrastructure Investment", level: "provmun", concern_id: 9},
  { label: "Opioid Crisis and Drug Policy", level: "all", concern_id: 10},
  { label: "Foreign Policy and National Security", level: "fed", concern_id: 11},
  { label: "Government Spending", level: "all", concern_id: 12},
  { label: "Public Health", level: "all", concern_id: 13},
  { label: "Small Business Support and Entrepreneurship", level: "provmun", concern_id: 14},
  { label: "Cultural and Historical Preservation", level: "provmun", concern_id: 15},
  { label: "Food Security and Agriculture", level: "provmun", concern_id: 16},
  { label: "Indigenous Peoples' Rights and Reconciliation", level: "fedprov", concern_id: 17},
  { label: "Technology and Privacy", level: "fed", concern_id: 18},
  { label: "Immigration and Refugee Policies", level: "fed", concern_id: 19},
  { label: "Mental Health Services", level: "provterr", concern_id: 20},
  { label: "Renewable Energy and Sustainability", level: "fedprov", concern_id: 21},
  { label: "Science and Research Funding", level: "fedprov", concern_id: 22},
  { label: "Youth Employment and Opportunities", level: "provmun", concern_id: 23},
  { label: "Electoral Reform", level: "all", concern_id: 24},
  { label: "Digital Infrastructure and Access", level: "fed", concern_id: 25},
  { label: "Cybersecurity and National Safety", level: "fed", concern_id: 26},
  { label: "Public Transportation and Mobility", level: "mun", concern_id: 27}
] as const;

const formSchema = z.object({
  concern: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  language: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})
 
async function getDataConcernForm(): Promise<RepTableColumns[]> {
  try {
    const repArray: RepTableColumns[] = [];
    const allReps = await getRepInfo(ALL_REPRESENTATIVE_ENDPOINT);

    // For each row, adapt to the columns interface
    allReps.forEach((row: RepInfo) => {
      const thisRep: RepTableColumns = {
        member_id: `${row.memberId}`,
        name: `${row.firstName} ${row.lastName}`,
        constituency: `${row.constituency}`,
        province_territory: `${row.provinceTerritory}`,
        party: `${row.party}`,
        gov_level: `${row.govLevel}`,
      }
      repArray.push(thisRep);
    });

    return repArray;
  } catch (error) {
    console.error(`Could not GET from /${ALL_REPRESENTATIVE_ENDPOINT}`);
    throw error; 
  }
}

export default async function MainForm() {
  const data = await getDataConcernForm();
  
  return (
    <>
      <SubmitForm level="federal" data={data} />
    </>
  )
}
