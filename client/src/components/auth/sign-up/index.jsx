import CommonForm from "@/components/common-form";
import { useToast } from "@/components/ui/use-toast";
import { signUpFormControls } from "@/config";
import { callRegisterUserApi } from "@/services";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function SignUp() {
    const formData = useForm({
        defaultValues : {
            name : '',
            email : '',
            password : ''            
        }
    })

    const { toast } = useToast();
    const navigate = useNavigate();

   async function handleSubmit(getData){
        //console.log(getData);
        const data = await callRegisterUserApi(getData)
        console.log(data, "Data");

        if(data?.success){
            toast({
                title : 'User register successful',
                description : 'Welcome'
            })
            navigate("/tasks/list");
        } else {
            toast({
                title : 'Error',
                description : 'Something went wrong',
            })
        }
         
    }

    return (
        <div>
            <CommonForm
                form={formData}
                handleSubmit={handleSubmit}
                formControls={signUpFormControls}
                btnText = {'Sign Up'}

            />
        </div>
    )
}
export default SignUp;