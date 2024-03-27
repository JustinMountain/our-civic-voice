"use client"
import * as React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

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

export default function FormUserflow() {
  // Define the form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      concern: "",
    },
  })

  // Create on submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }
  
  // const data = await getDataConcernForm();
  
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-muted p-8 rounded-xl mx-4 
                                                                md:min-w-96">
          <FormField
            control={form.control}
            name="concern"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>What is your concern?</FormLabel>

                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between"
                      )}
                    >
                    {value
                      ? concerns.find((concern) => concern.label === value)?.label
                        : "Select concern"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0
                                              md:min-w-96">
                    <Command>
                      <CommandInput
                        placeholder="Search concerns..."
                        className="h-9"
                      />
                      <CommandEmpty>Nothing found.</CommandEmpty>
                      <ScrollArea className="h-64">
                        <CommandGroup>
                          {concerns.map((concern) => (
                            <CommandItem
                              value={concern.label}
                              key={concern.concern_id}
                              onSelect={() => {
                                form.setValue("concern", concern.label);
                                setOpen(false);

                                let level: string;
                                let description: string;
                                let nextQuestion: string;

                                switch (concern.level) {
                                  case 'fed':
                                    level = 'Federal';
                                    description = concern.label + " is primarily a " + level + " issue."
                                    nextQuestion = "Select the Federal constituency you live in:";
                                    break;
                                  case 'provterr':
                                    level = 'Provincial/Territorial';
                                    description = concern.label + " is primarily a " + level + " issue."
                                    nextQuestion = "Select the Provincial/Territorial constituency you live in:";
                                    break;
                                  case 'mun':
                                    level = 'Municipal';
                                    description = concern.label + " is primarily a " + level + " issue, which unfortunately aren't currently supported.\n\nPlease select another concern."
                                    nextQuestion = "";
                                    break;
                                  case 'all':
                                    level = 'All Levels';
                                    description = concern.label + " can be effected by all levels of government."
                                    nextQuestion = "Choose the Federal or Provincial/Territorial constituency you live in:";
                                    break;
                                  case 'fedprov':
                                    level = 'Federal and Provincial/Territorial';
                                    description = concern.label + " is primarily a " + level + " issue."
                                    nextQuestion = "Select the Federal or Provincial/Territorial constituency you live in:";
                                    break;
                                  case 'provmun':
                                    level = 'Provincial/Territorial and Municipal';
                                    description = concern.label + " is primarily a " + level + " issue.\n\nUnfortunately Municipal issues aren't currently supported, please select your Provincial/Territorial or search for your municipal representatives."
                                    nextQuestion = "Which " + level + "constituency do you live in?";
                                    break;
                                  default:
                                    level = 'Unknown Level';
                                    description = 'Unknown Description';
                                    nextQuestion = 'Unknown Question';
                                }

                                // Alters the paragraph text
                                const levelGuide = document.getElementById("level_guide");
                                const constituencyInput = document.getElementById("constituency_input");

                                levelGuide!.classList.remove("hidden")
                                levelGuide!.innerText = description;

                                constituencyInput!.classList.remove("hidden")
                                constituencyInput!.getElementsByTagName("label")[0].innerText = nextQuestion;


                                // Need to create a map for all of the constituencies which gets dynamically populated based on the level of the concern, the send button then redirects to the appropriate page


                                // Create a call for the list from the DB above as const
                                // Create a variable to store the mapped version of this
                                // On select from the first part of the form, map the variable to the appropriate subset
                                // This subset is used to populate the second part of the form which is now revealed

                                // Need case for municipal to not show second question



































                              }}
                            >
                              {concern.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>

                      </ScrollArea>
                    </Command>
                  </PopoverContent>
                </Popover>
                </FormItem>
              )}
            />

        </form>
      </Form>
      {/* <SubmitForm level="federal" data={data} /> */}

    </>
  )
}
