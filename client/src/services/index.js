import axios from "axios"

export const callRegisterUserApi = async(formData) => {
    const response = await axios.post("http://localhost:5000/api/user/register", 
        formData,
        {withCredentials : true}
    );
    return response?.data;
}