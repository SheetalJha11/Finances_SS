import {
       Sheet,
        SheetContent, 
        SheetHeader, 
        SheetTitle, 
        SheetDescription
    } from "@/components/ui/sheet"
    import {useNewAccount} from "@/features/accounts/hooks/use-new-account"
    import {AccountFrom} from "./accounts-form"
    import { insertAccountSchema } from "@/db/schema";
    import z from "zod";
    import  {useCreateAccount} from "@/features/accounts/api/use-create-account"

    const formSchema = insertAccountSchema.pick({
        name: true
    })
    
    type FormValues = z.input<typeof formSchema>

    export function NewAccountSheet() {
        const {isOpen, onClose} = useNewAccount()

        const mutation =  useCreateAccount()

        function handleSubmit(value:FormValues) {
            mutation.mutate(value, {
                onSuccess: () => {
                    onClose();
                }
            });
            
       }

        return(
          <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <div className="p-6">
                <SheetHeader>
                 <SheetTitle>
                    New Account 
                 </SheetTitle>
                 <SheetDescription>
                    creat new account to track your transactions 
                 </SheetDescription>
                </SheetHeader>
                <AccountFrom onSubmit={handleSubmit} 
                disabled={mutation .isPending}
                defaultValues={{
                    name: "",
                    }}/>
                    </div>
            </SheetContent>
          </Sheet>
        )
    }