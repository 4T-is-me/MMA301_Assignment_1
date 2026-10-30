// Author: trangtttce191027
import * as Yup from "yup";

export const ProfileSchema = Yup.object().shape({
    name: Yup.string().trim().min(2, "Name must be at least 2 characters!")
    .max(50, "Name must be less than 50 Characters!")
    .required("Name is required!"),

    email: Yup.string().trim().email("Email is invalid!")
    .required("Email is required!"),

    phone: Yup.string().trim().matches(/^[0-9+\s-]{8,15}$/, "Invalid phone format (8-15 digits)!"),

    location: Yup.string().trim().max(100, "Location must be less than 100 characters!"),

    bio: Yup.string().trim().max(150, "Bio must be less than 150 Characters!"),
    
    avatar: Yup.string().required('Avatar URL is required'),
})