import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'

const LoadingButton = () => {
  return (
      <div className="relative group ">
        <Button disabled className='relative w-full top-[1px] left-[-1px] z-[1]'>
          <Loader2 className='h-4 w-4 animate-spin'>
              Loading...
          </Loader2>
        </Button>
        {/* BACKGROUND */}
        <div className="flex absolute top-[3px] left-[-3px] w-full h-full md:bg-black md:rounded-md z-[0]"/>
      </div>
  )
}

export default LoadingButton