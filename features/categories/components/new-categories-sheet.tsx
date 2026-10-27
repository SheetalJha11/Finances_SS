import {
       Sheet,
        SheetContent, 
        SheetHeader, 
        SheetTitle, 
        SheetDescription
    } from "@/components/ui/sheet"
    import {useNewcategories} from "@/features/categories/hooks/use-new-categories"
    import {CategoryFrom} from "./categories-form"
    import {insertCategoriesSchema} from "@/db/schema";
    import z from "zod";
    import  {useCreateCategory} from "@/features/categories/api/use-create-categories "

    const formSchema = insertCategoriesSchema.pick({
        name: true
    })
    
    type FormValues = z.input<typeof formSchema>

    export function NewCategorySheet() {
        const {isOpen, onClose} = useNewcategories()

        const mutation =  useCreateCategory()

        function handleSubmit(value:FormValues) {
            mutation.mutate(value, {
                onSuccess: () => {
                    onClose();
                }
            });
            
       }

        return(
          <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4 ">
                <div className="p-6">
                <SheetHeader>
                 <SheetTitle>
                    New Category
                 </SheetTitle>
                 <SheetDescription>
                    creat new category to organize your transactions 
                 </SheetDescription>
                </SheetHeader>
                <CategoryFrom onSubmit={handleSubmit} 
                disabled={mutation .isPending}
                defaultValues={{
                    name: "",
                    }}/>
                </div>
            </SheetContent>
          </Sheet>
        )
    }