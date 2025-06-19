import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        trim: true,
        required: true
    }
},{timestamps:true})

const Category = mongoose.model('Category', CategorySchema, 'categories');
export default Category;