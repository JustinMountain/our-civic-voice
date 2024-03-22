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
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RepTableColumns } from "@/components/ui/rep-table/columns"

const formSchema = z.object({
  concern: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  constituency: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})
 
export default function SubmitForm(props: {level: string, data: RepTableColumns[]}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      constituency: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-muted p-8 rounded-xl mx-4 
                                                              md:min-w-96">
        <div>
          Test
          <FormField
            control={form.control}
            name="concern"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is your concern?</FormLabel>
                <FormControl>
                  <Input id="submit-concern-id" placeholder="" disabled {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="constituency"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>What constituency do you live in?</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
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
                        ? props.data.find(
                            (row) => row.constituency === field.value
                          )?.constituency
                        : "Select constituency"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
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
                        {props.data.map((row) => (
                          <CommandItem
                            value={row.constituency}
                            key={row.member_id}
                            onSelect={() => {
                              form.setValue("constituency", row.constituency);
                              setOpen(false);

                              // let level: string;
                              // let description: string;
                              // let nextQuestion: string;

                              // switch (concern.level) {
                              //   case 'fed':
                              //     level = 'Federal';
                              //     description = concern.label + " is primarily a " + level + " issue."
                              //     nextQuestion = "Select the Federal constituency you live in:";
                              //     break;
                              //   case 'provterr':
                              //     level = 'Provincial/Territorial';
                              //     description = concern.label + " is primarily a " + level + " issue."
                              //     nextQuestion = "Select the Provincial/Territorial constituency you live in:";
                              //     break;
                              //   case 'mun':
                              //     level = 'Municipal';
                              //     description = concern.label + " is primarily a " + level + " issue, which unfortunately aren't currently supported.\n\nPlease select another concern."
                              //     nextQuestion = "";
                              //     break;
                              //   case 'all':
                              //     level = 'All Levels';
                              //     description = concern.label + " can be effected by all levels of government."
                              //     nextQuestion = "Choose the Federal or Provincial/Territorial constituency you live in:";
                              //     break;
                              //   case 'fedprov':
                              //     level = 'Federal and Provincial/Territorial';
                              //     description = concern.label + " is primarily a " + level + " issue."
                              //     nextQuestion = "Select the Federal or Provincial/Territorial constituency you live in:";
                              //     break;
                              //   case 'provmun':
                              //     level = 'Provincial/Territorial and Municipal';
                              //     description = concern.label + " is primarily a " + level + " issue.\n\nUnfortunately Municipal issues aren't currently supported, please select your Provincial/Territorial or search for your municipal representatives."
                              //     nextQuestion = "Which " + level + "constituency do you live in?";
                              //     break;
                              //   default:
                              //     level = 'Unknown Level';
                              //     description = 'Unknown Description';
                              //     nextQuestion = 'Unknown Question';
                              // }

                              // // Alters the paragraph text
                              // const levelGuide = document.getElementById("level_guide");
                              // const constituencyInput = document.getElementById("constituency_input");

                              // levelGuide!.classList.remove("hidden")
                              // levelGuide!.innerText = description;

                              // constituencyInput!.classList.remove("hidden")
                              // constituencyInput!.getElementsByTagName("label")[0].innerText = nextQuestion;


                              // Need to create a map for all of the constituencies which gets dynamically populated based on the level of the concern, the send button then redirects to the appropriate page


                              // Create a call for the list from the DB above as const
                              // Create a variable to store the mapped version of this
                              // On select from the first part of the form, map the variable to the appropriate subset
                              // This subset is used to populate the second part of the form which is now revealed

                              // Need case for municipal to not show second question



































                            }}
                          >
                            {row.constituency}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                row.constituency === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>

                    </ScrollArea>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div id="level_guide" className="hidden text-sm pb-4">
          This is a <span id="" className="font-bold"></span> issue.
        </div>
        
        <div className="flex justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  )
}
