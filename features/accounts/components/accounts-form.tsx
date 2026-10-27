
import { z} from "zod"
import {Trash } from "lucide-react"
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
     Form ,
     FormField,
     FormItem,
     FormLabel,
     FormControl,
     FormMessage
    } from "@/components/ui/form";
import { insertAccountSchema } from "@/db/schema";



const formSchema = insertAccountSchema.pick({
    name: true
})

type FormValues = z.input<typeof formSchema>

type Props = {
    id?: string
    defaultValues?: FormValues
    onSubmit: (Values: FormValues) => void
    onDelete?: ()=> void
    disabled? : boolean
}

export function AccountFrom({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled
}:Props) {
    const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    name: defaultValues?.name ?? "",
  },
});
function handleSubmit(value: FormValues) {
  console.log("SUBMIT SUCCESS:", value);
  onSubmit(value);
}

   function handleDelete() {
    onDelete?.()
   }

    return(
        <div>
         <Form {...form}>
             <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField 
              name="name"
              control={form.control}
              render={({field})=>(
               <FormItem>
                <FormLabel>
                    Name
                </FormLabel>
                 <FormControl>
                    <Input 
                    disabled={disabled}
                    placeholder="e.g. Cash, Bank, Credit Card"
                    {...field}
                    />
                 </FormControl>

               </FormItem>
              )}
              />
              <Button
  type="submit"
  className="w-full mt-3"
  disabled={disabled}
>
  {id ? "save changes" : "Create account"}
</Button>
            {/* <Button className="w-full mt-2"
                   type="button"
                   disabled={disabled}
                   onClick={handleDelete}
                   size="icon"
                   variant="outline"
                   >
                <Trash/>
                Delete account
            </Button> */}
            </form>
           
         </Form>
        </div>
    )
}