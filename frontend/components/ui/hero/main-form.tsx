"use client"
 
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
import { Input } from "@/components/ui/input"

const concerns = [
  { label: "Climate Change and Environmental Protection", level: "all", key: 1},
  { label: "Healthcare Access and Affordability", level: "provterr", key: 2},
  { label: "Education Reform", level: "provterr", key: 3},
  { label: "Economic Inequality", level: "all", key: 4},
  { label: "Women's Rights and Reproductive Health", level: "provterr", key: 5},
  { label: "LGBTQ+ Rights", level: "fedprov", key: 6},
  { label: "Racial Justice and Equality", level: "provterr", key: 7},
  { label: "Housing", level: "all", key: 8},
  { label: "Infrastructure Investment", level: "provmun", key: 9},
  { label: "Opioid Crisis and Drug Policy", level: "all", key: 10},
  { label: "Foreign Policy and National Security", level: "fed", key: 11},
  { label: "Government Spending", level: "all", key: 12},
  { label: "Public Health", level: "all", key: 13},
  { label: "Small Business Support and Entrepreneurship", level: "provmun", key: 14},
  { label: "Cultural and Historical Preservation", level: "provmun", key: 15},
  { label: "Food Security and Agriculture", level: "provmun", key: 16},
  { label: "Indigenous Peoples' Rights and Reconciliation", level: "fedprov", key: 17},
  { label: "Technology and Privacy", level: "fed", key: 18},
  { label: "Immigration and Refugee Policies", level: "fed", key: 19},
  { label: "Mental Health Services", level: "provterr", key: 20},
  { label: "Renewable Energy and Sustainability", level: "fedprov", key: 21},
  { label: "Science and Research Funding", level: "fedprov", key: 22},
  { label: "Youth Employment and Opportunities", level: "provmun", key: 23},
  { label: "Electoral Reform", level: "all", key: 24},
  { label: "Digital Infrastructure and Access", level: "fed", key: 25},
  { label: "Cybersecurity and National Safety", level: "fed", key: 26},
  { label: "Public Transportation and Mobility", level: "mun", key: 27}
] as const;
  
const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const
 
const formSchema = z.object({
  concern: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  language: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})
 
export default function MainForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      concern: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-muted p-8 rounded-xl mx-4 
                                                              md:min-w-96">
        <FormField
          control={form.control}
          name="concern"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>What is your concern?</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? concerns.find(
                            (concern) => concern.label === field.value
                          )?.label
                        : "Select concern"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search concerns..."
                      className="h-9"
                    />
                    <CommandEmpty>Nothing found.</CommandEmpty>
                    <CommandGroup>
                      {concerns.map((concern) => (
                        <CommandItem
                          value={concern.label}
                          key={concern.key}
                          onSelect={() => {
                            form.setValue("concern", concern.label)

                            let level: string;
                            let description: string;
                            let nextQuestion: string;

                            switch (concern.level) {
                              case 'fed':
                                level = 'Federal';
                                description = concern.label + " is a " + level + " issue."
                                nextQuestion = "Select the Federal constituency you live in:";
                                break;
                              case 'provterr':
                                level = 'Provincial/Territorial';
                                description = concern.label + " is a " + level + " issue."
                                nextQuestion = "Select the Provincial/Territorial constituency you live in:";
                                break;
                              case 'mun':
                                level = 'Municipal';
                                description = concern.label + " is a " + level + " issue, which unfortunately aren't currently supported.\n\nSearch for your municipal representatives or select another concern."
                                nextQuestion = "";
                                break;
                              case 'all':
                                level = 'All Levels';
                                description = concern.label + " can be effected by all levels of government."
                                nextQuestion = "Choose the Federal or Provincial/Territorial constituency you live in:";
                                break;
                              case 'fedprov':
                                level = 'Federal and Provincial/Territorial';
                                description = concern.label + " is a " + level + " issue."
                                nextQuestion = "Select the Federal or Provincial/Territorial constituency you live in:";
                                break;
                              case 'provmun':
                                level = 'Provincial/Territorial and Municipal';
                                description = concern.label + " is a " + level + " issue.\n\nUnfortunately Municipal issues aren't currently supported, please select your Provincial/Territorial or search for your municipal representatives."
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







































                          }}
                        >
                          {concern.label}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              concern.label === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div id="level_guide" className="hidden text-sm">
          Placeholder
        </div>

        <div id="constituency_input" className="hidden">
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Where do you live?</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? languages.find(
                              (language) => language.value === field.value
                            )?.label
                          : "Select constituency"}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search constituencies..."
                        className="h-9"
                      />
                      <CommandEmpty>Nothing found.</CommandEmpty>
                      <CommandGroup>
                        {languages.map((language) => (
                          <CommandItem
                            value={language.label}
                            key={language.value}
                            onSelect={() => {
                              form.setValue("language", language.value)
                            }}
                          >
                            {language.label}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                language.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  )
}
