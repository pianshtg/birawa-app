import { useSignInUser } from "@/api/AuthApi"
import LoadingButton from "@/components/LoadingButton"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { z } from "zod"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

export type SignInSchema = z.infer<typeof formSchema>

const Login = () => {
  const {signInUser, isLoading } = useSignInUser()

  const form = useForm<SignInSchema>({
    resolver: zodResolver(formSchema)
  })

  async function onSubmit (data: SignInSchema) {
    try {
      await signInUser(data)
    } catch (error) {
      console.error(error)
    }
  }
  
  return (
    // <div className="flex justify-center items-center h-screen bg-gray-100">
    //     <LoginForm />
    // </div>
    <div className="flex flex-col w-max-[1280px] h-[100vh] items-center justify-center">
      <div className="relative w-[400px] items-center">
        <Form {...form}>
          <form
            className="flex flex-col w-full bg-gray-100 rounded-lg p-10 pt-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="mt-3 mb-4">
              <h2 className="text-2xl font-medium">Login</h2>
            </div>
            <FormField
              control={form.control}
              name='email'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl className="relative top-[-4px] mb-7">
                    <Input className='bg-white font-normal border border-black' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl className="relative top-[-4px]">
                    <Input type='password' className='font-sans bg-white border border-black' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {isLoading ? (
                <LoadingButton/>
            ) :
              <div className="relative group w-[25%] ml-1 mt-3 h-auto">
                <Button type='submit' className='relative w-full border border-black text-white font-bold text-[14px] tracking-[2px] transition-all duration-100 top-[1px] left-[-1px] active:top-[2px] active:left-[-2px] z-[1]'>
                    Submit
                </Button>
                {/* BACKGROUND */}
                <div className="flex absolute top-[3px] left-[-3px] w-full h-full md:bg-black md:rounded-md z-[0]"/>
              </div>
            }

            <div className="relative top-2 flex w-full justify-center mt-5 text-[12px] tracking-[1px]">
              <Link to='/forgotpassword' className="underline font-thin hover:text-blue-500" reloadDocument>Forgot Password?</Link>
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
