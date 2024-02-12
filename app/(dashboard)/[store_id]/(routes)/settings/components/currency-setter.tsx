import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";


const CurrencySetter = () => {
    
    const currencySelector = [
        {
          location: 'en-UK',
          currencyCode: 'GBP',
          flag: "GB"
        },
        {
          location: 'en-US',
          currencyCode: 'USD',
          flag: "US"
        },
      ]

    return ( 
    <Popover>
        <PopoverTrigger>
            <Button
             variant="outline"
             size="sm"
             role="combobox"
             aria-label="Select a store"
             className={cn("w-[200px] justify-between")}
             data-cy="store-button"
            >

            </Button>
        </PopoverTrigger>
    </Popover>
    );
}
 
export default CurrencySetter;