import { useSignInUser } from "@/api/AuthApi"
import LoadingButton from "@/components/LoadingButton"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { z } from "zod"
// import LoginForm from "@/components/custom/organism/LoginForm"
import LogoTelkom from "@/assets/BirawaLogo.png"

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
    <>
    {/* <div className="flex justify-center items-center h-screen bg-gray-100">
        <LoginForm />
    </div> */}
    <div className="flex flex-col w-max-[1280px] h-[100vh] items-center justify-center bg-gray-100">
      <div className="w-full flex flex-col items-center max-w-md shadow-custom-login bg-white rounded-md px-8 pt-6 pb-8 ">
        <img src={LogoTelkom} alt="Logo Telkom Property" />
        <div className="my-6">
          <h2 className="text-2xl font-medium">Login</h2>
        </div>
        <Form {...form}>
          <form
            className="flex flex-col w-full items-center gap-y-5   "
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name='email'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl className="relative top-[-4px] mb-7">
                    <Input placeholder="Masukan  Email Anda" type="email"  {...field} required/>
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
                    <Input placeholder="Masukan Password Anda" type='password' className="font-sans" {...field} required />
                  </FormControl>
                </FormItem>
              )}
            />

            {isLoading ? (
                <div className="w-full">
                  <LoadingButton/>
                </div>
            ) :
             <div className=" w-full">
                <Button type='submit' className="w-full">
                    Login
                </Button>
             </div>
            }

            <div className="">
              <Link to='/forgotpassword' className="text-center text-primary mt-4 hover:underline" reloadDocument>Forgot Password?</Link>
            </div>

          </form>
        </Form>
      </div>
    </div>
    </>
  );
};

export default Login;
