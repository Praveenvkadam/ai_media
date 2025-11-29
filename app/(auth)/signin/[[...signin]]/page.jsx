import { SignIn } from "@clerk/nextjs";


const Signin = () => {
    return(
        <div className="flex justify-center p-25">
            <SignIn />
        </div>
    )
};

export default Signin;